<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

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

        DB::statement(<<<'SQL'
            CREATE OR REPLACE VIEW v_auth_users AS
            SELECT
                a.id_akun AS id,
                p.email,
                k.password,
                r.role,
                a.kategori_eksternal,
                a.status,
                p.no_telepon AS no_hp,
                p.foto_profil AS avatar_path,
                a.created_at,
                a.updated_at,
                a.suspended_at,
                a.alasan_suspended AS suspension_reason,
                a.status_changed_at,
                a.status_changed_by
            FROM akun a
            INNER JOIN pengguna p ON p.id_pengguna = a.id_pengguna
            INNER JOIN kredensial k ON k.id_kredensial = a.id_kredensial
            INNER JOIN peran r ON r.id_peran = a.id_peran
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP VIEW IF EXISTS v_auth_users');
        }
    }
};
