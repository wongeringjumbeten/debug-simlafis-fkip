<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Khusus driver non-pgsql (e.g. sqlite in-memory testing) agar model inventaris
     * dapat diuji menggunakan factory tanpa menyentuh database PostgreSQL shared.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            return;
        }

        if (! Schema::hasTable('instansi')) {
            Schema::create('instansi', function (Blueprint $table): void {
                $table->id('id_instansi');
                $table->string('nama_instansi');
            });
        }

        if (! Schema::hasTable('fakultas')) {
            Schema::create('fakultas', function (Blueprint $table): void {
                $table->id('id_fakultas');
                $table->string('nama_fakultas');
            });
        }

        if (! Schema::hasTable('prodi')) {
            Schema::create('prodi', function (Blueprint $table): void {
                $table->id('id_prodi');
                $table->foreignId('id_fakultas');
                $table->string('nama_prodi');
            });
        }

        if (! Schema::hasTable('pengguna')) {
            Schema::create('pengguna', function (Blueprint $table): void {
                $table->id('id_pengguna');
                $table->string('nama_lengkap')->nullable();
                $table->string('foto_profil')->nullable();
                $table->string('foto_identitas')->nullable();
                $table->string('email')->unique();
                $table->string('no_telepon')->nullable();
            });
        }

        if (! Schema::hasTable('barang')) {
            Schema::create('barang', function (Blueprint $table): void {
                $table->id('id_barang');
                $table->string('nama_barang');
                $table->string('foto_barang')->nullable();
                $table->text('deskripsi_barang')->nullable();
                $table->string('jenis');
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('ruangan')) {
            Schema::create('ruangan', function (Blueprint $table): void {
                $table->id('id_ruangan');
                $table->foreignId('id_barang');
                $table->integer('kapasitas')->nullable();
                $table->decimal('tarif_eksternal', 12, 2)->nullable()->default('0.00');
                $table->boolean('is_aktif')->nullable()->default(true);
                $table->decimal('tarif_eksternal_internal_unej', 12, 2)->nullable()->default('0.00');
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('alat')) {
            Schema::create('alat', function (Blueprint $table): void {
                $table->id('id_alat');
                $table->foreignId('id_barang');
                $table->decimal('tarif_eksternal_luar_unej', 12, 2)->nullable()->default('0.00');
                $table->decimal('tarif_eksternal_internal_unej', 12, 2)->nullable()->default('0.00');
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('detail_alat')) {
            Schema::create('detail_alat', function (Blueprint $table): void {
                $table->id('id_detail_alat');
                $table->string('no_seri_unit')->nullable();
                $table->foreignId('id_alat');
                $table->foreignId('id_ruangan')->nullable();
                $table->string('kondisi');
                $table->string('status');
                $table->string('tahun_pengadaan')->nullable();
                $table->string('sumber_dana')->nullable();
                $table->decimal('harga_beli', 12, 2)->nullable();
                $table->text('catatan')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('bahan')) {
            Schema::create('bahan', function (Blueprint $table): void {
                $table->id('id_bahan');
                $table->foreignId('id_barang');
                $table->foreignId('id_ruangan')->nullable();
                $table->integer('jumlah_awal')->nullable()->default(0);
                $table->integer('jumlah_saat_ini')->nullable()->default(0);
                $table->string('satuan')->nullable();
                $table->date('tanggal_kadaluarsa')->nullable();
                $table->string('status');
                $table->text('catatan')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('mebeler')) {
            Schema::create('mebeler', function (Blueprint $table): void {
                $table->id('id_mebeler');
                $table->foreignId('id_barang');
                $table->foreignId('id_ruangan')->nullable();
                $table->string('no_seri_unit_mebeler')->nullable();
                $table->string('kondisi');
                $table->string('tahun_pengadaan')->nullable();
                $table->string('sumber_dana')->nullable();
                $table->decimal('harga_beli', 12, 2)->nullable();
                $table->text('catatan')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            return;
        }

        Schema::dropIfExists('mebeler');
        Schema::dropIfExists('bahan');
        Schema::dropIfExists('detail_alat');
        Schema::dropIfExists('alat');
        Schema::dropIfExists('ruangan');
        Schema::dropIfExists('barang');
        Schema::dropIfExists('pengguna');
        Schema::dropIfExists('prodi');
        Schema::dropIfExists('fakultas');
        Schema::dropIfExists('instansi');
    }
};
