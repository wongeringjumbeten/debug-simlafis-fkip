<?php

use App\Models\Alat;
use App\Models\Bahan;
use App\Models\Barang;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (DB::getDriverName() !== 'pgsql') {
        $this->markTestSkipped('Membutuhkan database PostgreSQL test (simlafis_testing).');
    }
});

test('v_auth_users mengekspos 13 akun dengan role ternormalisasi', function () {
    $roles = User::query()->orderBy('id')->pluck('role')->all();

    expect($roles)->toBe([
        'admin', 'kalab', 'plp', 'dosen', 'dosen',
        'mhs', 'mhs', 'mhs', 'mhs',
        'ekst', 'ekst', 'ekst', 'ekst',
    ]);
});

test('katalog membaca aset nyata dari PostgreSQL', function () {
    $this->actingAs(User::query()->where('role', 'admin')->firstOrFail())
        ->get(route('katalog'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('katalog/index')
            ->where('role', 'admin')
            ->has('asets', 11)
        );
});

test('dashboard lab memuat agregat inventaris nyata', function () {
    $this->actingAs(User::query()->where('role', 'admin')->firstOrFail())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('inventaris.totalAlat', 5)
            ->where('inventaris.totalRuangan', 1)
            ->where('inventaris.totalPengguna', 13),
        );
});

test('model eloquent inventaris membaca relasi nyata dari PostgreSQL', function () {
    $alatList = Alat::with(['barang', 'detailAlat'])->get();

    expect($alatList)->toHaveCount(5);

    $pertama = $alatList->first();
    expect($pertama->barang)->not->toBeNull()
        ->and($pertama->barang->jenis)->toBe(Barang::JENIS_ALAT)
        ->and($pertama->detailAlat)->not->toBeEmpty();

    $ruangan = Ruangan::with('barang')->first();
    expect($ruangan)->not->toBeNull()
        ->and($ruangan->barang)->not->toBeNull();

    $bahan = Bahan::with('barang')->get();
    expect($bahan)->toHaveCount(5);
});
