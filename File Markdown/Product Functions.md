# Product Functions — SIMLAFIS

Matriks ringkas fitur per peran. Ini adalah **sumber untuk menu sidebar per role**. Detail kebutuhan per baris ada di [Business Requirements.md](./Business%20Requirements.md); ketentuan operasional ada di [Business Rule.md](./Business%20Rule.md).

Legenda akses: **C** = buat · **R** = lihat · **U** = ubah · **D** = unduh/ekspor · **X** = aksi proses (setuju/tolak/ubah status) · **—** = tidak ada.

## 1. Autentikasi & Profil (semua role)

| Fitur | ADMIN | KALAB | PLP | DOSEN | MHS | EKST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Login + Lupa Password | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Register mandiri | — | —¹ | —¹ | —¹ | —¹ | ✓ (kategori tarif) |
| Profil: lihat / ubah / ubah password | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Logout | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

¹ Akun internal dibuat Admin (BR-1).

## 2. Dashboard

| Konten | ADMIN | KALAB | PLP | DOSEN | MHS | EKST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Akumulasi pendapatan peminjaman (alat + ruangan) | ✓ | — | — | — | — | — |
| Total pengajuan per status (alat & ruangan): Seluruh/Pending/Disetujui/Ditolak/Dipinjam | ✓ | ✓ | ✓ | ✓² | ✓² | ✓² |
| Grafik batang rekap peminjaman bulanan (alat & ruangan) | ✓ | ✓ | ✓ | ✓² | ✓² | ✓² |
| 10 pengajuan peminjaman terbaru | ✓ | ✓ | ✓ | ✓² | ✓² | ✓² |

² Scope data milik pengguna sendiri (bukan seluruh lab).

## 3. Katalog Laboratorium

| Tab | ADMIN | KALAB | PLP | DOSEN | MHS | EKST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Alat (+ tarif & ketersediaan) | C R U | R | C R U | R | R | R (+ biaya otomatis) |
| Ruangan (+ tarif & jadwal) | C R U | R (jadwal) | C R U (jadwal) | R (jadwal) | R (jadwal) | R (jadwal + biaya) |
| Bahan | R | R | C R U | —³ | —³ | —³ |
| Mebeler | R | R | C R U | — | — | — |

³ Kategori Bahan disembunyikan dari Dosen/Mahasiswa/Eksternal (REQ-11).
Katalog tarif alat & ruangan juga tampil publik tanpa login (BR-7, EKS-01).

## 4. Keranjang Sesi (Cart) & Pengajuan

| Fitur | ADMIN | KALAB | PLP | DOSEN | MHS | EKST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Tambah/hapus item ke cart (modal 2-tab: Alat / Ruangan) | — | — | — | ✓ | ✓ | ✓ |
| Buat pengajuan dari cart | — | — | — | ✓ | ✓ | ✓ |
| Pilih pembayaran (Transfer + bukti / Cash via PLP) | — | — | — | — | — | ✓ |

## 5. Persetujuan & Sirkulasi

| Fitur | ADMIN | KALAB | PLP | DOSEN | MHS | EKST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Lihat status pengajuan | ✓ (semua) | ✓ (semua) | ✓ | ✓ (milik sendiri) | ✓ (milik sendiri) | ✓ (milik sendiri) |
| Setuju/Tolak per item (+ alasan, cek pembayaran) | ✓ | ✓ | — | — | — | — |
| Ubah status pengajuan → Dipinjam/Diserahkan (+ catat ID alat) | ✓ | — | ✓ (hanya item yang sudah disetujui) | — | — | — |
| Batalkan pengajuan mandiri (sebelum "Dipinjam") | — | — | — | ✓ | ✓ | ✓ |
| Validasi pengembalian (kondisi Baik/Rusak, trigger blokir telat) | ✓ | — | ✓ | — | — | — |
| Pengecekan Bebas Lab (daftar mahasiswa ber-tunggakan) | ✓ | — | ✓ | — | — | — |
| Surat Bebas Lab mandiri (PDF jika tunggakan 0) | — | — | — | — | ✓ | — |

## 6. Dokumentasi & Pelaporan

| Fitur | ADMIN | KALAB | PLP | DOSEN | MHS | EKST |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Dokumentasi Kegiatan | R | R | C R | — | — | — |
| Laporan Maintenance & Kalibrasi | R D | R D | Upload R D | — | — | — |
| Laporan Keuangan / Pendapatan | D | D | — | — | — | — |
| Laporan Inventarisasi | D | D | — | — | — | — |
| Riwayat peminjaman (lihat) | ✓ | ✓ (yang diproses) | ✓ | ✓ (sendiri) | ✓ (sendiri) | ✓ (sendiri) |

## 7. Informasi Statis (SOP)

| Konten | Siapa |
|---|---|
| Prosedur Tata Kelola Sistem | ADMIN |
| Prosedur Otorisasi & Pengawasan Lab | KALAB |
| Prosedur Operasional Fisik & Maintenance | PLP |
| Prosedur Peminjaman + Ringkasan Persyaratan + FAQ | DOSEN, MHS, EKST (+ publik) |

## 8. Manajemen Data Pengguna (khusus ADMIN)

| Fitur | Keterangan |
|---|---|
| Buat pengguna | Semua role; akun internal dibuat Admin (BR-1) |
| Lihat & ubah data pengguna | Termasuk ganti role (single role — BR-6) |
| Ubah status hak akses | Aktifkan / tangguhkan (BR-3); unblock setelah validasi tidak ada sanksi aktif |
