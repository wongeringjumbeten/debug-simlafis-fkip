<?php

use App\Models\User;

function adminUser(): User
{
    return User::factory()->create(['role' => 'admin']);
}

test('guests are redirected from the users module', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from the users module', function () {
    $this->actingAs(User::factory()->create(['role' => 'mhs']))
        ->get(route('users.index'))
        ->assertForbidden();
});

test('non-admin cannot create or change access status', function () {
    $actor = User::factory()->create(['role' => 'plp']);
    $target = User::factory()->create(['role' => 'mhs']);

    $this->actingAs($actor)->post(route('users.store'), [
        'name' => 'X', 'email' => 'x@simlafis.test', 'role' => 'dosen',
        'password' => 'password', 'password_confirmation' => 'password',
    ])->assertForbidden();

    $this->actingAs($actor)->patch(route('users.status', $target), [
        'active' => false, 'suspension_reason' => 'test',
    ])->assertForbidden();
});

test('admin can list users', function () {
    User::factory()->create(['email' => 'someone@simlafis.test']);

    $this->actingAs(adminUser())
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('users/index')
            ->has('users.data')
            ->has('roleOptions', 6),
        );
});

test('admin can create an internal account without external fields', function () {
    $this->actingAs(adminUser())
        ->post(route('users.store'), [
            'name' => 'Dosen Baru',
            'email' => 'dosen.baru@simlafis.test',
            'role' => 'dosen',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('users.index'));

    $user = User::where('email', 'dosen.baru@simlafis.test')->first();
    expect($user)->not->toBeNull()
        ->and($user->role)->toBe('dosen')
        ->and($user->instansi)->toBeNull()
        ->and($user->kategori)->toBeNull();
});

test('admin must supply institution and category for an external account', function () {
    $this->actingAs(adminUser())
        ->post(route('users.store'), [
            'name' => 'Eksternal Baru',
            'email' => 'ekst.baru@simlafis.test',
            'role' => 'ekst',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertSessionHasErrors(['instansi', 'kategori']);
});

test('admin can create an external account with valid fields', function () {
    $this->actingAs(adminUser())
        ->post(route('users.store'), [
            'name' => 'Eksternal Baru',
            'email' => 'ekst.ok@simlafis.test',
            'role' => 'ekst',
            'instansi' => 'PT Maju',
            'kategori' => 'luar_unej',
            'no_hp' => '081234567890',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertSessionHasNoErrors();

    $user = User::where('email', 'ekst.ok@simlafis.test')->first();
    expect($user->kategori)->toBe('luar_unej')
        ->and($user->instansi)->toBe('PT Maju');
});

test('store rejects an invalid role and bad phone number', function () {
    $this->actingAs(adminUser())
        ->post(route('users.store'), [
            'name' => 'Bad', 'email' => 'bad@simlafis.test', 'role' => 'superadmin',
            'no_hp' => '12345', 'password' => 'password', 'password_confirmation' => 'password',
        ])
        ->assertSessionHasErrors(['role', 'no_hp']);
});

test('admin can update a user and a blank password keeps the existing one', function () {
    $user = User::factory()->create(['role' => 'mhs']);
    $originalHash = $user->password;

    $this->actingAs(adminUser())
        ->patch(route('users.update', $user), [
            'name' => 'Nama Diperbarui',
            'email' => $user->email,
            'role' => 'dosen',
        ])
        ->assertSessionHasNoErrors();

    $user->refresh();
    expect($user->name)->toBe('Nama Diperbarui')
        ->and($user->role)->toBe('dosen')
        ->and($user->password)->toBe($originalHash);
});

test('admin cannot demote their own role', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->patch(route('users.update', $admin), [
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => 'mhs',
        ])
        ->assertSessionHasErrors('role');

    expect($admin->refresh()->role)->toBe('admin');
});

test('admin can suspend an account with a reason', function () {
    $user = User::factory()->create(['role' => 'mhs']);

    $this->actingAs(adminUser())
        ->patch(route('users.status', $user), [
            'active' => false,
            'suspension_reason' => 'Terlambat mengembalikan alat',
        ])
        ->assertSessionHasNoErrors();

    $user->refresh();
    expect($user->active)->toBeFalse()
        ->and($user->suspension_reason)->toBe('Terlambat mengembalikan alat');
});

test('suspending requires a reason', function () {
    $user = User::factory()->create(['role' => 'mhs']);

    $this->actingAs(adminUser())
        ->patch(route('users.status', $user), ['active' => false])
        ->assertSessionHasErrors('suspension_reason');
});

test('reactivating clears the suspension reason', function () {
    $user = User::factory()->create(['role' => 'mhs', 'active' => false, 'suspension_reason' => 'lama']);

    $this->actingAs(adminUser())
        ->patch(route('users.status', $user), ['active' => true])
        ->assertSessionHasNoErrors();

    $user->refresh();
    expect($user->active)->toBeTrue()
        ->and($user->suspension_reason)->toBeNull();
});

test('admin cannot suspend their own account', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->patch(route('users.status', $admin), ['active' => false, 'suspension_reason' => 'x'])
        ->assertSessionHasErrors('status');

    expect($admin->refresh()->active)->toBeTrue();
});
