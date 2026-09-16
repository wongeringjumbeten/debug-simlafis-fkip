<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'active' => $user->active,
                'instansi' => $user->instansi,
                'kategori' => $user->kategori,
                'no_hp' => $user->no_hp,
                'suspension_reason' => $user->suspension_reason,
                'terdaftar' => $user->created_at?->toFormattedDateString(),
            ]);

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

        User::create($data);

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

        // Kosongkan password bila tidak diisi agar tidak menimpa hash.
        if (($data['password'] ?? null) === null) {
            unset($data['password']);
        }

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profil pengguna berhasil diperbarui.')]);

        return to_route('users.index');
    }

    /**
     * Aktifkan / tangguhkan akses (ADM-10, BR-3, REQ-06).
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['status' => 'Anda tidak dapat menangguhkan akun Anda sendiri.']);
        }

        $validated = $request->validate([
            'active' => ['required', 'boolean'],
            'suspension_reason' => [
                Rule::requiredIf(fn () => ! $request->boolean('active')),
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $user->update([
            'active' => $validated['active'],
            // Alasan hanya relevan saat ditangguhkan; dibersihkan saat diaktifkan (unblock).
            'suspension_reason' => $validated['active'] ? null : ($validated['suspension_reason'] ?? null),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $validated['active']
                ? __('Akun berhasil diaktifkan kembali.')
                : __('Akun telah ditangguhkan.'),
        ]);

        return back();
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
}
