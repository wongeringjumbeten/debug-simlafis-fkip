# Overall Description — SIMLAFIS

> Gambaran umum produk: perspektif, fungsi, dan kelas pengguna.

| Atribut | Nilai |
| --- | --- |
| Versi | 2.0 |
| Fase | Sprint 1 |
| Dokumen terkait | [Business Requirements](Business%20Requirements.md) · [System Features](System%20Features.md) · [Architecture](Architecture.md) · [Business Rule](Business%20Rule.md) |

## Daftar Isi

1. [Perspektif Produk](#1-perspektif-produk)
2. [Fungsi Produk](#2-fungsi-produk)
3. [Kelas Pengguna dan Karakteristik](#3-kelas-pengguna-dan-karakteristik)
4. [Asumsi dan Ketergantungan](#4-asumsi-dan-ketergantungan)
5. [Batasan Sistem](#5-batasan-sistem)

---

## 1. Perspektif Produk

SIMLAFIS adalah **sistem manajemen operasional berbasis website** yang dirancang untuk menggantikan proses pencatatan manual berbasis buku besar konvensional di lingkungan Program Studi Pendidikan Fisika FKIP Universitas Jember.

Sistem berfungsi ganda:

| Peran | Fungsi |
| --- | --- |
| Etalase publik | Media penyedia informasi digital terbuka bagi publik (katalog, tarif, SOP, kontak) |
| Pusat data internal | Pengelolaan terpadu 4 rumpun laboratorium: Fisika Dasar, Elektronika, Fisika Lanjut, dan ELF |

**Batas integrasi.** Sistem **tidak** terintegrasi secara teknis dengan platform eksternal universitas (SISTER UNEJ) maupun *payment gateway* keuangan pihak ketiga. Verifikasi pembayaran dilakukan manual oleh KaLab/PLP.

**Nilai pembeda.** Sistem mengintegrasikan **sirkulasi peminjaman alat** dan **penjadwalan ruangan bebas bentrok** ke dalam satu kesatuan alur (*single-stream checkout*) melalui mekanisme **keranjang peminjaman berbasis sesi sementara** (*Temporary Session Cart*), guna mewujudkan tertib administrasi laboratorium yang kredibel dan akuntabel.

---

## 2. Fungsi Produk

### 2.1 Ringkasan fungsi per kelompok pengguna

| Kelompok | Peran | Fungsi utama |
| --- | --- | --- |
| Publik | Guest | Homepage & portal layanan publik; otentikasi & manajemen akun publik |
| Pengelola | Admin | Profil; dashboard analitik; manajemen data pengguna; katalog laboratorium; persetujuan; riwayat; validasi pengembalian; bebas laboratorium; dokumentasi |
| Pengelola | KaLab | Profil; dashboard; katalog (baca); persetujuan; riwayat; dokumentasi |
| Pengelola | PLP | Profil; dashboard; katalog (kelola); riwayat; validasi pengembalian; bebas laboratorium; dokumentasi |
| Peminjam | Dosen | Profil; dashboard; katalog + keranjang sesi; pengajuan; riwayat |
| Peminjam | Mahasiswa | Profil; dashboard; katalog + keranjang sesi; pengajuan; riwayat; bebas laboratorium |
| Peminjam | Eksternal | Profil; dashboard; katalog + keranjang sesi; pengajuan; riwayat; pembayaran |

> **Daftar rinci setiap fungsi** (beserta ID kebutuhan) ada pada [Business Requirements.md](Business%20Requirements.md). Matriks fitur × peran ada pada [Business Requirements §9](Business%20Requirements.md#9-matriks-fitur--peran). Bagian berikut hanya mencatat **kelompok fitur** yang membentuk ruang lingkup produk.

### 2.2 Kelompok fitur

| Kelompok fitur | Cakupan | Rujukan |
| --- | --- | --- |
| Homepage & portal layanan publik | Informasi umum operasional, katalog & tarif, prosedur/persyaratan/SOP/FAQ, alamat loket & jam operasional, kontak PLP | [PUB-01 … PUB-03](Business%20Requirements.md#2-guest--calon-pengguna-publik-pub) |
| Otentikasi & manajemen akun | Login, logout, lupa password, registrasi mandiri (Mahasiswa/Dosen/Eksternal), pembuatan akun oleh Admin, unblock akun | [REQ-01 … REQ-06](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil) |
| Profil pengguna | Melihat profil, mengubah profil, mengubah password | [ADM-02](Business%20Requirements.md#31-autentikasi--profil) |
| Dashboard analitik | Akumulasi pendapatan (khusus Admin), total pengajuan per status, grafik batang bulanan, 10 pengajuan terbaru | [ADM-04 … ADM-07](Business%20Requirements.md#32-dashboard-admin) |
| Manajemen master data aset | Alat, unit detail alat, ruangan, bahan, mebeler, barang | [REQ-07 … REQ-08](System%20Features.md#42-modul-manajemen-master-data-aset) |
| Katalog interaktif & keranjang sesi | Pencarian nama & rentang waktu, stok dinamis, penyembunyian kategori Bahan, keranjang sesi 2 tab | [REQ-09 … REQ-13](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi) |
| Transaksi peminjaman | Checkout dari keranjang, anti-collision jadwal, batas durasi 7 hari, opsi pembayaran | [REQ-14 … REQ-16](System%20Features.md#44-modul-transaksi-peminjaman-dan-anti-collision) |
| Verifikasi & persetujuan parsial | Item-level approval, penolakan independen, pembatalan mandiri | [REQ-17 … REQ-19](System%20Features.md#45-modul-verifikasi--persetujuan-parsial) |
| Validasi pengembalian | Pencatatan kondisi fisik, sanksi otomatis, kasir pembayaran tunai | [REQ-20 … REQ-22](System%20Features.md#46-modul-validasi-pengembalian) |
| Dokumentasi kegiatan, maintenance & kalibrasi | Unggah & lihat dokumentasi kegiatan, unggah & unduh laporan maintenance/kalibrasi | [REQ-23 … REQ-24](System%20Features.md#47-modul-dokumentasi-kegiatan-maintenance-dan-kalibrasi) |
| Dashboard & laporan | Dashboard analitik internal, dashboard layanan tarif eksternal, ekspor laporan inventarisasi & keuangan | [REQ-25 … REQ-29](System%20Features.md#48-modul-dashboard-analitik-dan-layanan-tarif-eksternal) |
| Informasi statik | SOP, persyaratan peminjaman, FAQ | [REQ-30](System%20Features.md#410-modul-informasi-statik-sop-persyaratan-dan-faq) |
| Surat Bebas Laboratorium | Pengecekan tunggakan dan penerbitan surat PDF otomatis | [REQ-31 … REQ-32](System%20Features.md#411-modul-surat-bebas-laboratorium-otomatis) |

---

## 3. Kelas Pengguna dan Karakteristik

Sistem memiliki **tujuh kelas pengguna** (enam peran tunggal + satu kelas publik) dengan karakteristik, tanggung jawab, dan hak akses berbeda guna menjamin keamanan data, penegakan kedisiplinan aturan lab, dan efisiensi operasional.

### 3.1 Guest / Semua Calon Pengguna

| Aspek | Keterangan |
| --- | --- |
| **Deskripsi** | Semua calon pengguna yang ingin mengakses dan mengetahui tentang website SIMLAFIS |
| **Karakteristik** | Pengguna tanpa autentikasi (masyarakat umum, calon peneliti eksternal, mahasiswa/dosen yang belum login). Fokusnya adalah keterbukaan informasi (*transparency*), pemasaran fasilitas lab, dan *lead generation* peminjaman |
| **Hak akses & kemampuan** | Menelusuri homepage dan profil 4 laboratorium (Fisika Dasar, Elektronika, Fisika Lanjut, ELF) serta SOP peminjaman; melihat katalog alat (stok riil) dan kalender ketersediaan ruangan (Available/Booked); melihat transparansi acuan tarif sewa fasilitas khusus kategori eksternal |

### 3.2 Admin

| Aspek | Keterangan |
| --- | --- |
| **Deskripsi** | Pengguna dengan otoritas tertinggi (*super user*) yang bertanggung jawab atas pengawasan operasional menyeluruh, pemeliharaan master data, dan tata kelola konfigurasi sistem secara terpusat |
| **Karakteristik** | Wewenang penuh mengendalikan stabilitas data pengguna dan hak akses operasional; wewenang teknis mengukur laporan keuangan hasil pendapatan layanan sewa; bertanggung jawab melakukan intervensi data atau *override approval* bila Kepala Laboratorium berhalangan hadir |
| **Hak akses & kemampuan** | **Manajemen Akun Terpusat** — membuat, memperbarui, menonaktifkan, serta membuka *suspended*/blokir akun (*unblock*) bagi seluruh peran. **Manajemen Tarif Master** — menginput dan memperbarui nominal tarif eksternal sewa alat dan ruangan. **Hak Akses Override Persetujuan** — menyetujui atau menolak pengajuan (*item-level approval*) secara langsung dalam kondisi darurat/khusus. **Laporan Finansial** — mengakses dan mengunduh laporan keuangan atau rekapitulasi pendapatan transaksi dari layanan berbayar |

### 3.3 Kepala Laboratorium (KaLab)

| Aspek | Keterangan |
| --- | --- |
| **Deskripsi** | Pimpinan tertinggi laboratorium yang memegang otoritas utama terhadap fungsi pengawasan, persetujuan strategis (*primary approver*), dan evaluasi hasil sirkulasi laboratorium |
| **Karakteristik** | Pengguna tingkat eksekutif yang membutuhkan antarmuka ringkas untuk mengambil keputusan persetujuan secara cepat dari jarak jauh; bertanggung jawab atas validasi kelayakan akademis dan operasional terhadap peminjaman alat serta sewa ruangan |
| **Hak akses & kemampuan** | **Primary Item-Level Approval** — meninjau, menyetujui, atau menolak pengajuan izin kegiatan di tingkat detail item (parsial) untuk ruangan dan alat dalam satu nomor transaksi. **Verifikasi Keuangan** — memeriksa dan memvalidasi keaslian unggahan bukti transfer pembayaran dari pengguna eksternal yang memilih metode Transfer Bank. **Pengawasan & Laporan** — memantau dashboard ringkasan status peminjaman, statistik tren bulanan, 10 transaksi terbaru, ketersediaan stok bahan internal lab, dan laporan maintenance |

### 3.4 Pranata Laboratorium Pendidikan (PLP)

| Aspek | Keterangan |
| --- | --- |
| **Deskripsi** | Staf teknis internal laboratorium yang bertanggung jawab atas pengelolaan inventaris fisik, pencatatan bahan internal dan mebeler, pengaturan jadwal kalender bebas bentrok, serta eksekusi penyerahan dan pengembalian barang di loket |
| **Karakteristik** | Pengguna operasional harian yang mengelola data unit fisik barang, log kondisi kelayakan alat, stok bahan lab, data mebeler, pembuatan jadwal reguler, unggah dokumentasi kegiatan, unggah laporan maintenance & kalibrasi, dan transaksi serah-terima di loket |
| **Hak akses & kemampuan** | **Manajemen Inventaris Operasional** — mengelola spesifikasi katalog alat, unit item fisik (lokasi lab, status Baik/Rusak), data mebeler, serta mencatat dan memperbarui stok bahan internal lab secara berkala. **Kontrol Jadwal Reguler** — mengatur kalender jadwal ruangan lab (jadwal praktikum reguler) dengan pengecekan bentrok (*anti-collision check*). **Penyerahan Fisik & Kasir Pembayaran** — mencatat/memilih ID unit fisik alat yang diserahkan, menerima dan mengonfirmasi pembayaran Tunai di loket dari pengguna eksternal, serta mengubah status transaksi menjadi Dipinjam (memicu pemotongan stok fisik alat secara resmi). **Validasi Pengembalian Fisik** — memproses pemulangan aset, mencatat kondisi fisik alat (Baik/Rusak), memperbarui status menjadi Selesai (stok fisik bertambah kembali), serta memicu penguncian akun (*suspended*) bila terlambat. **Pusat Dokumentasi** — mengunggah laporan maintenance/kalibrasi dan dokumentasi kegiatan |

### 3.5 Dosen

| Aspek | Keterangan |
| --- | --- |
| **Deskripsi** | Pengguna internal tingkat lanjut dari civitas akademika yang menggunakan fasilitas laboratorium untuk keperluan penelitian riset pribadi |
| **Karakteristik** | Memerlukan akses informasi ketersediaan alat dan jadwal ruangan yang akurat untuk menyusun jadwal riset |
| **Hak akses & kemampuan** | Melihat katalog ketersediaan alat dan kalender jadwal ruangan secara *real-time* **tanpa label tarif harga** (tarif internal/gratis). **Keranjang Sesi** — memilih alat dan ruangan via pop-up modal (mengisi tanggal, jam, dan jumlah unit) ke dalam keranjang sesi sementara. **Pengajuan Peminjaman** — membuat pengajuan transaksi terpadu serta membatalkan pengajuan yang masih berstatus Pending. **Pemantauan Status** — melihat status peninjauan per baris item (Disetujui/Ditolak) oleh KaLab |

### 3.6 Mahasiswa

| Aspek | Keterangan |
| --- | --- |
| **Deskripsi** | Pengguna internal harian dari kalangan mahasiswa Pendidikan Fisika yang memanfaatkan fasilitas laboratorium untuk kegiatan praktikum mandiri atau penelitian tugas akhir/skripsi |
| **Karakteristik** | Aktor peminjam harian yang pergerakannya dibatasi secara ketat oleh sistem demi kedisiplinan dan keamanan aset lab |
| **Hak akses & kemampuan** | Melihat katalog 2 tab (Alat dan Jadwal Ruangan) tanpa label tarif harga. **Keranjang Sesi** — menambahkan alat dan/atau ruangan via pop-up modal. **Pengajuan Peminjaman** — membuat pengajuan terpadu dengan memasukkan detail kegiatan, memilih Dosen Pembimbing, dan mengunggah berkas rekomendasi. **Modul Bebas Laboratorium** — mengecek daftar tunggakan alat pribadi secara mandiri serta mengunduh Surat Keterangan Bebas Lab (PDF) yang tombol unduhnya otomatis aktif hanya bila daftar tunggakan bernilai 0 (nol). **Aturan Sanksi** — mematuhi batas peminjaman maksimal 7 hari kalender; keterlambatan memicu sanksi `suspended`. **Pemantauan Status** — melihat status peninjauan per baris item |

### 3.7 Pengguna Eksternal

| Aspek | Keterangan |
| --- | --- |
| **Deskripsi** | Pihak di luar lingkungan Pendidikan Fisika FKIP Universitas Jember yang ingin mengakses informasi publik laboratorium atau menggunakan fasilitas untuk keperluan riset berbayar |
| **Karakteristik** | Pengguna luar yang memerlukan informasi ketersediaan fasilitas beserta rincian tarif sewa secara transparan. Sub-kategori **Internal-UNEJ** mendapat label harga sewa khusus akademis universitas, sedangkan **Luar-UNEJ** dikenakan tarif komersial penuh |
| **Hak akses & kemampuan** | **Akses Publik (Pra-Login)** — melihat halaman informasi publik berupa daftar katalog dan tarif resmi sewa. **Checkout Berbayar** — membuat pengajuan peminjaman via keranjang sesi sementara dengan total kalkulasi biaya otomatis menyesuaikan sub-kategori akun terdaftar. **Fleksibilitas Pembayaran** — memilih metode Transfer Bank (wajib mengunggah foto bukti transfer) atau Tunai/Cash (dibayarkan langsung di loket kepada PLP saat pengambilan barang/kunci). **Riwayat Transaksi** — memantau status persetujuan, status pembayaran (Unpaid/Paid), membatalkan pengajuan berstatus Pending, serta melihat riwayat peminjaman. **Pemantauan Status** — melihat status peninjauan per baris item |

---

## 4. Asumsi dan Ketergantungan

| # | Asumsi / Ketergantungan | Dampak bila tidak terpenuhi |
| --- | --- | --- |
| A1 | Pengguna memiliki akses internet dan peramban modern (Chrome/Edge/Firefox versi terbaru) | Antarmuka Inertia tidak dapat dirender |
| A2 | Server menyediakan PostgreSQL sebagai basis data utama | Sistem tidak dapat berjalan pada mode produksi |
| A3 | Verifikasi dokumen identitas (KTM/kartu pegawai/KTP) dilakukan **manual** oleh Admin/PLP | Risiko akun fiktif pada registrasi mandiri |
| A4 | Verifikasi pembayaran dilakukan **manual** (bukti transfer diperiksa KaLab, tunai diterima PLP) | Tidak ada konfirmasi pembayaran otomatis |
| A5 | Data wilayah (provinsi → kabupaten → kecamatan → desa) tersedia di basis data | Registrasi pengguna eksternal tidak dapat diselesaikan |
| A6 | Data master aset dan tarif diisi oleh Admin/PLP sebelum katalog publik berguna | Katalog tampil kosong |
| A7 | Pengguna mematuhi batas peminjaman 7 hari kalender | Sanksi penangguhan diterapkan ([BR-3](Business%20Rule.md#br-3--sanksi-penangguhan-akses-manual-block)) |

---

## 5. Batasan Sistem

| # | Batasan | Keterangan |
| --- | --- | --- |
| B1 | Tidak ada integrasi dengan SISTER UNEJ | Data civitas tidak divalidasi otomatis |
| B2 | Tidak ada *payment gateway* daring | Pembayaran diverifikasi manual |
| B3 | Verifikasi email, 2FA, dan passkey belum diaktifkan pada Sprint 1 | Pengerasan keamanan direncanakan pada sprint lanjutan |
| B4 | Tidak ada aplikasi mobile native | Antarmuka berbasis web responsif |
| B5 | Tidak ada notifikasi WhatsApp/email otomatis | Pemberitahuan mengandalkan antarmuka sistem |
| B6 | Pemetaan unit laboratorium masih sementara | Menunggu referensi unit lab resmi dari basis data ([Architecture §13](Architecture.md#13-batasan-dan-utang-teknis), temuan T1) |
| B7 | Ketersediaan foto aset terbatas | Baru 5 alat yang dipetakan ke paket UI/UX; sisanya menunggu data master resmi |
