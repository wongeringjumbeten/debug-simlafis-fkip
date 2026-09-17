<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class IdentitasController extends Controller
{
    /**
     * Streaming dokumen identitas (KTP/KTM/kartu pegawai) yang dijaga authorization.
     *
     * Aturan akses Sprint 1:
     * - Admin/KaLab/PLP dapat melihat semua dokumen identitas.
     * - Pengguna hanya dapat melihat dokumen milik sendiri.
     *
     * Path format: {subfolder}/{filename} (mis. "profiles/abc123.png")
     * atau hanya "{filename}" jika tanpa subfolder.
     */
    public function show(Request $request, string $path): StreamedResponse|Response
    {
        /** @var User $viewer */
        $viewer = $request->user();

        // Admin/KaLab/PLP boleh melihat semua; role lain hanya milik sendiri.
        $dapatLihatSemua = in_array($viewer->role, ['admin', 'kalab', 'plp'], true);

        if (! $dapatLihatSemua) {
            // Verifikasi bahwa path ini memang milik pengguna yang login.
            $idPengguna = (int) DB::table('akun')
                ->where('id_akun', $viewer->getAuthIdentifier())
                ->value('id_pengguna');

            $fotoIdentitas = DB::table('pengguna')
                ->where('id_pengguna', $idPengguna)
                ->value('foto_identitas');

            // Normalkan path (disk menyimpan tanpa leading slash).
            $pathNormal = ltrim($path, '/');
            $fotoNormal = ltrim((string) $fotoIdentitas, '/');

            if ($fotoNormal !== $pathNormal) {
                abort(403, 'Anda tidak memiliki akses ke dokumen ini.');
            }
        }

        if (! Storage::disk('identities')->exists($path)) {
            abort(404, 'Dokumen tidak ditemukan.');
        }

        return Storage::disk('identities')->response($path);
    }
}
