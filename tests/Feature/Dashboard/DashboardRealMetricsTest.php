<?php

use App\Models\Alat;
use App\Models\Barang;
use App\Models\DetailPengajuanPeminjamanAlat;
use App\Models\PengajuanPeminjaman;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('dashboard menampilkan data transaksi nyata saat pengajuan ada di database', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mhs = User::factory()->create(['role' => 'mhs', 'active' => true]);

    $barang = Barang::factory()->alat()->create(['nama_barang' => 'Mikroskop Digital']);
    $alat = Alat::factory()->create(['id_barang' => $barang->id_barang]);

    // Buat pengajuan untuk mhs
    $pengajuan1 = PengajuanPeminjaman::create([
        'id_pengguna' => $mhs->id,
        'jenis_peminjaman' => PengajuanPeminjaman::JENIS_INTERNAL,
        'total_biaya' => 0.00,
        'status_keseluruhan' => PengajuanPeminjaman::STATUS_MENUNGGU,
        'tanggal_peminjaman' => now()->toDateString(),
    ]);

    DetailPengajuanPeminjamanAlat::create([
        'id_pengajuan_peminjaman' => $pengajuan1->id_pengajuan_peminjaman,
        'id_alat' => $alat->id_alat,
        'waktu_mulai' => now()->addDay(),
        'waktu_selesai' => now()->addDays(2),
        'jumlah_item' => 1,
        'harga_per_item' => 0.00,
        'total_biaya_per_item' => 0.00,
        'status_item' => PengajuanPeminjaman::STATUS_MENUNGGU,
    ]);

    // Buat pengajuan eksternal berbayar disetujui (untuk menguji pendapatan admin)
    $ekstUser = User::factory()->create(['role' => 'ekst', 'active' => true]);
    $pengajuan2 = PengajuanPeminjaman::create([
        'id_pengguna' => $ekstUser->id,
        'jenis_peminjaman' => PengajuanPeminjaman::JENIS_EKSTERNAL,
        'total_biaya' => 350000.00,
        'status_keseluruhan' => PengajuanPeminjaman::STATUS_DISETUJUI,
        'tanggal_peminjaman' => now()->toDateString(),
    ]);

    $this->withoutExceptionHandling();

    // Admin melihat agregat lab nyata: total 2, pending 1, disetujui 1
    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('scope', 'lab')
            ->where('stats.total', 2)
            ->where('stats.pending', 1)
            ->where('stats.disetujui', 1)
            ->where('pendapatanBulanIni', 350000)
            ->has('recentPengajuan', 2)
        );

    // Mahasiswa hanya melihat miliknya: total 1, pending 1
    $this->actingAs($mhs)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('scope', 'self')
            ->where('stats.total', 1)
            ->where('stats.pending', 1)
            ->where('stats.disetujui', 0)
            ->missing('pendapatanBulanIni')
            ->has('recentPengajuan', 1)
            ->where('recentPengajuan.0.aset', 'Mikroskop Digital')
        );
});
