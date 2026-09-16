# System Features — SIMLAFIS

Sistem Informasi Manajemen Laboratorium Fisika (SIMLAFIS) dirancang sebagai solusi terintegrasi dengan dua arsitektur utama:

- **Sistem Internal (Back-Office):** manajemen inventaris, verifikasi transaksi, penjadwalan anti-collision, pencetakan dokumen administratif.
- **Sistem Eksternal (Front-Office):** etalase katalog publik, katalog layanan sewa, dan modul pengajuan bagi civitas UNEJ maupun pengguna eksternal.

Akses dikontrol dengan **RBAC 6 role (single-role** — BR-6**)**: `ADMIN`, `KALAB`, `PLP`, `DOSEN`, `MHS`, `EKST`.

> Catatan revisi dokumen: nomor REQ asli memiliki duplikat (dua REQ-3, dua REQ-18) dan penomoran sub-bagian 4.7–4.11 salah (tertulis 4.2.x). Semua telah dinomori ulang sekuensial **REQ-1 s.d. REQ-31**. Rujukan BR-x mengarah ke [Business Rule.md](./Business%20Rule.md); rujukan role/kode ada di [Business Requirements.md](./Business%20Requirements.md).

## 4.1 Autentikasi, Manajemen Pengguna, dan Profil

**Priority: High** · Benefit 5 · Penalty 5 · Cost 3 · Risk 2

Mengelola hak akses, registrasi akun eksternal, pemulihan kata sandi, pembaruan profil mandiri, logout, dan pembukaan blokir akun oleh Admin.

**Alur utama:**
- *Login/Logout:* input email + password → validasi → redirect ke dashboard per role. Logout menghapus sesi → kembali ke halaman login.
- *Registrasi Eksternal:* klik "Daftar Akun Publik" → form (Nama, Instansi, Kategori [Internal-UNEJ/Luar-UNEJ], Email, No HP, Password) → simpan → "Registrasi berhasil, silakan login."
- *Lupa Password:* klik "Lupa Password" → input email terdaftar → tautan reset dikirim → set password baru → kredensial diperbarui.
- *Unblock (Admin):* menu Manajemen Akun → pilih akun Suspended → "Buka Blokir" → validasi tidak ada sanksi aktif → status Active → "Akun berhasil diaktifkan kembali."
- *Ubah Profil/Password:* menu Pengaturan Profil → perbarui foto/telepon, atau isi password lama + baru → validasi kredensial lama → simpan.

**Functional Requirements:**
- **REQ-1**: RBAC dengan 6 role spesialisasi (single-role — BR-6): Admin, KaLab, PLP, Dosen, Mahasiswa, Eksternal.
- **REQ-2**: Verifikasi kombinasi email/username + password terenkripsi sebelum memberi akses ke dashboard sesuai role.
- **REQ-3**: Formulir pendaftaran khusus Pengguna Eksternal dengan klasifikasi kategori tarif (Internal-UNEJ / Luar-UNEJ) — BR-1, BR-2.
- **REQ-4**: Fitur "Lupa Password" dan "Ubah Password" dengan verifikasi kredensial/password lama yang valid.
- **REQ-5**: Fitur "Ubah Profil" (data personal) dan "Logout" (akhir sesi aman).
- **REQ-6**: Wewenang khusus Admin untuk unblock akun yang diblokir aturan bisnis (BR-3).

## 4.2 Manajemen Master Data Aset (Alat, Mebeler, Bahan, Ruangan)

**Priority: High** · Benefit 5 · Penalty 5 · Cost 3 · Risk 2

CRUD master data inventaris oleh PLP dan Admin: alat lab, mebeler, bahan habis pakai, ruang lab.

**Alur utama:**
- *Tambah aset:* pilih kategori (Alat/Mebeler/Bahan/Ruangan) → "Tambah Data" → pilih unit lab (Dasar/Elektronika/Lanjut/ELF) → isi spesifikasi, kondisi, jumlah → "Simpan".
- *Ubah/hapus aset:* pilih aset → "Ubah" → sistem memvalidasi aset tidak terikat peminjaman aktif → simpan/hapus.

**Functional Requirements:**
- **REQ-7**: CRUD data alat, mebeler, bahan, dan ruangan terikat pada 4 unit laboratorium (Dasar, Elektronika, Lanjut, ELF).
- **REQ-8**: Validasi penghapusan/ubahan aset agar tidak merusak riwayat transaksi peminjaman yang sedang berlangsung.

## 4.3 Katalog Interaktif, Search Rentang Waktu, & Temporary Session Cart

**Priority: High** · Benefit 5 · Penalty 4 · Cost 4 · Risk 3

