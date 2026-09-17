<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('pengajuan_peminjaman')) {
            Schema::create('pengajuan_peminjaman', function (Blueprint $table): void {
                $table->id('id_pengajuan_peminjaman');
                $table->unsignedBigInteger('id_pengguna');
                $table->string('jenis_peminjaman', 30); // 'internal', 'eksternal'
                $table->decimal('total_biaya', 12, 2)->default(0.00);
                $table->string('metode_pembayaran', 30)->nullable(); // 'transfer', 'cash'
                $table->string('bukti_pembayaran')->nullable();
                $table->string('status_keseluruhan', 30)->default('menunggu'); // 'menunggu', 'disetujui', 'ditolak', 'dipinjam', 'dikembalikan', 'dibatalkan'
                $table->text('catatan_penolakan')->nullable();
                $table->date('tanggal_peminjaman');
                $table->timestamps();

                $table->index('id_pengguna');
                $table->index('status_keseluruhan');
            });
        }

        if (! Schema::hasTable('detail_pengajuan_peminjaman_alat')) {
            Schema::create('detail_pengajuan_peminjaman_alat', function (Blueprint $table): void {
                $table->id('id_detail_pengajuan_peminjaman_alat');
                $table->unsignedBigInteger('id_pengajuan_peminjaman');
                $table->unsignedBigInteger('id_alat');
                $table->dateTime('waktu_mulai');
                $table->dateTime('waktu_selesai');
                $table->integer('jumlah_item')->default(1);
                $table->decimal('harga_per_item', 12, 2)->default(0.00);
                $table->decimal('total_biaya_per_item', 12, 2)->default(0.00);
                $table->string('status_item', 30)->default('menunggu'); // 'menunggu', 'disetujui', 'ditolak', 'dikembalikan'
                $table->text('alasan_penolakan')->nullable();
                $table->timestamps();

                $table->index('id_pengajuan_peminjaman');
                $table->index('id_alat');
                $table->index('status_item');
            });
        }

        if (! Schema::hasTable('detail_pengajuan_peminjaman_ruangan')) {
            Schema::create('detail_pengajuan_peminjaman_ruangan', function (Blueprint $table): void {
                $table->id('id_detail_pengajuan_peminjaman_ruangan');
                $table->unsignedBigInteger('id_pengajuan_peminjaman');
                $table->unsignedBigInteger('id_ruangan');
                $table->dateTime('waktu_mulai');
                $table->dateTime('waktu_selesai');
                $table->decimal('harga_per_item', 12, 2)->default(0.00);
                $table->decimal('total_biaya_per_item', 12, 2)->default(0.00);
                $table->string('status_item', 30)->default('menunggu'); // 'menunggu', 'disetujui', 'ditolak', 'selesai'
                $table->text('alasan_penolakan')->nullable();
                $table->timestamps();

                $table->index('id_pengajuan_peminjaman');
                $table->index('id_ruangan');
                $table->index('status_item');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_pengajuan_peminjaman_ruangan');
        Schema::dropIfExists('detail_pengajuan_peminjaman_alat');
        Schema::dropIfExists('pengajuan_peminjaman');
    }
};
