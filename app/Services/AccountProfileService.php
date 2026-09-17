<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AccountProfileService
{
    /**
     * Update profile source tables transactionally; v_auth_users is read-only.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();

            return;
        }

        DB::transaction(function () use ($user, $data): void {
            $account = DB::table('akun')
                ->where('id_akun', $user->getAuthIdentifier())
                ->first(['id_pengguna']);

            $pengguna = [
                'nama_lengkap' => $data['name'],
                'email' => $data['email'],
            ];

            if (array_key_exists('no_hp', $data)) {
                $pengguna['no_telepon'] = $data['no_hp'];
            }

            if (($data['foto_profil'] ?? null) instanceof UploadedFile) {
                $lama = DB::table('pengguna')->where('id_pengguna', $account->id_pengguna)->value('foto_profil');
                $pengguna['foto_profil'] = $data['foto_profil']->store('profiles', 'public');
                if (is_string($lama) && $lama !== '' && Storage::disk('public')->exists($lama)) {
                    Storage::disk('public')->delete($lama);
                }
            }

            if (($data['foto_identitas'] ?? null) instanceof UploadedFile) {
                $lama = DB::table('pengguna')->where('id_pengguna', $account->id_pengguna)->value('foto_identitas');
                $pengguna['foto_identitas'] = $data['foto_identitas']->store('', 'identities');
                if (is_string($lama) && $lama !== '' && Storage::disk('identities')->exists($lama)) {
                    Storage::disk('identities')->delete($lama);
                }
            }

            DB::table('pengguna')
                ->where('id_pengguna', $account->id_pengguna)
                ->update($pengguna);

            if ($user->role === User::ROLE_EKSTERNAL && isset($data['instansi'])) {
                $instansiId = DB::table('instansi')
                    ->where('nama_instansi', $data['instansi'])
                    ->value('id_instansi');

                if ($instansiId === null) {
                    $instansiId = DB::table('instansi')->insertGetId([
                        'nama_instansi' => $data['instansi'],
                    ], 'id_instansi');
                }

                DB::table('eksternal')
                    ->where('id_pengguna', $account->id_pengguna)
                    ->update(['id_instansi' => $instansiId]);
            }

            DB::table('akun')
                ->where('id_akun', $user->getAuthIdentifier())
                ->update(['updated_at' => now()]);
        });
    }
}