Etalase publik untuk pencarian alat, mebeler, dan ruangan — dengan pencarian nama + rentang waktu, sehingga stok tampil dinamis sesuai ketersediaan pada tanggal terpilih.

**Alur utama:**
- *Search rentang waktu:* pilih rentang tanggal + kata kunci → sistem memindai transaksi aktif pada rentang tersebut → tampilkan sisa stok fisik yang benar-benar tersedia.
- *Filter Bahan:* Dosen/Mahasiswa/Eksternal membuka katalog → kategori Bahan otomatis disembunyikan.
- *Cart (modal 2-tab):* pilih barang/ruangan → simpan sementara ke modal Keranjang Sesi (Tab 1: Alat, Tab 2: Ruangan) sebelum diajukan.

**Functional Requirements:**
- **REQ-9**: Pencarian katalog berdasarkan nama aset **dan** kriteria rentang tanggal peminjaman.
- **REQ-10**: Stok alat & ruangan ditampilkan dinamis berdasarkan sisa stok yang belum terbooking pada rentang waktu terpilih.
- **REQ-11**: Kategori Bahan disembunyikan dari katalog Dosen, Mahasiswa, dan Eksternal.
- **REQ-12**: Tidak menampilkan harga bagi Dosen/Mahasiswa; wajib menampilkan kalkulasi biaya otomatis bagi Eksternal (diferensiasi tarif — BR-2).

## 4.4 Transaksi Peminjaman, Anti-Collision, & Opsi Pembayaran

**Priority: High** · Benefit 5 · Penalty 5 · Cost 4 · Risk 3

Pengajuan transaksi dari keranjang, verifikasi bentrok jadwal ruangan, pembatasan durasi, dan pilihan pembayaran bagi Eksternal.

**Alur utama:**
- *Checkout & cek bentrok:* pengguna checkout → sistem cek jadwal ruangan → bentrok = tolak pengajuan; aman = status "Menunggu Approval".
- *Pembayaran Eksternal:* Transfer Bank (wajib upload bukti) atau Cash via PLP.

**Functional Requirements:**
- **REQ-13**: Temporary Session Cart — modal pop-up 2-tab memisahkan item Alat dan Ruangan (lihat 4.3).
- **REQ-14**: Validasi jadwal ruangan untuk mencegah bentrok (Anti-Collision Schedule); jadwal praktikum reguler diinput PLP agar tidak tertimpa.
- **REQ-15**: Durasi peminjaman Mahasiswa maksimal **7 hari kalender**.
- **REQ-16**: Pilihan pembayaran bagi Eksternal: Transfer Bank (unggah bukti) atau Cash via PLP (REQ-20).

## 4.5 Verifikasi & Persetujuan Parsial (Item-Level Approval)

**Priority: High** · Benefit 5 · Penalty 4 · Cost 4 · Risk 2

Persetujuan parsial per item oleh KaLab/Admin, verifikasi pembayaran, pembatalan mandiri sebelum barang diambil.

**Alur utama:**
- *Item-Level Approval:* KaLab setujui item alat, tolak item ruangan (dengan alasan) → transaksi alat tetap diproses (BR-4).
- *Pembatalan mandiri:* pemohon membatalkan item yang telah disetujui sebelum status "Dipinjam" (BR-5).

**Functional Requirements:**
- **REQ-17**: Persetujuan/penolakan independen per item.
- **REQ-18**: Penolakan ruangan tidak boleh membatalkan persetujuan alat secara otomatis.
- **REQ-19**: Pembatalan mandiri oleh pemohon diizinkan selama barang belum diserahkan fisik.

## 4.6 Sirkulasi, Pengembalian, Sanksi Auto-Block, & Kasir Cash

**Priority: High** · Benefit 5 · Penalty 5 · Cost 4 · Risk 3

PLP mencatat penyerahan/pengembalian, menerima pembayaran cash, dan memicu sanksi blokir otomatis.

**Alur utama:**
- *Pencatatan pengembalian:* PLP periksa kondisi barang (Baik/Rusak) → tutup transaksi.
- *Auto-block:* sistem mendeteksi keterlambatan > 7 hari kalender atau laporan kerusakan → status akun menjadi **Suspended** (BR-3).

**Functional Requirements:**
- **REQ-20**: Modul kasir pembayaran cash bagi PLP (pasangan opsi REQ-16).
- **REQ-21**: Pencatatan kondisi pengembalian aset oleh PLP; otomatis memblokir akun yang telat > 7 hari kalender atau merusak aset.

## 4.7 Dokumentasi Kegiatan, Maintenance, dan Kalibrasi Alat

**Priority: Medium** · Benefit 4 · Penalty 3 · Cost 3 · Risk 2

