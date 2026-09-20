# Sprint 1 — Analisis Kebutuhan Sistem

> Analisis kebutuhan fungsional dan bisnis untuk Sprint 1 SIMLAFIS.

| Atribut | Nilai |
| --- | --- |
| Versi | 2.0 |
| Fase | Sprint 1 |
| Jumlah prosedur | 38 (`PR-01` … `PR-38`) |
| Dokumen terkait | [Business Requirements](Business%20Requirements.md) · [System Features](System%20Features.md) · [User Story](user%20story.md) · [Tabel Data](tabel%20data.md) · [Architecture](Architecture.md) |

## Daftar Isi

1. [Analisis Kebutuhan Fungsional](#1-analisis-kebutuhan-fungsional)
   - [1.1 Modul Akses & Otentikasi](#11-modul-akses--otentikasi)
   - [1.2 Modul Profil](#12-modul-profil)
   - [1.3 Modul Manajemen Pengguna](#13-modul-manajemen-pengguna)
   - [1.4 Modul Dashboard](#14-modul-dashboard)
   - [1.5 Modul Katalog Alat](#15-modul-katalog-alat)
   - [1.6 Modul Katalog Ruangan](#16-modul-katalog-ruangan)
   - [1.7 Modul Data Bahan](#17-modul-data-bahan)
   - [1.8 Modul Data Mebeler](#18-modul-data-mebeler)
   - [1.9 Modul Sesi](#19-modul-sesi)
2. [Daftar Prosedur](#2-daftar-prosedur)
3. [Analisis Bisnis per Peran](#3-analisis-bisnis-per-peran)
4. [Gap Dokumentasi Sprint 1](#4-gap-dokumentasi-sprint-1)

---

## 1. Analisis Kebutuhan Fungsional

Setiap prosedur ditulis dengan format tetap: **Aktor**, **Rujukan**, **Alur** (langkah bernomor), **Validasi & pengecualian**, dan **Hasil**.

### 1.1 Modul Akses & Otentikasi

#### PR-01 · Akses Publik / Homepage

| | |
| --- | --- |
| **Aktor** | Guest / semua calon pengguna |
| **Rujukan** | [PUB-01](Business%20Requirements.md#2-guest--calon-pengguna-publik-pub), [PUB-02](Business%20Requirements.md#2-guest--calon-pengguna-publik-pub), [PUB-03](Business%20Requirements.md#2-guest--calon-pengguna-publik-pub), [BR-7](Business%20Rule.md#br-7--ketersediaan-informasi-publik) |

**Alur**

1. Pengguna membuka alamat situs web SIMLAFIS.
2. Sistem menampilkan halaman homepage yang memuat:
   - informasi umum operasional dan deskripsi layanan laboratorium;
   - daftar katalog alat dan ruangan beserta spesifikasi dan tarif layanan sewa;
   - prosedur peminjaman, ringkasan persyaratan, dokumen SOP, dan FAQ;
   - bilah pencarian dan filter (kata kunci atau unit laboratorium);
   - alamat loket lab, jam operasional, serta kontak WhatsApp/email PLP.
3. Pengguna menekan tombol "Pinjam" atau "Tambah ke Keranjang".
4. Sistem menampilkan dialog petunjuk dan mengarahkan pengguna ke halaman Login / Registrasi Akun.

**Hasil:** Pengguna memperoleh informasi layanan lengkap tanpa perlu login; aksi peminjaman dialihkan ke alur autentikasi.

---

#### PR-02 · Login

| | |
| --- | --- |
| **Aktor** | Admin, KaLab, PLP, Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [REQ-02](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil), [BR-3](Business%20Rule.md#br-3--sanksi-penangguhan-akses-manual-block) |

**Alur**

1. Pengguna membuka website SIMLAFIS dan sistem menampilkan homepage.
2. Pengguna mengklik "Login".
3. Sistem menampilkan form login berisi **Email** `varchar(255)` dan **Password** `varchar(255)`.
4. Pengguna mengisi form dan mengklik tombol "Login Sekarang".
5. Sistem melakukan validasi data login:
   - bila form kosong/tidak lengkap → pesan "Semua informasi harus diisi" dan kembali ke form login;
   - bila lengkap → sistem memeriksa data akun.
6. Bila kredensial sesuai, sistem mengidentifikasi peran pengguna (`admin` / `kalab` / `plp` / `mahasiswa` / `dosen` / `eksternal`) dan menampilkan dashboard sesuai peran.
7. Bila kredensial tidak sesuai, sistem menampilkan pesan "Akun belum terdaftar" dan kembali ke form login.
8. Setelah berhasil login, sistem membuat sesi (*session*) pengguna.

**Validasi & pengecualian**

| Kondisi | Perilaku sistem |
| --- | --- |
| Form kosong/tidak lengkap | Pesan "Semua informasi harus diisi"; tetap di form login |
| Kredensial salah | Pesan "Akun belum terdaftar"; tetap di form login |
| Status akun `blocked` | Autentikasi ditolak; sesi aktif dicabut; pesan "Akun Anda diblokir. Hubungi administrator laboratorium." |
| Status akun `suspended` | Login **berhasil**; akses fitur peminjaman dibatasi ([PR-11](#pr-11--mengubah-status-hak-akses-pengguna)) |

**Hasil:** Pengguna terautentikasi dan diarahkan ke dashboard sesuai peran.

---

#### PR-03 · Lupa Password

| | |
| --- | --- |
| **Aktor** | Admin, KaLab, PLP, Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [REQ-04](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil) |

**Alur**

1. Pengguna membuka halaman login pada sistem SIMLAFIS.
2. Pengguna mengklik tautan "Lupa Password".
3. Sistem menampilkan form pemulihan kata sandi berisi **Email Terdaftar** `varchar(255)`.
4. Pengguna mengisi email terdaftar dan mengklik tombol "Kirim Link Reset Password".
5. Sistem melakukan validasi email:
   - email tidak diisi → pesan "Email tidak boleh kosong";
   - email tidak terdaftar → pesan "Email tidak terdaftar pada sistem";
   - email valid → sistem membuat token reset sementara dan mengirimkan email berisi tautan pembaruan kata sandi.
6. Pengguna membuka tautan reset dari email.
7. Sistem menampilkan form reset password berisi **Password Baru** dan **Konfirmasi Password Baru** (keduanya `varchar(255)`).
8. Pengguna mengisi kata sandi baru dan mengklik "Perbarui Password".
9. Sistem memvalidasi: bila kedua kata sandi tidak identik → pesan "Konfirmasi password tidak cocok"; bila identik → sistem memperbarui kata sandi, menghapus token sementara, menampilkan pesan "Password berhasil diperbarui, silakan login kembali", dan mengarahkan ke halaman login.

**Hasil:** Kata sandi diperbarui dan token reset dihapus.

---

#### PR-04 · Register (Mahasiswa, Dosen, Eksternal)

| | |
| --- | --- |
| **Aktor** | Mahasiswa UNEJ, Dosen UNEJ, Pengguna Umum (non-UNEJ) |
| **Rujukan** | [REQ-03](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil), [BR-1](Business%20Rule.md#br-1--otoritas-manajemen-akun), [BR-2](Business%20Rule.md#br-2--kategori-tarif-eksternal) |

**Alur**

1. Pengguna membuka website SIMLAFIS dan mengklik "Daftar Akun".
2. Sistem menampilkan form registrasi tahap pertama:
   - Nama Lengkap `varchar(255)`
   - Kategori Pengguna: enum `Mahasiswa UNEJ` / `Dosen UNEJ` / `Pengguna Umum (Non-UNEJ)`
   - Nomor Telepon/WA `varchar(20)`
   - Email `varchar(255)`
3. Pengguna mengisi seluruh data dan mengklik tombol "Lanjut".
4. Sistem memvalidasi masukan:
   - ada field kosong → pesan "Semua kolom wajib diisi";
   - format email tidak valid → pesan "Format email tidak sesuai";
   - email sudah terdaftar → pesan "Email sudah terdaftar, silakan gunakan email lain";
   - seluruh data valid → sistem menampilkan form registrasi lanjutan sesuai kategori.
5. Sistem menampilkan form lanjutan menurut kategori:

   | Kategori | Field tambahan |
   | --- | --- |
   | **Dosen UNEJ** | NIP `integer` (unik), Fakultas `varchar(255)`, Prodi `varchar(255)`, Password, Konfirmasi Password, unggah Foto Profil (JPG/PNG), unggah Foto Kartu Pegawai (JPG/PNG) |
   | **Mahasiswa UNEJ** | NIM `integer` (unik), Fakultas `varchar(255)`, Prodi `varchar(255)`, Password, Konfirmasi Password, unggah Foto Profil (JPG/PNG), unggah Foto Kartu Tanda Mahasiswa (JPG/PNG) |
   | **Pengguna Umum (non-UNEJ)** | NIK `integer` (unik), Instansi `varchar(255)`, Provinsi/Kabupaten/Kecamatan/Kelurahan-Desa `varchar(100)`, Alamat Lengkap `varchar(255)`, Password, Konfirmasi Password, unggah Foto Profil (JPG/PNG), unggah Foto Kartu Tanda Penduduk (JPG/PNG) |

6. Pengguna mengisi seluruh data dan mengklik tombol "Daftar Sekarang".
7. Sistem memvalidasi masukan:
   - ada field belum diisi → pesan "Semua kolom wajib diisi";
   - unggahan > 2 MB atau bukan JPG/PNG → pesan "Format foto harus JPG/PNG dan maksimal 2MB";
   - Password dan Konfirmasi Password tidak sama → pesan "Konfirmasi password tidak cocok";
   - seluruh data valid → sistem menampilkan pop-up "Yakin ingin melakukan registrasi?".
8. Bila pengguna mengklik "Ya", sistem menyimpan data akun baru sesuai kategori, menampilkan pesan "Registrasi akun berhasil, silakan login", dan mengarahkan ke halaman login.
9. Bila pengguna mengklik "Batal", sistem menampilkan pesan "Batal Melakukan Registrasi" dan tetap menampilkan form registrasi.

**Validasi & pengecualian**

| Kondisi | Perilaku sistem |
| --- | --- |
| Kategori eksternal tanpa wilayah berjenjang yang valid | Registrasi ditolak; hierarki wilayah harus lolos (kabupaten ∈ provinsi, dan seterusnya) |
| NIM/NIP/NIK duplikat | Registrasi ditolak dengan pesan kesalahan |
| Berkas disimpan | Satu transaksi basis data untuk akun + profil; berkas disimpan pada disk publik |

**Hasil:** Akun baru terbuat dengan peran `mahasiswa`, `dosen`, atau `eksternal` (kategori tarif untuk eksternal).

> ⚠️ Registrasi mandiri **tidak berlaku** untuk Admin, KaLab, dan PLP — akun pengelola dibuat melalui [PR-09](#pr-09--membuat-data-pengguna-admin).

---

### 1.2 Modul Profil

#### PR-05 · Melihat Profil

| | |
| --- | --- |
| **Aktor** | Admin, KaLab, PLP, Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [ADM-02](Business%20Requirements.md#31-autentikasi--profil), [KLB-01](Business%20Requirements.md#41-autentikasi--profil), [PLP-01](Business%20Requirements.md#51-autentikasi--profil), [DSN-01](Business%20Requirements.md#61-autentikasi--profil), [MHS-01](Business%20Requirements.md#71-autentikasi--profil), [EKS-03](Business%20Requirements.md#82-autentikasi--profil) |

**Alur**

1. Pengguna masuk ke halaman dashboard sesuai peran.
2. Pengguna mengklik menu/foto "Profil Saya".
3. Sistem mengambil data profil dari basis data berdasarkan ID sesi aktif.
4. Sistem menampilkan halaman profil yang mencakup: foto profil, nama lengkap, NIM/NIP/ID identitas, instansi/program studi, email, nomor telepon, hak akses (peran), dan berkas identitas.

**Hasil:** Pengguna melihat data profilnya sendiri.

---

#### PR-06 · Mengubah Profil

| | |
| --- | --- |
| **Aktor** | Admin, KaLab, PLP, Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [REQ-05](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil), [BR-2](Business%20Rule.md#br-2--kategori-tarif-eksternal), [BR-6](Business%20Rule.md#br-6--eksklusivitas-peran-role) |

**Alur**

1. Pengguna membuka halaman "Profil Saya" dan mengklik tombol "Ubah Profil".
2. Sistem menampilkan form ubah profil yang terisi data sebelumnya: Foto Profil (JPG/PNG maks 2 MB), Nama Lengkap `varchar(255)`, Nomor Telepon `varchar(20)`, Instansi/Program Studi `varchar(255)`.
3. Pengguna memperbarui data dan mengklik tombol "Simpan Perubahan".
4. Sistem memvalidasi: field kosong → "Semua kolom wajib diisi"; unggahan > 2 MB atau bukan JPG/PNG → "Format foto harus JPG/PNG dan maksimal 2MB".
5. Bila data valid, sistem menampilkan pop-up "Yakin ingin menyimpan perubahan?".
6. Bila pengguna mengklik "Ya", sistem memperbarui basis data dan tampilan profil, lalu menampilkan pesan "Profil berhasil diperbarui".
7. Bila pengguna mengklik "Batal", sistem menampilkan pesan "Data profil batal diubah" dan tetap menampilkan form.

**Validasi & pengecualian**

| Field | Perlakuan |
| --- | --- |
| `role` | **Tidak pernah** diterima pada alur ini — mencegah eskalasi hak akses |
| `kategori` (kategori tarif) | **Tidak pernah** dapat diubah pengguna; hanya Admin ([BR-2](Business%20Rule.md#br-2--kategori-tarif-eksternal)) |
| NIM/NIP/Email | Bersifat terkunci (read-only) pada antarmuka |

**Hasil:** Data profil diperbarui tanpa mengubah peran maupun kategori tarif.

---

#### PR-07 · Mengubah Password

| | |
| --- | --- |
| **Aktor** | Admin, KaLab, PLP, Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [REQ-04](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil) |

**Alur**

1. Pengguna membuka halaman "Profil Saya" lalu memilih tab "Ubah Password".
2. Sistem menampilkan form ubah password: Password Lama, Password Baru, Konfirmasi Password Baru (semuanya `varchar(255)`).
3. Pengguna mengisi data dan mengklik tombol "Perbarui Password".
4. Sistem memvalidasi:
   - ada form kosong → pesan "Seluruh kolom password wajib diisi";
   - Password Lama tidak cocok dengan hash di basis data → pesan "Password lama Anda salah";
   - Password Baru dan Konfirmasi tidak sama → pesan "Konfirmasi password baru tidak cocok";
   - validasi berhasil → pop-up "Yakin ingin menyimpan perubahan password?".
5. Bila pengguna mengklik "Ya", sistem memperbarui kata sandi dan menampilkan pesan "Password berhasil diubah".
6. Bila pengguna mengklik "Batal", sistem menampilkan pesan "Password batal diubah" dan tetap menampilkan form.

**Hasil:** Kata sandi diperbarui; sesi lain tidak otomatis dicabut.

---

### 1.3 Modul Manajemen Pengguna

> Seluruh prosedur pada modul ini hanya dapat diakses peran **Admin** ([BR-1](Business%20Rule.md#br-1--otoritas-manajemen-akun), [BR-6](Business%20Rule.md#br-6--eksklusivitas-peran-role)).

#### PR-08 · Melihat Daftar Pengguna

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-09](Business%20Requirements.md#33-manajemen-data-pengguna) |

**Alur**

1. Admin memilih menu "Manajemen Pengguna".
2. Sistem melakukan query untuk mengambil daftar seluruh pengguna.
3. Sistem menampilkan tabel daftar pengguna dengan fitur pencarian dan filter peran, memuat kolom: Nama Lengkap, Foto Profil, Email, Institusi, Hak Akses (Role), Status Akses (`active`/`blocked`/`suspended`), dan Aksi (Detail, Edit, Ubah Status).
4. Admin mengklik tombol "Detail" pada salah satu data pengguna.
5. Sistem menampilkan pop-up/halaman detail: Nama Lengkap, Foto Profil, Email, No Identitas, No Telepon, Institusi, Hak Akses (Role), Status Akses, dan Foto Identitas.

**Hasil:** Admin memperoleh daftar dan rincian akun pengguna.

---

#### PR-09 · Membuat Data Pengguna

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-08](Business%20Requirements.md#33-manajemen-data-pengguna), [BR-1](Business%20Rule.md#br-1--otoritas-manajemen-akun) |

**Alur**

1. Admin berada di halaman "Manajemen Pengguna" dan mengklik tombol "Tambah Pengguna".
2. Sistem menampilkan form pembuatan pengguna baru: Nama Lengkap `varchar(255)`, Instansi/Organisasi `varchar(255)`, Role (enum: Admin / KaLab / PLP / Mahasiswa / Internal-UNEJ / Luar-UNEJ), Nomor Telepon/WA `varchar(20)`, No Identitas `varchar(100)`, Email `varchar(255)`, Password, Konfirmasi Password, Foto Profil, dan Foto Identitas (KTM atau KTP).
3. Admin mengisi seluruh informasi dan mengklik tombol "Simpan Data".
4. Sistem memvalidasi data:
   - ada field belum diisi → pesan "Semua kolom wajib diisi";
   - format email tidak valid → pesan "Format email tidak sesuai";
   - email sudah terdaftar → pesan "Email sudah terdaftar, silakan gunakan email lain";
   - Password dan Konfirmasi Password tidak sama → pesan "Konfirmasi password tidak cocok".
5. Bila data valid, sistem menyimpan pengguna baru dan menampilkan pesan "Data pengguna berhasil ditambahkan".

**Validasi & pengecualian**

| Kondisi | Perilaku sistem |
| --- | --- |
| Peran non-eksternal diberi `instansi`/`kategori` | Atribut eksternal dinormalkan menjadi kosong |
| Admin mengubah perannya sendiri | Ditolak (mencegah *self-demotion* dan *lockout*) |

**Hasil:** Akun pengelola (Admin/KaLab/PLP) maupun akun peminjam terbuat oleh Admin.

---

#### PR-10 · Mengubah Data Pengguna

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-09](Business%20Requirements.md#33-manajemen-data-pengguna) |

**Alur**

1. Admin mengklik tombol "Edit" pada salah satu baris pengguna di tabel daftar pengguna.
2. Sistem menampilkan form ubah pengguna yang terisi data pengguna saat ini.
3. Admin mengubah informasi pengguna (misalnya nama, email, nomor telepon, atau peran) dan mengklik tombol "Perbarui Data".
4. Sistem memvalidasi kelengkapan data.
5. Bila data valid, sistem memperbarui informasi pengguna dan menampilkan pesan "Data pengguna berhasil diperbarui".

**Hasil:** Data akun pengguna diperbarui sesuai penetapan tugas.

---

#### PR-11 · Mengubah Status Hak Akses Pengguna

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-10](Business%20Requirements.md#33-manajemen-data-pengguna), [BR-3](Business%20Rule.md#br-3--sanksi-penangguhan-akses-manual-block), [REQ-06](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil) |

**Alur**

1. Admin memilih pengguna pada tabel data pengguna dan mengklik tombol "Ubah Status".
2. Sistem menampilkan pop-up modal pilihan status: Status Akses (dropdown `active` / `blocked` / `suspended`) dan Alasan Perubahan Status (`TEXT`).
3. Admin memilih status (misalnya `active` → `suspended` akibat keterlambatan/kerusakan, atau sebaliknya mengaktifkan kembali) dan mengisi alasan, lalu mengklik tombol "Simpan Status".
4. Sistem memperbarui status hak akses pengguna pada basis data.
5. Bila status diubah menjadi `suspended`, sistem menolak pengguna tersebut membuat pengajuan peminjaman baru di katalog.
6. Bila status diubah menjadi `blocked`, sistem menolak pengguna mengakses seluruh fitur sistem.
7. Sistem menampilkan pesan "Status hak akses pengguna berhasil diperbarui".

**Validasi & pengecualian**

| Kondisi | Perilaku sistem |
| --- | --- |
| Admin menangguhkan akunnya sendiri | Ditolak |
| Akun `blocked` sedang memiliki sesi aktif | Sesi dicabut pada permintaan berikutnya |

**Hasil:** Status akses pengguna diperbarui dan tercatat (alasan, waktu, pelaku).

---

### 1.4 Modul Dashboard

#### PR-12 · Melihat Dashboard (Admin, KaLab, PLP)

| | |
| --- | --- |
| **Aktor** | Admin, KaLab, PLP |
| **Rujukan** | [ADM-04 … ADM-07](Business%20Requirements.md#32-dashboard-admin), [KLB-02](Business%20Requirements.md#42-dashboard-kalab), [PLP-02](Business%20Requirements.md#52-dashboard-plp) |

**Alur**

1. Pengguna berhasil melakukan login dan sistem otomatis mengarahkan ke Dashboard Utama.
2. Sistem melakukan kalkulasi dan menampilkan komponen analitik:
   - **Akumulasi Pendapatan** — total nominal penerimaan tunai dan transfer bank dari transaksi yang lunas (**khusus Admin**);
   - **Statistik Peminjaman Alat** — kotak ringkasan Total Seluruh Pengajuan, Pending, Disetujui, Ditolak, dan Sedang Dipinjam;
   - **Statistik Peminjaman Ruangan** — ringkasan dengan rincian status yang sama;
   - **Grafik Batang Peminjaman Alat** — tren frekuensi bulanan pada tahun berjalan;
   - **Grafik Batang Peminjaman Ruangan** — tren frekuensi bulanan pada tahun berjalan;
   - **10 Pengajuan Peminjaman Terbaru** — tabel ringkas 10 transaksi terakhir beserta statusnya.

**Validasi & pengecualian**

| Kondisi | Perilaku sistem |
| --- | --- |
| Pengguna bukan Admin | Data pendapatan **tidak dikirim** ke antarmuka |
| KaLab/PLP | Melihat agregat seluruh laboratorium, tanpa pendapatan |

**Hasil:** Pengelola memantau operasional seluruh laboratorium.

---

#### PR-13 · Melihat Dashboard (Mahasiswa, Dosen, Eksternal)

| | |
| --- | --- |
| **Aktor** | Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [DSN-02](Business%20Requirements.md#62-dashboard-dosen), [MHS-02](Business%20Requirements.md#72-dashboard-mahasiswa), [EKS-04](Business%20Requirements.md#83-dashboard-eksternal-setelah-login) |

**Alur**

1. Pengguna berhasil login ke dalam sistem SIMLAFIS.
2. Sistem menampilkan dashboard personal yang berisi:
   - **Ringkasan Aktivitas Peminjaman** — total peminjaman aktif, peminjaman menunggu persetujuan, dan riwayat peminjaman;
   - **Status Peminjaman Terkini** — widget status pengajuan alat/ruangan (Draft, Pending Approval PLP/KaLab, Approved, Disetujui, Ditolak, Berjalan, Selesai);
   - **Notifikasi Pengembalian** — peringatan batas waktu (*deadline*) pengembalian alat yang sedang dipinjam;
   - **Akses Cepat (Quick Links)** — tombol pintas ke "Katalog Alat" dan "Katalog & Jadwal Ruangan".

**Validasi & pengecualian**

| Kondisi | Perilaku sistem |
| --- | --- |
| Cakupan data | Hanya data milik pengguna yang bersangkutan (bukan agregat lab) |

**Hasil:** Peminjam memantau status pengajuannya secara *real-time*.

---

### 1.5 Modul Katalog Alat

#### PR-14 · Membuat Data Katalog dan Layanan Tarif Alat (Admin)

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-11](Business%20Requirements.md#34-katalog-laboratorium) |

**Alur**

1. Admin memilih menu "Katalog Laboratorium" → sistem menampilkan daftar katalog alat.
2. Admin mengklik tombol "Tambah Alat & Tarif".
3. Sistem menampilkan form tambah data alat: Nama Alat `varchar(255)`, Foto Alat (JPG/PNG maks 2 MB), Deskripsi `text`, dan Tarif Eksternal `decimal(12,2)` (default 0.00).
   > Stok **tidak** diinput manual — dihitung otomatis dari akumulasi `id_detail_alat`.
4. Admin mengisi seluruh informasi dan mengklik tombol "Simpan Data Alat".
5. Sistem memvalidasi masukan:
   - field kosong → "Semua informasi harus diisi" dan kembali ke form;
   - nominal tarif tidak valid (kurang dari 0 atau berupa huruf) → "Data numerik tarif tidak valid";
   - unggahan > 2 MB atau bukan JPG/PNG → "Format foto harus JPG/PNG dan maksimal 2MB";
   - data valid → pop-up "Yakin ingin menyimpan data alat baru?".
6. Bila Admin mengklik "Ya", sistem menyimpan data katalog alat dan acuan tarif sewa publik ke basis data, menampilkan pesan "Data alat dan layanan tarif berhasil ditambahkan", dan menampilkan kembali halaman daftar katalog alat dengan data terbaru.
7. Bila Admin mengklik "Batal", sistem menampilkan pesan "Penambahan data alat dibatalkan" dan tetap menampilkan halaman daftar katalog.

**Hasil:** Master alat baru terdaftar dengan acuan tarif publik.

---

#### PR-15 · Melihat Katalog, Ketersediaan, dan Layanan Tarif Alat (Admin)

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-11](Business%20Requirements.md#34-katalog-laboratorium) |

**Alur**

1. Admin memilih menu "Katalog Laboratorium".
2. Sistem melakukan query untuk mengambil seluruh data inventaris alat dan informasi tarif.
3. Sistem menampilkan katalog alat dalam bentuk tabel/kartu interaktif: Nama Alat, Foto Alat, Stok Total (kalkulasi otomatis), Stok Ketersediaan Riil (unit berstatus tersedia), Deskripsi, Tarif Eksternal, dan Aksi (Detail, Ubah).
4. Admin mengklik tombol "Detail" pada salah satu alat.
5. Sistem menampilkan rincian aset berdasarkan seluruh `id_detail_alat` yang terdaftar: No Seri Unit `varchar(100)`, Nama Alat, Lokasi Penyimpanan (Unit Lab), Kondisi (enum `baik`/`rusak`), Status (enum `tersedia`/`tidak tersedia`/`sedang perbaikan`), Tahun Pengadaan, Sumber Dana, Harga Beli `decimal(12,2)`, dan Catatan.
6. Admin dapat memilih filter unit laboratorium atau memasukkan kata kunci pada bilah pencarian.
7. Sistem menyaring dan memperbarui tampilan katalog secara *real-time* sesuai kriteria filter.

**Hasil:** Admin memantau kuantitas stok dan kondisi fisik inventaris.

---

#### PR-16 · Mengubah Data Katalog dan Layanan Tarif Alat (Admin)

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-11](Business%20Requirements.md#34-katalog-laboratorium) |

**Alur**

1. Admin membuka menu "Katalog Laboratorium" → sistem menampilkan daftar data alat beserta layanan tarif.
2. Admin memilih data alat yang akan diubah dengan mengklik tombol "Ubah".
3. Sistem menampilkan form ubah master alat yang terisi data saat ini: Nama Alat, Foto Alat, Deskripsi, Tarif Eksternal.
4. Admin melakukan perubahan data atau penyesuaian nominal tarif sewa dan mengklik tombol "Simpan Perubahan".
5. Sistem memvalidasi: field kosong → "Semua informasi harus lengkap"; nominal tarif tidak valid → "Data numerik tarif tidak valid"; gambar tidak sesuai ketentuan → "Format foto harus JPG/PNG dan maksimal 2MB".
6. Bila data valid, sistem menampilkan pop-up "Yakin ingin menyimpan perubahan data alat?".
7. Bila Admin mengklik "Ya", sistem memperbarui data master dan tarif, menampilkan pesan "Data alat dan layanan tarif telah berhasil diubah", dan menampilkan kembali halaman katalog dengan data terbaru.
8. Bila Admin mengklik "Batal", sistem menampilkan pesan "Perubahan data alat dibatalkan" dan tetap menampilkan halaman daftar katalog.

**Hasil:** Master alat dan tarif diperbarui.

---

#### PR-17 · Melihat Katalog Alat dan Detail Spesifikasi (KaLab)

| | |
| --- | --- |
| **Aktor** | KaLab |
| **Rujukan** | [KLB-03](Business%20Requirements.md#43-katalog-laboratorium-baca-saja) |

**Alur**

1. KaLab membuka menu "Katalog Laboratorium".
2. Sistem melakukan query untuk mengambil seluruh data inventaris alat dan informasi tarif.
3. Sistem menampilkan katalog alat (Nama Alat, Foto, Stok Total, Stok Ketersediaan Riil, Deskripsi, Tarif Eksternal) dengan aksi **hanya** tombol "Detail" — tanpa tombol Ubah, karena KaLab tidak mengelola master data.
4. KaLab mengklik "Detail" dan sistem menampilkan rincian `id_detail_alat` (No Seri Unit, Nama Alat, Lokasi Penyimpanan, Kondisi, Status, Tahun Pengadaan, Sumber Dana, Harga Beli, Catatan).
5. KaLab dapat memfilter unit laboratorium atau mencari berdasarkan kata kunci; sistem memperbarui tampilan secara *real-time*.

**Hasil:** KaLab memantau inventaris secara baca saja.

---

#### PR-18 · Membuat Data Detail Alat / Registrasi Unit Alat (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-03](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" dan mengklik tombol "Tambah Unit Detail Alat".
2. Sistem menampilkan form registrasi detail alat: No Seri Unit `varchar(100)` (kunci utama), Nama Alat (pilih master alat), Lokasi Penyimpanan (dropdown: Lab Fisika Dasar / Lab Elektronika / Lab Fisika Lanjut / Lab ELF), Kondisi (enum `baik`/`rusak`), Status (enum `tersedia`/`tidak tersedia`/`sedang perbaikan`), Tahun Pengadaan, Sumber Dana `varchar(255)`, Harga Beli `decimal(12,2)` (nullable), dan Catatan (nullable).
3. PLP mengisi seluruh informasi dan mengklik tombol "Simpan Detail Alat".
4. Sistem memvalidasi data:
   - field wajib belum diisi → "Semua informasi wajib harus diisi";
   - No Seri Unit duplikat → "No Seri Unit sudah terdaftar di sistem";
   - format tahun atau harga beli tidak valid → "Format data numerik/tahun tidak valid";
   - data valid → pop-up "Yakin ingin menambahkan unit alat ini?".
5. Bila PLP mengklik "Ya", sistem menyimpan unit detail alat baru, mengkalkulasi ulang jumlah stok fisik (+1) pada master alat terkait, menampilkan pesan "Detail unit alat berhasil disimpan", dan menampilkan kembali halaman katalog alat.
6. Bila PLP mengklik "Batal", sistem menampilkan pesan "Batal menyimpan detail data alat".

**Hasil:** Unit fisik alat terdata presisi dan stok master bertambah otomatis.

---

#### PR-19 · Melihat Katalog dan Detail Unit Alat (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-03](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" → "Katalog Alat".
2. Sistem menampilkan katalog alat dalam bentuk kartu interaktif (Nama Alat, Foto, Stok Total, Stok Ketersediaan Riil, Deskripsi, Tarif Eksternal) dengan aksi "Detail".
3. PLP mengklik "Detail" dan sistem menampilkan rincian aset berdasarkan seluruh `id_detail_alat` (No Seri Unit, Nama Alat, Lokasi Penyimpanan, Kondisi, Status, Tahun Pengadaan, Sumber Dana, Harga Beli, Catatan) beserta aksi "Ubah".
4. PLP dapat memfilter unit laboratorium atau mencari berdasarkan kata kunci; sistem memperbarui tampilan secara *real-time*.

**Hasil:** PLP memantau dan menyiapkan perubahan unit fisik.

---

#### PR-20 · Mengubah Data Detail Alat (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-03](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih data alat yang akan diperbarui dan mengklik tombol "Ubah".
2. Sistem menampilkan form ubah detail alat yang terisi data saat ini: No Seri Unit (read-only), Nama Alat, Lokasi Penyimpanan, Kondisi, Status, Tahun Pengadaan, Sumber Dana, Harga Beli, dan Catatan.
3. PLP melakukan penyesuaian lokasi, perubahan kondisi fisik (`baik`/`rusak`), atau status operasional (`tersedia`/`tidak tersedia`/`sedang perbaikan`), lalu mengklik tombol "Simpan Perubahan".
4. Sistem memvalidasi: field kosong → "Semua informasi harus lengkap"; harga beli/tahun pengadaan tidak valid → "Data numerik tidak valid".
5. Bila data valid, sistem menampilkan pop-up "Yakin ingin mengubah data unit detail alat ini?".
6. Bila PLP mengklik "Ya", sistem memperbarui data detail alat, menampilkan pesan "Data detail alat berhasil diperbarui", dan menampilkan kembali halaman katalog alat.
7. Bila PLP mengklik "Batal", sistem menampilkan pesan "Perubahan data alat dibatalkan" dan tetap menampilkan form.

**Hasil:** Kondisi dan status operasional unit alat selalu terbarui.

---

#### PR-21 · Melihat Katalog Alat dan Ketersediaan Alat (Mahasiswa, Dosen, Eksternal)

| | |
| --- | --- |
| **Aktor** | Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [DSN-03](Business%20Requirements.md#63-katalog-laboratorium--keranjang-sesi-cart), [MHS-03](Business%20Requirements.md#73-katalog-laboratorium--keranjang-sesi), [EKS-05](Business%20Requirements.md#84-katalog-laboratorium--keranjang-sesi), [REQ-10](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi), [REQ-11](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi), [REQ-12](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi) |

**Alur**

1. Pengguna membuka menu "Katalog Laboratorium".
2. Pengguna mengisi kriteria pencarian: Kata Kunci Nama Alat `varchar(255)` dan Rentang Tanggal Peminjaman (tanggal mulai s.d. tanggal selesai).
3. Pengguna mengklik "Cari Alat".
4. Sistem melakukan kalkulasi ketersediaan dinamis: menghitung total `id_detail_alat` berstatus `tersedia` dan berkondisi `baik`, lalu dikurangi kuantitas unit yang sudah ter-booking pada rentang tanggal tersebut.
5. Sistem menampilkan kartu alat: Foto Alat, Nama Alat, Lokasi Penyimpanan, Spesifikasi Singkat, dan Stok Tersedia Riil pada rentang tanggal tersebut.
6. Ketentuan tampilan tarif:
   - **Mahasiswa dan Dosen** — sistem **tidak** menampilkan nominal harga/tarif sewa;
   - **Pengguna Eksternal** — sistem menampilkan estimasi biaya sewa per unit.
7. Pengguna dapat mengklik tombol "Tambah ke Keranjang" untuk melanjutkan ke peminjaman.

**Hasil:** Pengguna mengetahui stok yang benar-benar tersedia pada periode yang direncanakan.

---

### 1.6 Modul Katalog Ruangan

#### PR-22 · Membuat Data Katalog dan Layanan Tarif Ruangan (Admin)

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-12](Business%20Requirements.md#34-katalog-laboratorium) |

**Alur**

1. Admin memilih menu "Katalog Laboratorium" → sistem membuka tab Alat.
2. Admin memilih tab "Jadwal Ruangan" dan mengklik "Tambah Ruangan & Tarif".
3. Sistem menampilkan form tambah ruangan: Nama Ruangan `varchar(255)`, Foto Ruangan, Kapasitas `int`, Tarif Sewa Eksternal `decimal(12,2)` (default 0.00, opsional), dan Deskripsi `text`.
4. Admin mengisi informasi dan mengklik tombol "Simpan Data Ruangan".
5. Sistem memvalidasi:
   - field wajib belum diisi → "Semua informasi wajib harus diisi" (**kecuali** Tarif Sewa Eksternal);
   - ID ruangan sudah terdaftar → "ID Ruangan sudah terdaftar di sistem";
   - kapasitas atau tarif tidak valid → "Data numerik kapasitas atau tarif tidak valid";
   - unggahan > 2 MB atau bukan JPG/PNG → "Format foto harus JPG/PNG dan maksimal 2MB";
   - data valid → pop-up "Yakin ingin menyimpan data ruangan baru?".
6. Bila Admin mengklik "Ya", sistem menyimpan data ruangan dan acuan tarif sewa publik, menampilkan pesan "Data ruangan dan layanan tarif berhasil disimpan", dan menampilkan kembali daftar katalog ruangan.
7. Bila Admin mengklik "Batal", sistem menampilkan pesan "Penambahan data ruangan dibatalkan" dan tetap menampilkan form.

**Hasil:** Ruangan baru terdaftar di katalog publik.

---

#### PR-23 · Melihat Katalog, Ketersediaan, dan Layanan Tarif Ruangan (Admin)

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-12](Business%20Requirements.md#34-katalog-laboratorium) |

**Alur**

1. Admin memilih menu "Katalog Laboratorium" → tab "Jadwal Ruangan".
2. Sistem melakukan query untuk mengambil seluruh data master ruangan beserta tarif sewa.
3. Sistem menampilkan katalog ruangan (Nama Ruangan, Foto Ruangan, Kapasitas, Tarif Sewa Eksternal) dengan aksi "Detail" dan "Ubah".
4. Admin mengklik "Detail" pada salah satu ruangan.
5. Sistem mengambil data jadwal dari basis data dan menyajikannya dalam bentuk kalender interaktif (*weekly*/*monthly view*), serta menampilkan halaman detail berisi Nama Ruangan dan Deskripsi.

**Hasil:** Admin memantau katalog dan jadwal ruangan.

---

#### PR-24 · Mengubah Data Katalog Master dan Layanan Tarif Ruangan (Admin)

| | |
| --- | --- |
| **Aktor** | Admin |
| **Rujukan** | [ADM-12](Business%20Requirements.md#34-katalog-laboratorium) |

**Alur**

1. Admin memilih tab "Jadwal Ruangan" → sistem menampilkan daftar data ruangan beserta layanan tarif.
2. Admin memilih data ruangan yang akan diubah dengan mengklik tombol "Ubah".
3. Sistem menampilkan form ubah ruangan yang terisi data saat ini: Nama Ruangan, Foto Ruangan, Kapasitas, Tarif Sewa Eksternal, dan Deskripsi.
4. Admin melakukan perubahan data atau penyesuaian nominal tarif sewa dan mengklik tombol "Simpan Perubahan".
5. Sistem memvalidasi: field kosong → "Semua informasi wajib diisi" (**kecuali** Tarif Sewa Eksternal); data numerik tidak valid → "Data numerik kapasitas atau tarif tidak valid"; gambar tidak sesuai ketentuan → "Format foto harus JPG/PNG dan maksimal 2MB".
6. Bila data valid, sistem menampilkan pop-up "Yakin ingin menyimpan perubahan data ruangan?".
7. Bila Admin mengklik "Ya", sistem memperbarui data katalog ruangan dan tarif, menampilkan pesan "Data ruangan dan layanan tarif berhasil diubah", dan menampilkan kembali daftar katalog ruangan.
8. Bila Admin mengklik "Batal", sistem menampilkan pesan "Perubahan data ruangan dibatalkan" dan tetap menampilkan form.

**Hasil:** Data ruangan dan tarif diperbarui.

---

#### PR-25 · Melihat Jadwal Penggunaan Ruangan Lab (KaLab)

| | |
| --- | --- |
| **Aktor** | KaLab |
| **Rujukan** | [KLB-04](Business%20Requirements.md#43-katalog-laboratorium-baca-saja) |

**Alur**

1. KaLab memilih menu "Katalog Laboratorium" → tab "Jadwal Ruangan".
2. Sistem mengambil data jadwal dan menyajikannya dalam bentuk kalender interaktif (*weekly*/*monthly view*).
3. Sistem juga menampilkan informasi ruangan dalam bentuk tabel/kartu di bawah kalender: Nama Ruangan, Foto Ruangan, Kapasitas, Tarif Sewa Eksternal, dan Deskripsi.
4. KaLab mengklik salah satu blok jadwal untuk menampilkan detail peminjaman/kegiatan: Nama Kegiatan, Nama Peminjam/Penanggung Jawab, Waktu Peminjaman, dan Catatan.

**Hasil:** KaLab mengawasi seluruh agenda praktikum, riset, maupun sewa ruangan.

---

#### PR-26 · Membuat Jadwal Ruangan / Input Jadwal Reguler (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-04](Business%20Requirements.md#53-katalog-laboratorium), [REQ-14](System%20Features.md#44-modul-transaksi-peminjaman-dan-anti-collision) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" → tab "Jadwal Ruangan" → mengklik tombol "Tambah Jadwal Reguler".
2. Sistem menampilkan form tambah jadwal: Pilihan Ruangan (dropdown), Nama Kegiatan/Mata Kuliah `varchar(255)`, Penanggung Jawab/Dosen `varchar(255)`, Hari (dropdown), Jam Mulai `time`, dan Jam Selesai `time`.
3. PLP menginputkan data jadwal operasional ruangan dan mengklik tombol "Simpan Jadwal".
4. Sistem melakukan validasi dan pengecekan bentrok (*anti-collision check*):
   - field wajib kosong → "Semua informasi wajib harus diisi";
   - jam mulai ≥ jam selesai → "Format rentang jam tidak valid";
   - slot telah terisi kegiatan praktikum lain atau peminjaman yang disetujui → "Jadwal bentrok dengan agenda lain yang terdaftar";
   - jadwal aman dan data valid → pop-up "Yakin ingin menambahkan jadwal ruangan ini?".
5. Bila PLP mengklik "Ya", sistem menyimpan agenda jadwal ruangan baru, menampilkan pesan "Jadwal ruangan berhasil ditambahkan", dan menampilkan kembali kalender jadwal ruangan.
6. Bila PLP mengklik "Batal", sistem menampilkan pesan "Penambahan jadwal dibatalkan" dan tetap menampilkan form.

**Hasil:** Slot waktu perkuliahan terblokir dan tidak dapat dibooking pihak lain.

---

#### PR-27 · Melihat Jadwal Ruangan (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-04](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" → tab "Jadwal Ruangan".
2. Sistem mengambil data jadwal dan menyajikannya sebagai kalender interaktif (*weekly*/*monthly view*).
3. Sistem menampilkan informasi ruangan dalam bentuk tabel/kartu di bawah kalender: Nama Ruangan, Foto Ruangan, Kapasitas, Tarif Sewa Eksternal, dan Deskripsi.
4. PLP mengklik salah satu blok jadwal untuk melihat detail kegiatan: Nama Kegiatan, Nama Peminjam/Penanggung Jawab, Waktu Peminjaman, dan Catatan.

**Hasil:** PLP mempersiapkan ruangan dan fasilitas sesuai jam kegiatan.

---

#### PR-28 · Mengubah Jadwal Ruangan (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-04](Business%20Requirements.md#53-katalog-laboratorium), [REQ-14](System%20Features.md#44-modul-transaksi-peminjaman-dan-anti-collision) |

**Alur**

1. PLP membuka tab "Jadwal Ruangan" → sistem menampilkan kalender interaktif dan informasi ruangan di bawahnya.
2. PLP mengklik salah satu blok jadwal → sistem menampilkan detail kegiatan (Nama Kegiatan, Nama Peminjam/Penanggung Jawab, Waktu Peminjaman, Catatan).
3. Untuk jadwal reguler, PLP mengklik "Ubah Jadwal".
4. Sistem menampilkan form ubah jadwal.
5. PLP melakukan penyesuaian hari, jam operasional, atau penanggung jawab kegiatan, lalu mengklik tombol "Simpan Perubahan".
6. Sistem melakukan verifikasi *anti-collision check* terhadap slot waktu baru:
   - bentrok → "Slot waktu baru bentrok dengan kegiatan lain";
   - aman → pop-up "Yakin ingin menyimpan perubahan jadwal ini?".
7. Bila PLP mengklik "Ya", sistem memperbarui data dan menampilkan pesan "Jadwal ruangan berhasil diperbarui".
8. Bila "Batal", sistem kembali ke form.

**Hasil:** Perubahan jadwal kuliah pengganti atau kegiatan lab terbaru tersimpan.

---

#### PR-29 · Melihat Katalog Ruangan dan Jadwal Ketersediaan (Mahasiswa, Dosen, Eksternal)

| | |
| --- | --- |
| **Aktor** | Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [DSN-04](Business%20Requirements.md#63-katalog-laboratorium--keranjang-sesi-cart), [MHS-03](Business%20Requirements.md#73-katalog-laboratorium--keranjang-sesi), [EKS-05](Business%20Requirements.md#84-katalog-laboratorium--keranjang-sesi), [REQ-12](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi) |

**Alur**

1. Pengguna memilih menu "Katalog Laboratorium" → tab "Jadwal Ruangan".
2. Sistem menampilkan jadwal sebagai kalender interaktif (*weekly*/*monthly view*).
3. Sistem menampilkan informasi ruangan dalam bentuk tabel/kartu di bawah kalender: Nama Ruangan, Foto Ruangan, Kapasitas, Tarif Sewa Eksternal, dan Deskripsi.
4. Pengguna memilih tanggal dan ruangan untuk memeriksa slot waktu yang kosong (*Available*) atau terisi (*Booked* / Praktikum).
5. Ketentuan tampilan tarif:
   - **Mahasiswa dan Dosen** — sistem tidak menampilkan tarif sewa;
   - **Pengguna Eksternal** — sistem menampilkan estimasi tarif sewa per jam/hari.
6. Pengguna dapat mengklik tombol "Detail" untuk melihat fasilitas ruangan atau "Ajukan Peminjaman" untuk memproses peminjaman slot waktu.

**Hasil:** Pengguna memilih slot waktu yang belum terisi untuk diajukan.

---

### 1.7 Modul Data Bahan

#### PR-30 · Melihat Data Bahan dan Ketersediaan Bahan (Admin & KaLab)

| | |
| --- | --- |
| **Aktor** | Admin, KaLab |
| **Rujukan** | [ADM-13](Business%20Requirements.md#34-katalog-laboratorium), [KLB-05](Business%20Requirements.md#43-katalog-laboratorium-baca-saja) |

**Alur**

1. Pengguna memilih menu "Katalog Laboratorium" → mengklik tab "Data Bahan".
2. Sistem melakukan query dan menampilkan tabel daftar bahan: Nama Bahan, Foto Bahan, Lokasi Penyimpanan, Stok Awal, Sisa Stok Ketersediaan, Satuan (Gram / mL / Pcs / Pack), Status, dan Catatan.

**Validasi & pengecualian**

| Kondisi | Perilaku sistem |
| --- | --- |
| Peran Dosen, Mahasiswa, atau Eksternal | Tab Data Bahan **tidak ditampilkan** ([REQ-11](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi)) |

**Hasil:** Pengelola memantau ketersediaan bahan habis pakai di seluruh unit lab.

---

#### PR-31 · Membuat Data Bahan (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-05](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" → tab "Data Bahan" → sistem menampilkan daftar aset bahan.
2. PLP mengklik tombol "Tambah Data Bahan".
3. Sistem menampilkan form tambah data bahan: Nama Bahan `varchar(255)`, Foto Bahan, Lokasi Penyimpanan (dropdown: Lab Fisika Dasar / Lab Elektronika / Lab Fisika Lanjut / Lab ELF), Stok Awal `integer`, Sisa Stok Ketersediaan `integer`, Satuan `varchar(50)` (Gram, mL, Pcs, Botol), Tanggal Kadaluarsa `date` (nullable), Status (dropdown `aman`/`menipis`/`habis`), dan Catatan (nullable).
4. PLP mengisi seluruh informasi dan mengklik tombol "Simpan Data Bahan".
5. Sistem memvalidasi: field wajib belum diisi → "Semua informasi wajib harus diisi"; jumlah stok kurang dari 0 atau berupa teks → "Data numerik stok tidak valid".
6. Bila data valid, sistem menampilkan pop-up "Yakin ingin menyimpan data bahan baru?".
7. Bila PLP mengklik "Ya", sistem menyimpan data bahan, menampilkan pesan "Data bahan berhasil disimpan", dan menampilkan kembali daftar katalog bahan.
8. Bila PLP mengklik "Batal", sistem menampilkan pesan "Penambahan data bahan dibatalkan" dan tetap menampilkan form.

**Hasil:** Stok awal dan spesifikasi bahan habis pakai terdata.

---

#### PR-32 · Melihat Data Bahan (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-05](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" → tab "Data Bahan".
2. Sistem melakukan query dan menampilkan tabel daftar bahan: Kode Bahan, Nama Bahan, Foto Bahan, Lokasi Penyimpanan, Stok Awal, Sisa Stok Ketersediaan, Satuan, Status, Catatan, dan Aksi "Ubah".

**Hasil:** PLP melakukan pengecekan stok opnam bahan secara berkala.

---

#### PR-33 · Mengubah Data Bahan (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-05](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP membuka tab "Data Bahan" → memilih bahan yang akan diubah dan mengklik tombol "Ubah".
2. Sistem menampilkan form ubah data bahan yang terisi data saat ini: Nama Bahan, Foto Bahan, Lokasi Penyimpanan, Stok Awal, Sisa Stok Ketersediaan, Satuan, Tanggal Kadaluarsa, Status, dan Catatan.
3. PLP melakukan penyesuaian kuantitas stok sisa, tanggal kadaluarsa, atau lokasi penyimpanan, lalu mengklik tombol "Simpan Perubahan".
4. Sistem memvalidasi data masukan.
5. Bila valid, sistem menampilkan pop-up "Yakin ingin menyimpan perubahan data bahan ini?".
6. Bila PLP mengklik "Ya", sistem memperbarui data bahan, menampilkan pesan "Data bahan berhasil diperbarui", dan kembali ke tabel daftar bahan.
7. Bila "Batal", sistem kembali ke form.

**Hasil:** Catatan kuantitas bahan di sistem sesuai kondisi fisik di lapangan.

---

### 1.8 Modul Data Mebeler

#### PR-34 · Melihat Data Mebeler (Admin & KaLab)

| | |
| --- | --- |
| **Aktor** | Admin, KaLab |
| **Rujukan** | [ADM-14](Business%20Requirements.md#34-katalog-laboratorium), [KLB-06](Business%20Requirements.md#43-katalog-laboratorium-baca-saja) |

**Alur**

1. Pengguna memilih menu "Katalog Laboratorium" → mengklik tab "Data Mebeler".
2. Sistem menampilkan daftar seluruh aset mebeler laboratorium: Nama Mebeler (Meja Lab / Kursi / Almari / Display), Foto Mebeler, Lokasi Penyimpanan (Unit Lab), Kondisi, Tahun Pengadaan, Sumber Dana, Harga Beli, dan Catatan.

**Hasil:** Pengelola memantau kuantitas dan kondisi fisik mebeler per unit lab.

---

#### PR-35 · Membuat Data Mebeler (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-06](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" → tab "Data Mebeler" → sistem menampilkan tabel aset mebeler.
2. PLP mengklik tombol "Tambah Unit Mebeler".
3. Sistem menampilkan form data mebeler: Nama Mebeler `varchar(255)`, Foto Mebeler, Lokasi Penyimpanan (Unit Lab), Kondisi (enum `baik`/`rusak`/`sedang perbaikan`), Tahun Pengadaan, Sumber Dana `varchar(255)`, Harga Beli `decimal(12,2)` (opsional), dan Catatan (opsional).
4. PLP menginputkan data aset mebeler dan mengklik tombol "Simpan Mebeler".
5. Sistem memvalidasi: field wajib kosong → "Semua informasi wajib harus diisi"; harga beli atau tahun pengadaan tidak valid → "Format data numerik/tahun tidak valid".
6. Bila data valid, sistem menampilkan pop-up "Yakin ingin menyimpan data mebeler baru?".
7. Bila PLP mengklik "Ya", sistem menyimpan data dan menampilkan pesan "Data mebeler berhasil ditambahkan".
8. Bila "Batal", sistem kembali ke form.

**Hasil:** Aset fisik mebeler terdaftar lengkap.

---

#### PR-36 · Melihat Data Mebeler (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-06](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP memilih menu "Katalog Laboratorium" → tab "Data Mebeler".
2. Sistem menampilkan tabel daftar seluruh aset mebeler: Nama Mebeler, Foto Mebeler, Lokasi Penyimpanan (Unit Lab), Kondisi, Tahun Pengadaan, Sumber Dana, Harga Beli, Catatan, dan Aksi "Ubah".

**Hasil:** PLP memantau keberadaan dan kelayakan aset mebeler di unit lab penugasan.

---

#### PR-37 · Mengubah Data Mebeler (PLP)

| | |
| --- | --- |
| **Aktor** | PLP |
| **Rujukan** | [PLP-06](Business%20Requirements.md#53-katalog-laboratorium) |

**Alur**

1. PLP membuka tab "Data Mebeler" → memilih data mebeler yang ingin diubah dan mengklik tombol "Ubah".
2. Sistem menampilkan form ubah data mebeler yang terisi data saat ini: Nama Mebeler, Foto Mebeler, Lokasi Penyimpanan, Kondisi, Tahun Pengadaan, Sumber Dana, Harga Beli, dan Catatan.
3. PLP memperbarui kondisi fisik, status ketersediaan, atau lokasi penyimpanan, lalu mengklik tombol "Simpan Perubahan".
4. Sistem memvalidasi masukan data.
5. Bila valid, sistem menampilkan pop-up "Yakin ingin menyimpan perubahan data mebeler ini?".
6. Bila PLP mengklik "Ya", sistem memperbarui basis data dan menampilkan pesan "Data mebeler telah berhasil diubah". Bila "Batal", sistem kembali ke form.

**Hasil:** Data kelayakan aset mebeler sesuai kondisi riil.

---

### 1.9 Modul Sesi

#### PR-38 · Logout

| | |
| --- | --- |
| **Aktor** | Admin, KaLab, PLP, Mahasiswa, Dosen, Eksternal |
| **Rujukan** | [REQ-05](System%20Features.md#41-modul-autentikasi-manajemen-pengguna-dan-profil) |

**Alur**

1. Pengguna yang sedang login mengklik tombol/ikon "Logout" pada menu navigasi profil.
2. Sistem menampilkan konfirmasi dialog "Apakah Anda yakin ingin keluar dari sistem?".
3. Pengguna mengklik tombol "Ya, Logout".
4. Sistem menghapus sesi login pengguna yang aktif.
5. Sistem menampilkan pesan "Anda telah berhasil logout" dan mengarahkan kembali ke halaman login utama.

**Hasil:** Sesi berakhir dengan aman.

---

## 2. Daftar Prosedur

| ID | Prosedur | Aktor | Modul |
| --- | --- | --- | --- |
| `PR-01` | [Akses Publik / Homepage](#pr-01--akses-publik--homepage) | Guest | Akses |
| `PR-02` | [Login](#pr-02--login) | Semua peran | Akses |
| `PR-03` | [Lupa Password](#pr-03--lupa-password) | Semua peran | Akses |
| `PR-04` | [Register](#pr-04--register-mahasiswa-dosen-eksternal) | Mahasiswa, Dosen, Eksternal | Akses |
| `PR-05` | [Melihat Profil](#pr-05--melihat-profil) | Semua peran | Profil |
| `PR-06` | [Mengubah Profil](#pr-06--mengubah-profil) | Semua peran | Profil |
| `PR-07` | [Mengubah Password](#pr-07--mengubah-password) | Semua peran | Profil |
| `PR-08` | [Melihat Daftar Pengguna](#pr-08--melihat-daftar-pengguna) | Admin | Pengguna |
| `PR-09` | [Membuat Data Pengguna](#pr-09--membuat-data-pengguna) | Admin | Pengguna |
| `PR-10` | [Mengubah Data Pengguna](#pr-10--mengubah-data-pengguna) | Admin | Pengguna |
| `PR-11` | [Mengubah Status Hak Akses](#pr-11--mengubah-status-hak-akses-pengguna) | Admin | Pengguna |
| `PR-12` | [Dashboard Admin/KaLab/PLP](#pr-12--melihat-dashboard-admin-kalab-plp) | Admin, KaLab, PLP | Dashboard |
| `PR-13` | [Dashboard Peminjam](#pr-13--melihat-dashboard-mahasiswa-dosen-eksternal) | Mahasiswa, Dosen, Eksternal | Dashboard |
| `PR-14` | [Buat Katalog Alat & Tarif](#pr-14--membuat-data-katalog-dan-layanan-tarif-alat-admin) | Admin | Katalog Alat |
| `PR-15` | [Lihat Katalog Alat & Tarif](#pr-15--melihat-katalog-ketersediaan-dan-layanan-tarif-alat-admin) | Admin | Katalog Alat |
| `PR-16` | [Ubah Katalog Alat & Tarif](#pr-16--mengubah-data-katalog-dan-layanan-tarif-alat-admin) | Admin | Katalog Alat |
| `PR-17` | [Lihat Katalog Alat & Spesifikasi](#pr-17--melihat-katalog-alat-dan-detail-spesifikasi-kalab) | KaLab | Katalog Alat |
| `PR-18` | [Registrasi Unit Alat](#pr-18--membuat-data-detail-alat--registrasi-unit-alat-plp) | PLP | Katalog Alat |
| `PR-19` | [Lihat Katalog & Detail Unit](#pr-19--melihat-katalog-dan-detail-unit-alat-plp) | PLP | Katalog Alat |
| `PR-20` | [Ubah Data Detail Alat](#pr-20--mengubah-data-detail-alat-plp) | PLP | Katalog Alat |
| `PR-21` | [Cari Alat & Ketersediaan](#pr-21--melihat-katalog-alat-dan-ketersediaan-alat-mahasiswa-dosen-eksternal) | Mahasiswa, Dosen, Eksternal | Katalog Alat |
| `PR-22` | [Buat Katalog Ruangan & Tarif](#pr-22--membuat-data-katalog-dan-layanan-tarif-ruangan-admin) | Admin | Katalog Ruangan |
| `PR-23` | [Lihat Katalog Ruangan](#pr-23--melihat-katalog-ketersediaan-dan-layanan-tarif-ruangan-admin) | Admin | Katalog Ruangan |
| `PR-24` | [Ubah Katalog Ruangan & Tarif](#pr-24--mengubah-data-katalog-master-dan-layanan-tarif-ruangan-admin) | Admin | Katalog Ruangan |
| `PR-25` | [Lihat Jadwal Ruangan](#pr-25--melihat-jadwal-penggunaan-ruangan-lab-kalab) | KaLab | Katalog Ruangan |
| `PR-26` | [Input Jadwal Reguler](#pr-26--membuat-jadwal-ruangan--input-jadwal-reguler-plp) | PLP | Katalog Ruangan |
| `PR-27` | [Lihat Jadwal Ruangan](#pr-27--melihat-jadwal-ruangan-plp) | PLP | Katalog Ruangan |
| `PR-28` | [Ubah Jadwal Ruangan](#pr-28--mengubah-jadwal-ruangan-plp) | PLP | Katalog Ruangan |
| `PR-29` | [Lihat Ketersediaan Ruangan](#pr-29--melihat-katalog-ruangan-dan-jadwal-ketersediaan-mahasiswa-dosen-eksternal) | Mahasiswa, Dosen, Eksternal | Katalog Ruangan |
| `PR-30` | [Lihat Data Bahan](#pr-30--melihat-data-bahan-dan-ketersediaan-bahan-admin--kalab) | Admin, KaLab | Bahan |
| `PR-31` | [Buat Data Bahan](#pr-31--membuat-data-bahan-plp) | PLP | Bahan |
| `PR-32` | [Lihat Data Bahan](#pr-32--melihat-data-bahan-plp) | PLP | Bahan |
| `PR-33` | [Ubah Data Bahan](#pr-33--mengubah-data-bahan-plp) | PLP | Bahan |
| `PR-34` | [Lihat Data Mebeler](#pr-34--melihat-data-mebeler-admin--kalab) | Admin, KaLab | Mebeler |
| `PR-35` | [Buat Data Mebeler](#pr-35--membuat-data-mebeler-plp) | PLP | Mebeler |
| `PR-36` | [Lihat Data Mebeler](#pr-36--melihat-data-mebeler-plp) | PLP | Mebeler |
| `PR-37` | [Ubah Data Mebeler](#pr-37--mengubah-data-mebeler-plp) | PLP | Mebeler |
| `PR-38` | [Logout](#pr-38--logout) | Semua peran | Sesi |

---

## 3. Analisis Bisnis per Peran

| Peran | Karakteristik | Fokus bisnis | Fungsi utama | Nilai bisnis |
| --- | --- | --- | --- | --- |
| **Akses Publik / Guest** | Pengguna tanpa autentikasi (masyarakat umum, calon peneliti eksternal, mahasiswa/dosen yang belum login) | Keterbukaan informasi (*transparency*), pemasaran fasilitas lab, dan *lead generation* peminjaman | Menelusuri homepage, profil 4 laboratorium (Fisika Dasar, Elektronika, Fisika Lanjut, ELF), serta SOP peminjaman; melihat transparansi acuan tarif sewa khusus kategori eksternal; mengakses prosedur, persyaratan, dan FAQ | Memangkas volume pertanyaan manual ke loket/PLP serta membuka peluang kerja sama riset dan sewa fasilitas |
| **Admin** | Pengelola penuh seluruh konfigurasi, data master, dan hak akses pengguna | Keamanan sistem, manajemen akun pengguna, serta *audit trail* operasional menyeluruh | Mengelola data akun seluruh pengguna dan mengatur status hak akses (aktif/suspend/blokir); mengelola master katalog, layanan tarif alat/ruangan, serta data bahan dan mebeler; meninjau rekapitulasi akumulasi pendapatan dan statistik bulanan | Menjaga integritas data, keamanan akses multi-peran, dan kontinuitas operasional seluruh sistem |
| **Kepala Laboratorium** | Penanggung jawab struktural dan pengambil keputusan manajerial laboratorium | Pengawasan tata kelola (*governance*), validasi tingkat lanjut, dan evaluasi kinerja finansial/operasional lab | Melakukan *approval* pengajuan alat dan persewaan ruangan; memantau ringkasan statistik peminjaman bulanan dan tren penggunaan fasilitas; mengunduh laporan rekapitulasi keuangan dan laporan kalibrasi alat | Menjamin akuntabilitas pengambilan keputusan serta pengawasan aset lab berbasis data kuantitatif (*data-driven decision making*) |
| **PLP** | Pengelola teknis harian di lapangan (garda terdepan operasional lab) | Akurasi fisik inventaris, validasi pengembalian alat, dan penjadwalan ruangan bebas bentrok | Mengelola master unit fisik katalog (Alat, Bahan Habis Pakai, Mebeler); memasukkan jadwal praktikum reguler untuk memicu otomatisasi *anti-collision check*; memvalidasi kondisi fisik pengembalian alat (Baik/Rusak), mengubah status peminjaman, serta mengunggah laporan maintenance/kalibrasi | Mencegah kerusakan/kehilangan aset melalui pelacakan unit fisik (`id_detail_alat`) serta menghilangkan bentrok jadwal ruangan |
| **Mahasiswa** | Pengguna internal terautentikasi dengan hak akses terbatas pada pengajuan peminjaman non-komersial | Efisiensi proses akademik (praktikum/tugas akhir) dan tertib administrasi bebas laboratorium | Mengakses katalog internal dan menambahkan item ke keranjang sesi; mengajukan peminjaman untuk keperluan praktikum/riset dengan batas durasi maksimal 7 hari kalender; memantau status persetujuan item serta membatalkan pengajuan sebelum status berubah; mengecek tunggakan untuk mengunduh Surat Keterangan Bebas Laboratorium | Mengeliminasi formulir kertas (*paperless*) dan mempercepat masa studi melalui proses birokrasi lab yang transparan |
| **Dosen** | Pengguna internal terautentikasi dengan prioritas penggunaan fasilitas untuk kegiatan penelitian | Kelancaran operasional riset lanjutan dan kegiatan praktikum mata kuliah | Mengakses katalog internal dan menambahkan item ke keranjang sesi; mengajukan peminjaman dengan batas durasi maksimal 7 hari kalender; memantau status persetujuan item serta membatalkan pengajuan sebelum status berubah | Mempermudah penyediaan sarana riset dosen serta menjamin akuntabilitas pemanfaatan aset lab oleh civitas akademika |
| **Pengguna Eksternal** | Pengguna dari luar instansi yang melakukan persewaan berbayar | Peningkatan Pendapatan Asli Daerah/Universitas (PNBP) melalui layanan sewa berbayar | Mengajukan sewa alat dan ruangan berbasis tarif resmi eksternal; mengunggah bukti pembayaran manual (transfer bank) atau mengonfirmasi pembayaran tunai di loket; memantau status verifikasi pembayaran dan persetujuan item dari pengelola lab | Meningkatkan *revenue generation* laboratorium dengan alur transaksi sewa yang terstruktur dan terlacak |

---

## 4. Gap Dokumentasi Sprint 1

Prosedur pada dokumen ini mencakup **modul akses, profil, manajemen pengguna, dashboard, dan katalog**. Modul transaksi berikut **belum memiliki prosedur tertulis** dan perlu dilengkapi sebelum Sprint 1 dinyatakan selesai.

| # | Modul yang belum terdokumentasi | Requirement terkait | Usulan ID |
| --- | --- | --- | --- |
| G1 | Keranjang sesi sementara (*Temporary Session Cart* 2 tab: tambah, lihat, hapus item) | [REQ-13](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi) | `PR-39` |
| G2 | Formulir & pembuatan pengajuan peminjaman dari keranjang (*checkout*) | [REQ-14](System%20Features.md#44-modul-transaksi-peminjaman-dan-anti-collision) | `PR-40` |
| G3 | Pengecekan bentrok jadwal pada saat pengajuan (*anti-collision* transaksi) | [REQ-14](System%20Features.md#44-modul-transaksi-peminjaman-dan-anti-collision) | `PR-41` |
| G4 | Pembatasan durasi peminjaman 7 hari kalender | [REQ-15](System%20Features.md#44-modul-transaksi-peminjaman-dan-anti-collision) | `PR-42` |
| G5 | Pemilihan & verifikasi pembayaran eksternal (transfer bank / tunai di loket) | [REQ-16](System%20Features.md#44-modul-transaksi-peminjaman-dan-anti-collision), [REQ-22](System%20Features.md#46-modul-validasi-pengembalian) | `PR-43` |
| G6 | Persetujuan/penolakan item-level oleh KaLab/Admin (termasuk alasan penolakan) | [REQ-17](System%20Features.md#45-modul-verifikasi--persetujuan-parsial), [REQ-18](System%20Features.md#45-modul-verifikasi--persetujuan-parsial) | `PR-44` |
| G7 | Pembatalan pengajuan mandiri oleh pemohon | [REQ-19](System%20Features.md#45-modul-verifikasi--persetujuan-parsial), [BR-5](Business%20Rule.md#br-5--hak-pembatalan-mandiri-pengguna) | `PR-45` |
| G8 | Penyerahan fisik alat & perubahan status menjadi Dipinjam | [REQ-20](System%20Features.md#46-modul-validasi-pengembalian) | `PR-46` |
| G9 | Validasi pengembalian fisik & pencatatan kondisi (Baik/Rusak/Hilang) | [REQ-20](System%20Features.md#46-modul-validasi-pengembalian) | `PR-47` |
| G10 | Penangguhan akun otomatis akibat keterlambatan/kerusakan | [REQ-21](System%20Features.md#46-modul-validasi-pengembalian), [BR-3](Business%20Rule.md#br-3--sanksi-penangguhan-akses-manual-block) | `PR-48` |
| G11 | Riwayat peminjaman & pemantauan status per item | [REQ-27](System%20Features.md#49-modul-riwayat-peminjaman-dan-pelaporan) | `PR-49` |
| G12 | Pengecekan bebas laboratorium & cetak Surat Keterangan Bebas Lab | [REQ-31](System%20Features.md#411-modul-surat-bebas-laboratorium-otomatis), [REQ-32](System%20Features.md#411-modul-surat-bebas-laboratorium-otomatis) | `PR-50` |
| G13 | Dokumentasi kegiatan & unggah laporan maintenance/kalibrasi | [REQ-23](System%20Features.md#47-modul-dokumentasi-kegiatan-maintenance-dan-kalibrasi), [REQ-24](System%20Features.md#47-modul-dokumentasi-kegiatan-maintenance-dan-kalibrasi) | `PR-51` |
| G14 | Ekspor Laporan Inventarisasi & Laporan Keuangan | [REQ-28](System%20Features.md#49-modul-riwayat-peminjaman-dan-pelaporan), [REQ-29](System%20Features.md#49-modul-riwayat-peminjaman-dan-pelaporan) | `PR-52` |
| G15 | Dashboard Layanan Tarif Eksternal | [REQ-26](System%20Features.md#48-modul-dashboard-analitik-dan-layanan-tarif-eksternal) | `PR-53` |
| G16 | Halaman informasi statik (SOP, persyaratan, FAQ) | [REQ-30](System%20Features.md#410-modul-informasi-statik) | `PR-54` |

> **Catatan.** Gap yang sama juga berlaku pada [user story.md](user%20story.md) — belum ada user story untuk modul transaksi. Lihat [README §4 temuan C8](README.md#4-catatan-konsistensi--temuan).

> ⚠️ **Tabel di atas hanya menyatakan bahwa prosedurnya belum *ditulis*, bukan bahwa fiturnya belum *dibuat*.** Verifikasi terhadap kode (20 Sep 2026) menunjukkan `G2` (checkout), `G6` (persetujuan item-level), `G7` (pembatalan mandiri), dan `G11` (riwayat) **sudah terimplementasi**; `G1`, `G3`, `G4`, dan `G5` terimplementasi sebagian. Yang benar-benar belum dibuat adalah `G8`–`G10` dan `G12`–`G16`. Rinciannya ada di [Verifikasi Implementasi Sprint 1 §6](Verifikasi%20Implementasi%20Sprint%201.md#6-verifikasi-ulang-gap-g1--g16).
