<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        Schema::table('akun', function (Blueprint $table): void {
            $table->string('remember_token', 100)->nullable()->after('alasan_suspended');
        });

        Schema::table('pengguna', function (Blueprint $table): void {
            $table->string('nama_lengkap')->nullable()->after('id_pengguna');
        });

        // Existing data is incomplete for admin/KaLab/PLP. A stable email-derived
        // fallback prevents a null principal name until Phase 3 profile enrichment.
        DB::statement(<<<'SQL'
            UPDATE pengguna p
            SET nama_lengkap = COALESCE(
                p.nama_lengkap,
                d.nama_dosen,
                m.nama_mahasiswa,
                e.nama_eksternal,
                split_part(p.email, '@', 1)
            )
            FROM akun a
            LEFT JOIN dosen d ON d.id_pengguna = a.id_pengguna
            LEFT JOIN mahasiswa m ON m.id_pengguna = a.id_pengguna
            LEFT JOIN eksternal e ON e.id_pengguna = a.id_pengguna
            WHERE a.id_pengguna = p.id_pengguna
        SQL);

        // Tabel berikut juga dibuat oleh migrasi standar Laravel
        // (0001_01_01_000001_create_cache_table, 0001_01_01_000000_create_users_table).
        // Dijaga agar migrasi ini tetap dapat dijalankan pada database bersih
        // tanpa peduli urutan mana yang lebih dulu berjalan.
        if (! Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table): void {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();
            });
        }

        if (! Schema::hasTable('cache')) {
            Schema::create('cache', function (Blueprint $table): void {
                $table->string('key')->primary();
                $table->mediumText('value');
                $table->integer('expiration');
            });
        }

        if (! Schema::hasTable('cache_locks')) {
            Schema::create('cache_locks', function (Blueprint $table): void {
                $table->string('key')->primary();
                $table->string('owner');
                $table->integer('expiration');
            });
        }

        $this->refreshAuthView();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('sessions');
        Schema::table('pengguna', function (Blueprint $table): void {
            $table->dropColumn('nama_lengkap');
        });
        Schema::table('akun', function (Blueprint $table): void {
            $table->dropColumn('remember_token');
        });

        DB::statement('DROP VIEW IF EXISTS v_auth_users');
    }

    private function refreshAuthView(): void
    {
        DB::statement('DROP VIEW IF EXISTS v_auth_users');
        DB::statement(<<<'SQL'
            CREATE VIEW v_auth_users AS
            SELECT
                a.id_akun AS id,
                p.nama_lengkap AS name,
                p.email,
                k.password,
                CASE r.role
                    WHEN 'mahasiswa' THEN 'mhs'
                    WHEN 'eksternal' THEN 'ekst'
                    ELSE r.role
                END AS role,
                a.kategori_eksternal AS kategori,
                a.status,
                p.no_telepon AS no_hp,
                p.foto_profil AS avatar,
                p.foto_identitas,
                i.nama_instansi AS instansi,
                a.created_at,
                a.updated_at,
                a.remember_token,
                a.suspended_at,
                a.alasan_suspended AS suspension_reason,
                a.status_changed_at,
                a.status_changed_by
            FROM akun a
            INNER JOIN pengguna p ON p.id_pengguna = a.id_pengguna
            INNER JOIN kredensial k ON k.id_kredensial = a.id_kredensial
            INNER JOIN peran r ON r.id_peran = a.id_peran
            LEFT JOIN eksternal e ON e.id_pengguna = p.id_pengguna
            LEFT JOIN instansi i ON i.id_instansi = e.id_instansi
        SQL);
    }
};
