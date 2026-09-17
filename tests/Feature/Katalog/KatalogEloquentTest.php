<?php

use App\Http\Controllers\KatalogController;
use App\Models\Alat;
use App\Models\Bahan;
use App\Models\Barang;
use App\Models\DetailAlat;
use App\Models\Mebeler;
use App\Models\Ruangan;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('katalog controller asets mengubah model eloquent ke format aset frontend', function () {
    $barangRuangan = Barang::factory()->ruangan()->create(['nama_barang' => 'Lab Fisika Dasar']);
    $ruangan = Ruangan::factory()->create([
        'id_barang' => $barangRuangan->id_barang,
        'kapasitas' => 30,
        'tarif_eksternal' => 200000.00,
        'tarif_eksternal_internal_unej' => 100000.00,
        'is_aktif' => true,
    ]);

    $barangAlat = Barang::factory()->alat()->create([
        'nama_barang' => 'Multimeter Digital',
        'foto_barang' => 'multimeter.jpg',
        'deskripsi_barang' => 'Pengukur arus presisi',
    ]);
    $alat = Alat::factory()->create([
        'id_barang' => $barangAlat->id_barang,
        'tarif_eksternal_luar_unej' => 45000.00,
        'tarif_eksternal_internal_unej' => 20000.00,
    ]);

    DetailAlat::factory()->create([
        'id_alat' => $alat->id_alat,
        'id_ruangan' => $ruangan->id_ruangan,
        'kondisi' => DetailAlat::KONDISI_BAIK,
        'status' => DetailAlat::STATUS_TERSEDIA,
    ]);

    DetailAlat::factory()->sedangPerbaikan()->create([
        'id_alat' => $alat->id_alat,
        'id_ruangan' => $ruangan->id_ruangan,
    ]);

    $barangBahan = Barang::factory()->bahan()->create(['nama_barang' => 'Alkohol 70%']);
    Bahan::factory()->create([
        'id_barang' => $barangBahan->id_barang,
        'id_ruangan' => $ruangan->id_ruangan,
        'jumlah_awal' => 1000,
        'jumlah_saat_ini' => 500,
        'satuan' => 'ml',
        'status' => Bahan::STATUS_AMAN,
    ]);

    $barangMebeler = Barang::factory()->mebeler()->create(['nama_barang' => 'Meja Praktikum']);
    Mebeler::factory()->create([
        'id_barang' => $barangMebeler->id_barang,
        'id_ruangan' => $ruangan->id_ruangan,
        'kondisi' => Mebeler::KONDISI_BAIK,
    ]);

    $controller = new KatalogController;
    $asets = $controller->asets();

    expect($asets)->toHaveCount(4);

    // Verifikasi item alat
    $itemAlat = collect($asets)->firstWhere('kategori', 'alat');
    expect($itemAlat)->not->toBeNull()
        ->and($itemAlat['nama'])->toBe('Multimeter Digital')
        ->and($itemAlat['kode'])->toBe('BRG-'.str_pad((string) $barangAlat->id_barang, 3, '0', STR_PAD_LEFT))
        ->and($itemAlat['foto'])->toBe('/multimeter.jpg')
        ->and($itemAlat['stokTotal'])->toBe(2)
        ->and($itemAlat['stokTersedia'])->toBe(1)
        ->and($itemAlat['kondisi'])->toBe('perlu_perawatan')
        ->and($itemAlat['lokasi'])->toBe('Lab Fisika Dasar')
        ->and($itemAlat['tarifInternalUnej'])->toBe(20000.0)
        ->and($itemAlat['tarifLuarUnej'])->toBe(45000.0);

    // Verifikasi item ruangan
    $itemRuangan = collect($asets)->firstWhere('kategori', 'ruangan');
    expect($itemRuangan)->not->toBeNull()
        ->and($itemRuangan['nama'])->toBe('Lab Fisika Dasar')
        ->and($itemRuangan['kapasitas'])->toBe(30)
        ->and($itemRuangan['stokTersedia'])->toBe(1)
        ->and($itemRuangan['tarifLuarUnej'])->toBe(200000.0);

    // Verifikasi item bahan
    $itemBahan = collect($asets)->firstWhere('kategori', 'bahan');
    expect($itemBahan)->not->toBeNull()
        ->and($itemBahan['nama'])->toBe('Alkohol 70%')
        ->and($itemBahan['stokTotal'])->toBe(1000)
        ->and($itemBahan['stokTersedia'])->toBe(500)
        ->and($itemBahan['kondisi'])->toBe('baik');

    // Verifikasi item mebeler
    $itemMebeler = collect($asets)->firstWhere('kategori', 'mebeler');
    expect($itemMebeler)->not->toBeNull()
        ->and($itemMebeler['nama'])->toBe('Meja Praktikum')
        ->and($itemMebeler['kondisi'])->toBe('baik');
});
