<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed one account per role for manual testing. Every account shares the
     * same password so switching roles while testing the UI is quick.
     */
    public function run(): void
    {
        $password = 'a123b456';

        $accounts = [
            ['role' => 'admin', 'name' => 'Admin SIMLAFIS', 'email' => 'admin@simlafis.test'],
            ['role' => 'kalab', 'name' => 'Kepala Laboratorium', 'email' => 'kalab@simlafis.test'],
            ['role' => 'plp', 'name' => 'Pranata Laboratorium', 'email' => 'plp@simlafis.test'],
            ['role' => 'dosen', 'name' => 'Dosen Pengampu', 'email' => 'dosen@simlafis.test'],
            ['role' => 'mhs', 'name' => 'Mahasiswa', 'email' => 'mhs@simlafis.test'],
        ];

        foreach ($accounts as $account) {
            User::factory()->create([
                'name' => $account['name'],
                'email' => $account['email'],
                'role' => $account['role'],
                'password' => $password,
            ]);
        }

        // Eksternal: carries institution + tariff category so the profile page
        // has data to display (BR-1: only external self-registers).
        User::factory()->create([
            'name' => 'Pengguna Eksternal',
            'email' => 'ekst@simlafis.test',
            'role' => 'ekst',
            'password' => $password,
            'instansi' => 'SMAN 1 Jember',
            'kategori' => 'internal_unej',
            'no_hp' => '081234567890',
        ]);
    }
}
