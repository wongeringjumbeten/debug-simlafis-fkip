# Integrasi Database PostgreSQL SIMLAFIS

## Baseline dan keamanan perubahan

- Database shared saat integrasi: PostgreSQL, database `postgres`, user `postgres`.
- Snapshot sudah dikonfirmasi tersedia sebelum migration shared pertama dijalankan.
- Database test terisolasi: `simlafis_testing`. Test tidak boleh menggunakan database shared.
- Jangan menjalankan `migrate:fresh`, `db:wipe`, atau migration destruktif pada database shared.
- Semua perubahan schema shared dibuat melalui Laravel migration yang additive/alterative dan direview sebelum dijalankan.

## Sumber kebenaran auth

Database memakai model 3NF:

```text
akun -> pengguna / peran / kredensial
```

Laravel akan memakai `v_auth_users` sebagai read model Fortify. Semua write autentikasi/profil dilakukan secara transaksional ke tabel sumber, bukan ke view.

## Kebijakan Sprint 1 yang disetujui

- Registrasi mandiri: Mahasiswa, Dosen, dan Eksternal.
- Eksternal memilih kategori tarif `internal_unej` atau `luar_unej`.
- Status akun: `active`, `suspended`, `blocked`.
- `suspended` tetap dapat login tetapi tidak dapat membuat cart/pengajuan baru.
- `blocked` ditolak saat autentikasi dan sesi aktifnya dicabut.
- Fortify Sprint 1: login, logout, lupa/reset password, ubah password. Email verification, 2FA, dan passkey tidak diaktifkan pada integrasi awal.
- UI/UX image alat hanya dipetakan ke barang yang sudah tersedia pada database; gambar lain menunggu data master resmi.
