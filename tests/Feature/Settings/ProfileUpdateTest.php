<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});

test('external user can update institution and phone number', function () {
    $user = User::factory()->create([
        'role' => 'ekst',
        'instansi' => 'Instansi Lama',
        'kategori' => 'internal_unej',
    ]);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'instansi' => 'Instansi Baru',
            'no_hp' => '081234567890',
        ])
        ->assertSessionHasNoErrors();

    $user->refresh();

    expect($user->instansi)->toBe('Instansi Baru');
    expect($user->no_hp)->toBe('081234567890');
});

test('external user cannot change tariff category or role via profile update', function () {
    $user = User::factory()->create([
        'role' => 'ekst',
        'instansi' => 'Instansi Awal',
        'kategori' => 'internal_unej',
    ]);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'instansi' => 'Instansi Awal',
            'kategori' => 'luar_unej', // ignored: not validated for profile
            'role' => 'admin', // ignored: never accepted here
        ])
        ->assertSessionHasNoErrors();

    $user->refresh();

    expect($user->kategori)->toBe('internal_unej');
    expect($user->role)->toBe('ekst');
});

test('external profile update rejects an invalid phone number', function () {
    $user = User::factory()->create(['role' => 'ekst', 'instansi' => 'Instansi']);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'instansi' => 'Instansi',
            'no_hp' => 'abc',
        ])
        ->assertSessionHasErrors('no_hp');
});

test('internal user profile update ignores external-only fields', function () {
    $user = User::factory()->create(['role' => 'mhs']);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Nama Baru',
            'email' => $user->email,
            'instansi' => 'Coba Diisi',
            'no_hp' => '081234567890',
        ])
        ->assertSessionHasNoErrors();

    $user->refresh();

    expect($user->name)->toBe('Nama Baru');
    expect($user->instansi)->toBeNull();
    expect($user->no_hp)->toBeNull();
});