PLP mengunggah dokumentasi kegiatan praktikum/penelitian serta laporan hasil maintenance dan kalibrasi berkala alat.

**Alur utama:**
- *Dokumentasi kegiatan:* menu "Dokumentasi Kegiatan" → isi nama kegiatan + pilih foto/berkas → "Simpan" → tersimpan ke repositori.
- *Laporan maintenance/kalibrasi:* pilih data alat → "Tambah Catatan Maintenance/Kalibrasi" → isi tanggal perbaikan + unggah laporan PDF → tersimpan sebagai rekam jejak alat.

**Functional Requirements:**
- **REQ-22**: PLP dapat mengunggah dan mengelola berkas dokumentasi kegiatan laboratorium.
- **REQ-23**: Unggah berkas laporan maintenance/kalibrasi yang terhubung ke master data alat terkait (dengan pembatasan ukuran berkas).

## 4.8 Dashboard Analitikal & Dashboard Layanan Tarif Eksternal

**Priority: Medium** · Benefit 4 · Penalty 3 · Cost 3 · Risk 1

Ringkasan eksekutif visual (statistik penggunaan, status inventaris, peminjaman aktif) untuk internal; Dashboard Layanan Tarif Eksternal untuk memantau komersialisasi.

**Alur utama:**
- *Dashboard internal:* Admin/KaLab/PLP login → tampil ringkasan peminjaman aktif, total alat dipinjam, alat rusak, statistik pengguna.
- *Dashboard tarif eksternal:* KaLab/Admin membuka tab "Dashboard Tarif Eksternal" → visualisasi statistik persewaan eksternal, total pendapatan, frekuensi penggunaan fasilitas.

**Functional Requirements:**
- **REQ-24**: Dashboard Analitikal operasional laboratorium bagi Admin, KaLab, PLP.
- **REQ-25**: Dashboard Layanan Tarif Eksternal: grafik transaksi sewa publik + rekapitulasi penggunaan fasilitas oleh pihak eksternal.

## 4.9 Riwayat Peminjaman & Unduh Pelaporan (Inventarisasi & Keuangan)

**Priority: High** · Benefit 5 · Penalty 4 · Cost 3 · Risk 2

Riwayat transaksi per pengguna + ekspor laporan resmi (PDF/Excel): Laporan Inventarisasi Aset dan Laporan Keuangan/Pendapatan.

**Alur utama:**
- *Riwayat:* menu "Riwayat Peminjaman" → daftar seluruh peminjaman + status.
- *Laporan Inventarisasi:* pilih lab + rentang tahun → "Unduh" → PDF/Excel daftar aset + kondisi.
- *Laporan Keuangan:* pilih periode bulan/tahun → "Unduh" → agregasi pendapatan sewa eksternal + denda.

**Functional Requirements:**
- **REQ-26**: Riwayat peminjaman lengkap per pengguna sesuai hak aksesnya (termasuk status per item — DSN-07/MHS-04/EKS-06).
- **REQ-27**: Ekspor Laporan Inventarisasi Aset (alat, mebeler, bahan) PDF/Excel untuk pengelola lab.
- **REQ-28**: Ekspor Laporan Keuangan/Pendapatan Transaksi Sewa Eksternal PDF/Excel per periode terpilih.

## 4.10 Informasi Statis (SOP, Persyaratan, FAQ)

**Priority: Low** · Benefit 3 · Penalty 2 · Cost 1 · Risk 1

Halaman informasi statis publik: SOP laboratorium, syarat & ketentuan peminjaman, FAQ.

**Alur utama:** klik menu "SOP" / "Persyaratan" / "FAQ" → tampil panduan teks, diagram alur, dokumen SOP.

**Functional Requirements:**
- **REQ-29**: Halaman informasi statis yang mudah diakses: SOP, Persyaratan Peminjaman, FAQ.

## 4.11 Surat Bebas Laboratorium Otomatis (PDF)

**Priority: Medium** · Benefit 4 · Penalty 3 · Cost 2 · Risk 1

Pencetakan mandiri Surat Bebas Laboratorium PDF bagi Mahasiswa; tombol unduh aktif otomatis hanya jika seluruh tunggakan dan sanksi bernilai 0.

**Alur utama:** Mahasiswa membuka menu → sistem cek tunggakan = 0 → tombol cetak aktif → klik → PDF diterbitkan otomatis.

**Functional Requirements:**
- **REQ-30**: Cek riwayat peminjaman dan sanksi sebelum mengaktifkan fungsi cetak surat bebas lab.
- **REQ-31**: Render & unduh Surat Bebas Laboratorium mandiri dalam format PDF yang sah jika bebas seluruh tunggakan.
