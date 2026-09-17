<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * External users may also edit their institution and phone number. The
     * tariff category (kategori) is intentionally absent: it drives pricing
     * (BR-2) and may only be changed by an Admin. Role is never accepted here
     * so a user cannot escalate their own access (BR-1, BR-6).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = $this->profileRules($this->user()->id);

        if ($this->user()->role === 'ekst') {
            $rules['instansi'] = ['required', 'string', 'max:255'];
            $rules['no_hp'] = $this->noHpRules();
        }

        // Foto profil hanya didukung pada schema PostgreSQL Sprint 1.
        if (DB::getDriverName() === 'pgsql') {
            $rules['foto_profil'] = ['nullable', 'image', 'mimes:jpg,png', 'max:2048'];
        }

        return $rules;
    }
}
