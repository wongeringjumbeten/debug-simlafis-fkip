<?php

namespace App\Http\Controllers;

use App\Models\PengajuanPeminjaman;
use App\Models\User;
use App\Services\PeminjamanService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatController extends Controller
{
    public function __construct(
        private readonly PeminjamanService $peminjamanService
    ) {}

    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $isLabRole = in_array($user->role, ['admin', 'kalab', 'plp'], true);
        $idPengguna = $this->peminjamanService->resolveIdPengguna($user);

        $query = PengajuanPeminjaman::query()
            ->with([
                'pengguna',
                'detailAlat.alat.barang',
                'detailRuangan.ruangan.barang',
            ])
            ->orderByDesc('id_pengajuan_peminjaman');

        if (! $isLabRole) {
            $query->where('id_pengguna', $idPengguna);
        }

        $transaksi = $query->get()->map(function (PengajuanPeminjaman $p) {
            $alatItems = $p->detailAlat->map(fn ($d) => [
                'id' => $d->id_detail_pengajuan_peminjaman_alat,
                'jenis' => 'alat',
                'nama' => $d->alat?->barang?->nama_barang ?? 'Alat #'.$d->id_alat,
                'jumlah' => $d->jumlah_item,
                'waktuMulai' => $d->waktu_mulai->format('Y-m-d H:i'),
                'waktuSelesai' => $d->waktu_selesai->format('Y-m-d H:i'),
                'totalBiaya' => (float) $d->total_biaya_per_item,
                'statusItem' => $d->status_item,
                'alasanPenolakan' => $d->alasan_penolakan,
            ]);

            $ruanganItems = $p->detailRuangan->map(fn ($d) => [
                'id' => $d->id_detail_pengajuan_peminjaman_ruangan,
                'jenis' => 'ruangan',
                'nama' => $d->ruangan?->barang?->nama_barang ?? 'Ruangan #'.$d->id_ruangan,
                'jumlah' => 1,
                'waktuMulai' => $d->waktu_mulai->format('Y-m-d H:i'),
                'waktuSelesai' => $d->waktu_selesai->format('Y-m-d H:i'),
                'totalBiaya' => (float) $d->total_biaya_per_item,
                'statusItem' => $d->status_item,
                'alasanPenolakan' => $d->alasan_penolakan,
            ]);

            return [
                'id' => $p->id_pengajuan_peminjaman,
                'kode' => 'TRX-'.str_pad((string) $p->id_pengajuan_peminjaman, 4, '0', STR_PAD_LEFT),
                'peminjam' => $p->pengguna?->nama_lengkap ?? $p->pengguna?->email ?? 'Pengguna',
                'jenisPeminjaman' => $p->jenis_peminjaman,
                'totalBiaya' => (float) $p->total_biaya,
                'metodePembayaran' => $p->metode_pembayaran,
                'buktiPembayaran' => $p->bukti_pembayaran ? '/storage/'.$p->bukti_pembayaran : null,
                'statusKeseluruhan' => $p->status_keseluruhan,
                'tanggalPeminjaman' => $p->tanggal_peminjaman->format('Y-m-d'),
                'isCancellable' => $p->isCancellable(),
                'items' => array_merge($alatItems->all(), $ruanganItems->all()),
            ];
        });

        return Inertia::render('riwayat/index', [
            'transaksi' => $transaksi,
            'role' => $user->role,
            'isLab' => $isLabRole,
        ]);
    }
}
