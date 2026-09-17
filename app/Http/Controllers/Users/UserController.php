<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Models\User;
use App\Services\AccountCredentialService;
use App\Services\AccountProfileService;
use App\Services\AccountStatusService;
use App\Services\RegistrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Daftar pengguna + filter pencarian & role (ADM-09).
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->when($request->string('q')->toString(), function ($query, string $q): void {
                $like = '%'.$q.'%';
                $query->where(fn ($sub) => $sub
                    ->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('instansi', 'like', $like));
            })
            ->when($request->string('role')->toString(), function ($query, string $role): void {
                $query->where('role', $role);
            })
            ->orderByDesc('created_at')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(function (User $user): array {
                $row = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'active' => $user->active,
                    'status' => $user->getRawOriginal('status') ?? ($user->active ? 'active' : 'suspended'),
                    'instansi' => $user->instansi,
                    'kategori' => $user->kategori,
                    'no_hp' => $user->no_hp,
                    'suspension_reason' => $user->suspension_reason,
                    'terdaftar' => $user->created_at?->toFormattedDateString(),
                    'nomor_identitas' => null,
                    'foto_profil_url' => null,
                    'foto_identitas_url' => null,
                ];

                if (DB::getDriverName() === 'pgsql') {
                    $row = array_merge($row, $this->identitasRow($user));
                }

                return $row;
            });

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'q' => $request->string('q')->toString(),
                'role' => $request->string('role')->toString(),
            ],
            'roleOptions' => User::ROLES,
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
            'currentUserId' => $request->user()->id,
        ]);
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data = $this->normalizeExternal($data);

        if (DB::getDriverName() === 'pgsql') {
            app(RegistrationService::class)->provisionByAdmin($data);
        } else {
            User::create($data);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Pengguna berhasil ditambahkan.')]);

        return to_route('users.index');
    }

    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        $data = $this->normalizeExternal($data);

        // Admin tidak boleh menurunkan role-nya sendiri (mencegah terkunci dari modul).
        if ($user->id === $request->user()->id && $data['role'] !== 'admin') {
            return back()->withErrors(['role' => 'Anda tidak dapat mengubah role Anda sendiri.']);
        }

        if (DB::getDriverName() === 'pgsql') {
            $this->updateAccount($user, $data);
        } else {
            // Kosongkan password bila tidak diisi agar tidak menimpa hash.
            if (($data['password'] ?? null) === null) {
                unset($data['password']);
            }

            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profil pengguna berhasil diperbarui.')]);

        return to_route('users.index');
    }

    /**
     * Aktifkan / tangguhkan / blokir akses (ADM-10, BR-3, REQ-06).
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['status' => 'Anda tidak dapat mengubah status akun Anda sendiri.']);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:active,suspended,blocked'],
            'alasan' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), ['suspended', 'blocked'], true)),
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        if (DB::getDriverName() === 'pgsql') {
            app(AccountStatusService::class)->change(
                $user,
                $validated['status'],
                $validated['status'] === 'active' ? null : ($validated['alasan'] ?? null),
                $request->user(),
            );
        } else {
            $user->update([
                'active' => $validated['status'] === 'active',
                'suspension_reason' => $validated['status'] === 'active' ? null : ($validated['alasan'] ?? null),
            ]);
        }

        $pesan = match ($validated['status']) {
            'active' => 'Akun berhasil diaktifkan kembali.',
            'suspended' => 'Akun telah ditangguhkan.',
            'blocked' => 'Akun telah diblokir.',
            default => 'Status akun diperbarui.',
        };

        Inertia::flash('toast', ['type' => 'success', 'message' => __($pesan)]);

        return back();
    }

    /**
     * Update akun PostgreSQL: profil dasar, ganti role (beserta subtype),
     * kategori eksternal, dan reset password opsional.
     *
     * @param  array<string, mixed>  $data
     */
    private function updateAccount(User $user, array $data): void
    {
        app(AccountProfileService::class)->update($user, $data);

        DB::transaction(function () use ($user, $data): void {
            $roleMap = [
                'admin' => 'admin', 'kalab' => 'kalab', 'plp' => 'plp',
                'dosen' => 'dosen', 'mhs' => 'mahasiswa', 'ekst' => 'eksternal',
            ];
            $dbRole = $roleMap[$data['role']] ?? 'eksternal';
            $idPeran = DB::table('peran')->where('role', $dbRole)->value('id_peran');

            DB::table('akun')->where('id_akun', $user->getAuthIdentifier())->update([
                'id_peran' => $idPeran,
                'kategori_eksternal' => $data['role'] === 'ekst' ? ($data['kategori'] ?? null) : null,
                'updated_at' => now(),
            ]);

            app(RegistrationService::class)->syncSubtype(
                (int) DB::table('akun')->where('id_akun', $user->getAuthIdentifier())->value('id_pengguna'),
                $data['role'],
                $data,
            );

            if (! empty($data['password'])) {
                app(AccountCredentialService::class)->updatePassword($user, $data['password']);
            }
        });
    }

    /**
     * Bersihkan field eksternal untuk role non-eksternal (BR-2).
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizeExternal(array $data): array
    {
        if (($data['role'] ?? null) !== User::ROLE_EKSTERNAL) {
            $data['instansi'] = null;
            $data['kategori'] = null;
        }

        return $data;
    }

    /**
     * Nomor identitas + URL foto dari tabel subtype 3NF.
     *
     * @return array<string, mixed>
     */
    private function identitasRow(User $user): array
    {
        $idPengguna = (int) DB::table('akun')->where('id_akun', $user->id)->value('id_pengguna');

        $nomor = match ($user->role) {
            'dosen' => DB::table('dosen')->where('id_pengguna', $idPengguna)->value('nip_nidn'),
            'mhs' => DB::table('mahasiswa')->where('id_pengguna', $idPengguna)->value('nim'),
            'ekst' => DB::table('eksternal')->where('id_pengguna', $idPengguna)->value('nik'),
            default => null,
        };

        $fotoProfil = DB::table('pengguna')->where('id_pengguna', $idPengguna)->value('foto_profil');
        $fotoIdentitas = DB::table('pengguna')->where('id_pengguna', $idPengguna)->value('foto_identitas');

        return [
            'nomor_identitas' => $nomor,
            'foto_profil_url' => $fotoProfil ? Storage::disk('public')->url($fotoProfil) : null,
            // Foto identitas dilayani via route terotorisasi, bukan URL publik langsung.
            'foto_identitas_url' => $fotoIdentitas ? route('identitas.show', ['path' => $fotoIdentitas]) : null,
        ];
    }
}
