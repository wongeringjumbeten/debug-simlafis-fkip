# Arsitektur Sistem — SIMLAFIS

> Sistem Informasi Manajemen Laboratorium Fisika · Capstone MBKM FKIP Universitas Jember

| Atribut | Nilai |
| --- | --- |
| Dokumen | Architecture Specification |
| Versi dokumen | 1.0 |
| Fase | Sprint 1 |
| Status | Baseline (mengikuti implementasi repositori `draft-sprint1`) |
| Ruang lingkup | 4 rumpun laboratorium: Fisika Dasar, Elektronika, Fisika Lanjut, ELF |
| Dokumen terkait | [Business Requirements](Business%20Requirements.md) · [Business Rule](Business%20Rule.md) · [System Features](System%20Features.md) · [Overall Description](Overall%20Description.md) · [Design](Design.md) · [Tabel Data](tabel%20data.md) · [User Story](user%20story.md) · [Sprint 1](sprint1.md) |

## Daftar Isi

1. [Tujuan dan Ruang Lingkup](#1-tujuan-dan-ruang-lingkup)
2. [Prinsip Arsitektur](#2-prinsip-arsitektur)
3. [Arsitektur Tingkat Tinggi](#3-arsitektur-tingkat-tinggi)
4. [Stack Teknologi](#4-stack-teknologi)
5. [Lapisan Aplikasi](#5-lapisan-aplikasi)
6. [Struktur Direktori](#6-struktur-direktori)
7. [Arsitektur Autentikasi dan Otorisasi](#7-arsitektur-autentikasi-dan-otorisasi)
8. [Arsitektur Data](#8-arsitektur-data)
9. [Alur Proses Utama](#9-alur-proses-utama)
10. [Arsitektur Frontend](#10-arsitektur-frontend)
11. [Keamanan](#11-keamanan)
12. [Kebutuhan Non-Fungsional](#12-kebutuhan-non-fungsional)
13. [Batasan dan Utang Teknis](#13-batasan-dan-utang-teknis)
14. [Keputusan Arsitektur (ADR)](#14-keputusan-arsitektur-adr)

---

## 1. Tujuan dan Ruang Lingkup

SIMLAFIS adalah aplikasi web monolitik (monolith) yang menggantikan pencatatan manual berbasis buku besar di Program Studi Pendidikan Fisika FKIP Universitas Jember. Arsitektur ini menetapkan:

- **Bagaimana** sistem disusun: satu aplikasi Laravel yang melayani render halaman (server-driven) sekaligus endpoint aksi (Inertia), dengan satu basis data PostgreSQL sebagai sumber kebenaran.
- **Siapa** yang boleh melakukan apa: kendali akses berbasis peran (RBAC) dengan enam peran tunggal (*single-role*).
- **Di mana** batas integrasi: **tidak ada** integrasi teknis dengan SISTER UNEJ maupun payment gateway pihak ketiga (lihat [Overall Description](Overall%20Description.md) §Product Perspective).

### 1.1 Yang termasuk ruang lingkup arsitektur

| Termasuk | Keterangan |
| --- | --- |
| Autentikasi & manajemen akun | Fortify (login, logout, lupa/reset password, ubah password), registrasi mandiri mahasiswa/dosen/eksternal |
| Master data aset | Alat, detail unit alat, ruangan, bahan, mebeler, barang |
| Katalog interaktif | Pencarian nama + rentang waktu, stok dinamis, penyembunyian kategori Bahan dari peran non-staf |
| Keranjang sesi sementara | *Temporary Session Cart* 2-tab (Alat / Ruangan) berbasis session |
| Transaksi peminjaman | Pengajuan terpadu, anti-collision jadwal ruangan, pembatasan durasi 7 hari |
| Persetujuan parsial | *Item-level approval* per baris item (alat dan ruangan independen) |
| Pengembalian & sanksi | Validasi kondisi fisik, pemicu status akun `suspended` |
| Dokumentasi & pelaporan | Dokumentasi kegiatan, laporan maintenance/kalibrasi, laporan keuangan, Surat Bebas Laboratorium |

### 1.2 Di luar ruang lingkup (Sprint 1)

Integrasi SISTER UNEJ, payment gateway daring, verifikasi email, autentikasi dua faktor (2FA), passkey, notifikasi WhatsApp/email otomatis, dan aplikasi mobile native.

---

## 2. Prinsip Arsitektur

| # | Prinsip | Konsekuensi teknis |
| --- | --- | --- |
| A1 | **Satu aplikasi, satu basis data** | Monolith Laravel; tidak ada service terpisah yang perlu diorkestrasi pada Sprint 1 |
| A2 | **Server sebagai sumber kebenaran** | Aturan bisnis ditegakkan di sisi server (Service + middleware), bukan hanya di UI |
| A3 | **Inertia sebagai jembatan, bukan API publik** | Tidak ada REST API terpisah; controller mengembalikan `Inertia::render` atau `redirect` |
| A4 | **Peran tunggal (*single-role*)** | Satu akun = satu peran; tidak ada penggabungan hak akses |
| A5 | **Persetujuan independen per item** | Status hidup di level baris item, bukan hanya di level transaksi |
| A6 | **Pertahanan berlapis untuk otorisasi** | Middleware + pemeriksaan `authorize()` pada Form Request + guard pada Service |
| A7 | **Portabilitas pengujian** | Jalur `pgsql` untuk produksi; jalur fallback (SQLite/mock) untuk pengujian tanpa PostgreSQL |
| A8 | **Perubahan skema bersifat aditif** | Semua perubahan basis data lewat migration; dilarang `migrate:fresh` pada basis data bersama |

---

## 3. Arsitektur Tingkat Tinggi

```text
                              ┌──────────────────────────────────────┐
                              │             PERAMBAN                 │
                              │  React 19 + Inertia 3 (SPA ringan)   │
                              └───────────────┬──────────────────────┘
                                              │ HTTP (HTML + JSON props)
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APLIKASI LARAVEL (monolith)                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ROUTING  routes/web.php · routes/settings.php                         │  │
│  └───────────────────────────────┬───────────────────────────────────────┘  │
│                                  ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ MIDDLEWARE  auth · verified · account.active · admin · borrower.active│  │
│  │             HandleInertiaRequests (shared props)                      │  │
│  └───────────────────────────────┬───────────────────────────────────────┘  │
│                                  ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ CONTROLLER  Dashboard · Katalog · Inventory · Peminjaman · Persetujuan│  │
│  │             Riwayat · Users · Wilayah · Identitas · Settings          │  │
│  └───────────────┬───────────────────────────────────┬───────────────────┘  │
│                  ▼                                   ▼                      │
│  ┌──────────────────────────────┐   ┌──────────────────────────────────┐    │
│  │ FORM REQUEST (validasi)      │   │ SERVICE (aturan bisnis)          │    │
│  │ Settings/* · Users/*         │   │ Registration · AccountCredential │    │
│  │ Concerns/*ValidationRules    │   │ AccountProfile · AccountStatus   │    │
│  └──────────────────────────────┘   │ Peminjaman                       │    │
│                                     └───────────────┬──────────────────┘    │
│                                                     ▼                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ MODEL / ELOQUENT  User · Barang · Alat · DetailAlat · Ruangan · Bahan │  │
│  │                   Mebeler · PengajuanPeminjaman · DetailPengajuan*    │  │
│  │                   Dosen · Mahasiswa · Fakultas · Prodi · Instansi     │  │
│  │                   Province · Regency · District · Village            │  │
│  └───────────────────────────────┬───────────────────────────────────────┘  │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   ▼
                    ┌──────────────────────────────────┐
                    │  PostgreSQL (sumber kebenaran)   │
                    │  + storage/app/public (berkas)   │
                    └──────────────────────────────────┘
```

**Catatan pembacaan diagram.** Tidak ada kolom "API layer" karena Inertia menggantikan peran itu: permintaan navigasi mengembalikan komponen React + props, sedangkan aksi formulir dikirim sebagai *Inertia request* dan dijawab dengan redirect/back. Berkas unggahan (foto profil, KTP/KTM, bukti pembayaran, laporan PDF) tidak diakses langsung dari disk publik, melainkan melalui rute ber-otorisasi (lihat [§11 Keamanan](#11-keamanan)).

---

## 4. Stack Teknologi

Versi diambil dari `composer.json` dan `package.json` repositori.

### 4.1 Sisi Server

| Komponen | Versi | Peran dalam arsitektur |
| --- | --- | --- |
| PHP | `^8.3` | Bahasa runtime; memakai constructor property promotion dan typed properties |
| Laravel Framework | `^13.17` | Kerangka monolith: routing, Eloquent, queue, validasi |
| Inertia Laravel | `^3.0` | Menjembatani controller dengan komponen React tanpa API terpisah |
| Laravel Fortify | `^1.37` | Backend autentikasi headless (login, reset password, ubah password) |
| Laravel Wayfinder | `^0.1.14` | Menghasilkan helper rute bertipe untuk sisi TypeScript |
| Laravel Chisel | `^0.1.0` | Utilitas pengembangan internal |
| Laravel Tinker | `^3.0` | Eksekusi PHP dalam konteks aplikasi untuk penelusuran masalah |

**Pengembangan dan mutu kode:** Pest `^4.7` (+ `pest-plugin-laravel`), Larastan `^3.9` (analisis statis), Pint `^1.27` (format), Collision `^8.9`, Pail `^1.2`, Sail `^1.53`.

### 4.2 Sisi Klien

| Komponen | Versi | Peran dalam arsitektur |
| --- | --- | --- |
| React | `^19.2` | Pustaka UI; memakai React Compiler (`babel-plugin-react-compiler`) |
| Inertia React | `^3.0` | Komponen halaman, form helper, tautan tanpa muat ulang penuh |
| TypeScript | `^5.7` | Tipe statis pada seluruh berkas `.ts`/`.tsx` |
| Tailwind CSS | `^4.0` (+ `@tailwindcss/vite`) | Sistem utilitas gaya; token desain dari [Design.md](Design.md) |
| Radix UI | paket `@radix-ui/react-*` | Primitif aksesibel (dialog, select, dropdown, tooltip, avatar, dsb.) |
| Lucide React | `^0.475` | Set ikon garis yang konsisten |
| Sonner | `^2.0` | Notifikasi *toast* |
| Vite (`vite-plus`) | `^8.0` / `0.3.0` | Bundler pengembangan dan produksi |

### 4.3 Basis Data dan Penyimpanan

| Komponen | Nilai | Catatan |
| --- | --- | --- |
| RDBMS | PostgreSQL | Basis data bersama saat integrasi: database `postgres`, user `postgres` |
| Basis data pengujian | `simlafis_testing` | Terisolasi; pengujian tidak boleh menyentuh basis data bersama |
| Normalisasi | 3NF | Lihat [Tabel Data](tabel%20data.md) |
| Penyimpanan berkas | Disk `public` Laravel (`storage/app/public`) | Unggahan JPG/PNG maksimal 2 MB; dokumen identitas diakses via controller ber-otorisasi |

---

## 5. Lapisan Aplikasi

Alur satu permintaan selalu melewati urutan berikut.

| # | Lapisan | Lokasi | Tanggung jawab | Dilarang |
| --- | --- | --- | --- | --- |
| 1 | Routing | `routes/web.php`, `routes/settings.php` | Memetakan URL ke controller dan menempelkan middleware | Memuat logika bisnis |
| 2 | Middleware | `app/Http/Middleware` | Menyaring permintaan: status akun, peran admin, hak meminjam | Mengubah data |
| 3 | Controller | `app/Http/Controllers` | Menerjemahkan permintaan menjadi panggilan Service, menyiapkan props Inertia | Menyimpan aturan bisnis rumit |
| 4 | Form Request | `app/Http/Requests` | Validasi masukan + `authorize()` sebagai lapisan otorisasi kedua | Menulis ke basis data |
| 5 | Service | `app/Services` | Aturan bisnis dan transaksi basis data | Menyentuh `Request`/`Response` HTTP |
| 6 | Model | `app/Models` | Relasi, kasting, aksesor | Aturan alur lintas entitas |
| 7 | Presentasi | `resources/js/pages`, `resources/js/components` | Merender props menjadi UI | Menjadi sumber kebenaran aturan bisnis |

### 5.1 Daftar Service dan tanggung jawabnya

| Service | Berkas | Tanggung jawab |
| --- | --- | --- |
| `RegistrationService` | `app/Services/RegistrationService.php` | Registrasi mandiri multi-kategori (mahasiswa/dosen/eksternal) dalam satu transaksi basis data; validasi hierarki wilayah; penyimpanan berkas |
| `AccountCredentialService` | `app/Services/AccountCredentialService.php` | Pengelolaan kredensial: pembuatan akun oleh admin, reset kata sandi, perubahan kata sandi |
| `AccountProfileService` | `app/Services/AccountProfileService.php` | Pembaruan profil mandiri dan profil oleh admin (pemisahan `kategori` yang hanya boleh diubah admin) |
| `AccountStatusService` | `app/Services/AccountStatusService.php` | Transisi status akun `active` / `suspended` / `blocked` beserta pencatatan alasan dan pelakunya |
| `PeminjamanService` | `app/Services/PeminjamanService.php` | Pembuatan pengajuan dari keranjang sesi, pemeriksaan bentrok jadwal, perhitungan biaya, pembatalan mandiri |

### 5.2 Middleware dan alias

| Alias | Kelas | Perilaku |
| --- | --- | --- |
| `admin` | `EnsureUserIsAdmin` | Menolak akses non-admin ke rute manajemen pengguna |
| `account.active` | `EnsureAccountIsActive` | Akun `blocked` dipaksa logout, sesi dibatalkan, diarahkan ke login dengan pesan galat |
| `borrower.active` | `EnsureCanBorrow` | Akun `suspended` tetap boleh membaca, tetapi ditolak (HTTP 403) saat membuat keranjang/pengajuan baru |
| (bawaan Laravel) | `auth`, `verified` | Memastikan sesi terautentikasi dan email terverifikasi |
| (global web) | `HandleAppearance`, `HandleInertiaRequests`, `AddLinkHeadersForPreloadedAssets` | Tema tampilan, *shared props* Inertia, preload aset |

---

## 6. Struktur Direktori

```text
simlafis-app/
├── app/
│   ├── Actions/Fortify/            # Aksi kustom Fortify (pembuatan/pembaruan pengguna)
│   ├── Auth/AccountUserProvider.php# User provider kustom (kompatibilitas view auth)
│   ├── Concerns/                   # PasswordValidationRules, ProfileValidationRules
│   ├── Http/
│   │   ├── Controllers/            # Dashboard, Katalog, Inventory, Peminjaman, ...
│   │   ├── Controllers/Users/      # Manajemen pengguna (khusus admin)
│   │   ├── Middleware/             # EnsureAccountIsActive, EnsureCanBorrow, EnsureUserIsAdmin, ...
│   │   └── Requests/               # Validasi Settings/* dan Users/*
│   ├── Models/                     # 20 model Eloquent
│   ├── Providers/                  # AppServiceProvider, FortifyServiceProvider
│   └── Services/                   # 5 service aturan bisnis
├── bootstrap/app.php               # Konfigurasi routing, middleware, penanganan pengecualian
├── database/migrations/            # Riwayat skema (aditif; lihat §8)
├── resources/js/
│   ├── components/                 # Komponen bersama (app-shell, status-badge, ui/*)
│   └── pages/                      # Halaman Inertia per modul
├── routes/                         # web.php, settings.php, console.php
├── tests/                          # Pest (Feature + Unit)
├── .ai/rules/                      # Aturan proyek yang mengikat (index.md memetakan glob → berkas)
└── File md ori/                    # Dokumen SRS (folder ini)
```

---

## 7. Arsitektur Autentikasi dan Otorisasi

### 7.1 Enam peran tunggal

| Peran (kode) | Sebutan | Kelompok akses |
| --- | --- | --- |
| `admin` | Admin | Internal pengelola — super user |
| `kalab` | Kepala Laboratorium | Internal pengelola — *primary approver* |
| `plp` | Pranata Laboratorium Pendidikan | Internal pengelola — operasional harian |
| `dosen` | Dosen Pendidikan Fisika UNEJ | Internal peminjam — tanpa label tarif |
| `mhs` | Mahasiswa Pendidikan Fisika UNEJ | Internal peminjam — tanpa label tarif |
| `ekst` | Eksternal (non Pendidikan Fisika UNEJ) | Peminjam berbayar — tarif `internal_unej` / `luar_unej` |

**Pemisahan penting.** Kode peran (`dosen`/`mhs`/`ekst`) **berbeda** dari kategori tarif (`internal_unej`/`luar_unej`). Kategori tarif adalah atribut pada akun eksternal, bukan peran tambahan — konsisten dengan [Business Rule](Business%20Rule.md) BR-2 dan [Business Rule](Business%20Rule.md) BR-5.

### 7.2 Alur autentikasi

```text
PENGUNJUNG
   │  1. GET /register  → form registrasi (mahasiswa | dosen | eksternal)
   │  2. POST /register → RegistrationService (satu transaksi DB + unggah berkas)
   │  3. GET /login     → form login Fortify
   │  4. POST /login    → Fortify::authenticateUsing / AccountUserProvider
   │                      ├─ kredensial salah → pesan galat di form
   │                      ├─ status = blocked → tolak autentikasi, sesi dicabut
   │                      └─ berhasil → buat sesi, tentukan peran
   ▼
MIDDLEWARE  auth → verified → account.active → [admin | borrower.active]
   │  blocked   → logout paksa + redirect /login
   │  suspended → boleh membaca; aksi pinjam ditolak 403
   ▼
DASHBOARD sesuai peran
```

### 7.3 Sumber identitas dan penulisan kredensial

- Model dokumen 3NF (`akun` → `pengguna` / `peran` / `kredensial`) menyediakan **read model** `v_auth_users` bagi Fortify.
- Karena `v_auth_users` adalah *view* (tidak dapat ditulis), seluruh penulisan autentikasi/profil dilakukan **transaksional ke tabel sumber**, bukan ke view. `AccountUserProvider` menangani kasus khusus penulisan *remember token*.
- Migration `2026_09_18_062129_merge_pengguna_to_users_table` menyatukan `akun` + `pengguna` ke tabel `users` bawaan Laravel (`foto_profil`, `foto_identitas`, `no_identitas`, `instansi`, `kategori`, `no_hp`, `role`, `active`, `suspension_reason`, `email_verified_at`) dan mengubah `dosen.id_pengguna`/`mahasiswa.id_pengguna` menjadi `user_id` agar mengikuti konvensi Eloquent.

> **Catatan konsistensi dokumen.** [Tabel Data](tabel%20data.md) masih menggambarkan model konseptual 3NF (`data_akun`, `data_pengguna`, `data_kredensial`, `data_peran`). Perbedaan ini disengaja dan tercatat sebagai utang dokumentasi pada [§13](#13-batasan-dan-utang-teknis).

### 7.4 Status akun

| Status | Boleh login | Boleh membaca | Boleh membuat pengajuan | Penanganan |
| --- | --- | --- | --- | --- |
| `active` | Ya | Ya | Ya | Normal |
| `suspended` | Ya | Ya | **Tidak** | `borrower.active` → HTTP 403 |
| `blocked` | **Tidak** | Tidak | Tidak | `account.active` → logout paksa |

Setiap perubahan status wajib mencatat alasan dan pelaku (`suspended_at`, `alasan_suspended`, `status_changed_by`).

### 7.5 Otorisasi manajemen pengguna

Seluruh rute `/users` berada di balik middleware `admin` **dan** memeriksa ulang peran pada `authorize()` di Form Request (pertahanan berlapis). Pengaman tambahan: admin tidak dapat mengubah perannya sendiri (mencegah *self-demotion*) dan tidak dapat menangguhkan akunnya sendiri. Atribut `kategori` (kategori tarif) hanya dapat diubah admin — **tidak pernah** melalui alur profil mandiri.

---

## 8. Arsitektur Data

### 8.1 Kelompok entitas

```text
A. IDENTITAS & OTORISASI
   users ──1:1── dosen / mahasiswa
   users ──N:1── fakultas, prodi, instansi
   users ──1:N── pengajuan_peminjaman
   wilayah: province ─1:N─ regency ─1:N─ district ─1:N─ village

B. MASTER ASET (pola generalisasi → spesialisasi)
   barang (nama, foto, deskripsi, jenis: alat|bahan|ruangan|mebeler)
      ├──1:1── alat    ──1:N── detail_alat   (unit fisik, no_seri_unit, kondisi, status)
      ├──1:1── ruangan ──1:N── jadwal_ruangan ──N:1── matakuliah
      ├──1:1── bahan   ──N:1── ruangan
      └──1:1── mebeler ──N:1── ruangan

C. TRANSAKSI PEMINJAMAN (status berlapis: transaksi → item → unit)
   pengajuan_peminjaman
      ├──1:N── detail_pengajuan_peminjaman_alat
      │           └──1:N── detail_unit_peminjaman_alat ──N:1── detail_alat
      └──1:N── detail_pengajuan_peminjaman_ruangan

D. DOKUMENTASI & PELAPORAN
   kegiatan_laboratorium · maintenance_kalibrasi ──N:M── detail_alat (pivot)
   bebas_laboratorium (nomor surat SKBL)
```

### 8.2 Aturan kunci pada model data

| Aturan | Penjelasan |
| --- | --- |
| Generalisasi `barang` | Empat jenis aset berbagi tabel induk `barang`, lalu dispesialisasi; mencegah duplikasi nama/foto/deskripsi |
| Stok berbasis unit | Ketersediaan alat dihitung dari `detail_alat`: total unit, dan tersedia = unit berkondisi `baik` **dan** berstatus `tersedia` |
| Status berlapis | `pengajuan_peminjaman.status_keseluruhan` merangkum; `detail_*.status_item` adalah status otoritatif per item (mendukung *item-level approval*) |
| Riwayat unit | `detail_unit_peminjaman_alat` mengikat unit fisik yang benar-benar diserahkan, termasuk kondisi kembali (`baik`/`rusak`/`hilang`) dan bukti pengembalian |
| Tarif | `alat.tarif_eksternal_luar_unej`, `alat.tarif_eksternal_internal_unej`, dan `ruangan.tarif_eksternal` (diperlakukan sebagai tarif Luar UNEJ) |
| Anti-collision | `jadwal_ruangan` menyimpan jadwal praktikum reguler; pengajuan ruangan diperiksa terhadap jadwal aktif **dan** transaksi aktif lain pada rentang waktu yang sama |
| Wilayah berjenjang | Validasi hierarki wajib lolos (kabupaten harus berada di provinsi terpilih, dan seterusnya) |

### 8.3 Pemetaan istilah dokumen ↔ implementasi

| Dokumen ([Tabel Data](tabel%20data.md)) | Implementasi saat ini | Keterangan |
| --- | --- | --- |
| `data_akun`, `data_pengguna`, `data_kredensial`, `data_peran` | `users` (+ `dosen`/`mahasiswa` dengan `user_id`) | Digabung pada migration `merge_pengguna_to_users_table` |
| `data_barang`, `data_alat`, `data_ruangan`, `data_bahan`, `data_mebeler` | `barang`, `alat`, `ruangan`, `bahan`, `mebeler` | Nama tabel tanpa prefiks `data_` |
| `data_pengajuan_peminjaman` | `pengajuan_peminjaman` | — |
| `data_detail_pengajuan_peminjaman_alat/ruangan` | `detail_pengajuan_peminjaman_alat/ruangan` | — |

Konvensi: tabel dan kolom memakai **snake_case** bahasa Indonesia; kunci utama `id_<entitas>` (atau `id` untuk `users`); kunci asing memakai pola `<entitas>_id` pada tabel baru dan `id_<entitas>` pada tabel warisan dokumen.

---

## 9. Alur Proses Utama

### 9.1 Katalog → Keranjang Sesi → Pengajuan

```text
1. Pengguna membuka /katalog (KatalogController@index)
   ├─ peran staf  → kategori Bahan ikut ditampilkan
   └─ peran peminjam → kategori Bahan disembunyikan (REQ-10)
2. Pengguna memilih rentang tanggal + kata kunci
   └─ sistem menghitung sisa stok dinamis pada rentang tersebut (REQ-09)
3. Pengguna menekan "Tambah" → dialog modal (tanggal, jam, jumlah)
   └─ item disimpan ke Temporary Session Cart (2 tab: Alat | Ruangan) (REQ-12)
4. Pengguna membuka dialog keranjang → meninjau/menghapus item
5. Pengguna menekan "Ajukan" → PeminjamanService@store
   ├─ periksa status akun (suspended → ditolak)
   ├─ periksa bentrok jadwal ruangan (anti-collision) (REQ-13)
   ├─ periksa durasi maksimal 7 hari kalender untuk mahasiswa (REQ-14)
   ├─ hitung biaya (eksternal berbayar; internal 0.00) (REQ-11)
   └─ tulis pengajuan + baris item dalam satu transaksi DB
6. Status awal: transaksi "menunggu", setiap item "menunggu"
```

### 9.2 Persetujuan Parsial (*Item-Level Approval*)

```text
KaLab/Admin membuka /persetujuan
   ├─ menyetujui item alat    → status_item alat = disetujui
   └─ menolak item ruangan    → status_item ruangan = ditolak + alasan_penolakan
        └─ TIDAK mengubah status item alat pada nomor transaksi yang sama (REQ-17)
Pemohon membuka /riwayat
   ├─ melihat status per baris item
   └─ dapat membatalkan sendiri selama belum "dipinjam" (REQ-18)
        └─ sistem melepas alokasi kuota alat dan kunci slot jadwal ruangan
```

### 9.3 Penyerahan dan Pengembalian

```text
PLP (loket)
   ├─ verifikasi pembayaran (transfer: cek bukti unggahan | tunai: kasir loket) (REQ-20)
   ├─ mencatat unit fisik yang diserahkan → detail_unit_peminjaman_alat
   ├─ status item → dipinjam  (kuota fisik alat terpotong)
   └─ saat kembali: catat kondisi (baik | rusak | hilang) + bukti pengembalian
        ├─ status item → selesai (stok fisik bertambah kembali)
        └─ jika terlambat > 7 hari kalender atau aset rusak → akun → suspended (REQ-19)
```

---

## 10. Arsitektur Frontend

| Aspek | Keputusan |
| --- | --- |
| Pola render | Server-driven: Laravel menyiapkan props → komponen React merender. Tidak ada state global berbasis API |
| Struktur halaman | `resources/js/pages/<modul>/index.tsx` sebagai halaman, komponen pendukung berdampingan (`cart-dialog.tsx`, `aset-card.tsx`, `item-form-dialog.tsx`) |
| Kerangka tata letak | `app-shell` + `app-sidebar` + `app-header` + `app-content` |
| Navigasi | `nav-items.ts` sebagai definisi menu terpusat, disaring menurut peran |
| Data dari server | *Shared props* Inertia: `name`, `auth.user` (termasuk URL avatar), `sidebarOpen` |
| Kontrak data | Halaman **hanya** mengonsumsi props; dilarang menyimpan data contoh/hardcoded di komponen (mis. `dashboard.tsx` harus menerima `labMetrics`/`personalMetrics` dari controller) |
| Komponen UI | Primitif Radix UI + gaya Tailwind; badge status terpusat pada `status-badge.tsx` |
| Rute dari sisi klien | Helper bertipe hasil Wayfinder |
| Aksesibilitas | Fokus terlihat, label eksplisit, status tidak hanya dibedakan warna (lihat [Design.md](Design.md) §8) |
| Cakupan data per peran | Widget sama, **cakupan berbeda**: admin/kalab/plp melihat agregat seluruh lab; dosen/mahasiswa/eksternal hanya data pribadi. Data pendapatan hanya untuk admin |

---

## 11. Keamanan

| Area | Kendali |
| --- | --- |
| Kata sandi | Hash Laravel (bcrypt); kebijakan panjang/kompleksitas terpusat di `Concerns/PasswordValidationRules` |
| Sesi | Sesi berbasis cookie terenkripsi; `account.active` mencabut sesi akun `blocked` (logout + `invalidate` + regenerasi token) |
| Otorisasi | Middleware + `authorize()` pada Form Request + guard Service (pertahanan berlapis) |
| Perlindungan akun admin | Admin tidak dapat menurunkan perannya sendiri atau menangguhkan dirinya sendiri |
| Dokumen identitas | Tidak disajikan langsung dari disk; diakses via `IdentitasController@show` yang memeriksa otorisasi terlebih dahulu |
| Unggahan | Dibatasi JPG/PNG maksimal 2 MB; nama berkas disimpan, bukan di-*echo* ke klien |
| Validasi masukan | Form Request terpusat; NIK/NIM/NIP diperlakukan sebagai **string**, bukan bilangan |
| Integritas transaksi | Registrasi dan pembuatan pengajuan dijalankan dalam satu transaksi basis data |
| Basis data | Perubahan skema hanya lewat migration aditif; dilarang `migrate:fresh`/`db:wipe` pada basis data bersama; pengujian memakai basis data terpisah |

---

## 12. Kebutuhan Non-Fungsional

| Kategori | Target |
| --- | --- |
| Portabilitas | Berjalan pada PostgreSQL (produksi) dan SQLite (pengujian) melalui percabangan driver |
| Kinerja | Pencarian stok dinamis memakai query terindeks; indeks ditambahkan untuk kolom pencarian/filter penting |
| Kemudahan pemeliharaan | Aturan area-spesifik terekam di `.ai/rules` (dipetakan lewat `.ai/rules/index.md`) agar diwarisi lintas kontributor |
| Mutu | Larastan (analisis statis), Pint (format), Pest (uji Feature + Unit) |
| Aksesibilitas | Kontras teks minimal 4,5:1, fokus keyboard terlihat, status disertai label teks |
| Auditabilitas | Riwayat status akun, riwayat peminjaman, dan jejak laporan maintenance/kalibrasi tersimpan |
| Keamanan data | Basis data terisolasi untuk pengujian; berkas identitas di balik otorisasi |

---

## 13. Batasan dan Utang Teknis

| # | Butir | Dampak | Rencana |
| --- | --- | --- | --- |
| T1 | Schema belum memiliki referensi resmi unit lab; controller memakai pemetaan sementara `id_ruangan → dasar/elektronika/lanjut/elf` (`RUANG_KE_LAB`) | Filter per unit lab rapuh bila data ruangan berubah | Ganti dengan referensi unit lab saat backend menyediakannya |
| T2 | Katalog membaca basis data nyata hanya ketika driver `pgsql`; selain itu jatuh ke data contoh | Perilaku berbeda antara lingkungan uji dan produksi | Pertahankan sebagai strategi pengujian; jangan dianggap fitur |
| T3 | Dashboard masih memakai metrik dari controller; perlu diganti query nyata | Angka dashboard belum final | Ganti isi `labMetrics()`/`personalMetrics()` dengan query nyata; dilarang mengembalikan array hardcoded di komponen |
| T4 | Model 3NF pada dokumen berbeda dari implementasi `users` | Risiko salah paham antara dokumen dan kode | Selaraskan [Tabel Data](tabel%20data.md) dengan skema aktual pada revisi berikutnya |
| T5 | Belum ada payment gateway daring | Verifikasi pembayaran manual oleh KaLab/PLP | Sesuai ruang lingkup; jangan diasumsikan otomatis |
| T6 | Belum ada integrasi SISTER UNEJ | Data civitas tidak tervalidasi otomatis | Registrasi mandiri + verifikasi dokumen manual |
| T7 | Hanya 5 gambar alat yang dipetakan ke paket UI/UX | 21 gambar lain menunggu data master resmi | Jangan membuat barang otomatis |
| T8 | Fitur Fortify nonaktif: verifikasi email, 2FA, passkey | Permukaan keamanan lebih kecil, tetapi juga lebih sedikit kendali | Aktifkan pada sprint lanjutan bila dibutuhkan |

---

## 14. Keputusan Arsitektur (ADR)

| ID | Keputusan | Alasan | Konsekuensi |
| --- | --- | --- | --- |
| ADR-01 | Monolith Laravel + Inertia (bukan SPA + REST API terpisah) | Satu basis kode, satu basis data, tim kecil, kebutuhan render cepat | Tidak ada kontrak API publik; integrasi pihak ketiga kelak butuh lapisan tambahan |
| ADR-02 | PostgreSQL sebagai sumber kebenaran | Normalisasi 3NF, transaksi kuat, kebutuhan agregasi laporan | Ketergantungan pada PostgreSQL; jalur fallback hanya untuk pengujian |
| ADR-03 | Enam peran tunggal (*single-role*) | Menghindari tumpang tindih tanggung jawab sesuai SOP laboratorium | Pengguna dengan dua kebutuhan akses harus memakai dua akun |
| ADR-04 | Kategori tarif sebagai atribut, bukan peran | Mencegah ledakan jumlah peran | Perlu pemeriksaan terpisah antara peran dan kategori tarif |
| ADR-05 | Persetujuan di tingkat item | Menghindari satu penolakan membatalkan seluruh transaksi | Status berlapis (transaksi → item → unit) menambah kompleksitas |
| ADR-06 | Keranjang berbasis sesi, bukan tabel basis data | Sederhana, tidak menyisakan data sampah | Keranjang hilang bila sesi berakhir; tidak dapat dilanjutkan lintas perangkat |
| ADR-07 | Fortify minimal (tanpa 2FA/passkey pada Sprint 1) | Fokus pada alur inti peminjaman | Perlu penjadwalan pengerasan keamanan lanjutan |
| ADR-08 | Aturan proyek direkam di `.ai/rules` | Aturan bertahan di repositori, bukan di catatan pribadi | Wajib dibaca sebelum mengubah berkas terkait |

---

## 15. Ringkasan Arsitektur dalam Satu Halaman

| Pertanyaan | Jawaban |
| --- | --- |
| Bentuk sistem | Monolith Laravel 13 + Inertia 3 + React 19 |
| Basis data | PostgreSQL, normalisasi 3NF, 1 basis data |
| Cara render | Server-driven props ke komponen React; tanpa API publik |
| Model akses | RBAC 6 peran tunggal + status akun (`active`/`suspended`/`blocked`) |
| Titik ekstensi aturan bisnis | `app/Services` (5 service) |
| Titik kendali permintaan | Middleware (`admin`, `account.active`, `borrower.active`) + Form Request |
| Inti transaksi | `pengajuan_peminjaman` → `detail_pengajuan_peminjaman_*` → `detail_unit_peminjaman_alat` |
| Ciri khas | Persetujuan parsial per item, stok dinamis berbasis rentang waktu, keranjang sesi sementara |
| Batas integrasi | Tanpa SISTER UNEJ, tanpa payment gateway, tanpa verifikasi email/2FA pada Sprint 1 |
| Sumber kebenaran dokumen | Repositori `draft-sprint1` dan `.ai/rules` |
