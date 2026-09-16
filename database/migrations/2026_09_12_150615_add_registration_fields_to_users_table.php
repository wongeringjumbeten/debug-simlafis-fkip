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
        Schema::table('users', function (Blueprint $table) {
            $table->string('instansi')->nullable()->after('email');
            $table->enum('kategori', ['internal_unej', 'luar_unej'])->nullable()->after('instansi');
            $table->string('no_hp', 20)->nullable()->after('kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['instansi', 'kategori', 'no_hp']);
        });
    }
};
