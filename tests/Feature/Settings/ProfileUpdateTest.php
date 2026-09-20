<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

test('profile page is displayed', function () {
    $user = buatPenggunaLengkap();

    $this->actingAs($user)
        ->get(route('profile.edit'))
        ->assertOk();
});

test('profile information can be updated', function () {
    $user = buatPenggunaLengkap(['email' => 'awal@unej.ac.id']);

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $tersimpan = DB::table('pengguna')->where('id_pengguna', idPengguna($user))->first();

    expect($tersimpan->nama_lengkap)->toBe('Test User');
    expect($tersimpan->email)->toBe('test@example.com');

    // Email baru harus diverifikasi ulang.
    expect(DB::table('akun')->where('id_akun', $user->getAuthIdentifier())->value('email_verified_at'))->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = buatPenggunaLengkap(['email' => 'tetap@unej.ac.id']);

    $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'tetap@unej.ac.id',
        ])
        ->assertSessionHasNoErrors();

    expect(DB::table('akun')->where('id_akun', $user->getAuthIdentifier())->value('email_verified_at'))->not->toBeNull();
});

test('foto profil dapat diunggah dan menggantikan berkas lama', function () {
    Storage::fake('public');

    $user = buatPenggunaLengkap(['email' => 'foto@unej.ac.id']);

    // Berkas lama yang seharusnya dibersihkan setelah penggantian.
    $lama = UploadedFile::fake()->image('lama.jpg', 200, 200);
    $pathLama = $lama->store('profiles', 'public');

    DB::table('pengguna')
        ->where('id_pengguna', idPengguna($user))
        ->update(['foto_profil' => $pathLama]);

    Storage::disk('public')->assertExists($pathLama);

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'foto_profil' => UploadedFile::fake()->image('baru.jpg', 400, 400),
        ]);

    $response->assertSessionHasNoErrors();

    $pathBaru = DB::table('pengguna')
        ->where('id_pengguna', idPengguna($user))
        ->value('foto_profil');

    expect($pathBaru)->toBeString();
    expect($pathBaru)->toStartWith('profiles/');
    expect($pathBaru)->not->toBe($pathLama);

    Storage::disk('public')->assertExists($pathBaru);
    Storage::disk('public')->assertMissing($pathLama);
});

test('unggahan foto profil menolak berkas yang bukan gambar', function () {
    Storage::fake('public');

    $user = buatPenggunaLengkap(['email' => 'dokumen@unej.ac.id']);

    $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'foto_profil' => UploadedFile::fake()->create('laporan.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors('foto_profil');
});

test('unggahan foto profil menolak berkas melebihi 2 MB', function () {
    Storage::fake('public');

    $user = buatPenggunaLengkap(['email' => 'besar@unej.ac.id']);

    $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'foto_profil' => UploadedFile::fake()->image('besar.jpg')->size(3000),
        ])
        ->assertSessionHasErrors('foto_profil');
});

test('penghapusan akun mandiri ditolak pada PostgreSQL', function () {
    $user = buatPenggunaLengkap(['email' => 'hapus@unej.ac.id']);

    $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertForbidden();

    // Akun tetap ada; pengelolaan akun adalah wewenang Admin (BR-1).
    expect(DB::table('pengguna')->where('email', 'hapus@unej.ac.id')->exists())->toBeTrue();
});

test('external user can update institution and phone number', function () {
    $user = buatPenggunaLengkap([
        'role' => 'ekst',
        'email' => 'eksternal@contoh.com',
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

    $pengguna = DB::table('pengguna')->where('id_pengguna', idPengguna($user))->first();
    expect($pengguna->no_telepon)->toBe('081234567890');

    $instansi = DB::table('eksternal as e')
        ->leftJoin('instansi as i', 'i.id_instansi', '=', 'e.id_instansi')
        ->where('e.id_pengguna', idPengguna($user))
        ->value('i.nama_instansi');

    expect($instansi)->toBe('Instansi Baru');
});

test('external user cannot change tariff category or role via profile update', function () {
    $user = buatPenggunaLengkap([
        'role' => 'ekst',
        'email' => 'tarif@contoh.com',
        'kategori' => 'internal_unej',
    ]);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'instansi' => 'Instansi Tetap',
            'kategori' => 'luar_unej', // diabaikan: tidak divalidasi di profil
            'role' => 'admin',         // diabaikan: tidak pernah diterima di sini
        ])
        ->assertSessionHasNoErrors();

    expect(DB::table('akun')->where('id_akun', $user->getAuthIdentifier())->value('kategori_eksternal'))
        ->toBe('internal_unej');

    expect(DB::table('akun as a')
        ->join('peran as r', 'r.id_peran', '=', 'a.id_peran')
        ->where('a.id_akun', $user->getAuthIdentifier())
        ->value('r.role'))->toBe('eksternal');
});

test('external profile update rejects an invalid phone number', function () {
    $user = buatPenggunaLengkap([
        'role' => 'ekst',
        'email' => 'hp@contoh.com',
        'kategori' => 'internal_unej',
    ]);

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
    $user = buatPenggunaLengkap(['role' => 'mhs', 'email' => 'mhs@unej.ac.id']);

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Nama Baru',
            'email' => $user->email,
            'instansi' => 'Coba Diisi',
            'no_hp' => '081234567890',
        ])
        ->assertSessionHasNoErrors();

    $pengguna = DB::table('pengguna')->where('id_pengguna', idPengguna($user))->first();

    expect($pengguna->nama_lengkap)->toBe('Nama Baru');
    expect($pengguna->no_telepon)->toBeNull();
});
