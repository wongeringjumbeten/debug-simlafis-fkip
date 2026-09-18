<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Services\RegistrationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        // Sprint 1 PostgreSQL: registrasi 3 kategori menulis graf 3NF transaksional.
        if (DB::getDriverName() !== 'pgsql') {
            throw ValidationException::withMessages([
                'email' => __('Registrasi hanya tersedia melalui PostgreSQL.'),
            ]);
        }

        return app(RegistrationService::class)->register($input);
    }
}
