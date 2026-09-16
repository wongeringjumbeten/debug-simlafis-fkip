<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register with basic fields', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('new users can register with external fields', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'External User',
        'email' => 'external@example.com',
        'instansi' => 'Universitas Jember',
        'kategori' => 'internal_unej',
        'no_hp' => '081234567890',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'external@example.com')->first();
    expect($user->instansi)->toBe('Universitas Jember');
    expect($user->kategori)->toBe('internal_unej');
    expect($user->no_hp)->toBe('081234567890');
});

test('new users can register with luar_unej category', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'External User Luar',
        'email' => 'luarunej@example.com',
        'instansi' => 'PT Teknologi Mandiri',
        'kategori' => 'luar_unej',
        'no_hp' => '089876543210',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'luarunej@example.com')->first();
    expect($user->kategori)->toBe('luar_unej');
});

test('registration requires name and email', function () {
    $response = $this->post(route('register.store'), [
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['name', 'email']);
});

test('registration requires valid email', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'invalid-email',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('registration requires matching passwords', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'different-password',
    ]);

    $response->assertSessionHasErrors(['password']);
});

test('registration fails when email already exists', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'existing@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('registration allows blank instansi and no_hp', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'noinstansi@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'noinstansi@example.com')->first();
    expect($user->instansi)->toBeNull();
    expect($user->no_hp)->toBeNull();
    expect($user->kategori)->toBeNull();
});

test('self registration always assigns the eksternal role', function () {
    // BR-1: only external users self-register; never grant admin via the form.
    $this->post(route('register.store'), [
        'name' => 'External User',
        'email' => 'rolereg@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    expect(User::where('email', 'rolereg@example.com')->first()->role)->toBe('ekst');
});

test('registration rejects an invalid phone number format', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'External User',
        'email' => 'badphone@example.com',
        'instansi' => 'Universitas Jember',
        'kategori' => 'internal_unej',
        'no_hp' => 'not-a-phone',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['no_hp']);
});

test('registration requires kategori when instansi is provided', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'External User',
        'email' => 'no_kategori@example.com',
        'instansi' => 'Universitas Jember',
        // kategori omitted
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['kategori']);
});

test('registration requires instansi when kategori is provided', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'External User',
        'email' => 'no_instansi@example.com',
        // instansi omitted
        'kategori' => 'internal_unej',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['instansi']);
});

test('registration invalid kategori value is rejected', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'External User',
        'email' => 'invalidkategori@example.com',
        'instansi' => 'Universitas Jember',
        'kategori' => 'invalid_category',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['kategori']);
});
