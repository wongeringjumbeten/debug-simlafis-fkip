<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Services\RegistrationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        // Sprint 1 PostgreSQL: registrasi 3 kategori menulis graf 3NF transaksional.
        if (DB::getDriverName() === 'pgsql') {
            return app(RegistrationService::class)->register($input);
        }

        Validator::make($input, [
            ...$this->profileRules(),
            ...$this->externalRegistrationRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'instansi' => $input['instansi'] ?? null,
            'kategori' => $input['kategori'] ?? null,
            'no_hp' => $input['no_hp'] ?? null,
            'role' => 'ekst',
            'password' => $input['password'],
        ]);
    }
}
