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

        DB::statement('ALTER TABLE akun ADD COLUMN IF NOT EXISTS kategori_eksternal varchar(20) NULL');
        DB::statement('ALTER TABLE akun ADD COLUMN IF NOT EXISTS status_changed_at timestamptz NULL');
        DB::statement('ALTER TABLE akun ADD COLUMN IF NOT EXISTS status_changed_by bigint NULL');
        DB::statement('ALTER TABLE akun DROP CONSTRAINT IF EXISTS akun_kategori_eksternal_check');
        DB::statement("ALTER TABLE akun ADD CONSTRAINT akun_kategori_eksternal_check CHECK (kategori_eksternal IS NULL OR kategori_eksternal IN ('internal_unej', 'luar_unej'))");
        DB::statement('CREATE INDEX IF NOT EXISTS idx_akun_kategori_eksternal ON akun (kategori_eksternal)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_akun_status_changed_by ON akun (status_changed_by)');
        DB::statement(<<<'SQL'
            CREATE TABLE IF NOT EXISTS riwayat_status_akun (
                id bigserial PRIMARY KEY,
                id_akun bigint NOT NULL REFERENCES akun(id_akun) ON DELETE CASCADE,
                status_lama varchar(10) NOT NULL,
                status_baru varchar(10) NOT NULL,
                alasan text NULL,
                changed_by bigint NULL REFERENCES akun(id_akun) ON DELETE SET NULL,
                created_at timestamptz NOT NULL DEFAULT now(),
                CONSTRAINT riwayat_status_akun_status_lama_check CHECK (status_lama IN ('active', 'suspended', 'blocked')),
                CONSTRAINT riwayat_status_akun_status_baru_check CHECK (status_baru IN ('active', 'suspended', 'blocked'))
            )
        SQL);

        DB::transaction(function (): void {
            // External Internal/Luar is a tariff category, not an authorization role.
            DB::table('akun')
                ->whereIn('id_peran', [6, 7])
                ->update([
                    'kategori_eksternal' => DB::raw("CASE id_peran WHEN 6 THEN 'internal_unej' ELSE 'luar_unej' END"),
                ]);

            DB::table('akun')
                ->whereIn('id_peran', [6, 7])
                ->update(['id_peran' => 6]);

            DB::table('peran')
                ->where('id_peran', 6)
                ->update(['role' => 'eksternal']);

            DB::table('peran')
                ->where('id_peran', 7)
                ->delete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::transaction(function (): void {
            DB::table('peran')->insert([
                'id_peran' => 7,
                'role' => 'eksternal_luar_unej',
            ]);

            DB::table('peran')
                ->where('id_peran', 6)
                ->update(['role' => 'eksternal_internal_unej']);

            DB::table('akun')
                ->where('kategori_eksternal', 'luar_unej')
                ->update(['id_peran' => 7]);

            DB::table('akun')
                ->where('kategori_eksternal', 'internal_unej')
                ->update(['id_peran' => 6]);
        });

        DB::statement('DROP TABLE IF EXISTS riwayat_status_akun');
        DB::statement('DROP INDEX IF EXISTS idx_akun_status_changed_by');
        DB::statement('DROP INDEX IF EXISTS idx_akun_kategori_eksternal');
        DB::statement('ALTER TABLE akun DROP CONSTRAINT IF EXISTS akun_kategori_eksternal_check');
        DB::statement('ALTER TABLE akun DROP COLUMN IF EXISTS status_changed_by');
        DB::statement('ALTER TABLE akun DROP COLUMN IF EXISTS status_changed_at');
        DB::statement('ALTER TABLE akun DROP COLUMN IF EXISTS kategori_eksternal');
    }
};
