<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('seeder creates one verified account per role sharing the test password', function () {
    $this->seed();

    $roles = User::orderBy('id')->pluck('role')->all();

    expect($roles)->toBe(['admin', 'kalab', 'plp', 'dosen', 'mhs', 'ekst']);

    expect(User::all()->every(fn (User $user) => Hash::check('a123b456', $user->password)))
        ->toBeTrue();

    $external = User::where('role', 'ekst')->first();
    expect($external->email)->toBe('ekst@simlafis.test')
        ->and($external->instansi)->not->toBeNull()
        ->and($external->kategori)->toBe('internal_unej');
});

test('login page hides the demo role shortcuts outside the local environment', function () {
    // Tests run in the "testing" environment, so the quick-login list must be empty.
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('demoAccounts', []),
        );
});
