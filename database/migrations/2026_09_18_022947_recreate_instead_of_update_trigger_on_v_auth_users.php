<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Re-attach the INSTEAD OF UPDATE trigger on v_auth_users.
     *
     * Migration 2026_09_18_020819 updated the trigger *function* but did not
     * re-create the *trigger* itself after dropping and re-creating the view,
     * which left the view un-writeable and caused markEmailAsVerified() to be
     * a no-op.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::unprepared(<<<'SQL'
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

        DB::unprepared('DROP TRIGGER IF EXISTS trg_v_auth_users_update ON v_auth_users;');
    }
};
