<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountCredentialService
{
    /**
     * Update credentials in the canonical source table, never the auth view.
     */
    public function updatePassword(User $user, string $password): void
    {
        $hash = Hash::make($password);

        if (DB::getDriverName() !== 'pgsql') {
            $user->forceFill(['password' => $hash])->save();

            return;
        }

        DB::transaction(function () use ($user, $hash): void {
            $credentialId = DB::table('akun')
                ->where('id_akun', $user->getAuthIdentifier())
                ->value('id_kredensial');

            DB::table('kredensial')
                ->where('id_kredensial', $credentialId)
                ->update(['password' => $hash]);

            DB::table('akun')
                ->where('id_akun', $user->getAuthIdentifier())
                ->update(['updated_at' => now()]);
        });
    }
}
