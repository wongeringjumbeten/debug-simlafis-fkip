# Business Requirements — SIMLAFIS

> Daftar kebutuhan bisnis per peran pengguna.

| Atribut | Nilai |
| --- | --- |
| Versi | 2.0 |
| Fase | Sprint 1 |
| Format ID | `<KODE PERAN>-<nomor>` (contoh: `ADM-04`) |
| Dokumen terkait | [Business Rule](Business%20Rule.md) · [System Features](System%20Features.md) · [Overall Description](Overall%20Description.md) · [User Story](user%20story.md) |

## Daftar Isi

1. [Konvensi & Ringkasan Peran](#1-konvensi--ringkasan-peran)
2. [Guest / Calon Pengguna Publik (PUB)](#2-guest--calon-pengguna-publik-pub)
3. [Admin (ADM)](#3-admin-adm)
4. [Kepala Laboratorium (KLB)](#4-kepala-laboratorium-klb)
5. [Pranata Laboratorium Pendidikan (PLP)](#5-pranata-laboratorium-pendidikan-plp)
6. [Dosen (DSN)](#6-dosen-dsn)
7. [Mahasiswa (MHS)](#7-mahasiswa-mhs)
8. [Eksternal (EKS)](#8-eksternal-eks)
9. [Matriks Fitur × Peran](#9-matriks-fitur--peran)

---

## 1. Konvensi & Ringkasan Peran

**Kode peran (6 peran tunggal — lihat [BR-6](Business%20Rule.md#br-6--eksklusivitas-peran-role)):** `ADMIN`, `KALAB`, `PLP`, `DOSEN`, `MHS` (Mahasiswa), `EKST` (Eksternal).

| Kode | Peran | Kelompok | Otoritas utama | Jumlah kebutuhan |
| --- | --- | --- | --- | --- |
| `PUB` | Guest / Calon Pengguna | Publik | Baca informasi & katalog | 3 |
| `ADM` | Admin | Pengelola | Seluruh pengaturan, data, dan akun | 26 |
| `KLB` | Kepala Laboratorium | Pengelola | Persetujuan, pengawasan, pelaporan | 11 |
| `PLP` | Pranata Laboratorium Pendidikan | Pengelola | Operasional harian, inventaris, jadwal, loket | 13 |
| `DSN` | Dosen | Peminjam internal | Peminjaman tanpa tarif | 9 |
| `MHS` | Mahasiswa | Peminjam internal | Peminjaman tanpa tarif + bebas lab | 7 |
| `EKS` | Eksternal | Peminjam berbayar | Peminjaman berbayar (`internal_unej` / `luar_unej`) | 8 |

> **Kategori tarif bukan peran.** `eksternal_internal_unej` dan `eksternal_luar_unej` adalah **atribut** pada akun berperan `eksternal`, bukan peran tambahan ([BR-2](Business%20Rule.md#br-2--kategori-tarif-eksternal)).

> ⚠️ **Catatan inkonsistensi dokumen asli (C6).** Dokumen asli mencantumkan "Fitur Register" untuk peran internal (KaLab, PLP, Dosen), padahal [BR-1](Business%20Rule.md#br-1--otoritas-manajemen-akun) menyatakan akun pengelola dibuat terpusat oleh Admin. Keputusan yang berlaku (tercatat di `docs/srs-decisions.md`): **registrasi mandiri hanya untuk Mahasiswa, Dosen, dan Eksternal**; akun Admin, KaLab, dan PLP dibuat oleh Admin. Dokumen ini mengikuti keputusan tersebut.

---

## 2. Guest / Calon Pengguna Publik (PUB)

**Deskripsi:** pengguna tanpa autentikasi — masyarakat umum, calon peneliti eksternal, serta mahasiswa/dosen yang belum login.

| ID | Kebutuhan | Rujukan |
| --- | --- | --- |
| `PUB-01` | Melihat homepage: informasi umum operasional dan deskripsi layanan laboratorium, profil 4 unit lab (Fisika Dasar, Elektronika, Fisika Lanjut, ELF) | [REQ-30](System%20Features.md#req-30--halaman-informasi-statik), [PR-01](sprint1.md#pr-01--akses-publik--homepage) |
| `PUB-02` | Melihat katalog alat dan ruangan beserta spesifikasi dan tarif layanan sewa; mencari berdasarkan kata kunci atau unit laboratorium; melihat kalender ketersediaan ruangan (Available/Booked) | [REQ-09](System%20Features.md#req-09--pencarian-katalog), [REQ-10](System%20Features.md#req-10--stok-dinamis) |
| `PUB-03` | Melihat prosedur peminjaman, ringkasan persyaratan, dokumen SOP, FAQ, alamat loket, jam operasional, serta kontak WhatsApp/email PLP; diarahkan ke Login/Registrasi saat menekan tombol "Pinjam" atau "Tambah ke Keranjang" | [REQ-30](System%20Features.md#req-30--halaman-informasi-statik), [BR-7](Business%20Rule.md#br-7--ketersediaan-informasi-publik) |

---

## 3. Admin (ADM)

**Otoritas penuh:** seluruh pengaturan dan data. Bertanggung jawab atas stabilitas data pengguna, hak akses operasional, serta intervensi/override persetujuan bila KaLab berhalangan.

### 3.1 Autentikasi & Profil

| ID | Kebutuhan |
| --- | --- |
| `ADM-01` | Login dan lupa password |
| `ADM-02` | Melihat profil, mengubah profil, mengubah password (dengan verifikasi password lama) |
| `ADM-03` | Logout |

### 3.2 Dashboard Admin

| ID | Kebutuhan |
| --- | --- |
| `ADM-04` | **Khusus Admin** — melihat akumulasi pendapatan dari peminjaman alat dan ruangan |
| `ADM-05` | Melihat total pengajuan per status (Seluruh / Pending / Disetujui / Ditolak / Sedang Dipinjam) untuk peminjaman alat dan ruangan |
| `ADM-06` | Melihat grafik batang rekapitulasi statistik peminjaman alat dan ruangan secara bulanan |
| `ADM-07` | Menampilkan 10 pengajuan peminjaman terbaru (alat dan ruangan) |

### 3.3 Manajemen Data Pengguna

| ID | Kebutuhan |
| --- | --- |
| `ADM-08` | Membuat data pengguna untuk semua peran ([BR-1](Business%20Rule.md#br-1--otoritas-manajemen-akun)) |
| `ADM-09` | Melihat daftar pengguna (dengan pencarian dan filter peran) serta mengubah data pengguna |
| `ADM-10` | Mengubah status hak akses pengguna: mengaktifkan, menangguhkan (membatasi akses peminjaman), atau membuka blokir (unblock) — [BR-3](Business%20Rule.md#br-3--sanksi-penangguhan-akses), [REQ-06](System%20Features.md#req-06--kewenangan-admin-membuka-blokir) |

### 3.4 Katalog Laboratorium

| ID | Kebutuhan |
| --- | --- |
| `ADM-11` | Membuat, melihat, dan mengubah katalog alat beserta layanan tarif dan ketersediaannya |
| `ADM-12` | Membuat, melihat, dan mengubah katalog ruangan beserta layanan tarif dan ketersediaannya |
| `ADM-13` | Melihat data bahan dan ketersediaannya (baca saja) |
| `ADM-14` | Melihat data mebeler (baca saja) |

### 3.5 Persetujuan (*Item-Level Approval*)

| ID | Kebutuhan |
| --- | --- |
| `ADM-15` | Melihat status seluruh pengajuan peminjaman |
| `ADM-16` | Menyetujui atau menolak item alat dan item ruangan secara independen per item, termasuk memeriksa status pembayaran dan mengisi alasan bila ditolak — [BR-4](Business%20Rule.md#br-4--hierarki-otoritas--persetujuan-parsial) |

### 3.6 Riwayat Peminjaman

| ID | Kebutuhan |
| --- | --- |
| `ADM-17` | Melihat status dan riwayat seluruh peminjaman |
| `ADM-18` | Mengubah status pengajuan alat/ruangan dan mencatat ID unit alat yang dipinjam |
| `ADM-19` | Mengunduh Laporan Inventarisasi |

### 3.7 Validasi Pengembalian

| ID | Kebutuhan |
| --- | --- |
| `ADM-20` | Melihat daftar alat yang sedang dipinjam |
| `ADM-21` | Mengubah data pengembalian (kondisi fisik: Baik/Rusak) dan memicu blokir akun otomatis jika terlambat — [REQ-21](System%20Features.md#req-21--sanksi-otomatis) |

### 3.8 Pengecekan Bebas Laboratorium

| ID | Kebutuhan |
| --- | --- |
| `ADM-22` | Melihat daftar mahasiswa yang memiliki tunggakan lab |

### 3.9 Dokumentasi

| ID | Kebutuhan |
| --- | --- |
| `ADM-23` | Melihat dan mengunduh Laporan Maintenance dan Kalibrasi |
| `ADM-24` | Melihat Dokumentasi Kegiatan |
| `ADM-25` | Mengunduh Laporan Keuangan / Laporan Pendapatan Transaksi |

### 3.10 Prosedur (SOP)

| ID | Kebutuhan |
| --- | --- |
| `ADM-26` | Melihat Prosedur Tata Kelola Sistem dan FAQ |

---

## 4. Kepala Laboratorium (KLB)

**Otoritas:** persetujuan, pengawasan, dan pelaporan. **Tidak** mengelola master data.

### 4.1 Autentikasi & Profil

| ID | Kebutuhan |
| --- | --- |
| `KLB-01` | Login, lupa password, melihat/mengubah profil, mengubah password, logout |

### 4.2 Dashboard KaLab

| ID | Kebutuhan |
| --- | --- |
| `KLB-02` | Setara `ADM-05`, `ADM-06`, `ADM-07` (total per status, grafik bulanan, 10 pengajuan terbaru) — **tanpa** akumulasi pendapatan |

### 4.3 Katalog Laboratorium (baca saja)

| ID | Kebutuhan |
| --- | --- |
| `KLB-03` | Melihat katalog alat dan ketersediaannya |
| `KLB-04` | Melihat jadwal penggunaan ruangan lab |
| `KLB-05` | Melihat data bahan dan ketersediaannya |
| `KLB-06` | Melihat data mebeler |

### 4.4 Persetujuan Peminjaman

| ID | Kebutuhan |
| --- | --- |
| `KLB-07` | Setara `ADM-15` dan `ADM-16` — melihat status pengajuan, menyetujui/menolak per item, memeriksa transaksi pembayaran, dan mengisi alasan penolakan. KaLab adalah **primary approver** |

### 4.5 Riwayat Peminjaman

| ID | Kebutuhan |
| --- | --- |
| `KLB-08` | Melihat riwayat peminjaman alat dan ruangan yang telah diproses |
| `KLB-09` | Mengunduh Laporan Inventarisasi |

### 4.6 Dokumentasi

| ID | Kebutuhan |
| --- | --- |
| `KLB-10` | Melihat dan mengunduh Laporan Maintenance/Kalibrasi, melihat Dokumentasi Kegiatan, mengunduh Laporan Keuangan |

### 4.7 Prosedur (SOP)

| ID | Kebutuhan |
| --- | --- |
| `KLB-11` | Melihat Prosedur Otorisasi & Pengawasan Lab beserta FAQ |

> ⚠️ **Temuan C4.** Komentar pada `routes/web.php` merujuk halaman prosedur sebagai `KLB-10`, sedangkan dokumen ini menetapkan `KLB-11`. Perlu disamakan.

---

## 5. Pranata Laboratorium Pendidikan (PLP)

**Otoritas operasional:** master data, jadwal, sirkulasi, dokumentasi, dan transaksi serah-terima di loket.

### 5.1 Autentikasi & Profil

| ID | Kebutuhan |
| --- | --- |
| `PLP-01` | Login, lupa password, melihat/mengubah profil, mengubah password, logout |

### 5.2 Dashboard PLP

| ID | Kebutuhan |
| --- | --- |
| `PLP-02` | Setara `KLB-02` (total per status, grafik bulanan, 10 pengajuan terbaru) |

### 5.3 Katalog Laboratorium

| ID | Kebutuhan |
| --- | --- |
| `PLP-03` | Membuat dan mengubah data katalog alat (termasuk registrasi unit fisik `detail_alat`); melihat katalog dan ketersediaannya |
| `PLP-04` | Membuat, melihat, dan mengubah Jadwal Ruangan — jadwal praktikum reguler dengan pemeriksaan anti-bentrok ([REQ-14](System%20Features.md#req-14--anti-collision-jadwal)) |
| `PLP-05` | Membuat, melihat, dan mengubah data bahan beserta ketersediaannya |
| `PLP-06` | Membuat, melihat, dan mengubah data mebeler |

> ⚠️ **Temuan C3.** Komentar di `app/Http/Controllers/InventoryController.php` merujuk `PLP-07`/`PLP-08` untuk data bahan dan `PLP-09`/`PLP-10` untuk data mebeler, bukan `PLP-05`/`PLP-06`. Salah satu sisi harus diperbaiki.

### 5.4 Riwayat Peminjaman

| ID | Kebutuhan |
| --- | --- |
| `PLP-07` | Melihat status dan riwayat peminjaman |
| `PLP-08` | Mengubah status pengajuan — **hanya untuk item yang sudah disetujui** (transisi Disetujui → Dipinjam/Diserahkan); mencatat ID unit alat yang dipinjam |

### 5.5 Validasi Pengembalian

| ID | Kebutuhan |
| --- | --- |
| `PLP-09` | Melihat daftar alat yang dipinjam; mengubah data pengembalian (kondisi Baik/Rusak/Hilang) dan memicu penangguhan akun jika terlambat ([REQ-21](System%20Features.md#req-21--sanksi-otomatis)) |

### 5.6 Pengecekan Bebas Laboratorium

| ID | Kebutuhan |
| --- | --- |
| `PLP-10` | Melihat daftar mahasiswa yang memiliki tunggakan lab |

### 5.7 Dokumentasi

| ID | Kebutuhan |
| --- | --- |
| `PLP-11` | Membuat dan melihat Dokumentasi Kegiatan |
| `PLP-12` | Mengunggah, melihat, dan mengunduh Laporan Maintenance/Kalibrasi |

### 5.8 Prosedur (SOP)

| ID | Kebutuhan |
| --- | --- |
| `PLP-13` | Melihat Prosedur Operasional Fisik & Maintenance beserta FAQ |

---

## 6. Dosen (DSN)

**Otoritas:** peminjam internal tanpa label tarif.

### 6.1 Autentikasi & Profil

| ID | Kebutuhan |
| --- | --- |
| `DSN-01` | Login, lupa password, melihat/mengubah profil, mengubah password, logout. Registrasi mandiri tersedia ([BR-1](Business%20Rule.md#br-1--otoritas-manajemen-akun)) |

### 6.2 Dashboard Dosen

| ID | Kebutuhan |
| --- | --- |
| `DSN-02` | Setara `KLB-02` tetapi **cakupan data milik sendiri** (pengajuan aktif, status terkini, notifikasi pengembalian, tautan cepat) |

### 6.3 Katalog Laboratorium & Keranjang Sesi (*Cart*)

| ID | Kebutuhan |
| --- | --- |
| `DSN-03` | Melihat katalog alat dan ketersediaannya |
| `DSN-04` | Melihat jadwal penggunaan ruangan lab |
| `DSN-05` | Menambahkan item (alat/ruangan) beserta tanggal, jam, dan jumlah ke keranjang sesi sementara melalui modal pop-up; melihat dan menghapus item di keranjang. Keranjang 2 tab: Tab 1 Alat, Tab 2 Ruangan ([REQ-13](System%20Features.md#req-13--temporary-session-cart)) |
| `DSN-06` | Membuat pengajuan peminjaman dari keranjang sesi sementara |

**Batasan tampilan:** tanpa nominal harga ([REQ-12](System%20Features.md#req-12--aturan-tampilan-tarif)); kategori Bahan disembunyikan ([REQ-11](System%20Features.md#req-11--penyembunyian-kategori-bahan)).

### 6.4 Riwayat Peminjaman

| ID | Kebutuhan |
| --- | --- |
| `DSN-07` | Melihat status pengajuan per baris item (Disetujui/Ditolak) |
| `DSN-08` | Membatalkan pengajuan secara mandiri — hanya selama status belum "Dipinjam" ([BR-5](Business%20Rule.md#br-5--hak-pembatalan-mandiri-pengguna)) |

### 6.5 Prosedur (SOP)

| ID | Kebutuhan |
| --- | --- |
| `DSN-09` | Melihat Prosedur Peminjaman, Ringkasan Persyaratan, dan FAQ |

---

## 7. Mahasiswa (MHS)

**Otoritas:** identik dengan Dosen, ditambah modul Bebas Laboratorium; durasi peminjaman dibatasi ([REQ-15](System%20Features.md#req-15--batas-durasi-peminjaman)).

### 7.1 Autentikasi & Profil

| ID | Kebutuhan |
| --- | --- |
| `MHS-01` | Login, lupa password, melihat/mengubah profil, mengubah password, logout. Registrasi mandiri tersedia (NIM + fakultas + prodi + KTM) |

### 7.2 Dashboard Mahasiswa

| ID | Kebutuhan |
| --- | --- |
| `MHS-02` | Setara `DSN-02` (data milik sendiri) |

### 7.3 Katalog Laboratorium & Keranjang Sesi

| ID | Kebutuhan |
| --- | --- |
| `MHS-03` | Setara `DSN-03` s.d. `DSN-06` |

### 7.4 Riwayat Peminjaman

| ID | Kebutuhan |
| --- | --- |
| `MHS-04` | Setara `DSN-07` dan `DSN-08` |

### 7.5 Bebas Laboratorium

| ID | Kebutuhan |
| --- | --- |
| `MHS-05` | Melihat daftar tunggakan atau alat yang belum dikembalikan |
| `MHS-06` | Mengunduh Surat Keterangan Bebas Laboratorium (PDF) — tombol aktif otomatis hanya bila tunggakan bernilai 0 ([REQ-31](System%20Features.md#req-31--prasyarat-cetak-surat-bebas-lab), [REQ-32](System%20Features.md#req-32--penerbitan-surat-bebas-lab)) |

### 7.6 Prosedur (SOP)

| ID | Kebutuhan |
| --- | --- |
| `MHS-07` | Setara `DSN-09` |

---

## 8. Eksternal (EKS)

**Otoritas:** peminjam berbayar. Sub-kategori tarif: **Internal-UNEJ** dan **Luar-UNEJ** ([BR-2](Business%20Rule.md#br-2--kategori-tarif-eksternal)).

### 8.1 Dashboard Layanan Tarif (publik, sebelum login)

| ID | Kebutuhan |
| --- | --- |
| `EKS-01` | Melihat daftar tarif alat dan ruangan yang tersedia di Laboratorium Pendidikan Fisika — dapat diakses tanpa login ([BR-7](Business%20Rule.md#br-7--ketersediaan-informasi-publik)) |

### 8.2 Autentikasi & Profil

| ID | Kebutuhan |
| --- | --- |
| `EKS-02` | Registrasi mandiri: nama, instansi, kategori (Internal-UNEJ / Luar-UNEJ), email, no. HP, password, NIK, wilayah tempat tinggal, dan foto KTP ([REQ-03](System%20Features.md#req-03--pendaftaran-pengguna-eksternal)) |
| `EKS-03` | Login, lupa password, melihat/mengubah profil, mengubah password, logout |

### 8.3 Dashboard Eksternal (setelah login)

| ID | Kebutuhan |
| --- | --- |
| `EKS-04` | Setara `DSN-02` (data milik sendiri) |

### 8.4 Katalog Laboratorium & Keranjang Sesi

| ID | Kebutuhan |
| --- | --- |
| `EKS-05` | Setara `DSN-03` s.d. `DSN-06`, **dengan kalkulasi biaya otomatis** sesuai sub-kategori ([REQ-12](System%20Features.md#req-12--aturan-tampilan-tarif)) |

### 8.5 Riwayat Peminjaman

| ID | Kebutuhan |
| --- | --- |
| `EKS-06` | Setara `DSN-07` dan `DSN-08`; memantau status pembayaran (Unpaid/Paid) |

### 8.6 Pembayaran

| ID | Kebutuhan |
| --- | --- |
| `EKS-07` | Memilih metode pembayaran: Transfer Bank (wajib mengunggah bukti transfer) atau Tunai/Cash di loket melalui PLP ([REQ-16](System%20Features.md#req-16--opsi-pembayaran-eksternal)) |

### 8.7 Prosedur (SOP)

| ID | Kebutuhan |
| --- | --- |
| `EKS-08` | Setara `DSN-09` |

---

## 9. Matriks Fitur × Peran

Keterangan: **C** = Create · **R** = Read · **U** = Update · **D** = Delete · **X** = eksekusi aksi khusus (approve/reject, serah-terima, cetak) · **–** = tidak ada akses.

| Modul / Fitur | PUB | ADM | KLB | PLP | DSN | MHS | EKS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage & portal publik | R | R | R | R | R | R | R |
| Registrasi mandiri | – | – | – | – | C | C | C |
| Login / lupa password / logout | – | R/X | R/X | R/X | R/X | R/X | R/X |
| Profil (lihat/ubah/ubah password) | – | R/U | R/U | R/U | R/U | R/U | R/U |
| Dashboard ringkasan | – | R | R | R | R | R | R |
| Dashboard pendapatan | – | R | – | – | – | – | – |
| Manajemen pengguna | – | C/R/U/X | – | – | – | – | – |
| Katalog alat | R | C/R/U | R | C/R/U | R | R | R |
| Katalog ruangan | R | C/R/U | R | R | R | R | R |
| Jadwal ruangan | R | R | R | C/R/U | R | R | R |
| Data bahan | – | R | R | C/R/U | – | – | – |
| Data mebeler | – | R | R | C/R/U | – | – | – |
| Keranjang sesi (*cart*) | – | – | – | – | C/R/D | C/R/D | C/R/D |
| Pengajuan peminjaman | – | – | – | – | C | C | C |
| Persetujuan item-level | – | X | X | – | – | – | – |
| Riwayat peminjaman | – | R/U | R | R/U | R/U | R/U | R/U |
| Validasi pengembalian | – | R/U | – | R/U | – | – | – |
| Bebas laboratorium | – | R | – | R | – | R/X | – |
| Dokumentasi & laporan | – | R/X | R/X | C/R/X | – | – | – |
| Laporan keuangan | – | X | X | – | – | – | – |

> **Catatan cakupan dashboard.** Widget dashboard identik lintas peran, tetapi **cakupan datanya berbeda**: Admin, KaLab, dan PLP melihat agregat seluruh laboratorium; Dosen, Mahasiswa, dan Eksternal hanya melihat data milik sendiri. Data pendapatan hanya tersedia untuk Admin.
