<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Skema dasar SIMLAFIS.
 *
 * Tabel-tabel pada migrasi ini sebelumnya dibuat di luar sistem migrasi
 * (langsung pada database Supabase), sehingga skema tidak dapat dibangun ulang
 * dari nol. Akibatnya test suite tidak dapat dijalankan pada database bersih.
 *
 * Migrasi ini mencatat skema tersebut secara resmi. Setiap tabel dijaga dengan
 * `Schema::hasTable()` sehingga:
 * - pada database yang sudah memiliki tabelnya (database kerja) migrasi ini
 *   tidak melakukan apa pun;
 * - pada database kosong (simlafis_testing) migrasi ini membangunnya dari nol.
 *
 * Diletakkan pada urutan paling awal karena migrasi sesudahnya
 * (124254, 124939, 020819, 062129) melakukan ALTER terhadap tabel `akun`.
 */
return new class extends Migration
{
    public function up(): void
    {
        $this->tabelWilayah();
        $this->tabelReferensi();
        $this->tabelAkun();
        $this->tabelSubtipePengguna();
        $this->tabelInventaris();
    }

    public function down(): void
    {
        // Urutan dibalik mengikuti ketergantungan foreign key.
        foreach ([
            'mebeler', 'bahan', 'detail_alat', 'ruangan', 'alat', 'barang',
            'eksternal', 'mahasiswa', 'dosen',
            'akun', 'pengguna', 'peran', 'kredensial',
            'prodi', 'fakultas', 'instansi',
            'villages', 'districts', 'regencies', 'provinces',
        ] as $tabel) {
            Schema::dropIfExists($tabel);
        }
    }

    /**
     * Wilayah administratif untuk dropdown berantai pada formulir registrasi.
     */
    private function tabelWilayah(): void
    {
        if (! Schema::hasTable('provinces')) {
            Schema::create('provinces', function (Blueprint $table): void {
                $table->id();
                $table->string('name');
            });
        }

        if (! Schema::hasTable('regencies')) {
            Schema::create('regencies', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('province_id')->constrained('provinces');
                $table->string('name');
                $table->string('type', 50)->nullable();
            });
        }

        if (! Schema::hasTable('districts')) {
            Schema::create('districts', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('regency_id')->constrained('regencies');
                $table->string('name');
            });
        }

        if (! Schema::hasTable('villages')) {
            Schema::create('villages', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('district_id')->constrained('districts');
                $table->string('name');
            });
        }
    }

    /**
     * Tabel referensi kelembagaan.
     */
    private function tabelReferensi(): void
    {
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
                $table->foreignId('id_fakultas')->constrained('fakultas', 'id_fakultas');
                $table->string('nama_prodi');
            });
        }
    }

    /**
     * Inti 3NF: peran, kredensial, pengguna, dan akun.
     */
    private function tabelAkun(): void
    {
        if (! Schema::hasTable('kredensial')) {
            Schema::create('kredensial', function (Blueprint $table): void {
                $table->id('id_kredensial');
                $table->string('password');
            });
        }

        if (! Schema::hasTable('peran')) {
            Schema::create('peran', function (Blueprint $table): void {
                $table->id('id_peran');
                $table->string('role', 50)->unique();
            });
        }

        // Peran awal; migrasi 124254 mengubah id_peran 6 menjadi kategori tarif
        // eksternal (BR-2) dan menghapus peran eksternal terpisah.
        DB::table('peran')->insertOrIgnore([
            ['id_peran' => 1, 'role' => 'admin'],
            ['id_peran' => 2, 'role' => 'kalab'],
            ['id_peran' => 3, 'role' => 'plp'],
            ['id_peran' => 4, 'role' => 'dosen'],
            ['id_peran' => 5, 'role' => 'mahasiswa'],
            ['id_peran' => 6, 'role' => 'eksternal'],
        ]);

        if (! Schema::hasTable('pengguna')) {
            Schema::create('pengguna', function (Blueprint $table): void {
                $table->id('id_pengguna');
                $table->string('foto_profil')->nullable();
                $table->string('foto_identitas')->nullable();
                $table->string('email')->unique();
                $table->string('no_telepon', 20)->nullable();
            });
        }

        if (! Schema::hasTable('akun')) {
            Schema::create('akun', function (Blueprint $table): void {
                $table->id('id_akun');
                $table->foreignId('id_pengguna')->unique()->constrained('pengguna', 'id_pengguna');
                $table->foreignId('id_peran')->constrained('peran', 'id_peran');
                $table->foreignId('id_kredensial')->constrained('kredensial', 'id_kredensial');
                $table->string('status', 10)->default('active');
                $table->timestampTz('created_at')->nullable()->useCurrent();
                $table->timestampTz('updated_at')->nullable();
                $table->timestampTz('suspended_at')->nullable();
                $table->text('alasan_suspended')->nullable();
                $table->string('kategori_eksternal', 20)->nullable();
                $table->timestampTz('status_changed_at')->nullable();
                $table->bigInteger('status_changed_by')->nullable();
                // Kolom email_verified_at ditambahkan belakangan oleh migrasi
                // 2026_09_18_020819, jadi tidak termasuk di sini.
            });
        }
    }

    /**
     * Tabel subtipe pengguna sesuai peran (BR-6: satu pengguna satu peran).
     */
    private function tabelSubtipePengguna(): void
    {
        if (! Schema::hasTable('dosen')) {
            Schema::create('dosen', function (Blueprint $table): void {
                $table->id('id_dosen');
                $table->foreignId('id_pengguna')->constrained('pengguna', 'id_pengguna');
                $table->foreignId('id_prodi')->nullable()->constrained('prodi', 'id_prodi');
                $table->foreignId('id_fakultas')->nullable()->constrained('fakultas', 'id_fakultas');
                $table->string('nama_dosen');
                $table->string('nip_nidn', 50)->unique();
            });
        }

        if (! Schema::hasTable('mahasiswa')) {
            Schema::create('mahasiswa', function (Blueprint $table): void {
                $table->id('id_mahasiswa');
                $table->foreignId('id_pengguna')->constrained('pengguna', 'id_pengguna');
                $table->foreignId('id_prodi')->nullable()->constrained('prodi', 'id_prodi');
                $table->foreignId('id_fakultas')->nullable()->constrained('fakultas', 'id_fakultas');
                $table->string('nama_mahasiswa');
                $table->string('nim', 30)->unique();
            });
        }

        if (! Schema::hasTable('eksternal')) {
            Schema::create('eksternal', function (Blueprint $table): void {
                $table->id('id_eksternal');
                $table->foreignId('id_pengguna')->constrained('pengguna', 'id_pengguna');
                $table->string('nama_eksternal');
                $table->string('nik', 100)->unique();
                $table->foreignId('id_instansi')->nullable()->constrained('instansi', 'id_instansi');
                $table->string('alamat_lengkap')->nullable();
                $table->foreignId('id_kelurahandesa')->nullable()->constrained('villages', 'id');
                $table->foreignId('id_kecamatan')->nullable()->constrained('districts', 'id');
                $table->foreignId('id_kabupaten')->nullable()->constrained('regencies', 'id');
                $table->foreignId('id_provinsi')->nullable()->constrained('provinces', 'id');
            });
        }
    }

    /**
     * Inventaris laboratorium: master barang beserta tabel turunannya.
     */
    private function tabelInventaris(): void
    {
        if (! Schema::hasTable('barang')) {
            Schema::create('barang', function (Blueprint $table): void {
                $table->id('id_barang');
                $table->string('nama_barang');
                $table->string('foto_barang')->nullable();
                $table->text('deskripsi_barang')->nullable();
                $table->string('jenis', 10);
                $table->timestampsTz();
            });
        }

        if (! Schema::hasTable('alat')) {
            Schema::create('alat', function (Blueprint $table): void {
                $table->id('id_alat');
                $table->foreignId('id_barang')->constrained('barang', 'id_barang');
                // Kolom tarif_eksternal_internal_unej ditambahkan belakangan
                // oleh migrasi 141015, jadi tidak termasuk di sini.
                $table->decimal('tarif_eksternal_luar_unej', 12, 2)->nullable()->default('0.00');
                $table->timestampsTz();
            });
        }

        if (! Schema::hasTable('ruangan')) {
            Schema::create('ruangan', function (Blueprint $table): void {
                $table->id('id_ruangan');
                $table->foreignId('id_barang')->constrained('barang', 'id_barang');
                $table->integer('kapasitas')->nullable();
                $table->decimal('tarif_eksternal', 12, 2)->nullable()->default('0.00');
                $table->boolean('is_aktif')->nullable()->default(true);
                $table->timestampsTz();
            });
        }

        if (! Schema::hasTable('detail_alat')) {
            Schema::create('detail_alat', function (Blueprint $table): void {
                $table->id('id_detail_alat');
                $table->string('no_seri_unit', 100)->nullable();
                $table->foreignId('id_alat')->constrained('alat', 'id_alat');
                $table->foreignId('id_ruangan')->nullable()->constrained('ruangan', 'id_ruangan');
                $table->string('kondisi', 30);
                $table->string('status', 30);
                $table->string('tahun_pengadaan', 4)->nullable();
                $table->string('sumber_dana', 50)->nullable();
                $table->decimal('harga_beli', 12, 2)->nullable();
                $table->text('catatan')->nullable();
                $table->timestampsTz();
            });
        }

        if (! Schema::hasTable('bahan')) {
            Schema::create('bahan', function (Blueprint $table): void {
                $table->id('id_bahan');
                $table->foreignId('id_barang')->constrained('barang', 'id_barang');
                $table->foreignId('id_ruangan')->nullable()->constrained('ruangan', 'id_ruangan');
                $table->integer('jumlah_awal')->nullable()->default(0);
                $table->integer('jumlah_saat_ini')->nullable()->default(0);
                $table->string('satuan', 50)->nullable();
                $table->date('tanggal_kadaluarsa')->nullable();
                $table->string('status', 30);
                $table->text('catatan')->nullable();
                $table->timestampsTz();
            });
        }

        if (! Schema::hasTable('mebeler')) {
            Schema::create('mebeler', function (Blueprint $table): void {
                $table->id('id_mebeler');
                $table->foreignId('id_barang')->constrained('barang', 'id_barang');
                $table->foreignId('id_ruangan')->nullable()->constrained('ruangan', 'id_ruangan');
                $table->string('no_seri_unit_mebeler', 100)->nullable();
                $table->string('kondisi', 30);
                $table->string('tahun_pengadaan', 4)->nullable();
                $table->string('sumber_dana', 50)->nullable();
                $table->decimal('harga_beli', 12, 2)->nullable();
                $table->text('catatan')->nullable();
                $table->timestampsTz();
            });
        }
    }
};
