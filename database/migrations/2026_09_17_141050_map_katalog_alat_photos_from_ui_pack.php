<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Petakan 5 foto alat terverifikasi dari paket UI/UX ke baris barang yang
     * sudah ada. Tidak membuat barang baru; 21 gambar sisanya menunggu data
     * master resmi (lihat docs/database-integration.md).
     *
     * @var array<int, string>
     */
    private const MAP = [
        2 => 'images/katalog/alat/jangka-sorong-analog.png',
        3 => 'images/katalog/alat/jangka-sorong-digital.png',
        4 => 'images/katalog/alat/mikrometer-sekrup.png',
        5 => 'images/katalog/alat/spherometer.png',
        6 => 'images/katalog/alat/neraca-ohaus-3-lengan.png',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        foreach (self::MAP as $idBarang => $foto) {
            DB::table('barang')->where('id_barang', $idBarang)->update(['foto_barang' => $foto]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        $original = [
            2 => 'jangka_sorong_analog.jpg',
            3 => 'jangka_sorong_digital.jpg',
            4 => 'mikrometer.jpg',
            5 => 'spherometer.jpg',
            6 => 'neraca_ohaus.jpg',
        ];

        foreach ($original as $idBarang => $foto) {
            DB::table('barang')->where('id_barang', $idBarang)->update(['foto_barang' => $foto]);
        }
    }
};
