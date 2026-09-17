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

        DB::unprepared(<<<'SQL'
            CREATE OR REPLACE FUNCTION trg_v_auth_users_update_func()
            RETURNS TRIGGER AS $$
            BEGIN
                -- 1. Perubahan data akun (remember_token, status, suspension, dsb)
                IF NEW.remember_token IS DISTINCT FROM OLD.remember_token
                   OR NEW.status IS DISTINCT FROM OLD.status
                   OR NEW.suspension_reason IS DISTINCT FROM OLD.suspension_reason
                   OR NEW.suspended_at IS DISTINCT FROM OLD.suspended_at
                   OR NEW.status_changed_at IS DISTINCT FROM OLD.status_changed_at
                   OR NEW.status_changed_by IS DISTINCT FROM OLD.status_changed_by
                   OR NEW.kategori IS DISTINCT FROM OLD.kategori THEN
                    UPDATE akun
                    SET
                        remember_token = NEW.remember_token,
                        status = NEW.status,
                        alasan_suspended = NEW.suspension_reason,
                        suspended_at = NEW.suspended_at,
                        status_changed_at = NEW.status_changed_at,
                        status_changed_by = NEW.status_changed_by,
                        kategori_eksternal = NEW.kategori,
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

        DB::unprepared(<<<'SQL'
            DROP TRIGGER IF EXISTS trg_v_auth_users_update ON v_auth_users;
            DROP FUNCTION IF EXISTS trg_v_auth_users_update_func();
        SQL);
    }
};
