<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

describe('pada driver non-PostgreSQL', function () {
    beforeEach(function () {
        if (DB::getDriverName() === 'pgsql') {
            $this->markTestSkipped('Hanya relevan pada driver non-pgsql.');
        }
    });

    test('registration is restricted to PostgreSQL deployments', function () {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    });
});

describe('pada PostgreSQL', function () {
    beforeEach(function () {
        if (DB::getDriverName() !== 'pgsql') {
            $this->markTestSkipped('Membutuhkan database PostgreSQL test (simlafis_testing).');
        }
    });

    function payloadMahasiswa(array $overrides = []): array
    {
        $fakultas = DB::table('fakultas')->orderBy('id_fakultas')->first();

        return array_merge([
            'kategori_pengguna' => 'mahasiswa',
            'name' => 'Mahasiswa Baru',
            'no_hp' => '081234567890',
            'email' => 'mhsbaru@example.com',
            'nim' => '241910301065',
            'id_fakultas' => $fakultas?->id_fakultas,
            'prodi' => 'Pendidikan Fisika',
            'foto_identitas' => UploadedFile::fake()->image('ktm.png'),
            'password' => 'password',
            'password_confirmation' => 'password',
        ], $overrides);
    }

    test('registrasi tanpa foto profil tetap berhasil dan mengirim email verifikasi', function () {
        Notification::fake();

        $response = $this->post(route('register.store'), payloadMahasiswa([
            'foto_profil' => null,
        ]));

        $response->assertRedirect(route('verification.notice', absolute: false));

        $user = User::query()->where('email', 'mhsbaru@example.com')->firstOrFail();
        expect($user->hasVerifiedEmail())->toBeFalse();

        Notification::assertSentTo($user, VerifyEmail::class);

        $pengguna = DB::table('pengguna')->where('email', 'mhsbaru@example.com')->first();
        expect($pengguna->foto_profil)->toBeNull();
        expect($pengguna->foto_identitas)->not->toBeNull();
    });

    test('registrasi dengan foto profil opsional tetap menyimpan berkas', function () {
        Notification::fake();

        $this->post(route('register.store'), payloadMahasiswa([
            'email' => 'mhsprofil@example.com',
            'foto_profil' => UploadedFile::fake()->image('profil.png'),
        ]));

        $pengguna = DB::table('pengguna')->where('email', 'mhsprofil@example.com')->first();
        expect($pengguna->foto_profil)->not->toBeNull();
    });

    test('registrasi menolak pendaftar tanpa foto identitas', function () {
        Notification::fake();

        $response = $this->post(route('register.store'), payloadMahasiswa([
            'foto_identitas' => null,
        ]));

        $response->assertSessionHasErrors('foto_identitas');
        expect(User::query()->where('email', 'mhsbaru@example.com')->exists())->toBeFalse();
        Notification::assertNothingSent();
    });
});
