<?php

namespace App\Auth;

use App\Models\User;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

class AccountUserProvider extends EloquentUserProvider
{
    /** Persist remember tokens to akun because v_auth_users is a read-only view. */
    public function updateRememberToken(Authenticatable $user, $token): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            parent::updateRememberToken($user, $token);

            return;
        }

        /** @var User $user */
        DB::table('akun')
            ->where('id_akun', $user->getAuthIdentifier())
            ->update([
                'remember_token' => $token,
                'updated_at' => now(),
            ]);

        $user->setAttribute('remember_token', $token);
    }
}
