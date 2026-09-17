<?php

use App\Models\Alat;
use App\Models\Bahan;
use App\Models\Barang;
use App\Models\DetailAlat;
use App\Models\Mebeler;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('admin dapat menambahkan master alat baru beserta acuan tarif publik', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin', 'active' => true]);
    $foto = UploadedFile::fake()->image('osiloskop.jpg', 400, 300);

    $payload = [
        'nama' => 'Osiloskop Dual Trace 50MHz',
        'spesifikasi' => 'Alat ukur gelombang frekuensi tinggi',
        'tarif_internal' => 25000,
        'tarif_luar' => 75000,
        'stok_awal' => 3,
        'kondisi' => 'baik',
        'foto' => $foto,
    ];

    $response = $this->actingAs($admin)->post(route('katalog.alat.store'), $payload);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('barang', [
        'nama_barang' => 'Osiloskop Dual Trace 50MHz',
        'jenis' => 'alat',
    ]);

    $barang = Barang::where('nama_barang', 'Osiloskop Dual Trace 50MHz')->first();
    expect($barang)->not->toBeNull();

    $this->assertDatabaseHas('alat', [
        'id_barang' => $barang->id_barang,
        'tarif_eksternal_internal_unej' => 25000,
        'tarif_eksternal_luar_unej' => 75000,
    ]);

    $alat = Alat::where('id_barang', $barang->id_barang)->first();
    expect(DetailAlat::where('id_alat', $alat->id_alat)->count())->toBe(3);
});

test('admin dapat memperbarui data master alat', function () {
    $admin = User::factory()->create(['role' => 'admin', 'active' => true]);

    $barang = Barang::factory()->alat()->create(['nama_barang' => 'Nama Awal']);
    $alat = Alat::factory()->create([
        'id_barang' => $barang->id_barang,
        'tarif_eksternal_internal_unej' => 10000,
        'tarif_eksternal_luar_unej' => 30000,
    ]);

    $payload = [
        'nama' => 'Nama Diperbarui',
        'spesifikasi' => 'Deskripsi baru',
        'tarif_internal' => 15000,
        'tarif_luar' => 45000,
    ];

    $response = $this->actingAs($admin)->patch(route('katalog.alat.update', $alat->id_alat), $payload);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('barang', [
        'id_barang' => $barang->id_barang,
        'nama_barang' => 'Nama Diperbarui',
    ]);
    $this->assertDatabaseHas('alat', [
        'id_alat' => $alat->id_alat,
        'tarif_eksternal_internal_unej' => 15000,
        'tarif_eksternal_luar_unej' => 45000,
    ]);
});

test('plp dapat menambahkan detail unit fisik alat', function () {
    $plp = User::factory()->create(['role' => 'plp', 'active' => true]);

    $barang = Barang::factory()->alat()->create();
    $alat = Alat::factory()->create(['id_barang' => $barang->id_barang]);

    $payload = [
        'no_seri_unit' => 'SN-LAB-2026-001',
        'kondisi' => 'baik',
        'status' => 'tersedia',
        'tahun_pengadaan' => '2026',
        'sumber_dana' => 'BOPTN',
        'harga_beli' => 12500000,
        'catatan' => 'Unit baru tersegel',
    ];

    $response = $this->actingAs($plp)->post(route('katalog.alat.unit.store', $alat->id_alat), $payload);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('detail_alat', [
        'id_alat' => $alat->id_alat,
        'no_seri_unit' => 'SN-LAB-2026-001',
        'kondisi' => 'baik',
        'status' => 'tersedia',
    ]);
});

test('admin dapat menambahkan master ruangan baru', function () {
    $admin = User::factory()->create(['role' => 'admin', 'active' => true]);

    $payload = [
        'nama' => 'Laboratorium Komputasi Fisika',
        'spesifikasi' => 'Ruang komputer dan simulasi fisika',
        'kapasitas' => 35,
        'tarif_internal' => 50000,
        'tarif_luar' => 150000,
    ];

    $response = $this->actingAs($admin)->post(route('katalog.ruangan.store'), $payload);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('barang', [
        'nama_barang' => 'Laboratorium Komputasi Fisika',
        'jenis' => 'ruangan',
    ]);
    $this->assertDatabaseHas('ruangan', [
        'kapasitas' => 35,
        'tarif_eksternal_internal_unej' => 50000,
        'tarif_eksternal' => 150000,
        'is_aktif' => true,
    ]);
});

test('plp dapat mengelola data bahan dan mebeler', function () {
    $plp = User::factory()->create(['role' => 'plp', 'active' => true]);

    // Bahan
    $payloadBahan = [
        'nama' => 'Larutan HCl 0.1M',
        'spesifikasi' => 'Asam klorida teknis',
        'stok_awal' => 500,
        'stok_saat_ini' => 450,
        'satuan' => 'mL',
        'status' => 'aman',
    ];

    $this->actingAs($plp)->post(route('katalog.bahan.store'), $payloadBahan)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('barang', ['nama_barang' => 'Larutan HCl 0.1M', 'jenis' => 'bahan']);
    $this->assertDatabaseHas('bahan', ['satuan' => 'mL', 'jumlah_awal' => 500]);

    // Mebeler
    $payloadMebeler = [
        'nama' => 'Meja Praktikum Tahan Asam',
        'kondisi' => 'baik',
        'spesifikasi' => 'Meja granit 6 kursi',
        'tahun_pengadaan' => '2025',
    ];

    $this->actingAs($plp)->post(route('katalog.mebeler.store'), $payloadMebeler)
        ->assertSessionHas('success');

    $this->assertDatabaseHas('barang', ['nama_barang' => 'Meja Praktikum Tahan Asam', 'jenis' => 'mebeler']);
    $this->assertDatabaseHas('mebeler', ['kondisi' => 'baik']);
});

test('role mahasiswa dilarang mengelola inventaris (403)', function () {
    $mhs = User::factory()->create(['role' => 'mhs', 'active' => true]);

    $response = $this->actingAs($mhs)->post(route('katalog.alat.store'), [
        'nama' => 'Alat Ilegal',
    ]);

    $response->assertForbidden();
});
