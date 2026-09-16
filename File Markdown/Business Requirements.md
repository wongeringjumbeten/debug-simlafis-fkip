# Business Requirements — SIMLAFIS

Daftar kebutuhan bisnis per peran. Format ID: `<ROLE>-<nomor>` (contoh: `ADM-01`).

**Kode peran (6 role, single-role — lihat BR-5):** `ADMIN`, `KALAB`, `PLP`, `DOSEN`, `MHS` (Mahasiswa), `EKST` (Eksternal).

> ⚠️ **Inkonsistensi yang perlu dikonfirmasi ke tim:** dokumen asli mencantumkan "Fitur Register" untuk KALAB, PLP, dan DOSEN, padahal [BR-1](./Business%20Rule.md) (Otoritas Manajemen Akun) melarang akun internal mendaftar mandiri — akun internal dibuat oleh Admin. Konvensi dokumen ini: **register dihapus dari role internal**; hanya EKST yang mendaftar mandiri. Jika tim memutuskan lain, ubah bagian ini.

## 1. Admin (ADMIN)

Otoritas penuh: seluruh pengaturan dan data.

### 1.1 Autentikasi & Profil
- ADM-01: Login, lupa password.
- ADM-02: Melihat/mengubah profil, mengubah password (verifikasi password lama).
- ADM-03: Logout.

### 1.2 Dashboard
- ADM-04: **Khusus Admin —** akumulasi pendapatan dari peminjaman alat & ruangan.
- ADM-05: Total pengajuan per status (Seluruh / Pending / Disetujui / Ditolak / Sedang Dipinjam) untuk peminjaman alat dan ruangan.
- ADM-06: Grafik batang rekapitulasi peminjaman alat & ruangan per bulan.
- ADM-07: 10 pengajuan peminjaman terbaru (alat & ruangan).

### 1.3 Manajemen Data Pengguna (Hak Akses)
- ADM-08: Membuat data pengguna (semua role — lihat BR-1).
- ADM-09: Melihat & mengubah data pengguna.
- ADM-10: Mengubah status hak akses pengguna: mengaktifkan / membatasi (menangguhkan) akses peminjaman; membuka blokir (unblock) — lihat REQ-06.

### 1.4 Katalog Laboratorium
- ADM-11: CRUD katalog alat + layanan tarif alat + ketersediaan.
- ADM-12: CRUD katalog ruangan + layanan tarif ruangan + ketersediaan.
- ADM-13: Melihat data bahan & ketersediaannya (read-only).
- ADM-14: Melihat data mebeler (read-only).

### 1.5 Persetujuan (Item-Level — lihat BR-4)
- ADM-15: Melihat status seluruh pengajuan peminjaman.
- ADM-16: Menyetujui/menolak item alat & item ruangan per item — termasuk mengecek status pembayaran, dan mengisi alasan jika ditolak.

### 1.6 Riwayat Peminjaman
- ADM-17: Melihat status & riwayat seluruh peminjaman.
- ADM-18: Mengubah status pengajuan alat/ruangan; mencatat ID alat yang dipinjam.
- ADM-19: Mengunduh Laporan Inventarisasi.

### 1.7 Validasi Pengembalian
- ADM-20: Melihat daftar alat sedang dipinjam.
- ADM-21: Mengubah data pengembalian (kondisi fisik: Baik/Rusak); memicu blokir akun otomatis jika telat — lihat REQ-21.

### 1.8 Pengecekan Bebas Laboratorium
- ADM-22: Melihat daftar mahasiswa yang memiliki tunggakan lab.

### 1.9 Dokumentasi
- ADM-23: Melihat & mengunduh Laporan Maintenance dan Kalibrasi.
- ADM-24: Melihat Dokumentasi Kegiatan.
- ADM-25: Mengunduh Laporan Keuangan / Pendapatan Transaksi.

### 1.10 Prosedur (SOP)
- ADM-26: Melihat Prosedur Tata Kelola Sistem & FAQ.

## 2. Kepala Laboratorium (KALAB)

Otoritas: persetujuan, pengawasan, dan pelaporan. **Tidak** mengelola master data.

### 2.1 Autentikasi & Profil
- KLB-01: Login, lupa password, profil (lihat/ubah/ubah password), logout.
- ~~Register~~ — dihapus, lihat catatan inkonsistensi di atas.

### 2.2 Dashboard
- KLB-02: Sama dengan ADM-05, ADM-06, ADM-07 (total per status, grafik bulanan, 10 pengajuan terbaru). **Tanpa** akumulasi pendapatan.

### 2.3 Katalog Laboratorium (read-only)
- KLB-03: Melihat katalog alat + ketersediaan.
- KLB-04: Melihat jadwal penggunaan ruangan lab.
- KLB-05: Melihat data bahan & ketersediaan.
- KLB-06: Melihat data mebeler.

### 2.4 Persetujuan Peminjaman
- KLB-07: Sama dengan ADM-15, ADM-16 (melihat status; setuju/tolak per item + cek pembayaran + alasan penolakan).

### 2.5 Riwayat Peminjaman
- KLB-08: Melihat riwayat peminjaman alat & ruangan yang telah diproses.
- KLB-09: Mengunduh Laporan Inventarisasi.

### 2.6 Dokumentasi
- KLB-10: Melihat & mengunduh Laporan Maintenance/Kalibrasi; melihat Dokumentasi Kegiatan; mengunduh Laporan Keuangan.

### 2.7 Prosedur (SOP)
- KLB-11: Melihat Prosedur Otorisasi & Pengawasan Lab, dan FAQ.

## 3. Pranata Laboratorium Pendidikan (PLP)

Otoritas operasional: master data, jadwal, sirkulasi, dokumentasi.

