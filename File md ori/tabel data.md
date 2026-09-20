# Tabel Data — Normalisasi 3NF

> Kamus data dan data dummy untuk Sistem Informasi Manajemen Laboratorium Fisika (SIMLAFIS).

| Atribut | Nilai |
| --- | --- |
| Versi | 2.0 |
| Bentuk normal | 3NF (Third Normal Form) |
| Jumlah entitas | 30 (`T-01` … `T-30`) |
| Isi data | Data dummy (contoh) — bukan data produksi |
| Dokumen terkait | [Architecture §8](Architecture.md#8-arsitektur-data) · [System Features](System%20Features.md) · [sprint1.md](sprint1.md) |

## Daftar Isi

1. [Konvensi](#1-konvensi)
2. [Ringkasan Entitas](#2-ringkasan-entitas)
3. [Diagram Relasi](#3-diagram-relasi)
4. [Kamus Data dan Data Dummy](#4-kamus-data-dan-data-dummy)
   - [4.1 Identitas & Otorisasi](#41-identitas--otorisasi-t-01--t-14)
   - [4.2 Master Aset](#42-master-aset-t-15--t-20)
   - [4.3 Penjadwalan](#43-penjadwalan-t-21--t-22)
   - [4.4 Transaksi Peminjaman](#44-transaksi-peminjaman-t-23--t-26)
   - [4.5 Dokumen & Pelaporan](#45-dokumen--pelaporan-t-27--t-30)
5. [Catatan Perbaikan & Inkonsistensi Data](#5-catatan-perbaikan--inkonsistensi-data)

---

## 1. Konvensi

| Aspek | Konvensi |
| --- | --- |
| Penamaan tabel | *snake_case* bahasa Indonesia (`detail_pengajuan_peminjaman_alat`) |
| Penamaan kolom | *snake_case* bahasa Indonesia (`jumlah_saat_ini`) |
| Kunci utama | `id_<entitas>` (contoh: `id_alat`); khusus `users` memakai `id` |
| Kunci asing | Pola `id_<entitas>` mengikuti dokumen; pola `<entitas>_id` dipakai pada implementasi baru (contoh: `user_id`) |
| Tipe kunci | `BIGINT` dengan *auto increment* |
| Tipe uang | `DECIMAL(12,2)`, nilai default `0.00` |
| Tipe tanggal-waktu | `DATETIME` / `TIMESTAMP`; tanggal saja memakai `DATE` |
| Enum | Disimpan sebagai `VARCHAR` dengan batasan nilai (contoh: `kondisi` ∈ {`baik`, `rusak`}) |
| Kolom opsional | Ditandai *(Nullable)* |

---

## 2. Ringkasan Entitas

| ID | Entitas | Kelompok | Kunci utama | Kunci asing utama | Baris dummy |
| --- | --- | --- | --- | --- | --- |
| `T-01` | `peran` | Identitas | `id_peran` | — | 6 |
| `T-02` | `kredensial` | Identitas | `id_kredensial` | — | 10 |
| `T-03` | `fakultas` | Identitas | `id_fakultas` | — | 4 |
| `T-04` | `prodi` | Identitas | `id_prodi` | `id_fakultas` | 4 |
| `T-05` | `dosen` | Identitas | `id_dosen` | `id_pengguna`, `id_prodi`, `id_fakultas` | 5 |
| `T-06` | `mahasiswa` | Identitas | `id_mahasiswa` | `id_pengguna`, `id_prodi`, `id_fakultas` | 4 |
| `T-07` | `instansi` | Identitas | `id_instansi` | — | 5 |
| `T-08` | `provinsi` | Wilayah | `id_provinsi` | — | 5 |
| `T-09` | `kabupaten` | Wilayah | `id_kabupaten` | `id_provinsi` | 5 |
| `T-10` | `kecamatan` | Wilayah | `id_kecamatan` | `id_kabupaten`, `id_provinsi` | 5 |
| `T-11` | `kelurahan_desa` | Wilayah | `id_kelurahandesa` | `id_kecamatan`, `id_kabupaten`, `id_provinsi` | 5 |
| `T-12` | `eksternal` | Identitas | `id_eksternal` | `id_pengguna`, `id_instansi`, wilayah | 4 |
| `T-13` | `pengguna` | Identitas | `id_pengguna` | — | 13 |
| `T-14` | `akun` | Otorisasi | `id_akun` | `id_pengguna`, `id_peran`, `id_kredensial` | 13 |
| `T-15` | `barang` | Master aset | `id_barang` | — | 19 |
| `T-16` | `ruangan` | Master aset | `id_ruangan` | `id_barang` | 4 |
| `T-17` | `alat` | Master aset | `id_alat` | `id_barang` | 6 |
| `T-18` | `detail_alat` | Master aset | `id_detail_alat` | `id_alat`, `id_ruangan` | 6 |
| `T-19` | `bahan` | Master aset | `id_bahan` | `id_barang`, `id_ruangan` | 5 |
| `T-20` | `mebeler` | Master aset | `id_mebeler` | `id_barang`, `id_ruangan` | 6 |
| `T-21` | `mata_kuliah` | Penjadwalan | `id_matakuliah` | — | 6 |
| `T-22` | `jadwal_ruangan` | Penjadwalan | `id_jadwal_ruangan` | `id_ruangan`, `id_matakuliah`, `id_pengguna` | 6 |
| `T-23` | `pengajuan_peminjaman` | Transaksi | `id_pengajuan_peminjaman` | `id_pengguna` | 6 |
| `T-24` | `detail_pengajuan_peminjaman_ruangan` | Transaksi | `id_detail_pengajuan_peminjaman_ruangan` | `id_pengajuan_peminjaman`, `id_ruangan` | 2 |
| `T-25` | `detail_pengajuan_peminjaman_alat` | Transaksi | `id_detail_pengajuan_peminjaman_alat` | `id_pengajuan_peminjaman`, `id_alat` | 5 |
| `T-26` | `detail_unit_peminjaman_alat` | Transaksi | `id_detail_unit_peminjaman_alat` | `id_detail_pengajuan_peminjaman_alat`, `id_detail_alat` | 4 |
| `T-27` | `bebas_laboratorium` | Dokumen | `id_bebas_laboratorium` | `id_pengajuan` | 4 |
| `T-28` | `kegiatan_laboratorium` | Dokumen | `id_kegiatan_laboratorium` | `id_ruangan` | 6 |
| `T-29` | `maintenance_kalibrasi` | Dokumen | `id_maintenance_kalibrasi` | — | 6 |
| `T-30` | `pivot_detail_alat_maintenance_kalibrasi` | Dokumen | `id_pivot_kalibrasi` | `id_maintenance_kalibrasi`, `id_detail_alat` | 6 |

---

## 3. Diagram Relasi

```text
A. IDENTITAS & OTORISASI
   peran ─1:N─ akun ─N:1─ pengguna ─1:1─ dosen ─N:1─ prodi ─N:1─ fakultas
                       │             └─1:1─ mahasiswa ─N:1─ prodi
                       └─N:1─ kredensial
   pengguna ─1:1─ eksternal ─N:1─ instansi
   eksternal ─N:1─ provinsi ─1:N─ kabupaten ─1:N─ kecamatan ─1:N─ kelurahan_desa

B. MASTER ASET (generalisasi → spesialisasi)
   barang ─1:1─ ruangan ──┐
          ├─1:1─ alat ────┼─1:N─ detail_alat
          ├─1:1─ bahan ────┤
          └─1:1─ mebeler ──┘

C. PENJADWALAN
   ruangan ─1:N─ jadwal_ruangan ─N:1─ mata_kuliah
                                └─N:1─ pengguna (penanggung jawab)

D. TRANSAKSI PEMINJAMAN
   pengguna ─1:N─ pengajuan_peminjaman
                     ├─1:N─ detail_pengajuan_peminjaman_alat ─N:1─ alat
                     │         └─1:N─ detail_unit_peminjaman_alat ─N:1─ detail_alat
                     └─1:N─ detail_pengajuan_peminjaman_ruangan ─N:1─ ruangan

E. DOKUMEN & PELAPORAN
   pengajuan_peminjaman ─1:1─ bebas_laboratorium
   ruangan ─1:N─ kegiatan_laboratorium
   maintenance_kalibrasi ─N:M─ detail_alat   (via pivot_detail_alat_maintenance_kalibrasi)
```

---

## 4. Kamus Data dan Data Dummy

### 4.1 Identitas & Otorisasi (`T-01` … `T-14`)

#### T-01 · `peran`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_peran` | BIGINT | PK, auto increment |
| `role` | VARCHAR(30) | Nama peran |

| `id_peran` | `role` |
| --- | --- |
| 1 | `admin` |
| 2 | `kalab` |
| 3 | `plp` |
| 4 | `dosen pendidikan fisika UNEJ` |
| 5 | `mahasiswa pendidikan fisika UNEJ` |
| 6 | `Eksternal (non pendidikan fisika UNEJ)` |

#### T-02 · `kredensial`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_kredensial` | BIGINT | PK, auto increment |
| `password` | VARCHAR(255) | Kata sandi ter-hash |

| `id_kredensial` | `password` |
| --- | --- |
| 1 | `&r2wife32eedd.` |
| 2 | `$2y$10$...` |
| 3 | `980fc$ddffe` |
| 4 | `0*p986mnnn` |
| 5 | `!r4667niidss` |
| 6 | `&r23j32eedd.` |
| 7 | `$2y$10$ww2..` |
| 8 | `980fc$1358fkkffe` |
| 9 | `0*p986mn6755nn` |
| 10 | `!r4667niy43dss` |

> ⚠️ Nilai di atas adalah **data dummy** untuk pengujian. Pada implementasi, kata sandi disimpan sebagai hash bcrypt (`$2y$10$...`) dan akun dummy boleh direset ke kata sandi uji yang disepakati.

#### T-03 · `fakultas`

| Kolom | Tipe |
| --- | --- |
| `id_fakultas` | BIGINT — PK, auto increment |
| `nama_fakultas` | VARCHAR(255) |

| `id_fakultas` | `nama_fakultas` |
| --- | --- |
| 1 | Fakultas Ilmu Pendidikan dan Keguruan |
| 2 | Fakultas Matematika dan Ilmu Pengetahuan Alam |
| 3 | Fakultas Teknik |
| 4 | Fakultas Teknologi Pertanian |

#### T-04 · `prodi`

| Kolom | Tipe |
| --- | --- |
| `id_prodi` | BIGINT — PK, auto increment |
| `id_fakultas` | BIGINT — FK → `fakultas.id_fakultas` |
| `nama_prodi` | VARCHAR(255) |

| `id_prodi` | `id_fakultas` | `nama_prodi` |
| --- | --- | --- |
| 1 | 1 | Pendidikan Fisika |
| 2 | 1 | Pendidikan Kimia |
| 3 | 1 | Pendidikan IPA |
| 4 | 3 | Teknik Elektro |

#### T-05 · `dosen`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_dosen` | BIGINT | PK, auto increment |
| `id_pengguna` | BIGINT | FK → `pengguna.id_pengguna` (implementasi: `user_id`) |
| `id_prodi` | BIGINT | FK → `prodi.id_prodi` |
| `id_fakultas` | BIGINT | FK → `fakultas.id_fakultas` |
| `nama_dosen` | VARCHAR(255) | — |
| `NIP/NIDN` | VARCHAR(32) | Unik — **string**, bukan integer |

| `id_dosen` | `id_pengguna` | `id_prodi` | `id_fakultas` | `nama_dosen` | `NIP/NIDN` |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | admin | 111111111110000000 |
| 2 | 2 | 2 | 1 | Dr. Ahmad Dahlan | 197503152005011002 |
| 3 | 3 | 3 | 1 | Siti Rahmawati, A.Md. | 199008202018012001 |
| 4 | 7 | 3 | 1 | Eko Prasetyo, M.Pd. | 198204122008121003 |
| 5 | 8 | 4 | 3 | Gusti Ayu | 19840403202010001 |

#### T-06 · `mahasiswa`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_mahasiswa` | BIGINT | PK, auto increment |
| `id_pengguna` | BIGINT | FK → `pengguna.id_pengguna` (implementasi: `user_id`) |
| `id_prodi` | BIGINT | FK → `prodi.id_prodi` |
| `id_fakultas` | BIGINT | FK → `fakultas.id_fakultas` |
| `nama_mahasiswa` | VARCHAR(255) | — |
| `NIM` | VARCHAR(20) | Unik — **string**, bukan integer |

| `id_mahasiswa` | `id_pengguna` | `id_prodi` | `id_fakultas` | `nama_mahasiswa` | `NIM` |
| --- | --- | --- | --- | --- | --- |
| 1 | 4 | 4 | 3 | Annisa Riska | 241910301065 |
| 2 | 5 | 2 | 1 | Nisa Anggita | 220210201043 |
| 3 | 9 | 1 | 1 | Maya Sari | 240210101004 |
| 4 | 10 | 1 | 1 | Nabila Rajwa | 230210201045 |

#### T-07 · `instansi`

| Kolom | Tipe |
| --- | --- |
| `id_instansi` | BIGINT — PK, auto increment |
| `nama_instansi` | VARCHAR(255) |

| `id_instansi` | `nama_instansi` |
| --- | --- |
| 1 | Politeknik Negeri Jember |
| 2 | SMAN 2 Lumajang |
| 3 | Universitas Muhammadiyah Jember |
| 4 | SMAN 1 Jember |
| 5 | SMAN 4 Jember |

#### T-08 · `provinsi`

| Kolom | Tipe |
| --- | --- |
| `id_provinsi` | BIGINT — PK, auto increment |
| `nama_provinsi` | VARCHAR(100) |

| `id_provinsi` | `nama_provinsi` |
| --- | --- |
| 1 | Jawa Timur |
| 2 | Jawa Barat |
| 3 | Jawa Tengah |
| 4 | Bali |
| 5 | Kalimantan Selatan |

#### T-09 · `kabupaten`

| Kolom | Tipe |
| --- | --- |
| `id_kabupaten` | BIGINT — PK, auto increment |
| `id_provinsi` | BIGINT — FK → `provinsi.id_provinsi` |
| `nama_kabupaten` | VARCHAR(100) |

| `id_kabupaten` | `id_provinsi` | `nama_kabupaten` |
| --- | --- | --- |
| 1 | 1 | Jember |
| 2 | 1 | Lumajang |
| 3 | 1 | Bondowoso |
| 4 | 3 | Solo |
| 5 | 2 | Bandung |

#### T-10 · `kecamatan`

| Kolom | Tipe |
| --- | --- |
| `id_kecamatan` | BIGINT — PK, auto increment |
| `id_kabupaten` | BIGINT — FK → `kabupaten.id_kabupaten` |
| `id_provinsi` | BIGINT — FK → `provinsi.id_provinsi` |
| `nama_kecamatan` | VARCHAR(100) |

| `id_kecamatan` | `id_kabupaten` | `id_provinsi` | `nama_kecamatan` |
| --- | --- | --- | --- |
| 1 | 1 | 1 | Sumbersari |
| 2 | 3 | 1 | Tegalampel |
| 3 | 2 | 1 | Rowokangkung |
| 4 | 4 | 3 | Banjarsari |
| 5 | 5 | 2 | Bandung Kulon |

#### T-11 · `kelurahan_desa`

| Kolom | Tipe |
| --- | --- |
| `id_kelurahandesa` | BIGINT — PK, auto increment |
| `id_kecamatan` | BIGINT — FK → `kecamatan.id_kecamatan` |
| `id_kabupaten` | BIGINT — FK → `kabupaten.id_kabupaten` |
| `id_provinsi` | BIGINT — FK → `provinsi.id_provinsi` |
| `nama_kelurahandesa` | VARCHAR(100) |

| `id_kelurahandesa` | `id_kecamatan` | `id_kabupaten` | `id_provinsi` | `nama_kelurahandesa` |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | Tegal Boto |
| 2 | 2 | 3 | 1 | Tanggulangin |
| 3 | 3 | 2 | 1 | Sidorejo |
| 4 | 4 | 4 | 3 | Keprabon |
| 5 | 5 | 5 | 2 | Gajah Mekar |

#### T-12 · `eksternal`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_eksternal` | BIGINT | PK, auto increment |
| `id_pengguna` | BIGINT | FK → `pengguna.id_pengguna` |
| `nama_eksternal` | VARCHAR(100) | — |
| `NIK` | VARCHAR(100) | Unik — **string**, bukan integer |
| `id_instansi` | BIGINT | FK → `instansi.id_instansi` |
| `alamat_lengkap` | VARCHAR(255) | — |
| `id_kelurahandesa` | BIGINT | FK → `kelurahan_desa.id_kelurahandesa` |
| `id_kecamatan` | BIGINT | FK → `kecamatan.id_kecamatan` |
| `id_kabupaten` | BIGINT | FK → `kabupaten.id_kabupaten` |
| `id_provinsi` | BIGINT | FK → `provinsi.id_provinsi` |

| `id_eksternal` | `id_pengguna` | `nama_eksternal` | `NIK` | `id_instansi` | `alamat_lengkap` | `kelurahan` | `kecamatan` | `kabupaten` | `provinsi` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 6 | Naraya Aqila | 3308062309060004 | 1 | Jalan Gajah Mada 97 | 4 | 4 | 4 | 3 |
| 2 | 11 | Alexandria | 3509052204090002 | 4 | Jalan Jawa VII | 1 | 1 | 1 | 1 |
| 3 | 12 | Scania | 3503062402070001 | 2 | Jalan Hayam Wuruk 132 | 2 | 2 | 3 | 1 |
| 4 | 13 | Muhammad Narendra | 3207082107060002 | 3 | Jalan Semeru 21 | 5 | 5 | 5 | 2 |

#### T-13 · `pengguna`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_pengguna` | BIGINT | PK, auto increment |
| `foto_profil` | VARCHAR(255) | *(Nullable)* |
| `foto_identitas` | VARCHAR(255) | *(Nullable)* |
| `email` | VARCHAR(255) | Unik |
| `no_telepon` | VARCHAR(20) | — |

| `id_pengguna` | `foto_profil` | `foto_identitas` | `email` | `no_telepon` |
| --- | --- | --- | --- | --- |
| 1 | admin.png | NULL | admin@unej.ac.id | 081234567890 |
| 2 | Dr. Ahmad Dahlan.png | NULL | kalab.fisika@unej.ac.id | 081234567891 |
| 3 | Siti Rahmawati, A.Md.png | NIDN_SitiRahmawati.png | plp.fisika@unej.ac.id | 081234567892 |
| 4 | annisariska.png | KTM_annisariska.png | annisa riska@unej.ac.id | 081234567893 |
| 5 | nisaanggita.png | KTM_nisaanggita.png | 220210201043@unej.ac.id | 081234567894 |
| 6 | narayaaqila.png | KTP_rianhidayat.png | narayaaqila@gmail.com | 081234567895 |
| 7 | ekoprasetyo.png | NIP_ekoprasetyo.png | ekoprasetyo@gmail.com | 082435873459 |
| 8 | gustiayu.png | NIPgustiayu.png | gustiayu@gmail.com | 0824356665431 |
| 9 | mayasari.png | NIM_mayasari.png | 240210101004@unej.ac.id | 085698125342 |
| 10 | nabilarajwa.png | NIM_nabilarajwa.png | 230210201045@unej.ac.id | 085643231112 |
| 11 | alexandria.png | NIK_alexandria.png | alexandria@gmail.com | 085467789922 |
| 12 | scania.png | NIK_scania.png | scania@gmail.com | 082456667122 |
| 13 | muhammadnarendra.png | NIK_muhammadnarendra.png | muhammadnarendra@gmail.com | 081876234511 |

#### T-14 · `akun`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_akun` | BIGINT | PK, auto increment |
| `id_pengguna` | BIGINT | FK → `pengguna.id_pengguna` |
| `id_peran` | BIGINT | FK → `peran.id_peran` |
| `id_kredensial` | BIGINT | FK → `kredensial.id_kredensial` |
| `status` | VARCHAR(10) | Enum: `active`, `blocked`, `suspended` — `suspended` berarti tidak dapat mengajukan peminjaman |
| `created_at` | DATETIME | — |
| `updated_at` | DATETIME | *(Nullable)* |
| `suspended_at` | DATETIME | *(Nullable)* |
| `alasan_suspended` | TEXT | *(Nullable)* |

| `id_akun` | `id_pengguna` | `id_peran` | `id_kredensial` | `status` | `created_at` | `updated_at` | `suspended_at` | `alasan_suspended` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | active | 2026-01-01 | 2026-01-01 | NULL | NULL |
| 2 | 2 | 2 | 2 | active | 2026-01-01 | 2026-01-01 | NULL | NULL |
| 3 | 3 | 3 | 3 | active | 2026-01-01 | 2026-01-01 | NULL | NULL |
| 4 | 4 | 6 | 4 | active | 2026-01-10 | 2026-01-10 | NULL | NULL |
| 5 | 5 | 5 | 5 | active | 2026-02-01 | 2026-02-01 | NULL | NULL |
| 6 | 6 | 6 | 4 | active | 2026-03-01 | 2026-03-01 | NULL | NULL |
| 7 | 7 | 4 | 6 | active | 2026-01-01 | 2026-01-01 | NULL | NULL |
| 8 | 8 | 6 | 7 | active | 2026-01-01 | 2026-01-01 | NULL | NULL |
| 9 | 9 | 4 | 10 | active | 2026-01-01 | 2026-01-01 | NULL | NULL |
| 10 | 10 | 4 | 9 | active | 2026-01-10 | 2026-01-10 | NULL | NULL |
| 11 | 11 | 6 | 8 | active | 2026-02-01 | 2026-02-01 | NULL | NULL |
| 12 | 12 | 6 | 8 | active | 2026-03-01 | 2026-03-01 | NULL | NULL |
| 13 | 13 | 6 | 2 | active | 2026-03-01 | 2026-03-01 | NULL | NULL |

> ⚠️ Perhatikan baris 7 (`id_pengguna` 7 = Eko Prasetyo, seorang Dosen) diberi `id_peran` 4 (Dosen) sedangkan baris 8 (`id_pengguna` 8 = Gusti Ayu) diberi `id_peran` 6 (Eksternal). Keduanya juga terdaftar di tabel `dosen` sebagai dosen. Perlu ditinjau ulang saat seed data resmi disusun.

---

### 4.2 Master Aset (`T-15` … `T-20`)

#### T-15 · `barang`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_barang` | BIGINT | PK, auto increment |
| `nama_barang` | VARCHAR(255) | — |
| `foto_barang` | VARCHAR(255) | — |
| `deskripsi_barang` | TEXT | — |
| `jenis_barang` | VARCHAR(10) | Enum: `alat`, `bahan`, `ruangan`, `mebeler` |

| `id_barang` | `nama_barang` | `foto_barang` | `deskripsi_barang` | `jenis_barang` |
| --- | --- | --- | --- | --- |
| 1 | Multimeter Digital | multimeter.jpg | Alat ukur tegangan dan arus presisi tinggi | Alat |
| 2 | Mikroskop Binokuler | mikroskop.jpg | Mikroskop perbesaran hingga 1000x | Alat |
| 3 | Osiloskop Digital | osiloskop.jpg | Pengukur sinyal gelombang listrik | Alat |
| 4 | Laser He-Ne | laser.jpg | Laser Helium-Neon untuk eksperimen optik | Alat |
| 5 | Jangka Sorong Digital | jangka.jpg | Alat ukur ketelitian 0.01 mm | Alat |
| 6 | Laboratorium Fisika Dasar | lab_fisdas.jpg | Dilengkapi projector & AC | Ruangan |
| 7 | Laboratorium Elektronika | lab_elka.jpg | Dilengkapi workbench oscilloscope | Ruangan |
| 8 | Laboratorium Fisika Lanjut | lab_fislan.jpg | 25 unit PC spesifikasi tinggi | Ruangan |
| 9 | Lab ELF | lab_anorg.jpg | Lemari asam terintegrasi | Ruangan |
| 10 | Asam Klorida (HCl) 1M | hcl.jpg | Asam Klorida dengan 1 Molaritas | Bahan |
| 11 | Kertas pH Indikator | ph.jpg | Kertas pH indikator untuk mengukur tingkat keasaman suatu zat | Bahan |
| 12 | Natrium Klorida (NaCl) | nacl.jpg | Senyawa kimia ionik dari natrium dan klorida dengan perbandingan 1:1 | Bahan |
| 13 | Alkohol 70% | alkohol.jpg | Cairan antiseptik medis yang efektif membunuh kuman, bakteri, dan virus pada luka ringan atau permukaan benda | Bahan |
| 14 | Tembaga(II) Sulfat | cuso4.jpg | Senyawa kimia anorganik berbentuk kristal biru terang (hidrat) atau bubuk putih (anhidrat) | Bahan |
| 15 | Meja Lab Kayu Jati | meja.jpg | – | Mebeler |
| 16 | Kursi Lab Putar | kursi.jpg | – | Mebeler |
| 17 | Lemari Alat Kaca | lemari.jpg | – | Mebeler |
| 18 | Papan Tulis Whiteboard | papan.jpg | – | Mebeler |
| 19 | Rak Besi Komponen | rak.jpg | – | Mebeler |
| 20 | Meja Dosen | meja_dsn.jpg | – | Mebeler |

> ⚠️ Pada dokumen asli, baris terakhir tertulis `id_barang` **17** ("Meja Dosen"). Karena 17 sudah dipakai "Lemari Alat Kaca", nilainya dikoreksi menjadi **20** (temuan C10). Perbaikan ini juga memengaruhi `T-20` baris 6.

#### T-16 · `ruangan`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_ruangan` | BIGINT | PK, auto increment |
| `id_barang` | BIGINT | FK → `barang.id_barang` |
| `kapasitas` | INT | — |
| `tarif_eksternal` | DECIMAL(12,2) | Default `0.00`, *(Nullable)* — diperlakukan sebagai tarif **Luar UNEJ** |
| `is_aktif` | BOOLEAN | Default `true` |

| `id_ruangan` | `id_barang` | `kapasitas` | `tarif_eksternal` | `is_aktif` |
| --- | --- | --- | --- | --- |
| 1 | 6 | 40 orang | 0.00 | true |
| 2 | 7 | 30 orang | 0.00 | true |
| 3 | 8 | 25 orang | 0.00 | true |
| 4 | 9 | 20 orang | 350000.00 | true |

#### T-17 · `alat`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_alat` | BIGINT | PK, auto increment |
| `id_barang` | BIGINT | FK → `barang.id_barang` |
| `tarif_eksternal_luar_unej` | DECIMAL(12,2) | Default `0.00` |
| `tarif_eksternal_internal_unej` | DECIMAL(12,2) | Tambahan pada implementasi ([BR-2](Business%20Rule.md#br-2--kategori-tarif-eksternal)) |

| `id_alat` | `id_barang` | `tarif_eksternal_luar_unej` |
| --- | --- | --- |
| 1 | 1 | 25000.00 |
| 2 | 2 | 40000.00 |
| 3 | 3 | 50000.00 |
| 4 | 4 | 35000.00 |
| 5 | 5 | 15000.00 |
| 6 | 6 | 45000.00 |

> ⚠️ Baris `id_alat` 6 mengacu ke `id_barang` 6 yang berjenis **Ruangan** ("Laboratorium Fisika Dasar"), bukan Alat. Baris ini juga tidak memiliki unit pada `T-18`. Perlu dikoreksi (temuan C10).

#### T-18 · `detail_alat`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_detail_alat` | BIGINT | PK, auto increment |
| `no_seri_unit` | VARCHAR(100) | Unik |
| `id_alat` | BIGINT | FK → `alat.id_alat` |
| `id_ruangan` | BIGINT | FK → `ruangan.id_ruangan` (lokasi penyimpanan) |
| `kondisi` | VARCHAR(30) | Enum: `baik`, `rusak` |
| `status` | VARCHAR(30) | Enum: `tersedia`, `tidak tersedia`, `sedang perbaikan` |
| `tahun_pengadaan` | VARCHAR(4) | Tahun |
| `sumber_dana` | VARCHAR(50) | Enum: `Hibah Penelitian`, `DIPA Unej` |
| `harga_beli` | DECIMAL(12,2) | *(Nullable)* |
| `catatan` | TEXT | *(Nullable)* |

| `id_detail_alat` | `no_seri_unit` | `id_alat` | `id_ruangan` | `kondisi` | `status` | `tahun` | `sumber_dana` | `harga_beli` | `catatan` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | MLT-001 | 1 | 1 | baik | tersedia | 2023 | DIPA Unej | 750000.00 | Berfungsi normal |
| 2 | MLT-002 | 1 | 4 | baik | tersedia | 2023 | DIPA Unej | 750000.00 | Berfungsi normal |
| 3 | MKS-001 | 2 | 2 | baik | tersedia | 2022 | Hibah Penelitian | 3500000.00 | Lensa bersih |
| 4 | OSK-001 | 3 | 3 | rusak | sedang perbaikan | 2021 | DIPA Unej | 5000000.00 | Probe rusak |
| 5 | LSR-001 | 4 | 4 | baik | tersedia | 2024 | DIPA Unej | 4200000.00 | Kalibrasi aktif |
| 6 | JNS-001 | 5 | 2 | baik | tidak tersedia | 2023 | DIPA Unej | 300000.00 | Baterai baru |

> Kolom `id_ruruangan` pada dokumen asli adalah salah ketik dan telah dikoreksi menjadi `id_ruangan` (temuan C10).

#### T-19 · `bahan`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_bahan` | BIGINT | PK, auto increment |
| `id_barang` | BIGINT | FK → `barang.id_barang` |
| `id_ruangan` | BIGINT | FK → `ruangan.id_ruangan` |
| `jumlah_awal` | INT | — |
| `jumlah_saat_ini` | INT | — |
| `satuan` | VARCHAR(50) | Gram, mL, Pcs, Botol, Pack |
| `tanggal_kadaluarsa` | DATE | *(Nullable)* |
| `status` | VARCHAR(30) | Enum: `aman`, `menipis`, `habis` |
| `catatan` | TEXT | *(Nullable)* |

| `id_bahan` | `id_barang` | `id_ruangan` | `jumlah_awal` | `jumlah_saat_ini` | `satuan` | `tanggal_kadaluarsa` | `status` | `catatan` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 10 | 3 | 5000 | 1200 | ml | 27-05-2027 | menipis | Sisa untuk 2 praktikum |
| 2 | 11 | 1 | 50 | 45 | pak | NULL | aman | Stok mencukupi |
| 3 | 12 | 2 | 2000 | 1800 | gram | 03-07-2027 | aman | Kemasan tersegel |
| 4 | 13 | 3 | 10000 | 0 | ml | NULL | habis | Perlu re-order |
| 5 | 14 | 4 | 1000 | 300 | gram | 31-12-2026 | menipis | Kristal biru bersih |

> Kolom `tanggal_kadaluarasa` pada dokumen asli adalah salah ketik dan telah dikoreksi menjadi `tanggal_kadaluarsa` (temuan C10).

#### T-20 · `mebeler`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_mebeler` | BIGINT | PK, auto increment |
| `id_barang` | BIGINT | FK → `barang.id_barang` |
| `id_ruangan` | BIGINT | FK → `ruangan.id_ruangan` |
| `no_seri_unit_mebeler` | VARCHAR(100) | Unik |
| `kondisi` | VARCHAR(30) | Enum: `baik`, `rusak`, `sedang perbaikan` |
| `tahun_pengadaan` | VARCHAR(4) | — |
| `sumber_dana` | VARCHAR(50) | Enum: `Hibah Penelitian`, `DIPA Unej` |
| `harga_beli` | DECIMAL(12,2) | *(Nullable)* |
| `catatan` | TEXT | *(Nullable)* |

| `id_mebeler` | `id_barang` | `id_ruangan` | `no_seri_unit_mebeler` | `kondisi` | `tahun` | `sumber_dana` | `harga_beli` | `catatan` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 15 | 4 | MBL-MJK | baik | 2020 | DIPA Unej | 1200000.00 | Tahan zat kimia |
| 2 | 16 | 2 | MBL-KRS | rusak | 2020 | DIPA Unej | 350000.00 | Roda macet |
| 3 | 17 | 1 | MBL-LMR | baik | 2019 | DIPA Unej | 2500000.00 | Kunci aman |
| 4 | 18 | 2 | MBL-PBN | baik | 2021 | DIPA Unej | 600000.00 | Bersih |
| 5 | 19 | 3 | MBL-RAK | sedang perbaikan | 2018 | DIPA Unej | 1500000.00 | Engsel las ulang |
| 6 | 20 | 4 | MBL-MJD | baik | 2022 | DIPA Unej | 1800000.00 | Sangat baik |

---

### 4.3 Penjadwalan (`T-21` … `T-22`)

#### T-21 · `mata_kuliah`

| Kolom | Tipe |
| --- | --- |
| `id_matakuliah` | BIGINT — PK, auto increment |
| `nama_mata_kuliah` | VARCHAR(255) |

| `id_matakuliah` | `nama_mata_kuliah` |
| --- | --- |
| 1 | Fisika Dasar I |
| 2 | Optika Modern |
| 3 | Elektronika Analog |
| 4 | Simulasi Fisika |
| 5 | Praktikum Gelombang |
| 6 | Kimia Fisika |

#### T-22 · `jadwal_ruangan`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_jadwal_ruangan` | BIGINT | PK, auto increment |
| `id_ruangan` | BIGINT | FK → `ruangan.id_ruangan` |
| `id_matakuliah` | BIGINT | FK → `mata_kuliah.id_matakuliah` |
| `id_pengguna` | BIGINT | FK → `pengguna.id_pengguna` (penanggung jawab) |
| `hari` | VARCHAR(10) | Enum: `Senin` … `Minggu` |
| `jam_mulai` | TIME | — |
| `jam_selesai` | TIME | — |
| `is_aktif` | BOOLEAN | Default `true` |

| `id_jadwal_ruangan` | `id_ruangan` | `id_matakuliah` | `id_pengguna` | `hari` | `jam_mulai` | `jam_selesai` | `is_aktif` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 8 | Senin | 08:00:00 | 10:30:00 | true |
| 2 | 3 | 2 | 7 | Rabu | 13:00:00 | 15:30:00 | true |
| 3 | 2 | 3 | 3 | Selasa | 09:30:00 | 12:00:00 | true |
| 4 | 3 | 4 | 7 | Kamis | 08:00:00 | 11:00:00 | true |
| 5 | 1 | 5 | 8 | Jumat | 13:30:00 | 16:00:00 | true |
| 6 | 4 | 6 | 3 | Selasa | 13:00:00 | 15:00:00 | true |

> ⚠️ Tabel ini menyimpan **jadwal reguler**. Jadwal berbasis tanggal diturunkan dari transaksi `detail_pengajuan_peminjaman_ruangan` yang berstatus disetujui/dipinjam.

---

### 4.4 Transaksi Peminjaman (`T-23` … `T-26`)

#### T-23 · `pengajuan_peminjaman`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_pengajuan_peminjaman` | BIGINT | PK, auto increment |
| `id_pengguna` | BIGINT | FK → `pengguna.id_pengguna` |
| `jenis_peminjaman` | VARCHAR(30) | Enum: `internal`, `eksternal` |
| `total_biaya` | DECIMAL(12,2) | *(Nullable)*, default `0.00` |
| `bukti_pembayaran` | VARCHAR(255) | *(Nullable)* |
| `status_keseluruhan` | VARCHAR(20) | Enum: `menunggu`, `disetujui`, `ditolak`, `dipinjam`, `terlambat`, `selesai` |
| `tanggal_peminjaman` | DATETIME | — |

| `id` | `id_pengguna` | `jenis_peminjaman` | `total_biaya` | `bukti_pembayaran` | `status_keseluruhan` | `tanggal_peminjaman` |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 | internal | 0.00 | NULL | selesai | 2026-09-05 |
| 2 | 6 | eksternal | 80000.00 | bukti_1.jpg | dipinjam | 2026-09-05 |
| 3 | 10 | internal | 0.00 | NULL | disetujui | 2026-09-06 |
| 4 | 8 | eksternal | 0.00 | bukti_2.jpg | menunggu | 2026-09-06 |
| 5 | 11 | eksternal | 400000.00 | bukti_3.jpg | disetujui | 2026-09-07 |
| 6 | 3 | internal | 0.00 | NULL | ditolak | 2026-09-07 |

#### T-24 · `detail_pengajuan_peminjaman_ruangan`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_detail_pengajuan_peminjaman_ruangan` | BIGINT | PK, auto increment |
| `id_pengajuan_peminjaman` | BIGINT | FK → `pengajuan_peminjaman` |
| `id_ruangan` | BIGINT | FK → `ruangan.id_ruangan` *(Nullable)* |
| `waktu_mulai` | DATETIME | — |
| `waktu_selesai` | DATETIME | — |
| `harga_per_item` | DECIMAL(12,2) | Default `0.00` |
| `total_biaya_per_item` | DECIMAL(12,2) | Default `0.00` |
| `status_item` | VARCHAR(20) | Enum: `menunggu`, `disetujui`, `ditolak`, `selesai` |
| `alasan_penolakan` | TEXT | *(Nullable)* |

| `id` | `id_pengajuan` | `id_ruangan` | `waktu_mulai` | `waktu_selesai` | `harga_per_item` | `total_biaya_per_item` | `status_item` | `alasan_penolakan` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 1 | 2026-09-09 10:00 | 2026-09-09 14:00 | 0.00 | 0.00 | menunggu | NULL |
| 2 | 5 | 2 | 2026-09-10 08:00 | 2026-09-10 17:00 | 400000.00 | 400000.00 | disetujui | NULL |

#### T-25 · `detail_pengajuan_peminjaman_alat`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_detail_pengajuan_peminjaman_alat` | BIGINT | PK, auto increment |
| `id_pengajuan_peminjaman` | BIGINT | FK → `pengajuan_peminjaman` |
| `id_alat` | BIGINT | FK → `alat.id_alat` *(Nullable)* |
| `waktu_mulai` | DATETIME | — |
| `waktu_selesai` | DATETIME | — |
| `jumlah_item` | INT | Default `1` |
| `harga_per_item` | DECIMAL(12,2) | Default `0.00` |
| `total_biaya_per_item` | DECIMAL(12,2) | Default `0.00` |
| `status_item` | VARCHAR(20) | Enum: `menunggu`, `disetujui`, `dipinjam`, `ditolak`, `selesai` |
| `alasan_penolakan` | TEXT | *(Nullable)* |

| `id` | `id_pengajuan` | `id_alat` | `waktu_mulai` | `waktu_selesai` | `jumlah_item` | `harga_per_item` | `total_biaya_per_item` | `status_item` | `alasan_penolakan` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 2026-09-05 08:00 | 2026-09-05 16:00 | 2 | 0.00 | 0.00 | selesai | NULL |
| 2 | 2 | 2 | 2026-09-06 08:00 | 2026-09-07 16:00 | 1 | 40000.00 | 80000.00 | disetujui | NULL |
| 3 | 4 | 3 | 2026-09-08 09:00 | 2026-09-08 12:00 | 1 | 80000.00 | 0.00 | disetujui | NULL |
| 4 | 5 | 4 | 2026-09-09 10:00 | 2026-09-09 14:00 | 1 | 80000.00 | 0.00 | menunggu | NULL |
| 5 | 6 | 5 | 2026-09-08 08:00 | 2026-09-08 12:00 | 5 | 0.00 | 0.00 | ditolak | Stok tidak cukup |

> ⚠️ Baris 3 dan 4 memiliki `harga_per_item` > 0 namun `total_biaya_per_item` = 0.00. Pada transaksi internal nilai tarif memang 0; namun bila baris tersebut milik transaksi eksternal, kalkulasi biaya perlu ditinjau (temuan C11 terkait konsistensi biaya).

#### T-26 · `detail_unit_peminjaman_alat`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_detail_unit_peminjaman_alat` | BIGINT | PK, auto increment |
| `id_detail_pengajuan_peminjaman_alat` | BIGINT | FK → `detail_pengajuan_peminjaman_alat` |
| `id_detail_alat` | BIGINT | FK → `detail_alat.id_detail_alat` |
| `kondisi_kembali` | VARCHAR(20) | Enum: `baik`, `rusak`, `hilang` *(Nullable)* |
| `bukti_pengembalian` | VARCHAR(255) | — |
| `tanggal_pengembalian` | DATETIME | *(Nullable)* |
| `catatan` | TEXT | *(Nullable)* |

| `id` | `id_detail_pengajuan_peminjaman_alat` | `id_detail_alat` | `kondisi_kembali` | `tanggal_pengembalian` | `bukti_pengembalian` | `catatan` |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | baik | 2026-09-05 15:45:00 | buktiPemgebalian.png | dikembalikan tepat waktu |
| 2 | 1 | 2 | baik | 2026-09-05 15:45:00 | buktiPemgebalian1.png | dikembalikan lebih cepat |
| 3 | 2 | 3 | NULL | NULL | NULL | NULL |
| 4 | 3 | 4 | NULL | NULL | NULL | NULL |

---

### 4.5 Dokumen & Pelaporan (`T-27` … `T-30`)

#### T-27 · `bebas_laboratorium`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_bebas_laboratorium` | BIGINT | PK, auto increment |
| `id_pengajuan` | BIGINT | FK → `pengajuan_peminjaman.id_pengajuan_peminjaman` |
| `nomor_surat` | VARCHAR(100) | Unik |
| `diterbitkan_pada` | DATETIME | — |

| `id_bebas_laboratorium` | `id_pengajuan` | `nomor_surat` | `diterbitkan_pada` |
| --- | --- | --- | --- |
| 1 | 4 | SKBL/FKIP/2026/001 | 2026-09-05 16:00:00 |
| 2 | 5 | SKBL/FKIP/2026/002 | 2026-09-05 16:30:00 |
| 3 | 9 | SKBL/FKIP/2026/003 | 2026-09-06 09:15:00 |
| 4 | 10 | SKBL/FKIP/2026/004 | 2026-09-06 11:20:00 |

> ⚠️ Dokumen asli menyatakan `id_pengajuan` sebagai FK ke `data_pengguna.id_pengguna`, padahal nilai datanya (4, 5, 9, 10) mengacu pada **nomor pengajuan**. Telah dikoreksi menjadi FK ke `pengajuan_peminjaman` (temuan C11). Mohon diverifikasi karena nilai 9 dan 10 juga tidak terdapat pada `T-23`.

#### T-28 · `kegiatan_laboratorium`

| Kolom | Tipe |
| --- | --- |
| `id_kegiatan_laboratorium` | BIGINT — PK, auto increment |
| `id_ruangan` | BIGINT — FK → `ruangan.id_ruangan` |
| `judul` | VARCHAR(255) |
| `jenis_kegiatan` | VARCHAR(100) |
| `deskripsi` | TEXT |
| `path_berkas` | VARCHAR(255) |
| `waktu_kegiatan` | DATETIME |

| `id` | `id_ruangan` | `judul` | `jenis_kegiatan` | `deskripsi` | `path_berkas` | `waktu_kegiatan` |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | Workshop Instrumentasi Fisika | Pelatihan | Pelatihan dasar penggunaan osiloskop bagi mahasiswa baru | Workshop.png | 2026-10-12 09:00:00 |
| 2 | 1 | Kuliah Tamu Optika Modern | Kuliah Umum | Pemaparan dari peneliti LIPI terkait laser | poster_2.png | 2026-10-20 13:00:00 |
| 3 | 3 | Sertifikasi K3 Laboratorium | Sertifikasi | Uji kompetensi K3 bagi asisten lab | panduan_3.pdf | 2026-11-01 08:00:00 |
| 4 | 2 | Maintenance Alat Bulanan | Pemeliharaan | Kalibrasi tahunan seluruh alat ukur digital | jadwal_4.pdf | 2026-11-15 08:00:00 |
| 5 | 4 | Lomba Karya Tulis Fisika | Kompetisi | Ajang kompetisi riset antar mahasiswa FKIP | juknis_5.pdf | 2026-12-05 08:00:00 |
| 6 | 4 | Inventarisasi Bahan B3 | Stock Opname | Pengecekan sisa stok bahan kimia berbahaya | berkas_6.pdf | 2026-12-20 09:00:00 |

#### T-29 · `maintenance_kalibrasi`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id_maintenance_kalibrasi` | BIGINT | PK, auto increment |
| `jenis_tindakan` | VARCHAR(20) | Enum: `maintenance`, `kalibrasi` |
| `nomor_surat` | VARCHAR(100) | — |
| `tanggal_surat` | DATE | — |
| `path_berkas` | VARCHAR(255) | — |
| `catatan` | VARCHAR(255) | *(Nullable)* |

| `id` | `jenis_tindakan` | `nomor_surat` | `tanggal_surat` | `path_berkas` | `catatan` |
| --- | --- | --- | --- | --- | --- |
| 1 | kalibrasi | 045/KAL/SUF/III/2026 | 2026-03-01 | uploads/kalibrasi/cert_045_2026.pdf | Kalibrasi alat ukur presisi tinggi (multimeter) |
| 2 | maintenance | 112/SP/TEK-JBR/III/2026 | 2026-03-15 | uploads/maintenance/srv_112_2026.pdf | Servis pembersihan dan ganti lensa mikroskop |
| 3 | kalibrasi | 089/KAL/SUF/IV/2026 | 2026-04-05 | uploads/kalibrasi/cert_089_2026.pdf | Kalibrasi tahunan osiloskop digital |
| 4 | maintenance | 204/MNT/LAB-UT/IV/2026 | 2026-04-20 | uploads/maintenance/srv_204_2026.pdf | Perbaikan Jangka Sorong Digital |
| 5 | kalibrasi | 120/KAL/KMI/V/2026 | 2026-05-10 | uploads/kalibrasi/cert_120_2026.pdf | Rekalibrasi berkala Laser He-Ne |
| 6 | maintenance | 055/SP/TEK-JBR/V/2026 | 2026-05-25 | uploads/maintenance/srv_055_2026.pdf | Penggantian komponen modul sensor yang aus |

#### T-30 · `pivot_detail_alat_maintenance_kalibrasi`

| Kolom | Tipe |
| --- | --- |
| `id_pivot_kalibrasi` | BIGINT — PK, auto increment |
| `id_maintenance_kalibrasi` | BIGINT — FK → `maintenance_kalibrasi` |
| `id_detail_alat` | BIGINT — FK → `detail_alat` |

| `id_pivot_kalibrasi` | `id_maintenance_kalibrasi` | `id_detail_alat` |
| --- | --- | --- |
| 1 | 1 | 1 |
| 2 | 1 | 2 |
| 3 | 2 | 3 |
| 4 | 3 | 4 |
| 5 | 4 | 6 |
| 6 | 5 | 5 |

---

## 5. Catatan Perbaikan & Inkonsistensi Data

| # | Butir | Temuan | Tindakan |
| --- | --- | --- | --- |
| D1 | `detail_alat.id_ruruangan` | Salah ketik | Dikoreksi menjadi `id_ruangan` |
| D2 | `bahan.tanggal_kadaluarasa` | Salah ketik | Dikoreksi menjadi `tanggal_kadaluarsa` |
| D3 | `kelurahan_desa` | Dokumen memakai dua penamaan berbeda: `id_kelurahandesa` dan `id_keluruhandesa` | Diseragamkan menjadi `id_kelurahandesa` |
| D4 | `barang.id_barang` = 17 ganda ("Lemari Alat Kaca" dan "Meja Dosen") | Pelanggaran kunci utama | "Meja Dosen" dinomori **20**; `mebeler` baris 6 disesuaikan |
| D5 | `alat.id_alat` = 6 → `id_barang` 6 | `barang` 6 berjenis **Ruangan**, bukan Alat | Perlu dikoreksi pada data resmi |
| D6 | `bebas_laboratorium.id_pengajuan` | Dinyatakan FK ke `pengguna`, padahal berisi nomor pengajuan; nilai 9 dan 10 tidak ada di `pengajuan_peminjaman` | FK dikoreksi ke `pengajuan_peminjaman`; data perlu dilengkapi |
| D7 | `akun` baris 7 dan 8 | Dosen (Eko Prasetyo) diberi peran Dosen, tetapi Gusti Ayu yang juga terdaftar sebagai dosen diberi peran Eksternal | Tinjau ulang saat menyusun seed data |
| D8 | `detail_pengajuan_peminjaman_alat` baris 3 dan 4 | `harga_per_item` > 0 namun `total_biaya_per_item` = 0.00 | Tinjau ulang logika kalkulasi biaya |
| D9 | `peran` baris 4–6 | Nilai peran memuat deskripsi panjang (`dosen pendidikan fisika UNEJ`) | Implementasi memakai kode ringkas (`dosen`, `mhs`, `ekst`) — lihat [Architecture §7.1](Architecture.md#71-enam-peran-tunggal) |
| D10 | Struktur `akun` + `pengguna` + `kredensial` | Implementasi telah menggabungkannya ke tabel `users` | Lihat [Architecture §8.3](Architecture.md#83-pemetaan-istilah-dokumen--implementasi) (temuan C9) |

> **Catatan normalisasi.** Penggabungan `pengguna`, `akun`, dan `kredensial` pada implementasi **tidak melanggar 3NF** karena setiap atribut tetap bergantung pada satu kunci utama (`users.id`). Dokumen ini mempertahankan bentuk konseptual agar tetap sejalan dengan rancangan awal dan kebutuhan pelaporan akademik.
