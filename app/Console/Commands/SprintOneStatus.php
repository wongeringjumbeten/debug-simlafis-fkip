<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class SprintOneStatus extends Command
{
    protected $signature = 'app:sprint-one-status';

    protected $description = 'Laporan kesiapan Sprint 1 (read-only, tanpa mengubah data)';

    public function handle(): int
    {
        $driver = DB::getDriverName();
        $this->info("DB driver: {$driver}");

        if ($driver === 'pgsql') {
            $this->line('akun: '.DB::table('akun')->count());
            $this->line('barang: '.DB::table('barang')->count()
                .' (alat: '.DB::table('barang')->where('jenis', 'alat')->count()
                .', ruangan: '.DB::table('barang')->where('jenis', 'ruangan')->count()
                .', bahan: '.DB::table('barang')->where('jenis', 'bahan')->count()
                .', mebeler: '.DB::table('barang')->where('jenis', 'mebeler')->count().')');
            $this->line('detail_alat: '.DB::table('detail_alat')->count());

            $missing = DB::table('barang')
                ->whereNotNull('foto_barang')
                ->pluck('foto_barang')
                ->reject(fn ($p) => file_exists(public_path($p)))
                ->values()
                ->all();
            $this->line($missing === [] ? 'foto katalog: semua file ada' : 'foto hilang: '.implode(', ', $missing));
        } else {
            $this->line('mode sqlite: katalog memakai mock UI-first.');
        }

        foreach (['home', 'login', 'dashboard', 'katalog', 'users.index'] as $name) {
            $this->line("route {$name}: ".(Route::has($name) ? 'OK' : 'HILANG'));
        }

        return self::SUCCESS;
    }
}
