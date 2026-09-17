<?php

namespace App\Http\Requests\Users;

use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User $target */
        $target = $this->route('user');

        // Role efektif: memakai nilai baru bila dikirim, selain itu nilai tersimpan.
        $role = $this->input('role', $target->role);
        $isEkst = $role === User::ROLE_EKSTERNAL;

        $rules = [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($target->id),
            'role' => ['required', 'string', Rule::in(User::ROLES)],
            // Password opsional saat ubah; diisi hanya bila admin ingin reset.
            'password' => ['nullable', 'string', 'confirmed', Password::defaults()],
            'instansi' => $isEkst ? ['required', 'string', 'max:255'] : ['nullable', 'string', 'max:255'],
            'kategori' => $isEkst ? ['required', Rule::in(User::KATEGORI_EKSTERNAL)] : ['nullable', Rule::in(User::KATEGORI_EKSTERNAL)],
            'no_hp' => $this->noHpRules(),
        ];

        if (DB::getDriverName() === 'pgsql') {
            $idPengguna = (int) DB::table('akun')->where('id_akun', $target->id)->value('id_pengguna');
            $rules['no_identitas'] = $this->identitasRules($role, $idPengguna);
            $rules['foto_profil'] = ['nullable', 'image', 'mimes:jpg,png', 'max:2048'];
            $rules['foto_identitas'] = ['nullable', 'image', 'mimes:jpg,png', 'max:2048'];
        }

        return $rules;
    }

    /**
     * No Identitas wajib untuk dosen/mhs/ekst pada schema PostgreSQL.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    private function identitasRules(?string $role, ?int $ignorePenggunaId): array
    {
        if (! in_array($role, ['dosen', 'mhs', 'ekst'], true)) {
            return ['nullable', 'string', 'max:50'];
        }

        $table = $role === 'dosen' ? 'dosen' : ($role === 'mhs' ? 'mahasiswa' : 'eksternal');
        $column = $role === 'dosen' ? 'nip_nidn' : ($role === 'mhs' ? 'nim' : 'nik');

        $unique = Rule::unique($table, $column);
        if ($ignorePenggunaId !== null) {
            $unique->where(fn ($q) => $q->where('id_pengguna', '!=', $ignorePenggunaId));
        }

        return ['required', 'string', 'max:50', $unique];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'role.in' => 'Role tidak dikenali.',
        ];
    }
}
