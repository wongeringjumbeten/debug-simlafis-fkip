# SRS Decisions (disetujui product owner)

Keputusan ini mengikat implementasi dan menggantikan bagian dokumen yang
bertentangan. Sumber utama: `File md ori/sprint1.md` terbaru.

## 1. Registrasi mandiri: Mahasiswa, Dosen, Eksternal

- `File md ori/sprint1.md` (Prosedur Register) menggantikan larangan register
  internal pada `Business Rule.md` lama.
- Kategori registrasi: `mahasiswa` (NIM + fakultas + prodi + KTM),
  `dosen` (NIP/NIDN + fakultas + prodi + kartu pegawai),
  `eksternal` (NIK + instansi + wilayah + alamat + KTP).
- Eksternal memilih kategori tarif `internal_unej` / `luar_unej` (BR-2 tetap berlaku).

## 2. Role otorisasi vs kategori tarif

- Role: `admin | kalab | plp | dosen | mahasiswa | eksternal`.
- `eksternal_internal_unej` dan `eksternal_luar_unej` BUKAN role;
  keduanya dimigrasikan menjadi role `eksternal` + `kategori_eksternal`.
- Frontend memakai alias ringkas `mhs`/`ekst` lewat `v_auth_users`.

## 3. Status akun: `active | suspended | blocked`

- `suspended`: boleh login dan melihat data; dilarang tambah cart,
  checkout, dan pengajuan baru.
- `blocked`: ditolak saat autentikasi; sesi aktif dicabut.
- Setiap perubahan status tercatat di `riwayat_status_akun`.

## 4. Tarif ruangan tunggal = tarif Luar UNEJ

- Kolom legacy `ruangan.tarif_eksternal` diperlakukan sebagai tarif Luar UNEJ
  (konsisten dengan `alat.tarif_eksternal_luar_unej`).
- Kolom `tarif_eksternal_internal_unej` ditambahkan ke `alat` dan `ruangan`.

## 5. Unit lab pada katalog

- Schema belum punya referensi unit lab; controller memakai pemetaan
  sementara `id_ruangan → dasar/elektronika/lanjut/elf`.
- Wajib diganti referensi resmi saat backend menyediakannya.

## 6. Fortify Sprint 1 minimal

- Aktif: login, logout, lupa/reset password, ubah password.
- Nonaktif sementara: email verification, 2FA, passkeys (tidak ada di Sprint 1).
- Akun dummy PostgreSQL boleh di-reset ke hash Laravel (`a123b456`).

## 7. Gambar katalog

- Hanya 5 alat existing yang dimapping ke paket UI/UX.
- 21 gambar sisanya menunggu data master resmi; tidak dibuatkan barang otomatis.
