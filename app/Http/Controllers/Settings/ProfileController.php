<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use App\Services\AccountProfileService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'identitas' => $this->identitas($user),
            'canDeleteAccount' => DB::getDriverName() !== 'pgsql',
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        app(AccountProfileService::class)->update($request->user(), $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     *
     * Self-deletion is not part of Sprint 1 on PostgreSQL; accounts are
     * managed centrally by Admin (BR-1).
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        if (DB::getDriverName() === 'pgsql') {
            abort(403, 'Penghapusan akun mandiri tidak tersedia. Hubungi administrator.');
        }

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Read-only identity details from the 3NF subtype tables.
     *
     * @return array<string, mixed>|null
     */
    private function identitas(User $user): ?array
    {
        if (DB::getDriverName() !== 'pgsql') {
            return null;
        }

        // getAuthIdentifier() mengembalikan id_akun, bukan id_pengguna.
        // Keduanya bisa berbeda bila sequence tidak sinkron.
        $idPengguna = (int) DB::table('akun')
            ->where('id_akun', $user->getAuthIdentifier())
            ->value('id_pengguna');

        $id = $idPengguna;

        $dosen = DB::table('dosen as d')
            ->leftJoin('fakultas as f', 'f.id_fakultas', '=', 'd.id_fakultas')
            ->leftJoin('prodi as p', 'p.id_prodi', '=', 'd.id_prodi')
            ->where('d.id_pengguna', $id)
            ->first(['d.nip_nidn as nomor', 'f.nama_fakultas as fakultas', 'p.nama_prodi as prodi']);

        if ($dosen) {
            return $this->identitasDasar($user, 'NIP / NIDN', $dosen->nomor, $dosen->fakultas, $dosen->prodi, null);
        }

        $mahasiswa = DB::table('mahasiswa as m')
            ->leftJoin('fakultas as f', 'f.id_fakultas', '=', 'm.id_fakultas')
            ->leftJoin('prodi as p', 'p.id_prodi', '=', 'm.id_prodi')
            ->where('m.id_pengguna', $id)
            ->first(['m.nim as nomor', 'f.nama_fakultas as fakultas', 'p.nama_prodi as prodi']);

        if ($mahasiswa) {
            return $this->identitasDasar($user, 'NIM', $mahasiswa->nomor, $mahasiswa->fakultas, $mahasiswa->prodi, null);
        }

        $eksternal = DB::table('eksternal as e')
            ->leftJoin('instansi as i', 'i.id_instansi', '=', 'e.id_instansi')
            ->where('e.id_pengguna', $id)
            ->first(['e.nik as nomor', 'i.nama_instansi as instansi', 'e.alamat_lengkap as alamat']);

        if ($eksternal) {
            return $this->identitasDasar($user, 'NIK', $eksternal->nomor, null, null, [
                'instansi' => $eksternal->instansi,
                'alamat' => $eksternal->alamat,
            ]);
        }

        return $this->identitasDasar($user, null, null, null, null, null);
    }

    /**
     * @param  array<string, string|null>|null  $ekstra
     * @return array<string, mixed>
     */
    private function identitasDasar(User $user, ?string $jenis, ?string $nomor, ?string $fakultas, ?string $prodi, ?array $ekstra): array
    {
        return array_merge([
            'jenis_identitas' => $jenis,
            'nomor_identitas' => $nomor,
            'fakultas' => $fakultas,
            'prodi' => $prodi,
            'foto_profil_url' => $user->avatar ? Storage::disk('public')->url($user->avatar) : null,
            // Foto identitas tidak di-expose via URL publik langsung; melalui route terotorisasi.
            'foto_identitas_url' => $user->foto_identitas ? route('identitas.show', ['path' => $user->foto_identitas]) : null,
        ], $ekstra ?? []);
    }
}
