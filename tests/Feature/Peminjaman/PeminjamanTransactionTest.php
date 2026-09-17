<?php

use App\Models\Alat;
use App\Models\Barang;
use App\Models\DetailPengajuanPeminjamanAlat;
use App\Models\DetailPengajuanPeminjamanRuangan;
use App\Models\PengajuanPeminjaman;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('mahasiswa dapat mengajukan peminjaman alat internal gratis', function () {
    $user = User::factory()->create([
        'role' => 'mhs',
        'active' => true,
    ]);

    $barang = Barang::factory()->alat()->create();
    $alat = Alat::factory()->create(['id_barang' => $barang->id_barang]);

    $payload = [
        'items' => [
            [
                'kategori' => 'alat',
                'id_alat' => $alat->id_alat,
                'tanggalMulai' => now()->addDay()->toDateString(),
                'tanggalSelesai' => now()->addDays(2)->toDateString(),
                'jamMulai' => '08:00',
                'jamSelesai' => '16:00',
                'jumlah' => 2,
            ],
        ],
    ];

    $response = $this->actingAs($user)->post(route('peminjaman.store'), $payload);

    $response->assertRedirect(route('riwayat'));

    $this->assertDatabaseHas('pengajuan_peminjaman', [
        'id_pengguna' => $user->id,
        'jenis_peminjaman' => 'internal',
        'total_biaya' => 0.00,
        'status_keseluruhan' => 'menunggu',
    ]);

    $this->assertDatabaseHas('detail_pengajuan_peminjaman_alat', [
        'id_alat' => $alat->id_alat,
        'jumlah_item' => 2,
        'status_item' => 'menunggu',
    ]);
});

test('peminjaman mahasiswa dibatasi maksimal 7 hari kalender', function () {
    $user = User::factory()->create([
        'role' => 'mhs',
        'active' => true,
    ]);

    $barang = Barang::factory()->alat()->create();
    $alat = Alat::factory()->create(['id_barang' => $barang->id_barang]);

    $payload = [
        'items' => [
            [
                'kategori' => 'alat',
                'id_alat' => $alat->id_alat,
                'tanggalMulai' => now()->addDay()->toDateString(),
                'tanggalSelesai' => now()->addDays(10)->toDateString(), // 9 hari > 7 hari
                'jumlah' => 1,
            ],
        ],
    ];

    $response = $this->actingAs($user)->post(route('peminjaman.store'), $payload);

    $response->assertSessionHasErrors('durasi');
});

test('eksternal dikenakan tarif sewa berjenjang', function () {
    $user = User::factory()->create([
        'role' => 'ekst',
        'kategori' => 'internal_unej',
        'active' => true,
    ]);

    $barang = Barang::factory()->alat()->create();
    $alat = Alat::factory()->create([
        'id_barang' => $barang->id_barang,
        'tarif_eksternal_internal_unej' => 15000.00,
        'tarif_eksternal_luar_unej' => 30000.00,
    ]);

    $payload = [
        'items' => [
            [
                'kategori' => 'alat',
                'id_alat' => $alat->id_alat,
                'tanggalMulai' => now()->addDay()->toDateString(),
                'tanggalSelesai' => now()->addDays(2)->toDateString(), // 1 hari
                'jumlah' => 2,
            ],
        ],
        'metode_pembayaran' => 'transfer',
    ];

    $response = $this->actingAs($user)->post(route('peminjaman.store'), $payload);

    $response->assertRedirect(route('riwayat'));

    // 15.000 * 2 unit * 2 hari = 60.000
    $this->assertDatabaseHas('pengajuan_peminjaman', [
        'id_pengguna' => $user->id,
        'jenis_peminjaman' => 'eksternal',
        'total_biaya' => 60000.00,
        'metode_pembayaran' => 'transfer',
    ]);
});

test('akun yang suspended dilarang membuat pengajuan peminjaman baru', function () {
    $user = User::factory()->create([
        'role' => 'mhs',
        'active' => false,
    ]);

    $barang = Barang::factory()->alat()->create();
    $alat = Alat::factory()->create(['id_barang' => $barang->id_barang]);

    $payload = [
        'items' => [
            [
                'kategori' => 'alat',
                'id_alat' => $alat->id_alat,
                'tanggalMulai' => now()->addDay()->toDateString(),
                'tanggalSelesai' => now()->addDays(2)->toDateString(),
            ],
        ],
    ];

    $response = $this->actingAs($user)->post(route('peminjaman.store'), $payload);

    $response->assertSessionHasErrors('cart');
});

