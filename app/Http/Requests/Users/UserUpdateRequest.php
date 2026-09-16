<?php

namespace App\Http\Requests\Users;

use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
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

        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($target->id),
            'role' => ['required', 'string', Rule::in(User::ROLES)],
            // Password opsional saat ubah; diisi hanya bila admin ingin reset.
            'password' => ['nullable', 'string', 'confirmed', Password::defaults()],
            'instansi' => $isEkst ? ['required', 'string', 'max:255'] : ['nullable', 'string', 'max:255'],
            'kategori' => $isEkst ? ['required', Rule::in(User::KATEGORI_EKSTERNAL)] : ['nullable', Rule::in(User::KATEGORI_EKSTERNAL)],
            'no_hp' => $this->noHpRules(),
        ];
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
