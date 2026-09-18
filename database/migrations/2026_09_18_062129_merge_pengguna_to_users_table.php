<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
        public function up()
    {
        // 1. Tambahkan kolom yang kurang ke tabel users
        Schema::table('users', function (Blueprint $table) {
            $table->string('foto_profil')->nullable();
            $table->string('foto_identitas')->nullable();
            $table->string('no_identitas')->nullable(); // NIM/NIP/KTP
        });

        // 2. Sesuaikan Foreign Key di Dosen dan Mahasiswa
        // Ubah id_pengguna menjadi user_id agar sesuai standar Eloquent Laravel
        Schema::table('dosen', function (Blueprint $table) {
            $table->renameColumn('id_pengguna', 'user_id');
        });

        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->renameColumn('id_pengguna', 'user_id');
        });

        // 3. Hapus tabel redundan
        Schema::dropIfExists('akun');
        Schema::dropIfExists('pengguna');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
