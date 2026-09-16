<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from the catalog', function () {
    $this->get(route('katalog'))->assertRedirect(route('login'));
});

test('catalog receives the authenticated user role', function () {
    foreach (['admin', 'kalab', 'plp', 'dosen', 'mhs'] as $role) {
        $this->actingAs(User::factory()->create(['role' => $role]))
            ->get(route('katalog'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('katalog/index')
                ->where('role', $role)
                ->where('subKategori', null),
            );
    }
});

test('external catalog receives the user tariff category', function () {
    $user = User::factory()->create([
        'role' => 'ekst',
        'kategori' => 'luar_unej',
    ]);

    $this->actingAs($user)
        ->get(route('katalog'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('katalog/index')
            ->where('role', 'ekst')
            ->where('subKategori', 'luar_unej'),
        );
});
