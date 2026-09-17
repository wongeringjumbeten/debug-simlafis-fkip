<?php

namespace App\Services;

use App\Models\Alat;
use App\Models\DetailPengajuanPeminjamanAlat;
use App\Models\DetailPengajuanPeminjamanRuangan;
use App\Models\PengajuanPeminjaman;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PeminjamanService
{
    /**
     * Membuat pengajuan peminjaman baru dari item keranjang.
     *
     * @param  list<array<string, mixed>>  $items
     *
     * @throws ValidationException
     */
    public function createPengajuan(
        User $user,
        array $items,
        ?string $metodePembayaran = null,
        ?UploadedFile $buktiPembayaran = null
    ): PengajuanPeminjaman {
        // BR-3: Sanksi penangguhan akses.
        if ($user->isSuspended() || $user->isBlocked()) {
            throw ValidationException::withMessages([
                'cart' => 'Akun Anda sedang ditangguhkan atau diblokir, sehingga tidak dapat membuat pengajuan peminjaman baru.',
            ]);
        }

        if (empty($items)) {
            throw ValidationException::withMessages([
                'cart' => 'Keranjang peminjaman masih kosong.',
            ]);
        }

        $idPengguna = $this->resolveIdPengguna($user);
        $isEksternal = $user->role === 'ekst';
        $subKategori = $isEksternal ? ($user->kategori ?? 'luar_unej') : null;
        $jenisPeminjaman = $isEksternal ? PengajuanPeminjaman::JENIS_EKSTERNAL : PengajuanPeminjaman::JENIS_INTERNAL;

        return DB::transaction(function () use (
            $user,
            $items,
            $idPengguna,
            $isEksternal,
            $subKategori,
            $jenisPeminjaman,
            $metodePembayaran,
            $buktiPembayaran
        ): PengajuanPeminjaman {
            $totalBiayaTransaksi = 0.00;
            $alatRecords = [];
            $ruanganRecords = [];

            foreach ($items as $item) {
                $kategori = $item['kategori'] ?? $item['aset']['kategori'] ?? null;
                $waktuMulai = isset($item['waktu_mulai'])
                    ? Carbon::parse($item['waktu_mulai'])
                    : Carbon::parse(($item['tanggalMulai'] ?? Carbon::now()->toDateString()).' '.($item['jamMulai'] ?? '08:00'));
                $waktuSelesai = isset($item['waktu_selesai'])
                    ? Carbon::parse($item['waktu_selesai'])
                    : Carbon::parse(($item['tanggalSelesai'] ?? Carbon::now()->toDateString()).' '.($item['jamSelesai'] ?? '17:00'));

                // REQ-14: Pembatasan durasi peminjaman Mahasiswa maksimal 7 hari.
                if ($user->role === 'mhs') {
                    $durasiHari = (int) ceil($waktuMulai->diffInDays($waktuSelesai, false)) ?: 1;
                    if ($durasiHari > 7) {
                        throw ValidationException::withMessages([
                            'durasi' => 'Peminjaman untuk Mahasiswa dibatasi maksimal 7 hari kalender.',
                        ]);
                    }
                }

                $hari = max(1, (int) ceil($waktuMulai->diffInDays($waktuSelesai, false)) ?: 1);

                if ($kategori === 'alat') {
                    $idAlat = (int) ($item['id_alat'] ?? $item['aset']['id_alat'] ?? $this->resolveAlatIdFromBarang((int) ($item['id'] ?? $item['aset']['id'] ?? 0)));
                    $alat = Alat::query()->with('barang')->findOrFail($idAlat);
                    $jumlah = max(1, (int) ($item['jumlah'] ?? 1));

                    $tarifPerItem = 0.00;
                    if ($isEksternal) {
                        $tarifPerItem = $subKategori === 'internal_unej'
                            ? (float) ($alat->tarif_eksternal_internal_unej ?? 0)
                            : (float) ($alat->tarif_eksternal_luar_unej ?? 0);
                    }

                    $subtotal = $tarifPerItem * $jumlah * $hari;
                    $totalBiayaTransaksi += $subtotal;

                    $alatRecords[] = [
                        'id_alat' => $alat->id_alat,
                        'waktu_mulai' => $waktuMulai,
                        'waktu_selesai' => $waktuSelesai,
                        'jumlah_item' => $jumlah,
                        'harga_per_item' => $tarifPerItem,
                        'total_biaya_per_item' => $subtotal,
                        'status_item' => DetailPengajuanPeminjamanAlat::STATUS_MENUNGGU,
                    ];
                } elseif ($kategori === 'ruangan') {
                    $idRuangan = (int) ($item['id_ruangan'] ?? $item['aset']['id_ruangan'] ?? $this->resolveRuanganIdFromBarang((int) ($item['id'] ?? $item['aset']['id'] ?? 0)));
                    $ruangan = Ruangan::query()->with('barang')->findOrFail($idRuangan);

                    // REQ-13: Anti-collision schedule check.
                    $this->checkRoomCollision($ruangan, $waktuMulai, $waktuSelesai);

                    $tarifPerItem = 0.00;
                    if ($isEksternal) {
                        $tarifPerItem = $subKategori === 'internal_unej'
                            ? (float) ($ruangan->tarif_eksternal_internal_unej ?? 0)
                            : (float) ($ruangan->tarif_eksternal ?? 0);
                    }

                    $subtotal = $tarifPerItem * $hari;
                    $totalBiayaTransaksi += $subtotal;

                    $ruanganRecords[] = [
                        'id_ruangan' => $ruangan->id_ruangan,
                        'waktu_mulai' => $waktuMulai,
                        'waktu_selesai' => $waktuSelesai,
                        'harga_per_item' => $tarifPerItem,
                        'total_biaya_per_item' => $subtotal,
                        'status_item' => DetailPengajuanPeminjamanRuangan::STATUS_MENUNGGU,
                    ];
                }
            }

            // Upload bukti pembayaran jika eksternal
            $buktiPath = null;
            if ($buktiPembayaran !== null) {
                $buktiPath = $buktiPembayaran->store('bukti_pembayaran', 'public');
            }

            $pengajuan = PengajuanPeminjaman::query()->create([
                'id_pengguna' => $idPengguna,
                'jenis_peminjaman' => $jenisPeminjaman,
                'total_biaya' => $totalBiayaTransaksi,
                'metode_pembayaran' => $metodePembayaran,
                'bukti_pembayaran' => $buktiPath,
                'status_keseluruhan' => PengajuanPeminjaman::STATUS_MENUNGGU,
                'tanggal_peminjaman' => Carbon::now()->toDateString(),
            ]);

            foreach ($alatRecords as $record) {
                $record['id_pengajuan_peminjaman'] = $pengajuan->id_pengajuan_peminjaman;
                DetailPengajuanPeminjamanAlat::query()->create($record);
            }

            foreach ($ruanganRecords as $record) {
                $record['id_pengajuan_peminjaman'] = $pengajuan->id_pengajuan_peminjaman;
                DetailPengajuanPeminjamanRuangan::query()->create($record);
            }

            return $pengajuan;
        });
    }

    /**
     * BR-5: Pembatalan mandiri peminjaman oleh pemohon.
     *
     * @throws ValidationException
     */
    public function cancelPengajuan(User $user, PengajuanPeminjaman $pengajuan): bool
    {
        if (! $pengajuan->isCancellable()) {
            throw ValidationException::withMessages([
                'cancel' => 'Pengajuan tidak dapat dibatalkan karena status sudah dipinjam atau selesai.',
            ]);
        }

        $idPengguna = $this->resolveIdPengguna($user);
        $isLabAdmin = in_array($user->role, ['admin', 'kalab', 'plp'], true);

        if (! $isLabAdmin && (int) $pengajuan->id_pengguna !== $idPengguna) {
            throw ValidationException::withMessages([
                'cancel' => 'Anda tidak memiliki hak untuk membatalkan pengajuan ini.',
            ]);
        }

        return DB::transaction(function () use ($pengajuan): bool {
            $pengajuan->status_keseluruhan = PengajuanPeminjaman::STATUS_DIBATALKAN;
            $pengajuan->save();

            $pengajuan->detailAlat()
                ->whereIn('status_item', [DetailPengajuanPeminjamanAlat::STATUS_MENUNGGU, DetailPengajuanPeminjamanAlat::STATUS_DISETUJUI])
                ->update(['status_item' => PengajuanPeminjaman::STATUS_DIBATALKAN]);

            $pengajuan->detailRuangan()
                ->whereIn('status_item', [DetailPengajuanPeminjamanRuangan::STATUS_MENUNGGU, DetailPengajuanPeminjamanRuangan::STATUS_DISETUJUI])
                ->update(['status_item' => PengajuanPeminjaman::STATUS_DIBATALKAN]);

            return true;
        });
    }

    /**
     * REQ-13: Deteksi bentrok jadwal ruangan.
     *
     * @throws ValidationException
     */
    public function checkRoomCollision(Ruangan $ruangan, Carbon $mulai, Carbon $selesai): void
    {
        $collision = DetailPengajuanPeminjamanRuangan::query()
            ->where('id_ruangan', $ruangan->id_ruangan)
            ->whereIn('status_item', [
                DetailPengajuanPeminjamanRuangan::STATUS_MENUNGGU,
                DetailPengajuanPeminjamanRuangan::STATUS_DISETUJUI,
            ])
            ->where(function ($query) use ($mulai, $selesai): void {
                $query->where('waktu_mulai', '<', $selesai)
                    ->where('waktu_selesai', '>', $mulai);
            })
            ->exists();

        if ($collision) {
            $namaRuangan = $ruangan->barang?->nama_barang ?? 'Ruangan #'.$ruangan->id_ruangan;
            throw ValidationException::withMessages([
                'ruangan' => "Jadwal {$namaRuangan} bentrok dengan peminjaman lain pada rentang waktu yang dipilih.",
            ]);
        }
    }

    /**
     * Dapatkan id_pengguna yang valid dari model User (v_auth_users / users).
     */
    public function resolveIdPengguna(User $user): int
    {
        if (DB::getDriverName() === 'pgsql') {
            $idPengguna = DB::table('akun')
                ->where('id_akun', $user->getAuthIdentifier())
                ->value('id_pengguna');

            if ($idPengguna !== null) {
                return (int) $idPengguna;
            }
        }

        return (int) $user->getAuthIdentifier();
    }

    private function resolveAlatIdFromBarang(int $idBarang): int
    {
        $alat = Alat::query()->where('id_barang', $idBarang)->first();

        return $alat ? (int) $alat->id_alat : $idBarang;
    }

    private function resolveRuanganIdFromBarang(int $idBarang): int
    {
        $ruangan = Ruangan::query()->where('id_barang', $idBarang)->first();

        return $ruangan ? (int) $ruangan->id_ruangan : $idBarang;
    }
}
