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
            $table->timestamp('email_verified_at')->nullable()->after('remember_token');
        });

        // Akun yang sudah ada dianggap terverifikasi agar tidak terkunci
        // oleh middleware verified / pembatasan login.
        DB::table('akun')->whereNull('email_verified_at')->update(['email_verified_at' => now()]);

        $this->refreshAuthView();

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trg_v_auth_users_update_func()
            RETURNS TRIGGER AS $$
            BEGIN
                -- 1. Perubahan data akun (remember_token, status, suspension, verifikasi email, dsb)
                IF NEW.remember_token IS DISTINCT FROM OLD.remember_token
                   OR NEW.status IS DISTINCT FROM OLD.status
                   OR NEW.suspension_reason IS DISTINCT FROM OLD.suspension_reason
                   OR NEW.suspended_at IS DISTINCT FROM OLD.suspended_at
                   OR NEW.status_changed_at IS DISTINCT FROM OLD.status_changed_at
                   OR NEW.status_changed_by IS DISTINCT FROM OLD.status_changed_by
                   OR NEW.kategori IS DISTINCT FROM OLD.kategori
                   OR NEW.email_verified_at IS DISTINCT FROM OLD.email_verified_at THEN
                    UPDATE akun
                    SET
                        remember_token = NEW.remember_token,
                        status = NEW.status,
                        alasan_suspended = NEW.suspension_reason,
                        suspended_at = NEW.suspended_at,
                        status_changed_at = NEW.status_changed_at,
                        status_changed_by = NEW.status_changed_by,
                        kategori_eksternal = NEW.kategori,
                        email_verified_at = NEW.email_verified_at,
                        updated_at = NOW()
                    WHERE id_akun = OLD.id;
                END IF;

                -- 2. Perubahan kredensial / password
                IF NEW.password IS DISTINCT FROM OLD.password THEN
                    UPDATE kredensial
                    SET password = NEW.password
                    WHERE id_kredensial = (SELECT id_kredensial FROM akun WHERE id_akun = OLD.id);
                END IF;

                -- 3. Perubahan profil pengguna
                IF NEW.name IS DISTINCT FROM OLD.name
                   OR NEW.email IS DISTINCT FROM OLD.email
                   OR NEW.no_hp IS DISTINCT FROM OLD.no_hp
                   OR NEW.avatar IS DISTINCT FROM OLD.avatar
                   OR NEW.foto_identitas IS DISTINCT FROM OLD.foto_identitas THEN
                    UPDATE pengguna
                    SET
                        nama_lengkap = NEW.name,
                        email = NEW.email,
                        no_telepon = NEW.no_hp,
                        foto_profil = NEW.avatar,
                        foto_identitas = NEW.foto_identitas
                    WHERE id_pengguna = (SELECT id_pengguna FROM akun WHERE id_akun = OLD.id);
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            DROP TRIGGER IF EXISTS trg_v_auth_users_update ON v_auth_users;

            CREATE TRIGGER trg_v_auth_users_update
            INSTEAD OF UPDATE ON v_auth_users
            FOR EACH ROW
            EXECUTE FUNCTION trg_v_auth_users_update_func();
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        $this->refreshAuthView();

        Schema::table('akun', function (Blueprint $table): void {
            $table->dropColumn('email_verified_at');
        });
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
                a.email_verified_at,
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
