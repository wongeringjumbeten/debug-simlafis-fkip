<?php

namespace App\Services;

use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class RegistrationService
{
    use ProfileValidationRules;

    public const KATEGORI = ['mahasiswa', 'dosen', 'eksternal'];

    /**
     * Validate a Sprint 1 multi-category registration payload.
     *
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public function validate(array $input): array
    {
        $kategori = $input['kategori_pengguna'] ?? null;

        $rules = [
            'kategori_pengguna' => ['required', 'string', 'in:'.implode(',', self::KATEGORI)],
            'name' => ['required', 'string', 'max:255'],
            'no_hp' => ['required', 'string', 'max:20', 'regex:/^(\+62|62|0)8[1-9][0-9]{6,10}$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:pengguna,email'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            // Foto profil opsional (bisa dilengkapi nanti di pengaturan profil);
            // dokumen identitas tetap wajib untuk verifikasi pendaftar.
            'foto_profil' => ['nullable', 'image', 'mimes:jpg,png', 'max:2048'],
            'foto_identitas' => ['required', 'image', 'mimes:jpg,png', 'max:2048'],
        ];

        if ($kategori === 'mahasiswa') {
            $rules += [
                'nim' => ['required', 'string', 'max:30', 'unique:mahasiswa,nim'],
                'id_fakultas' => ['required', 'integer', 'exists:fakultas,id_fakultas'],
                'prodi' => ['required', 'string', 'max:255'],
            ];
        }

        if ($kategori === 'dosen') {
            $rules += [
                'nip' => ['required', 'string', 'max:50', 'unique:dosen,nip_nidn'],
                'id_fakultas' => ['required', 'integer', 'exists:fakultas,id_fakultas'],
                'prodi' => ['required', 'string', 'max:255'],
            ];
        }

        if ($kategori === 'eksternal') {
            $rules += [
                'kategori_tarif' => ['required', 'string', 'in:'.implode(',', User::KATEGORI_EKSTERNAL)],
                'nik' => ['required', 'string', 'max:30', 'unique:eksternal,nik'],
                'instansi' => ['required', 'string', 'max:255'],
                'id_provinsi' => ['required', 'integer', 'exists:provinces,id'],
                'id_kabupaten' => ['required', 'integer', 'exists:regencies,id'],
                'id_kecamatan' => ['required', 'integer', 'exists:districts,id'],
                'id_kelurahandesa' => ['required', 'integer', 'exists:villages,id'],
                'alamat_lengkap' => ['required', 'string', 'max:255'],
            ];
        }

        $validator = Validator::make($input, $rules);

        // Wilayah harus membentuk hierarki yang konsisten.
        $validator->after(function ($validator) use ($input): void {
            if (($input['kategori_pengguna'] ?? null) !== 'eksternal') {
                return;
            }

            $kab = isset($input['id_kabupaten']) ? DB::table('regencies')->find($input['id_kabupaten']) : null;
            $kec = isset($input['id_kecamatan']) ? DB::table('districts')->find($input['id_kecamatan']) : null;
            $des = isset($input['id_kelurahandesa']) ? DB::table('villages')->find($input['id_kelurahandesa']) : null;

            if ($kab && (int) $kab->province_id !== (int) ($input['id_provinsi'] ?? 0)) {
                $validator->errors()->add('id_kabupaten', 'Kabupaten tidak termasuk dalam provinsi terpilih.');
            }
            if ($kec && (int) $kec->regency_id !== (int) ($input['id_kabupaten'] ?? 0)) {
                $validator->errors()->add('id_kecamatan', 'Kecamatan tidak termasuk dalam kabupaten terpilih.');
            }
            if ($des && (int) $des->district_id !== (int) ($input['id_kecamatan'] ?? 0)) {
                $validator->errors()->add('id_kelurahandesa', 'Desa tidak termasuk dalam kecamatan terpilih.');
            }
        });

        return $validator->validate();
    }

    /**
     * Create the full 3NF account graph in one transaction and return the
     * freshly resolved auth principal.
     *
     * @param  array<string, mixed>  $input
     */
    public function register(array $input): User
    {
        $data = $this->validate($input);

        $idAkun = DB::transaction(function () use ($data) {
            $fotoProfil = ($data['foto_profil'] ?? null) instanceof UploadedFile
                ? $data['foto_profil']->store('profiles', 'public')
                : null;
            // Dokumen identitas disimpan di disk private (tidak dapat diakses langsung via URL).
            $fotoIdentitas = $data['foto_identitas']->store('', 'identities');

            $idPengguna = DB::table('pengguna')->insertGetId([
                'nama_lengkap' => $data['name'],
                'email' => $data['email'],
                'no_telepon' => $data['no_hp'],
                'foto_profil' => $fotoProfil,
                'foto_identitas' => $fotoIdentitas,
            ], 'id_pengguna');

            $idKredensial = DB::table('kredensial')->insertGetId([
                'password' => Hash::make($data['password']),
            ], 'id_kredensial');

            $role = $data['kategori_pengguna'] === 'eksternal' ? 'eksternal' : $data['kategori_pengguna'];
            $idPeran = DB::table('peran')->where('role', $role)->value('id_peran');

            $idAkun = DB::table('akun')->insertGetId([
                'id_pengguna' => $idPengguna,
                'id_peran' => $idPeran,
                'id_kredensial' => $idKredensial,
                'status' => 'active',
                'kategori_eksternal' => $data['kategori_pengguna'] === 'eksternal' ? $data['kategori_tarif'] : null,
                'created_at' => now(),
                'updated_at' => now(),
            ], 'id_akun');

            match ($data['kategori_pengguna']) {
                'mahasiswa' => $this->createMahasiswa($idPengguna, $data),
                'dosen' => $this->createDosen($idPengguna, $data),
                'eksternal' => $this->createEksternal($idPengguna, $data),
            };

            return $idAkun;
        });

        return User::query()->where('id', $idAkun)->firstOrFail();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function createMahasiswa(int $idPengguna, array $data): void
    {
        DB::table('mahasiswa')->insert([
            'id_pengguna' => $idPengguna,
            'id_prodi' => $this->resolveProdi($data['id_fakultas'], $data['prodi']),
            'id_fakultas' => $data['id_fakultas'],
            'nama_mahasiswa' => $data['name'],
            'nim' => $data['nim'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function createDosen(int $idPengguna, array $data): void
    {
        DB::table('dosen')->insert([
            'id_pengguna' => $idPengguna,
            'id_prodi' => $this->resolveProdi($data['id_fakultas'], $data['prodi']),
            'id_fakultas' => $data['id_fakultas'],
            'nama_dosen' => $data['name'],
            'nip_nidn' => $data['nip'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function createEksternal(int $idPengguna, array $data): void
    {
        $instansi = DB::table('instansi')->where('nama_instansi', $data['instansi'])->first(['id_instansi']);

        DB::table('eksternal')->insert([
            'id_pengguna' => $idPengguna,
            'nama_eksternal' => $data['name'],
            'nik' => $data['nik'],
            'id_instansi' => $instansi?->id_instansi ?? DB::table('instansi')->insertGetId([
                'nama_instansi' => $data['instansi'],
            ], 'id_instansi'),
            'alamat_lengkap' => $data['alamat_lengkap'],
            'id_kelurahandesa' => $data['id_kelurahandesa'],
            'id_kecamatan' => $data['id_kecamatan'],
            'id_kabupaten' => $data['id_kabupaten'],
            'id_provinsi' => $data['id_provinsi'],
        ]);
    }

    private function resolveProdi(int $idFakultas, string $namaProdi): int
    {
        $namaProdi = trim(preg_replace('/\s+/', ' ', strtolower($namaProdi)));

        $existing = DB::table('prodi')
            ->where('id_fakultas', $idFakultas)
            ->whereRaw('LOWER(nama_prodi) = ?', [$namaProdi])
            ->value('id_prodi');

        if ($existing) {
            return $existing;
        }

        return DB::table('prodi')->insertGetId([
            'id_fakultas' => $idFakultas,
            'nama_prodi' => ucwords($namaProdi),
        ], 'id_prodi');
    }

    /**
     * Provision an account by Admin on PostgreSQL. Identity documents are
     * optional here (they can be completed later); role may be any of the
     * six Sprint 1 roles.
     *
     * @param  array<string, mixed>  $data
     */
    public function provisionByAdmin(array $data): User
    {
        $roleMap = [
            'admin' => 'admin', 'kalab' => 'kalab', 'plp' => 'plp',
            'dosen' => 'dosen', 'mhs' => 'mahasiswa', 'ekst' => 'eksternal',
        ];
        $dbRole = $roleMap[$data['role']] ?? 'eksternal';

        $idAkun = DB::transaction(function () use ($data, $dbRole) {
            $pengguna = [
                'nama_lengkap' => $data['name'],
                'email' => $data['email'],
                'no_telepon' => $data['no_hp'] ?? null,
            ];

            if (($data['foto_profil'] ?? null) instanceof UploadedFile) {
                $pengguna['foto_profil'] = $data['foto_profil']->store('profiles', 'public');
            }
            if (($data['foto_identitas'] ?? null) instanceof UploadedFile) {
                $pengguna['foto_identitas'] = $data['foto_identitas']->store('', 'identities');
            }

            $idPengguna = DB::table('pengguna')->insertGetId($pengguna, 'id_pengguna');

            $idKredensial = DB::table('kredensial')->insertGetId([
                'password' => Hash::make($data['password']),
            ], 'id_kredensial');

            $idPeran = DB::table('peran')->where('role', $dbRole)->value('id_peran');

            $idAkun = DB::table('akun')->insertGetId([
                'id_pengguna' => $idPengguna,
                'id_peran' => $idPeran,
                'id_kredensial' => $idKredensial,
                'status' => 'active',
                'kategori_eksternal' => $data['role'] === 'ekst' ? ($data['kategori'] ?? null) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ], 'id_akun');

            $this->syncSubtype($idPengguna, $data['role'], $data);

            return $idAkun;
        });

        return User::query()->where('id', $idAkun)->firstOrFail();
    }

    /**
     * Ensure the role subtype row exists and sync its display name.
     * Skipped when there is neither an identity number nor an existing row,
     * so admin-created accounts without identity stay valid.
     *
     * @param  array<string, mixed>  $data
     */
    public function syncSubtype(int $idPengguna, string $role, array $data): void
    {
        $nama = $data['name'];
        $identitas = isset($data['no_identitas']) && $data['no_identitas'] !== '' ? (string) $data['no_identitas'] : null;

        if ($role === 'dosen') {
            $exists = DB::table('dosen')->where('id_pengguna', $idPengguna)->exists();
            if ($identitas === null && ! $exists) {
                return;
            }
            $values = ['nama_dosen' => $nama];
            if ($identitas !== null) {
                $values['nip_nidn'] = $identitas;
            }
            DB::table('dosen')->updateOrInsert(['id_pengguna' => $idPengguna], $values);

            return;
        }

        if ($role === 'mhs') {
            $exists = DB::table('mahasiswa')->where('id_pengguna', $idPengguna)->exists();
            if ($identitas === null && ! $exists) {
                return;
            }
            $values = ['nama_mahasiswa' => $nama];
            if ($identitas !== null) {
                $values['nim'] = $identitas;
            }
            DB::table('mahasiswa')->updateOrInsert(['id_pengguna' => $idPengguna], $values);

            return;
        }

        if ($role === 'ekst') {
            $instansiId = null;
            if (! empty($data['instansi'])) {
                $instansiId = DB::table('instansi')->where('nama_instansi', $data['instansi'])->value('id_instansi')
                    ?? DB::table('instansi')->insertGetId(['nama_instansi' => $data['instansi']], 'id_instansi');
            }

            $values = ['nama_eksternal' => $nama];
            if ($identitas !== null) {
                $values['nik'] = $identitas;
            }
            if ($instansiId !== null) {
                $values['id_instansi'] = $instansiId;
            }
            DB::table('eksternal')->updateOrInsert(['id_pengguna' => $idPengguna], $values);
        }
    }

    public static function storageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        return Storage::disk('public')->url($path);
    }
}
