<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Buat pengguna lengkap beserta rantai tabel 3NF-nya.
 *
 * `User::factory()->create()` TIDAK bisa dipakai untuk skenario ini: model `User`
 * memetakan ke view `v_auth_users`, dan `User::save()` sengaja mengembalikan
 * `false` untuk record baru (insert ditangani service, bukan model). Akibatnya
 * factory tidak membuat baris apa pun dan `getAuthIdentifier()` bernilai null.
 *
 * Helper ini membuat baris nyata pada `pengguna`, `kredensial`, dan `akun`,
 * lalu mengembalikan model yang terbaca dari view sehingga siap dipakai
 * `actingAs()` maupun service profil.
 *
 * @param  array<string, mixed>  $atribut
 */
function buatPenggunaLengkap(array $atribut = []): User
{
    // Model memakai singkatan (mhs/ekst); tabel `peran` memakai nama penuh.
    $role = $atribut['role'] ?? 'admin';
    $rolePenuh = match ($role) {
        'mhs' => 'mahasiswa',
        'ekst' => 'eksternal',
        default => $role,
    };

    $idPeran = DB::table('peran')->where('role', $rolePenuh)->value('id_peran');

    if ($idPeran === null) {
        throw new RuntimeException("Peran '{$rolePenuh}' tidak ditemukan pada tabel peran.");
    }

    $idPengguna = DB::table('pengguna')->insertGetId([
        'email' => $atribut['email'] ?? fake()->unique()->safeEmail(),
        'nama_lengkap' => $atribut['name'] ?? fake()->name(),
        'no_telepon' => $atribut['no_hp'] ?? null,
        'foto_profil' => $atribut['foto_profil'] ?? null,
        'foto_identitas' => $atribut['foto_identitas'] ?? null,
    ], 'id_pengguna');

    $idKredensial = DB::table('kredensial')->insertGetId([
        'password' => Hash::make($atribut['password'] ?? 'password'),
    ], 'id_kredensial');

    $idAkun = DB::table('akun')->insertGetId([
        'id_pengguna' => $idPengguna,
        'id_peran' => $idPeran,
        'id_kredensial' => $idKredensial,
        'status' => $atribut['status'] ?? 'active',
        'kategori_eksternal' => $atribut['kategori'] ?? null,
        'email_verified_at' => $atribut['email_verified_at'] ?? now(),
    ], 'id_akun');

    // Subtipe opsional, dibutuhkan sebagian halaman (mis. identitas profil).
    if ($role === 'dosen') {
        DB::table('dosen')->insert([
            'id_pengguna' => $idPengguna,
            'nama_dosen' => $atribut['name'] ?? 'Dosen Uji',
            'nip_nidn' => $atribut['nip_nidn'] ?? (string) fake()->unique()->numerify('################'),
        ]);
    }

    if ($role === 'mhs') {
        DB::table('mahasiswa')->insert([
            'id_pengguna' => $idPengguna,
            'nama_mahasiswa' => $atribut['name'] ?? 'Mahasiswa Uji',
            'nim' => $atribut['nim'] ?? (string) fake()->unique()->numerify('##########'),
        ]);
    }

    if ($role === 'ekst') {
        DB::table('eksternal')->insert([
            'id_pengguna' => $idPengguna,
            'nama_eksternal' => $atribut['name'] ?? 'Eksternal Uji',
            'nik' => $atribut['nik'] ?? (string) fake()->unique()->numerify('################'),
        ]);
    }

    return User::whereKey($idAkun)->firstOrFail();
}

/**
 * Ambil `id_pengguna` dari model User.
 *
 * Penting: `$user->id` adalah `id_akun` (kolom `id` pada view `v_auth_users`),
 * BUKAN `id_pengguna`. Keduanya berasal dari sequence berbeda dan tidak boleh
 * dipertukarkan saat menulis assertion ke tabel `pengguna`.
 */
function idPengguna(User $user): int
{
    return (int) DB::table('akun')
        ->where('id_akun', $user->getAuthIdentifier())
        ->value('id_pengguna');
}
