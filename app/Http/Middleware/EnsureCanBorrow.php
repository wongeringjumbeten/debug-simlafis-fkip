<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanBorrow
{
    /**
     * Suspended users retain read access but cannot create cart/loan actions.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort_if($request->user()?->isSuspended(), 403, 'Akun ditangguhkan dan tidak dapat membuat pengajuan baru.');

        return $next($request);
    }
}
