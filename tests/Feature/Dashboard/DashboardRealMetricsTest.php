<?php

use App\Models\Alat;
use App\Models\Barang;
use App\Models\DetailPengajuanPeminjamanAlat;
use App\Models\DetailPengajuanPeminjamanRuangan;
use App\Models\PengajuanPeminjaman;
use App\Models\Ruangan;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Membuat satu pengajuan peminjaman alat.
 */
function pengajuanAlat(int $idPengguna, Alat $alat, array $atribut = []): PengajuanPeminjaman
{
    $pengajuan = PengajuanPeminjaman::create([
        'id_pengguna' => $idPengguna,
        'jenis_peminjaman' => $atribut['jenis'] ?? PengajuanPeminjaman::JENIS_INTERNAL,
        'total_biaya' => $atribut['biaya'] ?? 0.00,
        'status_keseluruhan' => $atribut['status'] ?? PengajuanPeminjaman::STATUS_MENUNGGU,
        'tanggal_peminjaman' => $atribut['tanggal'] ?? now()->toDateString(),
    ]);

    DetailPengajuanPeminjamanAlat::create([
        'id_pengajuan_peminjaman' => $pengajuan->id_pengajuan_peminjaman,
        'id_alat' => $alat->id_alat,
        'waktu_mulai' => $atribut['mulai'] ?? now()->addDay(),
        'waktu_selesai' => $atribut['selesai'] ?? now()->addDays(2),
        'jumlah_item' => 1,
        'harga_per_item' => 0.00,
        'total_biaya_per_item' => 0.00,
        'status_item' => $atribut['status'] ?? PengajuanPeminjaman::STATUS_MENUNGGU,
    ]);

    return $pengajuan;
}

/**
 * Membuat satu pengajuan peminjaman ruangan.
 */
function pengajuanRuangan(int $idPengguna, Ruangan $ruangan, array $atribut = []): PengajuanPeminjaman
{
    $pengajuan = PengajuanPeminjaman::create([
        'id_pengguna' => $idPengguna,
        'jenis_peminjaman' => $atribut['jenis'] ?? PengajuanPeminjaman::JENIS_INTERNAL,
        'total_biaya' => $atribut['biaya'] ?? 0.00,
        'status_keseluruhan' => $atribut['status'] ?? PengajuanPeminjaman::STATUS_MENUNGGU,
        'tanggal_peminjaman' => $atribut['tanggal'] ?? now()->toDateString(),
    ]);

    DetailPengajuanPeminjamanRuangan::create([
        'id_pengajuan_peminjaman' => $pengajuan->id_pengajuan_peminjaman,
        'id_ruangan' => $ruangan->id_ruangan,
        'waktu_mulai' => $atribut['mulai'] ?? now()->addDay(),
        'waktu_selesai' => $atribut['selesai'] ?? now()->addDays(2),
        'harga_per_item' => 0.00,
        'total_biaya_per_item' => 0.00,
        'status_item' => $atribut['status'] ?? PengajuanPeminjaman::STATUS_MENUNGGU,
    ]);

    return $pengajuan;
}

function alatUji(string $nama = 'Mikroskop Digital'): Alat
{
    $barang = Barang::factory()->alat()->create(['nama_barang' => $nama]);

    return Alat::factory()->create(['id_barang' => $barang->id_barang]);
}

function ruanganUji(string $nama = 'Lab Fisika Dasar'): Ruangan
{
    $barang = Barang::factory()->ruangan()->create(['nama_barang' => $nama]);

    return Ruangan::factory()->create(['id_barang' => $barang->id_barang]);
}

test('admin melihat agregat laboratorium dan akumulasi pendapatan', function () {
    $admin = buatPenggunaLengkap(['role' => 'admin']);
    $mhs = buatPenggunaLengkap(['role' => 'mhs']);
    $ekst = buatPenggunaLengkap(['role' => 'ekst']);

    $alat = alatUji();

    pengajuanAlat(idPengguna($mhs), $alat, ['status' => PengajuanPeminjaman::STATUS_MENUNGGU]);
    pengajuanAlat(idPengguna($ekst), $alat, [
        'status' => PengajuanPeminjaman::STATUS_DISETUJUI,
        'jenis' => PengajuanPeminjaman::JENIS_EKSTERNAL,
        'biaya' => 350000.00,
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('scope', 'lab')
            ->where('isLab', true)
            ->where('showRevenue', true)
            ->where('statsAlat.total', 2)
            ->where('statsAlat.pending', 1)
            ->where('statsAlat.disetujui', 1)
            ->where('pendapatanBulanIni', 350000)
            ->has('recentPengajuan', 2)
        );
});

test('kalab dan plp melihat agregat tanpa data pendapatan', function () {
    $kalab = buatPenggunaLengkap(['role' => 'kalab']);
    $plp = buatPenggunaLengkap(['role' => 'plp']);

    $alat = alatUji();
    pengajuanAlat(idPengguna($plp), $alat);

    foreach ([$kalab, $plp] as $pengguna) {
        $this->actingAs($pengguna)
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('scope', 'lab')
                ->where('showRevenue', false)
                ->missing('pendapatanBulanIni')
                ->has('statsAlat')
                ->has('statsRuangan')
            );
    }
});

