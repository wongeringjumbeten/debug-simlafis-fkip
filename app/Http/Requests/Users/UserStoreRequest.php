<?php

namespace App\Http\Requests\Users;

use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserStoreRequest extends FormRequest
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
        $isEkst = $this->input('role') === User::ROLE_EKSTERNAL;

        $rules = [
            'name' => $this->nameRules(),
            'email' => $this->emailRules(),
            'role' => ['required', 'string', Rule::in(User::ROLES)],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'instansi' => $isEkst ? ['required', 'string', 'max:255'] : ['nullable', 'string', 'max:255'],
            'kategori' => $isEkst ? ['required', Rule::in(User::KATEGORI_EKSTERNAL)] : ['nullable', Rule::in(User::KATEGORI_EKSTERNAL)],
            'no_hp' => $this->noHpRules(),
        ];

        if (DB::getDriverName() === 'pgsql') {
            $rules['no_identitas'] = $this->identitasRules($this->input('role'), null);
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
}
