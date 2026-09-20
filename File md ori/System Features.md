# System Features — SIMLAFIS

> Spesifikasi fungsional per modul.

| Atribut | Nilai |
| --- | --- |
| Versi | 2.0 |
| Fase | Sprint 1 |
| Jumlah modul | 11 |
| Jumlah requirement | 32 (`REQ-01` … `REQ-32`) |
| Dokumen terkait | [Business Requirements](Business%20Requirements.md) · [Business Rule](Business%20Rule.md) · [sprint1.md](sprint1.md) · [Architecture](Architecture.md) |

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Modul Autentikasi, Manajemen Pengguna, dan Profil](#41-modul-autentikasi-manajemen-pengguna-dan-profil)
3. [Modul Manajemen Master Data Aset](#42-modul-manajemen-master-data-aset)
4. [Modul Katalog Interaktif dan Keranjang Sesi](#43-modul-katalog-interaktif-dan-keranjang-sesi)
5. [Modul Transaksi Peminjaman dan Anti-Collision](#44-modul-transaksi-peminjaman-dan-anti-collision)
6. [Modul Verifikasi & Persetujuan Parsial](#45-modul-verifikasi--persetujuan-parsial)
7. [Modul Validasi Pengembalian](#46-modul-validasi-pengembalian)
8. [Modul Dokumentasi Kegiatan, Maintenance dan Kalibrasi](#47-modul-dokumentasi-kegiatan-maintenance-dan-kalibrasi)
9. [Modul Dashboard Analitik dan Layanan Tarif Eksternal](#48-modul-dashboard-analitik-dan-layanan-tarif-eksternal)
10. [Modul Riwayat Peminjaman dan Pelaporan](#49-modul-riwayat-peminjaman-dan-pelaporan)
11. [Modul Informasi Statik](#410-modul-informasi-statik)
12. [Modul Surat Bebas Laboratorium Otomatis](#411-modul-surat-bebas-laboratorium-otomatis)

---

## 1. Pendahuluan

### 1.1 Gambaran umum

SIMLAFIS dirancang sebagai solusi terintegrasi yang membagi ruang lingkup operasional laboratorium ke dalam dua arsitektur utama:

| Arsitektur | Cakupan |
| --- | --- |
| **Sistem Internal (Back-Office)** | Optimasi manajemen inventaris, verifikasi transaksi, penjadwalan anti-collision, dan pencetakan dokumen administratif |
| **Sistem Eksternal (Front-Office)** | Etalase katalog publik, katalog layanan sewa, dan modul pengajuan bagi civitas akademika UNEJ maupun pengguna eksternal |

Guna menjamin keamanan data, mencegah tumpang tindih wewenang, dan memitigasi risiko penyalahgunaan akses (*fraud*), sistem menerapkan **Kendali Akses Berbasis Peran (Role-Based Access Control / RBAC)** yang membagi pengguna ke dalam **6 hak akses tunggal (*single-role*)**: Admin, Kepala Laboratorium (KaLab), Pranata Laboratorium Pendidikan (PLP), Dosen, Mahasiswa, dan Pengguna Eksternal.

### 1.2 Pemetaan penomoran

Dokumen versi lama memiliki **nomor requirement duplikat** (`REQ-3` dua kali, `REQ-18` dua kali) sehingga tidak dapat dipetakan ke kode. Penomoran disusun ulang menjadi `REQ-01` … `REQ-32`; pemetaan berikut menjaga keterlacakan.

| Modul | Nomor lama | Nomor baru |
| --- | --- | --- |
| 4.1 Autentikasi & Profil | `REQ-1`, `REQ-2`, `REQ-3`, `REQ-3` *(duplikat)*, `REQ-4`, `REQ-5` | `REQ-01` … `REQ-06` |
| 4.2 Master Data Aset | `REQ-6`, `REQ-7` | `REQ-07`, `REQ-08` |
| 4.3 Katalog & Keranjang | `REQ-8` … `REQ-12` | `REQ-09` … `REQ-13` |
| 4.4 Transaksi & Anti-Collision | `REQ-13`, `REQ-14`, `REQ-15` | `REQ-14`, `REQ-15`, `REQ-16` |
| 4.5 Persetujuan Parsial | `REQ-16`, `REQ-17`, `REQ-18` | `REQ-17`, `REQ-18`, `REQ-19` |
| 4.6 Validasi Pengembalian | `REQ-18` *(duplikat)*, `REQ-19`, `REQ-20` | `REQ-20`, `REQ-21`, `REQ-22` |
| 4.7 Dokumentasi | `REQ-21`, `REQ-22` | `REQ-23`, `REQ-24` |
| 4.8 Dashboard | `REQ-23`, `REQ-24` | `REQ-25`, `REQ-26` |
| 4.9 Riwayat & Pelaporan | `REQ-25`, `REQ-26`, `REQ-27` | `REQ-27`, `REQ-28`, `REQ-29` |
| 4.10 Informasi Statik | `REQ-28` | `REQ-30` |
| 4.11 Surat Bebas Lab | `REQ-29`, `REQ-30` | `REQ-31`, `REQ-32` |

> **Verifikasi.** Nomor baru ini cocok **100%** dengan rujukan `REQ` yang sudah tertulis di kode: `REQ-06`, `REQ-11`, `REQ-12`, `REQ-13`, `REQ-14`, `REQ-15`, `REQ-16`, `REQ-21`, `REQ-31`, `REQ-32` (lihat `app/Services/PeminjamanService.php`, `app/Http/Controllers/Users/UserController.php`, `.ai/rules/controllers.md`).

### 1.3 Ringkasan prioritas modul

Skala penilaian: **5 = sangat tinggi**, **1 = sangat rendah**.

| Modul | Prioritas | Benefit | Penalty | Cost | Risk |
| --- | --- | --- | --- | --- | --- |
| 4.1 Autentikasi, Manajemen Pengguna & Profil | **High** | 5 | 5 | 3 | 2 |
| 4.2 Manajemen Master Data Aset | **High** | 5 | 5 | 3 | 2 |
| 4.3 Katalog Interaktif & Keranjang Sesi | **High** | 5 | 4 | 4 | 3 |
| 4.4 Transaksi Peminjaman & Anti-Collision | **High** | 5 | 5 | 4 | 3 |
| 4.5 Verifikasi & Persetujuan Parsial | **High** | 5 | 4 | 4 | 2 |
| 4.6 Validasi Pengembalian | **High** | 5 | 5 | 4 | 3 |
| 4.7 Dokumentasi, Maintenance & Kalibrasi | **Medium** | 4 | 3 | 3 | 2 |
| 4.8 Dashboard Analitik & Tarif Eksternal | **Medium** | 4 | 3 | 3 | 1 |
| 4.9 Riwayat Peminjaman & Pelaporan | **High** | 5 | 4 | 3 | 2 |
| 4.10 Informasi Statik (SOP, Persyaratan, FAQ) | **Low** | 3 | 2 | 1 | 1 |
| 4.11 Surat Bebas Laboratorium Otomatis | **Medium** | 4 | 3 | 2 | 1 |

---

## 4.1 Modul Autentikasi, Manajemen Pengguna, dan Profil

### Deskripsi dan Prioritas

Mengelola hak akses ke dalam sistem, pembuatan akun (mandiri maupun oleh Admin), pemulihan kata sandi, pembaruan profil mandiri, sesi logout, serta pembukaan blokir (*unblock*) akun pengguna oleh Admin.

**Prioritas:** High

| Komponen | Nilai | Keterangan |
| --- | --- | --- |
| Benefit | 5 | Menjamin keamanan sistem dan pengelolaan identitas pengguna secara terpusat |
| Penalty | 5 | Tanpa fitur ini, pengguna tidak dapat masuk, memulihkan akun, atau mengamankan sesi transaksi |
| Cost | 3 | Membutuhkan autentikasi berbasis sesi dan integrasi RBAC 6 peran |
| Risk | 2 | Risiko *unauthorized access* dimitigasi dengan enkripsi dan penanganan sesi yang valid |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Login & Logout** | Pengguna memasukkan email dan password → sistem memvalidasi dan mengarahkan ke dashboard → untuk keluar, pengguna mengklik "Logout" → sistem menghapus sesi dan mengarahkan ke halaman login |
| **Registrasi Pengguna** | Pengguna mengklik "Daftar Akun" → sistem menampilkan formulir pendaftaran bertahap (nama, kategori pengguna, no. telepon, email → lanjut ke formulir sesuai kategori) → pengguna mengisi dan mengklik "Daftar Sekarang" → sistem menyimpan data dan menampilkan pesan "Registrasi akun berhasil, silakan login" |
| **Lupa Password** | Pengguna mengklik "Lupa Password" → sistem meminta email terdaftar → sistem mengirimkan tautan reset → pengguna memasukkan password baru → sistem memperbarui kredensial |
| **Unblock Akun** | Admin membuka "Manajemen Akun" → memilih akun berstatus `suspended`/`blocked` → mengklik "Ubah Status" → sistem memvalidasi tidak ada sanksi aktif → status akun kembali `active` |
| **Ubah Password & Profil** | Pengguna membuka "Pengaturan Profil" → memperbarui foto profil, nomor telepon, atau memasukkan password lama dan baru → sistem memvalidasi kredensial lama → sistem menyimpan perubahan |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-01` | Sistem harus mengimplementasikan RBAC dengan 6 peran terspesialisasi: Admin, KaLab, PLP, Dosen, Mahasiswa, dan Pengguna Eksternal |
| `REQ-02` | Sistem harus memverifikasi kombinasi email dan password terenkripsi sebelum memberikan hak akses ke dashboard masing-masing peran |
| `REQ-03` | Sistem harus menyediakan formulir pendaftaran mandiri bagi Mahasiswa, Dosen, dan Pengguna Eksternal, termasuk klasifikasi kategori tarif (`internal_unej` / `luar_unej`) bagi pengguna eksternal |
| `REQ-04` | Sistem harus menyediakan fitur "Lupa Password" dan "Ubah Password" dengan verifikasi password lama/kredensial yang valid |
| `REQ-05` | Sistem harus menyediakan fitur "Ubah Profil" untuk memperbarui data personal pengguna dan fitur "Logout" untuk mengakhiri sesi secara aman |
| `REQ-06` | Sistem harus menyediakan wewenang khusus bagi Admin untuk membuka blokir (*unblock*) akun pengguna yang diblokir oleh aturan bisnis sistem |

---

## 4.2 Modul Manajemen Master Data Aset

### Deskripsi dan Prioritas

Digunakan oleh PLP dan Admin untuk mengelola (*create, read, update, delete*) master data inventaris yang mencakup alat laboratorium, unit detail alat, mebeler, bahan habis pakai, serta ruang laboratorium.

**Prioritas:** High

| Komponen | Nilai | Keterangan |
| --- | --- | --- |
| Benefit | 5 | Menyediakan basis data inventaris yang akurat dan terstruktur |
| Penalty | 5 | Tanpa master data, transaksi peminjaman dan katalog tidak dapat berfungsi |
| Cost | 3 | Pembuatan modul CRUD aset terintegrasi dengan struktur lab |
| Risk | 2 | Potensi duplikasi data inventaris |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Tambah Data Aset** | PLP/Admin memilih kategori (Alat / Mebeler / Bahan / Ruangan) → mengklik "Tambah Data" → memilih unit laboratorium (Dasar / Elektronika / Lanjut / ELF) → mengisi spesifikasi, kondisi, dan jumlah → klik "Simpan" → sistem memperbarui master data |
| **Ubah Data Aset** | PLP/Admin memilih aset → mengklik "Ubah" → sistem memvalidasi bahwa aset tidak sedang terikat peminjaman aktif → sistem menyimpan perubahan atau menghapus data |
| **Registrasi Unit Alat** | PLP mengklik "Tambah Unit Detail Alat" → mengisi nomor seri unit, lokasi, kondisi, status → klik "Simpan Detail Alat" → sistem menambah unit dan menghitung ulang stok master alat (+1) |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-07` | Sistem harus menyediakan fungsi CRUD data alat, mebeler, bahan, dan ruangan yang terikat pada 4 unit laboratorium |
| `REQ-08` | Sistem harus memvalidasi penghapusan data aset agar tidak merusak riwayat transaksi peminjaman yang sedang berlangsung |

---

## 4.3 Modul Katalog Interaktif dan Keranjang Sesi

### Deskripsi dan Prioritas

Menyajikan etalase publik untuk pencarian alat, mebeler, dan ruangan. Katalog dilengkapi pencarian nama serta pencarian berdasarkan rentang waktu, sehingga stok yang ditampilkan bersifat dinamis sesuai ketersediaan pada tanggal tersebut. Kategori Bahan secara khusus disembunyikan dari tampilan Dosen, Mahasiswa, dan Eksternal.

**Prioritas:** High

| Komponen | Nilai | Keterangan |
| --- | --- | --- |
| Benefit | 5 | Memberikan kepastian ketersediaan stok riil pada tanggal yang direncanakan pengguna |
| Penalty | 4 | Mencegah kekeliruan pemesanan barang yang sebenarnya sudah dipesan pihak lain pada tanggal tersebut |
| Cost | 4 | Pengembangan logika kalkulasi stok dinamis berdasarkan rentang tanggal |
| Risk | 3 | Pemrosesan pencarian stok dinamis membutuhkan query teroptimasi |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Pencarian Katalog Berdasarkan Rentang Waktu** | Pengguna memilih rentang tanggal peminjaman dan memasukkan kata kunci nama barang/ruangan → sistem memindai transaksi aktif pada rentang tanggal tersebut → sistem menampilkan sisa stok fisik yang benar-benar tersedia pada periode itu |
| **Filter Akses Kategori Bahan** | Dosen, Mahasiswa, atau Pengguna Eksternal membuka katalog → sistem otomatis menyembunyikan kategori Bahan Habis Pakai dari etalase |
| **Temporary Session Cart (modal 2 tab)** | Pengguna memilih barang/ruangan → sistem menyimpan sementara ke pop-up modal Keranjang Sesi (Tab 1: Alat, Tab 2: Ruangan) sebelum diajukan |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-09` | Sistem harus menyediakan fitur pencarian katalog berdasarkan nama aset dan kriteria rentang tanggal peminjaman |
| `REQ-10` | Sistem harus menyajikan informasi stok alat dan ruangan secara dinamis berdasarkan kalkulasi sisa stok yang belum ter-booking pada rentang waktu yang dipilih |
| `REQ-11` | Sistem harus menyembunyikan kategori data Bahan dari antarmuka katalog pengguna Dosen, Mahasiswa, dan Pengguna Eksternal |
| `REQ-12` | Sistem tidak boleh menampilkan harga bagi Dosen dan Mahasiswa, namun wajib menampilkan kalkulasi biaya otomatis bagi Pengguna Eksternal |
| `REQ-13` | Sistem harus menyediakan Temporary Session Cart berupa pop-up modal 2 tab untuk memisahkan item Alat dan Ruangan |

---

## 4.4 Modul Transaksi Peminjaman dan Anti-Collision

### Deskripsi dan Prioritas

Mengelola pengajuan transaksi dari keranjang, verifikasi bentrok jadwal ruangan (*anti-collision*), pembatasan durasi, dan pilihan pembayaran sewa bagi Pengguna Eksternal.

**Prioritas:** High

| Komponen | Nilai |
| --- | --- |
| Benefit | 5 |
| Penalty | 5 |
| Cost | 4 |
| Risk | 3 |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Pengajuan Transaksi & Pengecekan Bentrok** | Pengguna melakukan checkout → sistem mengecek jadwal ruangan → jika bentrok, sistem menolak pengajuan; jika aman, status menjadi "Menunggu" |
| **Pembayaran Eksternal** | Pengguna Eksternal memilih Transfer Bank (wajib mengunggah bukti) atau Tunai melalui PLP |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-14` | Sistem harus memvalidasi jadwal ruangan guna menghindari bentrok jadwal (*anti-collision schedule*) |
| `REQ-15` | Sistem harus membatasi durasi peminjaman Mahasiswa maksimal 7 hari kalender |
| `REQ-16` | Sistem harus menyediakan pilihan pembayaran Transfer Bank (dengan unggah bukti) atau Tunai melalui PLP, khusus bagi Pengguna Eksternal |

---

## 4.5 Modul Verifikasi & Persetujuan Parsial

### Deskripsi dan Prioritas

Memfasilitasi KaLab dan PLP untuk menyetujui transaksi secara parsial (*item-level*), memverifikasi pembayaran, serta memproses pembatalan mandiri sebelum barang diambil.

**Prioritas:** High

| Komponen | Nilai |
| --- | --- |
| Benefit | 5 |
| Penalty | 4 |
| Cost | 4 |
| Risk | 2 |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Item-Level Approval** | KaLab menyetujui item alat namun menolak item ruangan → transaksi alat tetap diproses tanpa membatalkan seluruh pengajuan |
| **Pembatalan Mandiri** | Pemohon membatalkan item yang telah disetujui sebelum status berubah menjadi "Dipinjam" |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-17` | Sistem harus mendukung persetujuan/penolakan independen pada tingkat item (*item-level approval*) |
| `REQ-18` | Penolakan ruangan tidak boleh membatalkan persetujuan alat secara otomatis |
| `REQ-19` | Sistem harus mengizinkan pembatalan mandiri oleh pemohon sebelum barang fisik diserahkan |

---

## 4.6 Modul Validasi Pengembalian

### Deskripsi dan Prioritas

Digunakan oleh PLP untuk mencatat penyerahan/pengembalian barang, penerimaan pembayaran tunai, dan pemicuan otomatis sanksi blokir akun akibat keterlambatan atau kerusakan.

**Prioritas:** High

| Komponen | Nilai |
| --- | --- |
| Benefit | 5 |
| Penalty | 5 |
| Cost | 4 |
| Risk | 3 |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Pencatatan Pengembalian** | PLP memeriksa kondisi barang dan menyelesaikan transaksi |
| **Suspended karena Keterlambatan/Kerusakan** | Jika terjadi keterlambatan > 7 hari kalender atau laporan kerusakan aset → sistem mengubah status akun pengguna menjadi `suspended` |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-20` | Sistem harus menyediakan pencatatan kondisi pengembalian aset oleh PLP |
| `REQ-21` | Sistem harus secara otomatis menangguhkan akun yang terlambat mengembalikan alat > 7 hari kalender atau merusakkan aset |
| `REQ-22` | Sistem harus menyediakan modul kasir pembayaran tunai bagi PLP |

---

## 4.7 Modul Dokumentasi Kegiatan, Maintenance dan Kalibrasi

### Deskripsi dan Prioritas

Digunakan oleh PLP untuk mengunggah dokumentasi kegiatan praktikum/penelitian laboratorium, serta mengunggah laporan hasil pemeliharaan (*maintenance*) dan kalibrasi berkala alat laboratorium.

**Prioritas:** Medium

| Komponen | Nilai | Keterangan |
| --- | --- | --- |
| Benefit | 4 | Menjamin rekam jejak perawatan alat dan pendokumentasian kegiatan laboratorium |
| Penalty | 3 | Sulit memantau kelayakan alat dan riwayat kegiatan laboratorium secara digital |
| Cost | 3 | Pengembangan modul manajemen berkas (unggah PDF/gambar) |
| Risk | 2 | Risiko ukuran berkas besar sehingga memerlukan pembatasan unggahan |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Unggah Dokumentasi Kegiatan** | PLP membuka menu "Dokumentasi Kegiatan" → mengisi nama kegiatan dan memilih foto/berkas dokumentasi → klik "Simpan" → sistem menyimpan berkas ke repositori |
| **Unggah Laporan Maintenance/Kalibrasi** | PLP/KaLab memilih data alat → mengklik "Tambah Catatan Maintenance/Kalibrasi" → mengisi tanggal perbaikan dan mengunggah berkas laporan PDF → sistem menyimpan rekam jejak perawatan alat |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-23` | Sistem harus menyediakan fungsi bagi PLP untuk mengunggah dan mengelola berkas dokumentasi kegiatan laboratorium |
| `REQ-24` | Sistem harus menyediakan fungsi untuk mengunggah berkas laporan hasil maintenance dan kalibrasi alat yang terhubung ke master data alat terkait |

---

## 4.8 Modul Dashboard Analitik dan Layanan Tarif Eksternal

### Deskripsi dan Prioritas

Menyajikan ringkasan eksekutif visual (statistik penggunaan, status inventaris, peminjaman aktif) untuk internal, serta Dashboard Layanan Tarif Eksternal khusus untuk memantau performa komersialisasi dan pemanfaatan fasilitas oleh pihak luar.

**Prioritas:** Medium

| Komponen | Nilai | Keterangan |
| --- | --- | --- |
| Benefit | 4 | Memudahkan pengawasan operasional dan pengambilan keputusan strategis oleh KaLab dan Admin |
| Penalty | 3 | Tanpa dashboard, pengelola harus merekap data secara manual dari tabel transaksi |
| Cost | 3 | Visualisasi grafik dan agregasi data statistik |
| Risk | 1 | Kinerja query statistik pada jumlah data yang besar |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Membuka Dashboard Internal** | Admin/KaLab/PLP masuk ke sistem → sistem menampilkan ringkasan jumlah peminjaman aktif, total alat dipinjam, alat rusak, dan statistik pengguna |
| **Membuka Dashboard Layanan Tarif Eksternal** | KaLab/Admin membuka tab "Dashboard Tarif Eksternal" → sistem menampilkan visualisasi statistik persewaan eksternal, total pendapatan, dan frekuensi penggunaan fasilitas oleh pihak luar |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-25` | Sistem harus menyediakan Dashboard Analitik ringkasan operasional laboratorium bagi Admin, KaLab, dan PLP |
| `REQ-26` | Sistem harus menyediakan Dashboard Layanan Tarif Eksternal yang menampilkan grafik transaksi sewa publik dan rekapitulasi penggunaan fasilitas oleh pihak eksternal |

---

## 4.9 Modul Riwayat Peminjaman dan Pelaporan

### Deskripsi dan Prioritas

Memungkinkan pengguna melihat riwayat transaksi mereka, serta menyediakan fasilitas bagi Admin, KaLab, dan PLP untuk mengunduh laporan resmi berbentuk dokumen/spreadsheet meliputi Laporan Inventarisasi Aset dan Laporan Keuangan/Pendapatan Transaksi.

**Prioritas:** High

| Komponen | Nilai | Keterangan |
| --- | --- | --- |
| Benefit | 5 | Mendukung akuntabilitas keuangan dan pelaporan inventaris berkala untuk akreditasi |
| Penalty | 4 | Proses audit dan rekapitulasi laporan laboratorium menjadi terhambat |
| Cost | 3 | Pengembangan modul ekspor laporan (PDF/Excel) |
| Risk | 2 | Ketidaksesuaian format rekapitulasi laporan keuangan |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Melihat Riwayat Peminjaman** | Pengguna membuka menu "Riwayat Peminjaman" → sistem menampilkan daftar seluruh peminjaman terdahulu beserta statusnya |
| **Unduh Laporan Inventarisasi** | PLP/KaLab memilih parameter lab dan rentang tahun → mengklik "Unduh Laporan Inventarisasi" → sistem menerbitkan berkas PDF/Excel daftar aset dan kondisinya |
| **Unduh Laporan Keuangan/Pendapatan** | KaLab/Admin memilih periode bulan/tahun → mengklik "Unduh Laporan Keuangan" → sistem mengagregasi seluruh pendapatan sewa eksternal/denda dan menerbitkan laporan transaksi resmi |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-27` | Sistem harus menampilkan riwayat peminjaman lengkap bagi setiap pengguna sesuai dengan hak aksesnya |
| `REQ-28` | Sistem harus menyediakan fitur ekspor Laporan Inventarisasi Aset (alat, mebeler, bahan) dalam format PDF/Excel untuk pengelola lab |
| `REQ-29` | Sistem harus menyediakan fitur ekspor Laporan Keuangan/Pendapatan Transaksi Sewa Eksternal dalam format PDF/Excel berdasarkan periode yang dipilih |

---

## 4.10 Modul Informasi Statik

### Deskripsi dan Prioritas

Menyajikan halaman informasi statik publik mengenai *Standard Operating Procedure* (SOP) laboratorium, syarat & ketentuan peminjaman, serta *Frequently Asked Questions* (FAQ) untuk memandu pengguna.

**Prioritas:** Low

| Komponen | Nilai | Keterangan |
| --- | --- | --- |
| Benefit | 3 | Mengurangi pertanyaan berulang dan memberikan edukasi prosedur laboratorium |
| Penalty | 2 | Informasi harus ditanyakan langsung ke pengelola jika halaman ini tidak ada |
| Cost | 1 | Pembuatan halaman statik |
| Risk | 1 | Risiko minimal karena konten bersifat statik |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Membuka Informasi Statik** | Pengguna mengklik menu "SOP", "Persyaratan", atau "FAQ" pada navigasi utama → sistem menampilkan halaman informasi berisi panduan teks, diagram alur, dan dokumen SOP |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-30` | Sistem harus menyediakan halaman informasi statik yang mudah diakses berisi SOP laboratorium, Persyaratan Peminjaman, dan FAQ |

---

## 4.11 Modul Surat Bebas Laboratorium Otomatis

### Deskripsi dan Prioritas

Fasilitas pencetakan mandiri Surat Bebas Laboratorium PDF bagi Mahasiswa, yang tombol unduhnya aktif otomatis jika seluruh tunggakan dan sanksi bernilai 0 (nihil).

**Prioritas:** Medium

| Komponen | Nilai |
| --- | --- |
| Benefit | 4 |
| Penalty | 3 |
| Cost | 2 |
| Risk | 1 |

### Stimulus / Response

| Skenario | Alur |
| --- | --- |
| **Cetak Surat Bebas Lab** | Mahasiswa membuka menu → jika tunggakan = 0, tombol cetak aktif → klik cetak → sistem menerbitkan dokumen PDF otomatis |

### Functional Requirements

| ID | Requirement |
| --- | --- |
| `REQ-31` | Sistem harus mengecek riwayat peminjaman dan sanksi sebelum mengaktifkan fungsi cetak surat bebas lab |
| `REQ-32` | Sistem harus merender dan mengunduh Surat Bebas Laboratorium secara mandiri dalam format PDF yang sah jika terbebas dari seluruh tunggakan |

---

## Lampiran · Matriks Keterlacakan

| Modul | Requirement | Kebutuhan peran terkait | Prosedur |
| --- | --- | --- | --- |
| 4.1 | `REQ-01` … `REQ-06` | `PUB-03`, `ADM-01`…`ADM-03`, `ADM-08`…`ADM-10`, `KLB-01`, `PLP-01`, `DSN-01`, `MHS-01`, `EKS-02`, `EKS-03` | [PR-02 … PR-11](sprint1.md#2-daftar-prosedur) |
| 4.2 | `REQ-07`, `REQ-08` | `ADM-11`…`ADM-14`, `PLP-03`, `PLP-05`, `PLP-06` | [PR-18 … PR-20](sprint1.md#2-daftar-prosedur), [PR-31 … PR-37](sprint1.md#2-daftar-prosedur) |
| 4.3 | `REQ-09` … `REQ-13` | `PUB-02`, `DSN-03`…`DSN-06`, `MHS-03`, `EKS-05` | [PR-21](sprint1.md#2-daftar-prosedur), [PR-29](sprint1.md#2-daftar-prosedur) |
| 4.4 | `REQ-14` … `REQ-16` | `DSN-06`, `MHS-03`, `EKS-05`, `EKS-07` | ⚠️ *belum ada prosedur* |
| 4.5 | `REQ-17` … `REQ-19` | `ADM-15`, `ADM-16`, `KLB-07`, `DSN-08`, `MHS-04`, `EKS-06` | ⚠️ *belum ada prosedur* |
| 4.6 | `REQ-20` … `REQ-22` | `ADM-20`, `ADM-21`, `PLP-09` | ⚠️ *belum ada prosedur* |
| 4.7 | `REQ-23`, `REQ-24` | `ADM-23`, `KLB-10`, `PLP-11`, `PLP-12` | ⚠️ *belum ada prosedur* |
| 4.8 | `REQ-25`, `REQ-26` | `ADM-04`…`ADM-07`, `KLB-02`, `PLP-02`, `DSN-02`, `MHS-02`, `EKS-04` | [PR-12](sprint1.md#2-daftar-prosedur), [PR-13](sprint1.md#2-daftar-prosedur) |
| 4.9 | `REQ-27` … `REQ-29` | `ADM-17`…`ADM-19`, `KLB-08`, `KLB-09`, `DSN-07`, `MHS-04`, `EKS-06` | ⚠️ *belum ada prosedur* |
| 4.10 | `REQ-30` | `PUB-03`, `ADM-26`, `KLB-11`, `PLP-13`, `DSN-09`, `MHS-07`, `EKS-08` | ⚠️ *belum ada prosedur* |
| 4.11 | `REQ-31`, `REQ-32` | `MHS-05`, `MHS-06` | ⚠️ *belum ada prosedur* |

> ⚠️ Sel pada kolom "Prosedur" yang bertanda *belum ada prosedur* merupakan bagian dari temuan **C8** (lihat [README §4](README.md#4-catatan-konsistensi--temuan)).