test('statistik alat dan ruangan dihitung terpisah', function () {
    $admin = buatPenggunaLengkap(['role' => 'admin']);
    $peminjam = buatPenggunaLengkap(['role' => 'mhs']);

    $alat = alatUji();
    $ruangan = ruanganUji();

    pengajuanAlat(idPengguna($peminjam), $alat);
    pengajuanRuangan(idPengguna($peminjam), $ruangan, ['status' => PengajuanPeminjaman::STATUS_DIPINJAM]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('statsAlat.total', 1)
            ->where('statsAlat.pending', 1)
            ->where('statsAlat.dipinjam', 0)
            ->where('statsRuangan.total', 1)
            ->where('statsRuangan.pending', 0)
            ->where('statsRuangan.dipinjam', 1)
        );
});

test('peminjam hanya melihat data miliknya sendiri', function () {
    $mhs = buatPenggunaLengkap(['role' => 'mhs']);
    $lain = buatPenggunaLengkap(['role' => 'mhs']);

    $alat = alatUji();
    pengajuanAlat(idPengguna($mhs), $alat, ['status' => PengajuanPeminjaman::STATUS_MENUNGGU]);
    pengajuanAlat(idPengguna($lain), $alat, ['status' => PengajuanPeminjaman::STATUS_DISETUJUI]);

    $this->actingAs($mhs)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('scope', 'self')
            ->where('isLab', false)
            ->where('showRevenue', false)
            ->where('ringkasan.total', 1)
            ->where('ringkasan.menunggu', 1)
            ->where('ringkasan.disetujui', 0)
            ->has('recentPengajuan', 1)
            ->where('recentPengajuan.0.aset', 'Mikroskop Digital')
            // Dashboard peminjam tidak memuat komponen khusus pengelola.
            ->missing('statsAlat')
            ->missing('statsRuangan')
            ->missing('chart')
            ->missing('inventaris')
        );
});

test('dashboard menampilkan nol, bukan data contoh, saat belum ada transaksi', function () {
    $admin = buatPenggunaLengkap(['role' => 'admin']);
    $mhs = buatPenggunaLengkap(['role' => 'mhs']);

    // Peran pengelola: seluruh angka nol dan daftar kosong.
    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('statsAlat.total', 0)
            ->where('statsAlat.pending', 0)
            ->where('statsAlat.disetujui', 0)
            ->where('statsAlat.ditolak', 0)
            ->where('statsAlat.dipinjam', 0)
            ->where('statsRuangan.total', 0)
            ->where('pendapatanBulanIni', 0)
            ->has('recentPengajuan', 0)
            ->has('chart.alat', 12)
            ->where('chart.alat', array_fill(0, 12, 0))
        );

    // Peran peminjam: tidak ada pengajuan karangan atas nama "Anda".
    $this->actingAs($mhs)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('ringkasan.total', 0)
            ->where('ringkasan.berjalan', 0)
            ->has('recentPengajuan', 0)
            ->has('notifikasiPengembalian', 0)
        );
});

test('notifikasi pengembalian memuat tenggat dari item yang dipinjam', function () {
    $mhs = buatPenggunaLengkap(['role' => 'mhs']);

    $alat = alatUji();
    pengajuanAlat(idPengguna($mhs), $alat, [
        'status' => PengajuanPeminjaman::STATUS_DIPINJAM,
        'selesai' => now()->addDays(3)->setTime(17, 0),
    ]);

    // Pengajuan yang sudah selesai tidak boleh muncul di notifikasi.
    pengajuanAlat(idPengguna($mhs), $alat, [
        'status' => PengajuanPeminjaman::STATUS_DIKEMBALIKAN,
    ]);

    $this->actingAs($mhs)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('ringkasan.berjalan', 1)
            ->where('ringkasan.selesai', 1)
            ->has('notifikasiPengembalian', 1)
            ->where('notifikasiPengembalian.0.jatuhTempo', now()->addDays(3)->toDateString())
            ->where('notifikasiPengembalian.0.hariTersisa', 3)
        );
});

test('grafik tren dihitung dari transaksi nyata', function () {
    $admin = buatPenggunaLengkap(['role' => 'admin']);
    $peminjam = buatPenggunaLengkap(['role' => 'mhs']);

    $alat = alatUji();
    $ruangan = ruanganUji();

    pengajuanAlat(idPengguna($peminjam), $alat, ['tanggal' => now()->toDateString()]);
    pengajuanAlat(idPengguna($peminjam), $alat, ['tanggal' => now()->toDateString()]);
    pengajuanRuangan(idPengguna($peminjam), $ruangan, ['tanggal' => now()->toDateString()]);

    $bulanIni = (int) now()->month;

    // Deret grafik 0-indeks: bulan ke-N berada pada indeks N-1.
    $indeksBulanIni = (int) now()->month - 1;

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('chartPeriode', 'bulanan')
            ->has('chart.alat', 12)
            ->where("chart.alat.{$indeksBulanIni}", 2)
            ->where("chart.ruangan.{$indeksBulanIni}", 1)
        );

    // Periode harian: elemen terakhir adalah hari ini.
    $this->actingAs($admin)
        ->get(route('dashboard', ['periode' => 'harian']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('chartPeriode', 'harian')
            ->has('chart.labels', 30)
            ->where('chart.alat.29', 2)
            ->where('chart.ruangan.29', 1)
        );
});
