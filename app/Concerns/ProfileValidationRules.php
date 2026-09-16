<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * Get the validation rules for external registration fields.
     * instansi and kategori are coupled: either both are provided or both
     * are null — an external user must specify both their institution and
     * tariff category (BR-2).
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function externalRegistrationRules(): array
    {
        return [
            'instansi' => ['nullable', 'string', 'max:255', 'required_with:kategori'],
            'kategori' => ['nullable', 'in:internal_unej,luar_unej', 'required_with:instansi'],
            'no_hp' => $this->noHpRules(),
        ];
    }

    /**
     * Validation rules for an Indonesian mobile/WhatsApp number.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function noHpRules(): array
    {
        return [
            'nullable',
            'string',
            'max:20',
            'regex:/^(\+62|62|0)8[1-9][0-9]{6,10}$/',
        ];
    }
}
