<?php

use App\Models\Alat;
use App\Models\Bahan;
use App\Models\Barang;
use App\Models\DetailAlat;
use App\Models\Fakultas;
use App\Models\Instansi;
use App\Models\Mebeler;
use App\Models\Pengguna;
use App\Models\Prodi;
use App\Models\Ruangan;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('barang dapat dibuat dan memiliki relasi ke alat', function () {
    $barang = Barang::factory()->alat()->create([
        'nama_barang' => 'Osiloskop Digital',
        'foto_barang' => 'osiloskop.jpg',
    ]);

    $alat = Alat::factory()->create([
        'id_barang' => $barang->id_barang,
        'tarif_eksternal_luar_unej' => 50000.00,
        'tarif_eksternal_internal_unej' => 25000.00,
    ]);

    expect($barang->alat)->not->toBeNull()
        ->and($barang->alat->id_alat)->toBe($alat->id_alat)
        ->and($alat->barang->id_barang)->toBe($barang->id_barang)
        ->and($barang->foto_url)->toBe('/osiloskop.jpg');
});

test('alat mengagregasi stok total dan stok tersedia dari detail alat', function () {
    $alat = Alat::factory()->create();

    // 2 unit tersedia & kondisi baik
    DetailAlat::factory()->count(2)->create([
        'id_alat' => $alat->id_alat,
        'kondisi' => DetailAlat::KONDISI_BAIK,
        'status' => DetailAlat::STATUS_TERSEDIA,
    ]);

    // 1 unit rusak & tidak tersedia
    DetailAlat::factory()->rusak()->create([
        'id_alat' => $alat->id_alat,
    ]);

    // 1 unit sedang perbaikan
    DetailAlat::factory()->sedangPerbaikan()->create([
        'id_alat' => $alat->id_alat,
    ]);

    expect($alat->stok_total)->toBe(4)
        ->and($alat->stok_tersedia)->toBe(2);
});

test('detail alat mendukung query scope tersedia dan kondisi baik', function () {
    $alat = Alat::factory()->create();

    DetailAlat::factory()->create([
        'id_alat' => $alat->id_alat,
        'kondisi' => DetailAlat::KONDISI_BAIK,
        'status' => DetailAlat::STATUS_TERSEDIA,
    ]);

    DetailAlat::factory()->rusak()->create([
        'id_alat' => $alat->id_alat,
    ]);

    expect(DetailAlat::tersedia()->count())->toBe(1)
        ->and(DetailAlat::kondisiBaik()->count())->toBe(1);
});

test('ruangan memiliki relasi ke barang dan aset di dalamnya', function () {
    $barangRuangan = Barang::factory()->ruangan()->create([
        'nama_barang' => 'Lab Fisika Dasar',
    ]);

    $ruangan = Ruangan::factory()->create([
        'id_barang' => $barangRuangan->id_barang,
        'kapasitas' => 40,
        'tarif_eksternal' => 350000.00,
        'tarif_eksternal_internal_unej' => 150000.00,
        'is_aktif' => true,
    ]);

    $alat = Alat::factory()->create();
    DetailAlat::factory()->create([
        'id_alat' => $alat->id_alat,
        'id_ruangan' => $ruangan->id_ruangan,
    ]);

    Bahan::factory()->create([
        'id_ruangan' => $ruangan->id_ruangan,
    ]);

    Mebeler::factory()->create([
        'id_ruangan' => $ruangan->id_ruangan,
    ]);

    expect($ruangan->barang->id_barang)->toBe($barangRuangan->id_barang)
        ->and($ruangan->kapasitas)->toBe(40)
        ->and($ruangan->is_aktif)->toBeTrue()
        ->and($ruangan->detailAlat)->toHaveCount(1)
        ->and($ruangan->bahan)->toHaveCount(1)
        ->and($ruangan->mebeler)->toHaveCount(1);
});

test('bahan dan mebeler terhubung ke barang dan ruangan dengan benar', function () {
    $barangBahan = Barang::factory()->bahan()->create(['nama_barang' => 'Alkohol 70%']);
    $ruangan = Ruangan::factory()->create();

    $bahan = Bahan::factory()->create([
        'id_barang' => $barangBahan->id_barang,
        'id_ruangan' => $ruangan->id_ruangan,
        'jumlah_awal' => 1000,
        'jumlah_saat_ini' => 450,
        'status' => Bahan::STATUS_AMAN,
    ]);

    $barangMebeler = Barang::factory()->mebeler()->create(['nama_barang' => 'Meja Lab Kayu']);
    $mebeler = Mebeler::factory()->create([
        'id_barang' => $barangMebeler->id_barang,
        'id_ruangan' => $ruangan->id_ruangan,
        'kondisi' => Mebeler::KONDISI_BAIK,
    ]);

    expect($bahan->barang->nama_barang)->toBe('Alkohol 70%')
        ->and($bahan->ruangan->id_ruangan)->toBe($ruangan->id_ruangan)
        ->and($mebeler->barang->nama_barang)->toBe('Meja Lab Kayu')
        ->and($mebeler->ruangan->id_ruangan)->toBe($ruangan->id_ruangan);
});

test('master data model fakultas dan prodi memiliki relasi yang tepat', function () {
    $fakultas = Fakultas::query()->create([
        'nama_fakultas' => 'Fakultas Keguruan dan Ilmu Pendidikan',
    ]);

    $prodi = Prodi::query()->create([
        'id_fakultas' => $fakultas->id_fakultas,
        'nama_prodi' => 'Pendidikan Fisika',
    ]);

    expect($fakultas->prodi)->toHaveCount(1)
        ->and($prodi->fakultas->nama_fakultas)->toBe('Fakultas Keguruan dan Ilmu Pendidikan');
});

test('master model pengguna dan instansi dapat dibuat', function () {
    $instansi = Instansi::query()->create([
        'nama_instansi' => 'SMAN 1 Jember',
    ]);

    $pengguna = Pengguna::query()->create([
        'nama_lengkap' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'no_telepon' => '08123456789',
    ]);

    expect($instansi->nama_instansi)->toBe('SMAN 1 Jember')
        ->and($pengguna->email)->toBe('budi@example.com');
});