### 3.1 Autentikasi & Profil
- PLP-01: Login, lupa password, profil, logout. ~~Register~~ — lihat catatan inkonsistensi.

### 3.2 Dashboard
- PLP-02: Sama dengan KLB-02 (total per status, grafik bulanan, 10 pengajuan terbaru).

### 3.3 Katalog Laboratorium
- PLP-03: Membuat & mengubah data katalog alat; melihat katalog + ketersediaan.
- PLP-04: Membuat, melihat, mengubah Jadwal Ruangan (jadwal praktikum reguler, anti-bentrok — lihat REQ-14).
- PLP-05: Membuat, melihat, mengubah data bahan + ketersediaan.
- PLP-06: Membuat, melihat, mengubah data mebeler.

### 3.4 Riwayat Peminjaman
- PLP-07: Melihat status & riwayat peminjaman.
- PLP-08: Mengubah status pengajuan — **hanya item yang sudah disetujui** (transisi Approved → Dipinjam/Diserahkan); mencatat ID alat yang dipinjam.

### 3.5 Validasi Pengembalian
- PLP-09: Melihat daftar alat dipinjam; mengubah data pengembalian (kondisi Baik/Rusak; memicu suspend akun jika telat — lihat REQ-21).

### 3.6 Pengecekan Bebas Laboratorium
- PLP-10: Melihat daftar mahasiswa ber-tunggakan lab.

### 3.7 Dokumentasi
- PLP-11: Membuat & melihat Dokumentasi Kegiatan.
- PLP-12: Mengunggah, melihat, mengunduh Laporan Maintenance/Kalibrasi.

### 3.8 Prosedur (SOP)
- PLP-13: Melihat Prosedur Operasional Fisik & Maintenance, dan FAQ.

## 4. Dosen (DOSEN)

Otoritas: peminjam internal (tanpa tarif).

### 4.1 Autentikasi & Profil
- DSN-01: Login, lupa password, profil, logout. ~~Register~~ — lihat catatan inkonsistensi.

### 4.2 Dashboard
- DSN-02: Sama dengan KLB-02 (total per status, grafik bulanan, 10 pengajuan terbaru) — data milik sendiri.

### 4.3 Katalog + Keranjang Sesi (Cart)
- DSN-03: Melihat katalog alat + ketersediaan.
- DSN-04: Melihat jadwal penggunaan ruangan lab.
- DSN-05: Menambah item (alat/ruangan) + tanggal, jam, jumlah ke cart sementara via modal pop-up; melihat & menghapus item di cart. Cart 2-tab: Tab 1 Alat, Tab 2 Ruangan — lihat REQ-13.
- DSN-06: Membuat pengajuan peminjaman dari cart.
- **Tanpa harga** — lihat REQ-12. Kategori Bahan disembunyikan — lihat REQ-11.

### 4.4 Riwayat Peminjaman
- DSN-07: Melihat status pengajuan (Approved/Rejected per item).
- DSN-08: Membatalkan pengajuan mandiri — hanya selama belum "Dipinjam" (lihat BR-5).

### 4.5 Prosedur (SOP)
- DSN-09: Melihat Prosedur Peminjaman, Ringkasan Persyaratan, FAQ.

## 5. Mahasiswa (MHS)

Identik dengan Dosen, ditambah Bebas Laboratorium; durasi peminjaman dibatasi (REQ-15).

### 5.1 Autentikasi & Profil
- MHS-01: Login, lupa password, profil, logout. ~~Register~~ — lihat catatan inkonsistensi.

### 5.2 Dashboard
- MHS-02: Sama dengan DSN-02 (data milik sendiri).

### 5.3 Katalog + Keranjang Sesi (Cart)
- MHS-03: Sama dengan DSN-03 s.d. DSN-06.

### 5.4 Riwayat Peminjaman
- MHS-04: Sama dengan DSN-07, DSN-08.

### 5.5 Bebas Laboratorium
- MHS-05: Melihat daftar tunggakan / alat belum dikembalikan.
- MHS-06: Mengunduh Surat Keterangan Bebas Laboratorium (PDF otomatis jika tunggakan = 0 — lihat REQ-31, REQ-32).

### 5.6 Prosedur (SOP)
- MHS-07: Sama dengan DSN-09.

## 6. Eksternal (EKST)

Pengguna luar (pembayar tarif). Sub-kategori: **Eksternal Internal-UNEJ** dan **Eksternal Luar-UNEJ** (tarif berbeda — lihat BR-2).

### 6.1 Dashboard Layanan Tarif (Publik, belum login)
- EKS-01: Melihat daftar tarif alat & ruangan yang tersedia di Laboratorium Pendidikan Fisika — akses publik tanpa login (lihat BR-7).

### 6.2 Autentikasi & Profil
- EKS-02: **Register mandiri** (Nama, Instansi, Kategori [Internal-UNEJ / Luar-UNEJ], Email, No HP, Password) — satu-satunya role yang mendaftar sendiri (REQ-03).
- EKS-03: Login, lupa password, profil, logout.

### 6.3 Dashboard (setelah login)
- EKS-04: Sama dengan DSN-02 (data milik sendiri).

### 6.4 Katalog + Keranjang Sesi (Cart)
- EKS-05: Sama dengan DSN-03 s.d. DSN-06, **dengan kalkulasi biaya tarif otomatis** (REQ-12) sesuai sub-kategori (BR-2).

### 6.5 Riwayat Peminjaman
- EKS-06: Sama dengan DSN-07, DSN-08.

### 6.6 Pembayaran
- EKS-07: Memilih metode pembayaran: Transfer Bank (wajib unggah bukti) atau Cash via PLP (REQ-16).

### 6.7 Prosedur (SOP)
- EKS-08: Sama dengan DSN-09.
