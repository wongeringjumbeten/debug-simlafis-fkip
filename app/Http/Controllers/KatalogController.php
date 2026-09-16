<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KatalogController extends Controller
{
    /**
     * Katalog internal (alat/ruangan/bahan/mebeler). Visibilitas tab dan
     * aksi per role ditangani frontend (REQ-11); data aset masih mock UI-first
     * sampai master data backend siap (REQ-7).
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('katalog/index', [
            'role' => $user->role,
            // Sub-kategori tarif hanya relevan untuk eksternal (BR-2).
            'subKategori' => $user->role === 'ekst' ? $user->kategori : null,
        ]);
    }
}
