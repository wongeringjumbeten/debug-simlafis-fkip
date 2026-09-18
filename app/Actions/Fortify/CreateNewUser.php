<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Services\RegistrationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Fortify\Rules\Password;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        // Cukup pastikan driver pgsql, sisanya ke Service
        if (DB::getDriverName() !== 'pgsql') {
            throw ValidationException::withMessages(['email' => 'Hanya PostgreSQL.']);
        }
        return app(RegistrationService::class)->register($input);
    }
}