test('sistem mendeteksi tabrakan jadwal ruangan', function () {
    $user1 = User::factory()->create(['role' => 'dosen', 'active' => true]);
    $user2 = User::factory()->create(['role' => 'mhs', 'active' => true]);

    $barangRuangan = Barang::factory()->ruangan()->create();
    $ruangan = Ruangan::factory()->create(['id_barang' => $barangRuangan->id_barang]);

    // Booking pertama: besok 08:00 - 12:00
    $mulai1 = now()->addDay()->setTime(8, 0);
    $selesai1 = now()->addDay()->setTime(12, 0);

    $pengajuan1 = PengajuanPeminjaman::query()->create([
        'id_pengguna' => $user1->id,
        'jenis_peminjaman' => 'internal',
        'total_biaya' => 0.00,
        'status_keseluruhan' => 'menunggu',
        'tanggal_peminjaman' => now()->toDateString(),
    ]);

    DetailPengajuanPeminjamanRuangan::query()->create([
        'id_pengajuan_peminjaman' => $pengajuan1->id_pengajuan_peminjaman,
        'id_ruangan' => $ruangan->id_ruangan,
        'waktu_mulai' => $mulai1,
        'waktu_selesai' => $selesai1,
        'status_item' => 'menunggu',
    ]);

    // Booking kedua: besok 10:00 - 14:00 (bentrok!)
    $payload2 = [
        'items' => [
            [
                'kategori' => 'ruangan',
                'id_ruangan' => $ruangan->id_ruangan,
                'waktu_mulai' => now()->addDay()->setTime(10, 0)->toDateTimeString(),
                'waktu_selesai' => now()->addDay()->setTime(14, 0)->toDateTimeString(),
            ],
        ],
    ];

    $response2 = $this->actingAs($user2)->post(route('peminjaman.store'), $payload2);

    $response2->assertSessionHasErrors('ruangan');
});

test('pemohon dapat membatalkan pengajuan mandiri sebelum dipinjam', function () {
    $user = User::factory()->create(['role' => 'mhs', 'active' => true]);

    $pengajuan = PengajuanPeminjaman::query()->create([
        'id_pengguna' => $user->id,
        'jenis_peminjaman' => 'internal',
        'total_biaya' => 0.00,
        'status_keseluruhan' => 'menunggu',
        'tanggal_peminjaman' => now()->toDateString(),
    ]);

    $response = $this->actingAs($user)->post(route('peminjaman.cancel', $pengajuan));

    $response->assertSessionHas('success');

    $pengajuan->refresh();
    expect($pengajuan->status_keseluruhan)->toBe('dibatalkan');
});

test('staf lab dapat menyetujui atau menolak item secara independen', function () {
    $admin = User::factory()->create(['role' => 'admin', 'active' => true]);
    $pemohon = User::factory()->create(['role' => 'mhs', 'active' => true]);

    $barangAlat = Barang::factory()->alat()->create();
    $alat = Alat::factory()->create(['id_barang' => $barangAlat->id_barang]);

    $pengajuan = PengajuanPeminjaman::query()->create([
        'id_pengguna' => $pemohon->id,
        'jenis_peminjaman' => 'internal',
        'total_biaya' => 0.00,
        'status_keseluruhan' => 'menunggu',
        'tanggal_peminjaman' => now()->toDateString(),
    ]);

    $itemAlat = DetailPengajuanPeminjamanAlat::query()->create([
        'id_pengajuan_peminjaman' => $pengajuan->id_pengajuan_peminjaman,
        'id_alat' => $alat->id_alat,
        'waktu_mulai' => now()->addDay(),
        'waktu_selesai' => now()->addDays(2),
        'jumlah_item' => 1,
        'status_item' => 'menunggu',
    ]);

    // Admin setujui item alat
    $this->actingAs($admin)
        ->patch(route('persetujuan.alat.approve', $itemAlat))
        ->assertSessionHas('success');

    $itemAlat->refresh();
    $pengajuan->refresh();

    expect($itemAlat->status_item)->toBe('disetujui')
        ->and($pengajuan->status_keseluruhan)->toBe('disetujui');
});

test('halaman riwayat dapat diakses oleh peminjam', function () {
    $user = User::factory()->create(['role' => 'mhs', 'active' => true]);

    $this->actingAs($user)
        ->get(route('riwayat'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('riwayat/index')
            ->has('transaksi')
        );
});

test('halaman persetujuan hanya dapat diakses oleh staf lab', function () {
    $mhs = User::factory()->create(['role' => 'mhs', 'active' => true]);
    $admin = User::factory()->create(['role' => 'admin', 'active' => true]);

    $this->actingAs($mhs)
        ->get(route('persetujuan'))
        ->assertForbidden();

    $this->actingAs($admin)
        ->get(route('persetujuan'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('persetujuan/index')
            ->has('pengajuan')
        );
});
