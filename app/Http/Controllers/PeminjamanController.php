<?php

namespace App\Http\Controllers;

use App\Models\PengajuanPeminjaman;
use App\Models\User;
use App\Services\PeminjamanService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PeminjamanController extends Controller
{
    public function __construct(
        private readonly PeminjamanService $peminjamanService
    ) {}

    /**
     * Membuat transaksi pengajuan peminjaman dari keranjang sesi.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['nullable', 'integer'],
            'items.*.id_alat' => ['nullable', 'integer'],
            'items.*.id_ruangan' => ['nullable', 'integer'],
            'items.*.kategori' => ['nullable', 'string', 'in:alat,ruangan'],
            'items.*.aset' => ['nullable', 'array'],
            'items.*.aset.id' => ['nullable', 'integer'],
            'items.*.aset.id_alat' => ['nullable', 'integer'],
            'items.*.aset.id_ruangan' => ['nullable', 'integer'],
            'items.*.aset.kategori' => ['nullable', 'string'],
            'items.*.tanggalMulai' => ['nullable', 'string'],
            'items.*.tanggalSelesai' => ['nullable', 'string'],
            'items.*.waktu_mulai' => ['nullable', 'string'],
            'items.*.waktu_selesai' => ['nullable', 'string'],
            'items.*.jamMulai' => ['nullable', 'string'],
            'items.*.jamSelesai' => ['nullable', 'string'],
            'items.*.jumlah' => ['nullable', 'integer', 'min:1'],
            'metode_pembayaran' => ['nullable', 'string', 'in:transfer,cash'],
            'bukti_pembayaran' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $buktiFile = $request->file('bukti_pembayaran');

        $this->peminjamanService->createPengajuan(
            user: $user,
            items: $validated['items'],
            metodePembayaran: $validated['metode_pembayaran'] ?? null,
            buktiPembayaran: $buktiFile
        );

        return redirect()->route('riwayat')->with('success', 'Pengajuan peminjaman berhasil dibuat dan menunggu verifikasi.');
    }

    /**
     * BR-5: Pembatalan mandiri peminjaman oleh pemohon sebelum barang dipinjam.
     */
    public function cancel(Request $request, PengajuanPeminjaman $peminjaman): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->peminjamanService->cancelPengajuan($user, $peminjaman);

        return back()->with('success', 'Pengajuan peminjaman berhasil dibatalkan.');
    }
}
