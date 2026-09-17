<?php

namespace App\Http\Controllers;

use App\Models\DetailPengajuanPeminjamanAlat;
use App\Models\DetailPengajuanPeminjamanRuangan;
use App\Models\PengajuanPeminjaman;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PersetujuanController extends Controller
{
    /**
     * Menampilkan daftar pengajuan yang memerlukan persetujuan per-item (BR-4).
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        // Khusus peran lab (Admin, KaLab, PLP).
        if (! in_array($user->role, ['admin', 'kalab', 'plp'], true)) {
            abort(403, 'Hanya staf laboratorium yang dapat mengakses halaman persetujuan.');
        }

        $pengajuanMenunggu = PengajuanPeminjaman::query()
            ->with([
                'pengguna',
                'detailAlat.alat.barang',
                'detailRuangan.ruangan.barang',
            ])
            ->where('status_keseluruhan', PengajuanPeminjaman::STATUS_MENUNGGU)
            ->orderByDesc('id_pengajuan_peminjaman')
            ->get()
            ->map(function (PengajuanPeminjaman $p) {
                return [
                    'id' => $p->id_pengajuan_peminjaman,
                    'kode' => 'TRX-'.str_pad((string) $p->id_pengajuan_peminjaman, 4, '0', STR_PAD_LEFT),
                    'peminjam' => $p->pengguna?->nama_lengkap ?? $p->pengguna?->email ?? 'Pengguna',
                    'jenisPeminjaman' => $p->jenis_peminjaman,
                    'totalBiaya' => (float) $p->total_biaya,
                    'metodePembayaran' => $p->metode_pembayaran,
                    'buktiPembayaran' => $p->bukti_pembayaran ? '/storage/'.$p->bukti_pembayaran : null,
                    'tanggalPeminjaman' => $p->tanggal_peminjaman->format('Y-m-d'),
                    'alat' => $p->detailAlat->map(fn ($d) => [
                        'id' => $d->id_detail_pengajuan_peminjaman_alat,
                        'nama' => $d->alat?->barang?->nama_barang ?? 'Alat #'.$d->id_alat,
                        'jumlah' => $d->jumlah_item,
                        'waktuMulai' => $d->waktu_mulai->format('Y-m-d H:i'),
                        'waktuSelesai' => $d->waktu_selesai->format('Y-m-d H:i'),
                        'totalBiaya' => (float) $d->total_biaya_per_item,
                        'statusItem' => $d->status_item,
                        'alasanPenolakan' => $d->alasan_penolakan,
                    ]),
                    'ruangan' => $p->detailRuangan->map(fn ($d) => [
                        'id' => $d->id_detail_pengajuan_peminjaman_ruangan,
                        'nama' => $d->ruangan?->barang?->nama_barang ?? 'Ruangan #'.$d->id_ruangan,
                        'waktuMulai' => $d->waktu_mulai->format('Y-m-d H:i'),
                        'waktuSelesai' => $d->waktu_selesai->format('Y-m-d H:i'),
                        'totalBiaya' => (float) $d->total_biaya_per_item,
                        'statusItem' => $d->status_item,
                        'alasanPenolakan' => $d->alasan_penolakan,
                    ]),
                ];
            });

        return Inertia::render('persetujuan/index', [
            'pengajuan' => $pengajuanMenunggu,
            'role' => $user->role,
        ]);
    }

    public function approveAlat(DetailPengajuanPeminjamanAlat $item): RedirectResponse
    {
        $item->status_item = DetailPengajuanPeminjamanAlat::STATUS_DISETUJUI;
        $item->alasan_penolakan = null;
        $item->save();

        $item->pengajuan->refreshStatusKeseluruhan();

        return back()->with('success', 'Item alat berhasil disetujui.');
    }

    public function rejectAlat(Request $request, DetailPengajuanPeminjamanAlat $item): RedirectResponse
    {
        $validated = $request->validate([
            'alasan' => ['nullable', 'string', 'max:255'],
        ]);

        $item->status_item = DetailPengajuanPeminjamanAlat::STATUS_DITOLAK;
        $item->alasan_penolakan = $validated['alasan'] ?? 'Ditolak oleh verifikator laboratorium.';
        $item->save();

        $item->pengajuan->refreshStatusKeseluruhan();

        return back()->with('success', 'Item alat telah ditolak.');
    }

    public function approveRuangan(DetailPengajuanPeminjamanRuangan $item): RedirectResponse
    {
        $item->status_item = DetailPengajuanPeminjamanRuangan::STATUS_DISETUJUI;
        $item->alasan_penolakan = null;
        $item->save();

        $item->pengajuan->refreshStatusKeseluruhan();

        return back()->with('success', 'Item ruangan berhasil disetujui.');
    }

    public function rejectRuangan(Request $request, DetailPengajuanPeminjamanRuangan $item): RedirectResponse
    {
        $validated = $request->validate([
            'alasan' => ['nullable', 'string', 'max:255'],
        ]);

        $item->status_item = DetailPengajuanPeminjamanRuangan::STATUS_DITOLAK;
        $item->alasan_penolakan = $validated['alasan'] ?? 'Ditolak oleh verifikator laboratorium.';
        $item->save();

        $item->pengajuan->refreshStatusKeseluruhan();

        return back()->with('success', 'Item ruangan telah ditolak.');
    }
}
