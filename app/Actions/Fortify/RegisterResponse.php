<?php

namespace App\Actions\Fortify;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Arahkan pendaftar baru ke halaman verifikasi email sebelum masuk dashboard.
     */
    public function toResponse($request): Response
    {
        $user = $request->user();

        if ($user instanceof MustVerifyEmail && ! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        return $request->wantsJson()
            ? response()->json('', 201)
            : redirect()->intended(Fortify::redirects('register'));
    }
}
