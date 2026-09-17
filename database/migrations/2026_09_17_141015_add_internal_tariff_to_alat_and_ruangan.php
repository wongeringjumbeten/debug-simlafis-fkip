<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Sprint 1 membutuhkan dua tarif sewa (Internal UNEJ dan Luar UNEJ) untuk
     * alat dan ruangan. Kolom luar-UNEJ sudah ada; migration ini menambah
     * kolom internal-UNEJ. Hanya PostgreSQL (DB shared backend).
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        Schema::table('alat', function (Blueprint $table): void {
            $table->decimal('tarif_eksternal_internal_unej', 12, 2)->nullable()->default('0.00');
        });

        Schema::table('ruangan', function (Blueprint $table): void {
            $table->decimal('tarif_eksternal_internal_unej', 12, 2)->nullable()->default('0.00');
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

        Schema::table('ruangan', function (Blueprint $table): void {
            $table->dropColumn('tarif_eksternal_internal_unej');
        });

        Schema::table('alat', function (Blueprint $table): void {
            $table->dropColumn('tarif_eksternal_internal_unej');
        });
    }
};
