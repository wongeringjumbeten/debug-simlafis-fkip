<?php

namespace App\Http\Requests\Users;

use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
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

        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules(),
            'role' => ['required', 'string', Rule::in(User::ROLES)],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'instansi' => $isEkst ? ['required', 'string', 'max:255'] : ['nullable', 'string', 'max:255'],
            'kategori' => $isEkst ? ['required', Rule::in(User::KATEGORI_EKSTERNAL)] : ['nullable', Rule::in(User::KATEGORI_EKSTERNAL)],
            'no_hp' => $this->noHpRules(),
        ];
    }
}
