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
        // Penangkal mesin waktu super lengkap (mendeteksi semua variasi key front-end)
        $antiTimeTravelRule = function ($attribute, $value, $fail) use ($request) {
            preg_match('/items\.(\d+)\./', $attribute, $matches);
            $index = $matches[1] ?? null;

            if ($index !== null && $value) {
                $items = $request->input('items', []);
                $item = $items[$index] ?? [];

                // Tangkap segala kemungkinan nama key tanggal dari front-end
                $tglMulai = $item['tanggalMulai'] ?? $item['tanggal_mulai'] ?? null;
                $tglSelesai = $item['tanggalSelesai'] ?? $item['tanggal_selesai'] ?? null;

                // Tangkap segala kemungkinan nama key jam mulai dari front-end
                $jamMulai = $item['waktu_mulai'] ?? $item['jamMulai'] ?? $item['jam_mulai'] ?? $item['waktuMulai'] ?? null;

                // Jika di hari yang sama dan jam mulai ditemukan
                if ($tglMulai && $tglSelesai && $tglMulai === $tglSelesai && $jamMulai) {
                    try {
                        // Gunakan Carbon untuk parse jam dengan akurat (format H:i)
                        $timeStart = \Carbon\Carbon::createFromFormat('H:i', trim($jamMulai));
                        $timeEnd = \Carbon\Carbon::createFromFormat('H:i', trim($value));

                        if ($timeEnd->lessThanOrEqualTo($timeStart)) {
                            $fail('Waktu selesai pada item ke-' . ($index + 1) . ' tidak boleh lebih awal atau sama dengan jam mulai di hari yang sama!');
                        }
                    } catch (\Exception $e) {
                        // Abaikan jika format string jam tidak valid (biar ditangani rule date_format)
                    }
                }
            }
        };

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

            // Validasi Tanggal (Mendukung semua variasi key)
            'items.*.tanggalMulai' => ['nullable', 'date'],
            'items.*.tanggal_mulai' => ['nullable', 'date'],
            'items.*.tanggalSelesai' => ['nullable', 'date'],
            'items.*.tanggal_selesai' => ['nullable', 'date', 'after_or_equal:items.*.tanggalMulai'],

            // Validasi Jam Mulai (Mendukung semua variasi key)
            'items.*.waktu_mulai' => ['nullable', 'string'],
            'items.*.jamMulai' => ['nullable', 'string'],
            'items.*.jam_mulai' => ['nullable', 'string'],
            'items.*.waktuMulai' => ['nullable', 'string'],

            // Pasang penangkal mesin waktu di SEMUA variasi field jam selesai
            'items.*.waktu_selesai' => ['nullable', 'string', $antiTimeTravelRule],
            'items.*.jamSelesai' => ['nullable', 'string', $antiTimeTravelRule],
            'items.*.jam_selesai' => ['nullable', 'string', $antiTimeTravelRule],
            'items.*.waktuSelesai' => ['nullable', 'string', $antiTimeTravelRule],

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
