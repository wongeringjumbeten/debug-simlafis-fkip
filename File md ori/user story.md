# User Story — SIMLAFIS

> Kumpulan user story per fitur, dikelompokkan menurut aktor.

| Atribut | Nilai |
| --- | --- |
| Versi | 2.0 |
| Fase | Sprint 1 |
| Jumlah kelompok | 31 (`US-01` … `US-31`) |
| Format ID | `US-<nomor>-<KODE AKTOR>` (contoh: `US-02-ADM`) |
| Dokumen terkait | [Business Requirements](Business%20Requirements.md) · [System Features](System%20Features.md) · [sprint1.md](sprint1.md) |

> **Catatan story point.** Kolom *Story Point* pada dokumen asli **kosong seluruhnya**. Pada dokumen ini nilainya ditulis `TBD` (*to be determined*) dan wajib diisi pada sesi *sprint planning*. Nilai tersebut **tidak** dikarang di sini.

## Daftar Isi

| ID | Fitur | Aktor | Rujukan |
| --- | --- | --- | --- |
| `US-01` | [Dashboard Publik](#us-01--dashboard-publik) | Guest | `PUB-01`…`PUB-03` |
| `US-02` | [Login](#us-02--login) | 6 peran | `REQ-02` |
| `US-03` | [Lupa Password](#us-03--lupa-password--reset-password) | 6 peran | `REQ-04` |
| `US-04` | [Registrasi Akun](#us-04--registrasi-akun) | Mahasiswa, Dosen, Eksternal | `REQ-03` |
| `US-05` | [Melihat Profil](#us-05--melihat-profil-akun) | 6 peran | `REQ-05` |
| `US-06` | [Mengubah Profil](#us-06--mengubah-informasi-profil) | 6 peran | `REQ-05`, `BR-2` |
| `US-07` | [Mengubah Password](#us-07--mengubah-password-akun) | 6 peran | `REQ-04` |
| `US-08` | [Melihat Daftar Pengguna](#us-08--melihat-daftar-pengguna) | Admin | `ADM-09` |
| `US-09` | [Tambah Pengguna](#us-09--tambah-pengguna-baru) | Admin | `ADM-08` |
| `US-10` | [Mengubah Data Pengguna](#us-10--mengubah-data-pengguna) | Admin | `ADM-09` |
| `US-11` | [Kelola Status Akses](#us-11--mengelola-hak-akses--status-peminjaman) | Admin | `ADM-10`, `BR-3` |
| `US-12` | [Dashboard](#us-12--dashboard-setelah-login) | 6 peran | `ADM-04`…`ADM-07` |
| `US-13` | [Tambah Master Alat & Tarif](#us-13--tambah-master-alat--tarif) | Admin | `ADM-11` |
| `US-14` | [Tambah Detail Unit Alat](#us-14--tambah-detail-unit-alat) | PLP | `PLP-03` |
| `US-15` | [Lihat Detail Unit Alat](#us-15--lihat-detail-unit-alat) | Admin, KaLab, PLP | `ADM-11`, `KLB-03`, `PLP-03` |
| `US-16` | [Pencarian & Ketersediaan Alat](#us-16--pencarian--ketersediaan-alat) | Dosen, Mahasiswa, Eksternal | `REQ-09`, `REQ-10` |
| `US-17` | [Ubah Master Alat & Tarif](#us-17--ubah-master-alat--tarif) | Admin | `ADM-11` |
| `US-18` | [Ubah Detail Unit Alat](#us-18--ubah-detail-unit-alat) | PLP | `PLP-03` |
| `US-19` | [Tambah Katalog Ruangan & Tarif](#us-19--tambah-katalog-ruangan--tarif) | Admin | `ADM-12` |
| `US-20` | [Input Jadwal Reguler](#us-20--input-jadwal-reguler-ruangan) | PLP | `PLP-04`, `REQ-14` |
| `US-21` | [Ubah Katalog Ruangan & Tarif](#us-21--ubah-katalog-ruangan--tarif) | Admin | `ADM-12` |
| `US-22` | [Ubah Jadwal Ruangan](#us-22--ubah-jadwal-ruangan) | PLP | `PLP-04` |
| `US-23` | [Lihat Katalog Ruangan](#us-23--lihat-katalog-ruangan) | Admin, KaLab, PLP | `ADM-12`, `KLB-04`, `PLP-04` |
| `US-24` | [Lihat Ketersediaan Ruangan](#us-24--lihat-ketersediaan-ruangan-publik) | Dosen, Mahasiswa, Eksternal | `REQ-12` |
| `US-25` | [Membuat Data Bahan](#us-25--membuat-data-bahan) | PLP | `PLP-05` |
| `US-26` | [Mengubah Data Bahan](#us-26--mengubah-data-bahan) | PLP | `PLP-05` |
| `US-27` | [Lihat Data Bahan](#us-27--lihat-data-bahan) | Admin, KaLab, PLP | `ADM-13`, `KLB-05`, `PLP-05` |
| `US-28` | [Tambah Data Mebeler](#us-28--tambah-data-mebeler) | PLP | `PLP-06` |
| `US-29` | [Mengubah Data Mebeler](#us-29--mengubah-data-mebeler) | PLP | `PLP-06` |
| `US-30` | [Lihat Data Mebeler](#us-30--lihat-data-mebeler) | Admin, KaLab, PLP | `ADM-14`, `KLB-06`, `PLP-06` |
| `US-31` | [Log Out](#us-31--log-out) | 6 peran | `REQ-05` |

---

## US-01 · Dashboard Publik

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-01-PUB` | Calon Pengguna (Publik) | Sebagai Calon Pengguna (Publik), saya ingin melihat informasi laboratorium, katalog alat, dan ketersediaan ruangan sebelum login | Dapat mengetahui layanan dan estimasi biaya sewa sebelum mendaftar/melakukan booking | TBD |

**Skenario**

1. Pengguna mengakses URL utama SIMLAFIS.
2. Sistem menampilkan informasi umum operasional dan deskripsi layanan laboratorium.
3. Sistem menampilkan daftar katalog alat dan ruangan, spesifikasi, dan tarif layanan sewa.
4. Sistem menampilkan prosedur peminjaman, ringkasan persyaratan, dokumen SOP, dan FAQ.
5. Sistem menampilkan bilah pencarian dan filter (kata kunci atau unit laboratorium).
6. Sistem menampilkan alamat loket lab, jam operasional, serta kontak WhatsApp/email PLP.
7. Calon Pengguna mengklik tombol "Pinjam" / "Tambah ke Keranjang".
8. Sistem mengarahkan pengguna ke halaman Login / Registrasi Akun.

---

## US-02 · Login

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-02-ADM` | Admin | Sebagai Admin, saya ingin melakukan login | Dapat mengakses sistem | TBD |
| `US-02-KLB` | KaLab | Sebagai KaLab, saya ingin melakukan login | Dapat mengakses sistem | TBD |
| `US-02-PLP` | PLP | Sebagai PLP, saya ingin melakukan login | Dapat mengakses sistem | TBD |
| `US-02-DSN` | Dosen | Sebagai Dosen, saya ingin melakukan login | Dapat mengakses sistem | TBD |
| `US-02-MHS` | Mahasiswa | Sebagai Mahasiswa, saya ingin melakukan login | Dapat mengakses sistem | TBD |
| `US-02-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal, saya ingin melakukan login | Dapat mengakses sistem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor membuka website dan sistem menampilkan homepage.
2. Aktor mengklik "Login".
3. Sistem menampilkan form login berisi email dan password.
4. Aktor mengisi email dan password.
5. Sistem memvalidasi email dan password.
6. Jika data benar, pengguna diarahkan ke dashboard; jika salah, sistem menampilkan pesan kesalahan.
7. Password ditampilkan dalam bentuk tersembunyi.

---

## US-03 · Lupa Password / Reset Password

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-03-ADM` | Admin | Sebagai Admin yang lupa kata sandi, saya ingin mengajukan pemulihan password via email | Dapat memperbarui kata sandi dan mengakses kembali akun | TBD |
| `US-03-KLB` | KaLab | Sebagai KaLab yang lupa kata sandi, saya ingin mengajukan pemulihan password via email | Idem | TBD |
| `US-03-PLP` | PLP | Sebagai PLP yang lupa kata sandi, saya ingin mengajukan pemulihan password via email | Idem | TBD |
| `US-03-DSN` | Dosen | Sebagai Dosen yang lupa kata sandi, saya ingin mengajukan pemulihan password via email | Idem | TBD |
| `US-03-MHS` | Mahasiswa | Sebagai Mahasiswa yang lupa kata sandi, saya ingin mengajukan pemulihan password via email | Idem | TBD |
| `US-03-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal yang lupa kata sandi, saya ingin mengajukan pemulihan password via email | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor mengklik tautan "Lupa Password" di halaman Login.
2. Sistem menampilkan form input email terdaftar.
3. Aktor menginputkan email dan mengklik "Kirim Link Reset Password".
4. Sistem memeriksa ketersediaan email: bila terdaftar, sistem mengirimkan email berisi tautan/token reset password; bila tidak ditemukan, sistem menampilkan pesan kesalahan.
5. Aktor membuka tautan dari email, menginputkan password baru, dan menyimpan perubahan.

---

## US-04 · Registrasi Akun

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-04-DSN` | Dosen | Sebagai Dosen, saya ingin mendaftarkan akun baru ke dalam sistem | Memiliki akun terverifikasi untuk melakukan pengajuan sewa alat dan ruangan | TBD |
| `US-04-MHS` | Mahasiswa | Sebagai Mahasiswa, saya ingin mendaftarkan akun baru ke dalam sistem | Idem | TBD |
| `US-04-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal, saya ingin mendaftarkan akun baru ke dalam sistem | Idem | TBD |

**Skenario**

1. Aktor membuka halaman Register.
2. Sistem menampilkan form registrasi tahap pertama: Nama Lengkap, Kategori Pengguna (enum: `Mahasiswa UNEJ` / `Dosen UNEJ` / `Pengguna Umum (Non-UNEJ)`), Nomor Telepon/WA, dan Email.
3. Aktor mengisi seluruh data dan mengklik tombol "Lanjut".
4. Sistem memvalidasi data masukan: bila data tidak lengkap, format email tidak valid, atau email sudah terdaftar, sistem menampilkan pesan kesalahan.
5. Bila seluruh data valid, sistem menampilkan form registrasi lanjutan sesuai kategori:

   | Aktor | Field form lanjutan |
   | --- | --- |
   | **Dosen** | NIP `integer` (unik), Fakultas, Prodi, Password, Konfirmasi Password, unggah Foto Profil (JPG/PNG), unggah Foto Kartu Pegawai (JPG/PNG) |
   | **Mahasiswa** | NIM `integer` (unik), Fakultas, Prodi, Password, Konfirmasi Password, unggah Foto Profil (JPG/PNG), unggah Foto Kartu Tanda Mahasiswa (JPG/PNG) |
   | **Pengguna Eksternal** | NIK `integer` (unik), Instansi, Provinsi/Kabupaten/Kecamatan/Kelurahan-Desa, Alamat Lengkap, Password, Konfirmasi Password, unggah Foto Profil (JPG/PNG), unggah Foto Kartu Tanda Penduduk (JPG/PNG) |

6. Aktor mengisi seluruh data dan mengklik tombol "Daftar Sekarang".
7. Sistem memvalidasi: bila ada field belum diisi, ukuran unggahan > 2 MB, format bukan JPG/PNG, atau Password dan Konfirmasi Password tidak sama, sistem menampilkan pesan kesalahan.
8. Bila seluruh data valid, sistem menyimpan data akun baru sesuai kategori, menampilkan pesan "Registrasi akun berhasil, silakan login", dan mengarahkan ke halaman login.

---

## US-05 · Melihat Profil Akun

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-05-ADM` | Admin | Sebagai Admin terautentikasi, saya ingin melihat detail informasi profil akun saya | Dapat memastikan data identitas dan kontak yang terdaftar sudah benar | TBD |
| `US-05-KLB` | KaLab | Sebagai KaLab terautentikasi, saya ingin melihat detail informasi profil akun saya | Idem | TBD |
| `US-05-PLP` | PLP | Sebagai PLP terautentikasi, saya ingin melihat detail informasi profil akun saya | Idem | TBD |
| `US-05-DSN` | Dosen | Sebagai Dosen terautentikasi, saya ingin melihat detail informasi profil akun saya | Idem | TBD |
| `US-05-MHS` | Mahasiswa | Sebagai Mahasiswa terautentikasi, saya ingin melihat detail informasi profil akun saya | Idem | TBD |
| `US-05-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal terautentikasi, saya ingin melihat detail informasi profil akun saya | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor mengklik "Profil Saya".
2. Sistem melakukan query dan menampilkan detail profil: Foto Profil, Nama Lengkap, NIM/NIP/ID Identitas, Instansi/Program Studi, Email, Nomor Telepon, Hak Akses (Role), dan File Identitas.

---

## US-06 · Mengubah Informasi Profil

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-06-ADM` | Admin | Sebagai Admin terautentikasi, saya ingin memperbarui data kontak atau informasi profil saya | Informasi diri di sistem tetap akurat dan mutakhir | TBD |
| `US-06-KLB` | KaLab | Sebagai KaLab terautentikasi, saya ingin memperbarui data kontak atau informasi profil saya | Idem | TBD |
| `US-06-PLP` | PLP | Sebagai PLP terautentikasi, saya ingin memperbarui data kontak atau informasi profil saya | Idem | TBD |
| `US-06-DSN` | Dosen | Sebagai Dosen terautentikasi, saya ingin memperbarui data kontak atau informasi profil saya | Idem | TBD |
| `US-06-MHS` | Mahasiswa | Sebagai Mahasiswa terautentikasi, saya ingin memperbarui data kontak atau informasi profil saya | Idem | TBD |
| `US-06-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal terautentikasi, saya ingin memperbarui data kontak atau informasi profil saya | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor membuka halaman Profil Saya dan mengklik "Ubah Profil".
2. Sistem menampilkan form ubah profil — field sensitif seperti NIM/NIP dan Email bersifat terkunci (*read-only*).
3. Aktor memperbarui data (Nama Lengkap, No. Telepon, Foto Profil, Instansi) lalu mengklik "Simpan Perubahan".
4. Sistem memvalidasi masukan data.
5. Bila valid, sistem memperbarui data di basis data dan menampilkan pesan sukses.

**Kriteria tambahan:** peran (`role`) dan kategori tarif (`kategori`) **tidak dapat** diubah melalui alur ini ([BR-2](Business%20Rule.md#br-2--kategori-tarif-eksternal), [BR-6](Business%20Rule.md#br-6--eksklusivitas-peran-role)).

---

## US-07 · Mengubah Password Akun

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-07-ADM` | Admin | Sebagai Admin terautentikasi, saya ingin mengganti kata sandi akun saya secara berkala | Keamanan akun tetap terjaga dari akses yang tidak sah | TBD |
| `US-07-KLB` | KaLab | Sebagai KaLab terautentikasi, saya ingin mengganti kata sandi akun saya secara berkala | Idem | TBD |
| `US-07-PLP` | PLP | Sebagai PLP terautentikasi, saya ingin mengganti kata sandi akun saya secara berkala | Idem | TBD |
| `US-07-DSN` | Dosen | Sebagai Dosen terautentikasi, saya ingin mengganti kata sandi akun saya secara berkala | Idem | TBD |
| `US-07-MHS` | Mahasiswa | Sebagai Mahasiswa terautentikasi, saya ingin mengganti kata sandi akun saya secara berkala | Idem | TBD |
| `US-07-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal terautentikasi, saya ingin mengganti kata sandi akun saya secara berkala | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor membuka halaman Profil Saya dan mengklik "Ubah Password".
2. Sistem menampilkan form ubah password: Password Lama, Password Baru, dan Konfirmasi Password Baru.
3. Aktor mengisi form dan mengklik "Perbarui Password".
4. Sistem memvalidasi masukan: bila password lama tidak sesuai atau password baru tidak memenuhi kriteria keamanan, sistem menampilkan pesan kesalahan.
5. Bila valid, sistem memperbarui password dan menampilkan pesan sukses.

---

## US-08 · Melihat Daftar Pengguna

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-08-ADM` | Admin | Sebagai Admin, saya ingin melihat daftar seluruh pengguna terdaftar beserta role dan status akunnya | Dapat mengelola dan memantau akun pengguna di dalam sistem | TBD |

**Skenario**

1. Admin memilih menu Manajemen Pengguna.
2. Sistem menampilkan tabel daftar pengguna dengan kolom: Nama Lengkap, Foto Profil, Email, Institusi, Hak Akses (Role), Status Akses (`active`, `blocked`, `suspended`), dan Aksi (Detail, Edit, Ubah Status).
3. Pengguna mengklik tombol Detail.
4. Sistem menampilkan pop-up berisi: Nama Lengkap, Foto Profil, Email, No Identitas, No Telepon, Institusi, Hak Akses (Role), Status Akses, dan Foto Identitas.
5. Sistem menyediakan filter berdasarkan Role (Mahasiswa, Dosen, PLP, KaLab, Eksternal) dan kolom pencarian.

---

## US-09 · Tambah Pengguna Baru

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-09-ADM` | Admin | Sebagai Admin, saya ingin menambahkan akun pengguna baru (terutama akun pengelola seperti KaLab, PLP, atau Dosen) | Pengguna baru dapat mengakses sistem sesuai hak akses yang diberikan | TBD |

**Skenario**

1. Admin mengklik tombol "Tambah Pengguna" di halaman Manajemen Pengguna.
2. Sistem menampilkan form penambahan pengguna baru: Nama Lengkap, Instansi/Organisasi, Role (enum: Admin / KaLab / PLP / Mahasiswa / Internal-UNEJ / Luar-UNEJ), Nomor Telepon/WA, No Identitas, Email, Password, Konfirmasi Password, Foto Profil, dan Foto Identitas (KTM atau KTP).
3. Admin mengisi form dan mengklik "Simpan".
4. Sistem memvalidasi masukan data (termasuk pengecekan duplikasi NIP/Email).
5. Bila valid, sistem menyimpan pengguna baru ke basis data.

---

## US-10 · Mengubah Data Pengguna

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-10-ADM` | Admin | Sebagai Admin, saya ingin memperbarui data akun pengguna lain (seperti perubahan role) | Data akun pengguna sesuai dengan penetapan tugas | TBD |

**Skenario**

1. Admin memilih salah satu pengguna pada tabel dan mengklik tombol "Edit".
2. Sistem menampilkan form ubah pengguna yang terisi data saat ini.
3. Admin melakukan penyesuaian (misalnya mengubah role pengguna).
4. Admin mengklik "Simpan Perubahan".
5. Sistem memvalidasi dan memperbarui data akun pada basis data.

---

## US-11 · Mengelola Hak Akses & Status Peminjaman

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-11-ADM` | Admin | Sebagai Admin, saya ingin mengaktifkan, menonaktifkan, atau membatasi hak akses peminjaman akun pengguna tertentu | Pengguna yang melanggar aturan/sanksi (misalnya terlambat mengembalikan alat) dapat dibatasi akses peminjaman alat/ruangannya | TBD |

**Skenario**

1. Admin memilih akun pengguna yang ingin dikelola pada tabel Manajemen Pengguna.
2. Admin mengklik tombol "Ubah Status".
3. Sistem menampilkan pop-up modal pilihan status akses: Status Akses (dropdown `active`, `blocked`, `suspended`) dan Alasan Perubahan Status (`TEXT`).
4. Admin memilih status baru (misalnya `suspended`) dan memasukkan catatan alasan sanksi.
5. Admin mengklik "Simpan Status".
6. Sistem memperbarui status pengguna di basis data: pengguna berstatus `suspended` tetap bisa login, namun tombol/fitur Booking dan Tambah ke Keranjang dinonaktifkan oleh sistem.

---

## US-12 · Dashboard (Setelah Login)

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-12-ADM` | Admin | Sebagai Admin, saya ingin melihat dashboard dengan statistik sistem dan aktivitas laboratorium | Dapat memantau operasional seluruh laboratorium dan lalu lintas transaksi peminjaman secara menyeluruh | TBD |
| `US-12-KLB` | KaLab | Sebagai KaLab, saya ingin melihat dashboard dengan statistik sistem dan aktivitas laboratorium | Idem | TBD |
| `US-12-PLP` | PLP | Sebagai PLP, saya ingin melihat dashboard dengan statistik sistem dan aktivitas laboratorium | Idem | TBD |
| `US-12-MHS` | Mahasiswa | Sebagai Mahasiswa, saya ingin melihat ringkasan aktivitas dan status peminjaman di dashboard | Dapat memantau status pengajuan peminjaman alat/ruangan secara *real-time* | TBD |
| `US-12-DSN` | Dosen | Sebagai Dosen, saya ingin melihat ringkasan aktivitas dan status peminjaman di dashboard | Idem | TBD |
| `US-12-EKS` | Eksternal | Sebagai Eksternal, saya ingin melihat ringkasan aktivitas dan status peminjaman di dashboard | Idem | TBD |

**Skenario — dashboard pengelola (Admin, KaLab, PLP)**

1. Aktor melakukan login ke sistem dan sistem menampilkan dashboard utama.
2. Sistem menyajikan total akumulasi pendapatan (**khusus Admin**), statistik total inventaris alat/ruangan, statistik pengguna, ringkasan transaksi sewa publik, dan 10 peminjaman terbaru.

**Skenario — dashboard peminjam (Mahasiswa, Dosen, Eksternal)**

1. Aktor melakukan login ke sistem dan sistem menampilkan dashboard khusus.
2. Sistem menyajikan ringkasan aktivitas peminjaman aktif, widget status peminjaman terkini, dan notifikasi pengembalian.
3. Aktor dapat mengklik *Quick Links* ke Katalog Alat/Ruangan.

---

## US-13 · Tambah Master Alat & Tarif

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-13-ADM` | Admin | Sebagai Admin, saya ingin menginputkan data master katalog alat beserta acuan tarif sewa | Master alat terdaftar di katalog publik dengan acuan harga sewa yang valid | TBD |

**Skenario**

1. Admin memilih menu Katalog Alat dan mengklik "Tambah Alat & Tarif".
2. Sistem menampilkan form tambah data alat: Nama Alat, Foto Alat (JPG/PNG maks 2 MB), Deskripsi, dan Tarif Eksternal `decimal(12,2)` (default 0.00).
3. Admin mengisi form dan mengklik "Simpan Data Alat".
4. Sistem memvalidasi masukan: bila ada field kosong, tarif tidak valid, atau foto > 2 MB, sistem menampilkan pesan kesalahan.
5. Bila valid, sistem menampilkan dialog konfirmasi.
6. Admin mengonfirmasi dialog simpan.
7. Sistem menyimpan data master ke basis data (stok dikalkulasi otomatis dari detail unit).

---

## US-14 · Tambah Detail Unit Alat

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-14-PLP` | PLP | Sebagai PLP, saya ingin menginputkan data unit spesifik `id_detail_alat` ke dalam sistem | Setiap fisik alat terdata secara presisi dan stok pada katalog master bertambah otomatis | TBD |

**Skenario**

1. PLP memilih menu Katalog Alat dan mengklik "Tambah Unit Detail Alat".
2. Sistem menampilkan form registrasi detail alat: No Seri Unit `varchar(100)` (PK), Nama Alat (pilih master), Lokasi Penyimpanan (dropdown: Lab Fisika Dasar / Lab Elektronika / Lab Fisika Lanjut / Lab ELF), Kondisi (enum `baik`, `rusak`), Status (enum `tersedia`, `tidak tersedia`, `sedang perbaikan`), Tahun Pengadaan, Sumber Dana, Harga Beli (nullable), dan Catatan (nullable).
3. PLP mengisi data dan mengklik "Simpan Detail Alat".
4. Sistem memvalidasi: bila `id_detail_alat` duplikat, ada field wajib belum diisi, atau format inputan salah, sistem menampilkan pesan kesalahan.
5. Bila valid, sistem menampilkan dialog konfirmasi.
6. PLP mengonfirmasi dialog simpan.
7. Sistem menyimpan data unit dan mengkalkulasi ulang stok total master alat (+1).

---

## US-15 · Lihat Detail Unit Alat

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-15-ADM` | Admin | Sebagai Admin, saya ingin melihat daftar katalog dan rincian spesifikasi fisik tiap unit alat | Dapat memantau kuantitas stok riil dan kondisi fisik seluruh inventaris | TBD |
| `US-15-KLB` | KaLab | Sebagai KaLab, saya ingin melihat daftar katalog dan rincian spesifikasi fisik tiap unit alat | Idem | TBD |
| `US-15-PLP` | PLP | Sebagai PLP, saya ingin melihat daftar katalog dan rincian spesifikasi fisik tiap unit alat | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor membuka menu "Katalog Laboratorium".
2. Sistem menampilkan daftar master alat beserta kuantitas stok kalkulasi otomatis.
3. Aktor mengklik tombol "Detail" pada salah satu baris alat.
4. Sistem menampilkan rincian spesifikasi unit berdasarkan `id_detail_alat` (Kondisi, Status, Lokasi, Sumber Dana, Harga Beli, Catatan).

---

## US-16 · Pencarian & Ketersediaan Alat

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-16-DSN` | Dosen | Sebagai Dosen, saya ingin mencari dan memeriksa stok ketersediaan alat berdasarkan tanggal peminjaman | Dapat mengetahui alat yang tersedia untuk dipinjam/disewa | TBD |
| `US-16-MHS` | Mahasiswa | Sebagai Mahasiswa, saya ingin mencari dan memeriksa stok ketersediaan alat berdasarkan tanggal peminjaman | Idem | TBD |
| `US-16-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal, saya ingin mencari dan memeriksa stok ketersediaan alat berdasarkan tanggal peminjaman | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor membuka menu Katalog Laboratorium dan menginputkan kata kunci serta rentang tanggal peminjaman.
2. Sistem mengkalkulasi stok riil (total unit berkondisi baik dan tersedia, dikurangi unit yang sudah ter-booking).
3. Sistem menampilkan kartu daftar alat beserta kuantitas stok riil.
4. **Khusus Pengguna Eksternal:** sistem juga menampilkan tarif sewa ([REQ-12](System%20Features.md#43-modul-katalog-interaktif-dan-keranjang-sesi)).

---

## US-17 · Ubah Master Alat & Tarif

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-17-ADM` | Admin | Sebagai Admin, saya ingin memperbarui informasi master alat atau nominal tarif sewa | Informasi katalog publik dan acuan biaya sewa tetap akurat | TBD |

**Skenario**

1. Admin memilih tombol "Ubah" pada salah satu master alat.
2. Sistem menampilkan form ubah data yang terisi informasi saat ini: Nama Alat, Foto Alat, Deskripsi, dan Tarif Eksternal.
3. Admin menyesuaikan data dan mengklik "Simpan Perubahan".
4. Sistem memvalidasi data: bila ada field kosong, inputan tidak valid, atau ukuran/format foto tidak sesuai, sistem menampilkan pesan kesalahan.
5. Bila valid, sistem menampilkan dialog konfirmasi.
6. Sistem memperbarui basis data master alat.

---

## US-18 · Ubah Detail Unit Alat

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-18-PLP` | PLP | Sebagai PLP, saya ingin memperbarui status operasional atau kondisi fisik unit `id_detail_alat` | Status ketersediaan fisik alat (tersedia, rusak, sedang perbaikan) selalu terbarui | TBD |

**Skenario**

1. PLP memilih salah satu `id_detail_alat` dan mengklik "Ubah".
2. Sistem menampilkan form ubah unit alat (`id_detail_alat` terkunci): No Seri Unit (read-only), Nama Alat, Lokasi Penyimpanan, Kondisi, Status, Tahun Pengadaan, Sumber Dana, Harga Beli, dan Catatan.
3. PLP memperbarui data dan mengklik "Simpan Perubahan".
4. Sistem memvalidasi data: bila ada field kosong atau inputan tidak valid, sistem menampilkan pesan kesalahan.
5. Bila valid, sistem menampilkan dialog konfirmasi.
6. Sistem memperbarui data unit fisik di basis data.

---

## US-19 · Tambah Katalog Ruangan & Tarif

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-19-ADM` | Admin | Sebagai Admin, saya ingin menambahkan data ruangan laboratorium baru beserta tarif sewa eksternal | Ruangan terdaftar di katalog publik dan dapat dipinjam/disewa | TBD |

**Skenario**

1. Admin mengklik "Tambah Ruangan & Tarif" di menu Katalog Ruangan.
2. Sistem menampilkan form tambah ruangan: Nama Ruangan, Foto Ruangan, Kapasitas `int`, Tarif Sewa Eksternal `decimal(12,2)` (default 0.00, opsional), dan Deskripsi.
3. Admin mengisi form dan mengklik "Simpan Data Ruangan".
4. Sistem memvalidasi: bila field wajib belum diisi, inputan tidak sesuai, atau format gambar/ukuran tidak sesuai, sistem menampilkan pesan kesalahan.
5. Bila valid, sistem menampilkan dialog konfirmasi.
6. Sistem menyimpan data ruangan baru ke basis data.

---

## US-20 · Input Jadwal Reguler Ruangan

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-20-PLP` | PLP | Sebagai PLP, saya ingin memasukkan jadwal reguler perkuliahan/praktikum ke dalam kalender ruangan | Slot waktu perkuliahan terblokir dan tidak dapat dibooking oleh pihak lain | TBD |

**Skenario**

1. PLP memilih "Tambah Jadwal Reguler" pada menu Jadwal Ruangan.
2. Sistem menampilkan form tambah jadwal: Pilihan Ruangan (dropdown), Nama Kegiatan/Mata Kuliah, Penanggung Jawab/Dosen, Hari (dropdown), Jam Mulai `time`, dan Jam Selesai `time`.
3. PLP mengisi data dan mengklik "Simpan Jadwal".
4. Sistem melakukan *anti-collision check*: bila jadwal bentrok, ada field wajib kosong, atau jam mulai ≥ jam selesai, sistem menolak dan menampilkan pesan kesalahan.
5. Bila aman, sistem menampilkan dialog konfirmasi.
6. Sistem menyimpan jadwal reguler ke dalam kalender.

---

## US-21 · Ubah Katalog Ruangan & Tarif

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-21-ADM` | Admin | Sebagai Admin, saya ingin memperbarui informasi fasilitas, kapasitas, atau tarif sewa ruangan | Informasi data ruangan di katalog publik selalu mutakhir | TBD |

**Skenario**

1. Admin memilih tombol "Ubah" pada salah satu ruangan.
2. Sistem menampilkan form ubah yang terisi data saat ini: ID Ruangan (read-only), Nama Ruangan, Foto Ruangan, Kapasitas, Tarif Sewa Eksternal, dan Deskripsi.
3. Admin memperbarui informasi dan mengklik "Simpan Perubahan".
4. Sistem memvalidasi: bila field wajib kosong, inputan tidak sesuai, atau format/ukuran gambar tidak sesuai, sistem menolak dan menampilkan pesan kesalahan.
5. Bila aman, sistem menampilkan dialog konfirmasi.
6. Sistem memperbarui data ruangan di basis data.

---

## US-22 · Ubah Jadwal Ruangan

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-22-PLP` | PLP | Sebagai PLP, saya ingin menyesuaikan tanggal atau jam agenda ruangan yang telah terdaftar | Perubahan jadwal kuliah pengganti atau kegiatan lab terbaru tercatat di sistem | TBD |

**Skenario**

1. PLP memilih salah satu blok agenda di kalender dan mengklik "Ubah Jadwal".
2. Sistem menampilkan form ubah jadwal yang terisi data saat ini.
3. PLP mengubah tanggal/jam operasional dan mengklik "Simpan Perubahan".
4. Sistem melakukan *anti-collision check* pada slot waktu baru: bila bentrok, sistem menolak dan menampilkan pesan kesalahan.
5. Bila aman, sistem menampilkan dialog konfirmasi dan memperbarui basis data.

---

## US-23 · Lihat Katalog Ruangan

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-23-ADM` | Admin | Sebagai Admin, saya ingin melihat daftar katalog ruangan, detail fasilitas, dan acuan tarif sewa | Dapat memantau dan mengelola seluruh ruangan lab yang terdaftar | TBD |
| `US-23-KLB` | KaLab | Sebagai KaLab, saya ingin melihat kalender jadwal penggunaan ruangan laboratorium | Dapat mengawasi seluruh agenda praktikum, riset, maupun sewa ruangan | TBD |
| `US-23-PLP` | PLP | Sebagai PLP, saya ingin melihat tampilan kalender jadwal operasional ruangan di unit lab bertugas | Dapat mempersiapkan ruangan dan fasilitas sesuai jam kegiatan | TBD |

**Skenario**

1. Aktor membuka menu Katalog Laboratorium dan memilih tab Jadwal Ruangan.
2. Sistem menampilkan tabel daftar ruangan beserta kapasitas dan acuan tarif sewa.
3. Aktor mengklik tombol "Detail" pada salah satu ruangan.
4. Sistem menampilkan nama dan deskripsi ruangan, serta mengambil data jadwal dari basis data dan menyajikannya dalam bentuk kalender interaktif (*weekly*/*monthly view*).
5. Aktor mengklik salah satu blok jadwal untuk melihat rincian peminjaman/kegiatan.

---

## US-24 · Lihat Ketersediaan Ruangan Publik

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-24-DSN` | Dosen | Sebagai Dosen, saya ingin melihat katalog ruangan dan kalender ketersediaan jam kosong | Dapat memilih slot waktu yang belum terisi (*Available*) untuk diajukan peminjaman | TBD |
| `US-24-MHS` | Mahasiswa | Sebagai Mahasiswa, saya ingin melihat katalog ruangan dan kalender ketersediaan jam kosong | Idem | TBD |
| `US-24-EKS` | Eksternal | Sebagai Pengguna Eksternal, saya ingin melihat katalog ruangan dan kalender ketersediaan jam kosong | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor membuka menu Katalog & Jadwal Ruangan.
2. Sistem menampilkan daftar ruangan beserta kalender ketersediaan slot waktu.
3. Aktor memilih tanggal untuk memeriksa jam yang kosong/terisi.

---

## US-25 · Membuat Data Bahan

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-25-PLP` | PLP | Sebagai PLP, saya ingin mencatatkan data bahan habis pakai baru ke dalam sistem | Stok awal dan spesifikasi bahan habis pakai terdata di inventaris lab | TBD |

**Skenario**

1. PLP mengklik "Tambah Data Bahan" pada menu Katalog Bahan.
2. Sistem menampilkan form: Nama Bahan, Foto Bahan, Lokasi Penyimpanan (dropdown unit lab), Stok Awal `integer`, Sisa Stok Ketersediaan `integer`, Satuan (Gram, mL, Pcs, Botol), Tanggal Kadaluarsa `date` (nullable), Status (dropdown `aman`, `menipis`, `habis`), dan Catatan (nullable).
3. PLP mengisi form dan mengklik "Simpan Data Bahan".
4. Sistem memvalidasi data: bila field wajib kosong, inputan tidak sesuai, atau format/ukuran gambar tidak sesuai, sistem menolak dan menampilkan pesan kesalahan.
5. Bila aman, sistem menampilkan dialog konfirmasi.
6. Sistem menyimpan data bahan ke dalam basis data.

---

## US-26 · Mengubah Data Bahan

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-26-PLP` | PLP | Sebagai PLP, saya ingin memperbarui sisa kuantitas stok atau tanggal kadaluarsa bahan | Catatan kuantitas bahan habis pakai di sistem sesuai dengan fisik di lapangan | TBD |

**Skenario**

1. PLP memilih salah satu bahan dan mengklik "Ubah".
2. Sistem menampilkan form ubah bahan (`id_bahan` terkunci): Nama Bahan, Foto Bahan, Lokasi Penyimpanan, Stok Awal, Sisa Stok Ketersediaan, Satuan, Tanggal Kadaluarsa, Status, dan Catatan.
3. PLP memperbarui data dan mengklik "Simpan Perubahan".
4. Sistem memvalidasi data: bila field wajib kosong, inputan tidak sesuai, atau format/ukuran gambar tidak sesuai, sistem menolak dan menampilkan pesan kesalahan.
5. Bila aman, sistem menampilkan dialog konfirmasi.
6. Sistem memperbarui data bahan di basis data.

---

## US-27 · Lihat Data Bahan

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-27-ADM` | Admin | Sebagai Admin, saya ingin melihat daftar inventaris bahan habis pakai dan sisa stoknya | Pengelola dapat memantau ketersediaan bahan kimia/habis pakai di seluruh unit lab | TBD |
| `US-27-KLB` | KaLab | Sebagai KaLab, saya ingin melihat daftar inventaris bahan habis pakai dan sisa stoknya | Idem | TBD |
| `US-27-PLP` | PLP | Sebagai PLP, saya ingin melihat daftar lengkap bahan habis pakai di unit laboratorium tempat bertugas | Dapat melakukan pengecekan stok opnam bahan secara berkala | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor memilih Tab Katalog Bahan.
2. Sistem menampilkan tabel daftar bahan: Kode Bahan, Nama Bahan, Foto Bahan, Lokasi Penyimpanan, Stok Awal, Sisa Stok Ketersediaan, Satuan (Gram / mL / Pcs / Pack), Status, dan Catatan.
3. **Khusus PLP:** tersedia kolom Aksi "Ubah".

---

## US-28 · Tambah Data Mebeler

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-28-PLP` | PLP | Sebagai PLP, saya ingin menginputkan data unit aset mebeler baru ke dalam inventaris lab | Aset fisik mebeler terdaftar secara lengkap dalam basis data | TBD |

**Skenario**

1. PLP mengklik "Tambah Unit Mebeler" pada menu Data Mebeler.
2. Sistem menampilkan form data mebeler: Nama Mebeler, Foto Mebeler, Lokasi Penyimpanan (Unit Lab), Kondisi (enum `baik`, `rusak`, `sedang perbaikan`), Tahun Pengadaan, Sumber Dana, Harga Beli (opsional), dan Catatan (opsional).
3. PLP mengisi data dan mengklik "Simpan Data Mebeler".
4. Sistem memvalidasi data: bila field wajib kosong, inputan tidak sesuai, atau format/ukuran gambar tidak sesuai, sistem menolak dan menampilkan pesan kesalahan.
5. Bila aman, sistem menampilkan dialog konfirmasi.
6. Sistem menyimpan unit mebeler baru ke basis data.

---

## US-29 · Mengubah Data Mebeler

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-29-PLP` | PLP | Sebagai PLP, saya ingin memperbarui kondisi fisik atau status ketersediaan unit mebeler | Data kelayakan aset mebeler di sistem sesuai kondisi riil | TBD |

**Skenario**

1. PLP memilih salah satu data mebeler dan mengklik "Ubah".
2. Sistem menampilkan form ubah mebeler (`id_mebeler` terkunci): Nama Mebeler (Meja Lab / Kursi / Almari / Display), Foto Mebeler, Lokasi Penyimpanan (Unit Lab), Kondisi, Tahun Pengadaan, Sumber Dana, Harga Beli, dan Catatan.
3. PLP mengklik "Simpan Perubahan".
4. Sistem memvalidasi data: bila field wajib kosong, inputan tidak sesuai, atau format/ukuran gambar tidak sesuai, sistem menolak dan menampilkan pesan kesalahan.
5. Bila aman, sistem menampilkan dialog konfirmasi.
6. Sistem memperbarui data mebeler di basis data.

---

## US-30 · Lihat Data Mebeler

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-30-ADM` | Admin | Sebagai Admin, saya ingin melihat daftar inventaris aset mebeler laboratorium | Pengelola dapat memantau kuantitas dan kondisi fisik mebeler di tiap unit lab | TBD |
| `US-30-KLB` | KaLab | Sebagai KaLab, saya ingin melihat daftar inventaris aset mebeler laboratorium | Idem | TBD |
| `US-30-PLP` | PLP | Sebagai PLP, saya ingin melihat daftar inventaris mebeler di unit lab penugasan | Dapat memantau keberadaan dan kelayakan aset mebeler | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor memilih Tab Katalog Mebeler.
2. Sistem menampilkan daftar seluruh aset mebeler laboratorium: Nama Mebeler (Meja Lab / Kursi / Almari / Display), Foto Mebeler, Lokasi Penyimpanan (Unit Lab), Kondisi, Tahun Pengadaan, Sumber Dana, Harga Beli, dan Catatan.
3. **Khusus PLP:** tersedia kolom Aksi "Ubah".

---

## US-31 · Log Out

| ID | Aktor | User Story | Manfaat | Story Point |
| --- | --- | --- | --- | --- |
| `US-31-ADM` | Admin | Sebagai Admin yang sedang login, saya ingin keluar dari sesi akun sistem | Sesi akun berakhir dengan aman dan tidak dapat diakses orang lain | TBD |
| `US-31-KLB` | KaLab | Sebagai KaLab yang sedang login, saya ingin keluar dari sesi akun sistem | Idem | TBD |
| `US-31-PLP` | PLP | Sebagai PLP yang sedang login, saya ingin keluar dari sesi akun sistem | Idem | TBD |
| `US-31-DSN` | Dosen | Sebagai Dosen yang sedang login, saya ingin keluar dari sesi akun sistem | Idem | TBD |
| `US-31-MHS` | Mahasiswa | Sebagai Mahasiswa yang sedang login, saya ingin keluar dari sesi akun sistem | Idem | TBD |
| `US-31-EKS` | Pengguna Eksternal | Sebagai Pengguna Eksternal yang sedang login, saya ingin keluar dari sesi akun sistem | Idem | TBD |

**Skenario** (berlaku untuk seluruh aktor di atas)

1. Aktor mengklik tombol/menu "Log Out".
2. Sistem menampilkan dialog konfirmasi "Apakah Anda yakin ingin keluar dari sistem?".
3. Aktor mengklik "Ya, Log Out".
4. Sistem menampilkan pesan "Anda telah berhasil logout" dan menghapus token autentikasi/sesi login.
5. Sistem mengarahkan aktor kembali ke halaman Login / Dashboard Publik dengan notifikasi sukses keluar.

---

## Lampiran A · Perbaikan Redaksional

Perbaikan berikut dilakukan terhadap dokumen asli tanpa mengubah makna.

| # | Lokasi asli | Masalah | Perbaikan |
| --- | --- | --- | --- |
| 1 | US-04 (Dosen, Mahasiswa, Eksternal) | Judul tertulis ganda: `Title: Title: Registrasi Akun ...` | Menjadi `Registrasi Akun` |
| 2 | US-02 (KaLab) | `Actor: Admin` — aktor salah | Menjadi `KaLab` |
| 3 | US-02 (PLP) | `Actor: Admin` dan langkah "Kalab klik Login" — aktor salah | Menjadi `PLP` |
| 4 | US-03 (urutan aktor) | Aktor tidak berurutan | Diurutkan: Admin, KaLab, PLP, Dosen, Mahasiswa, Eksternal |
| 5 | US-07 (Eksternal) | Langkah pertama tertulis "Mahasiswa membuka halaman..." | Menjadi "Pengguna Eksternal membuka halaman..." |
| 6 | US-22 | `Actor: Admin` padahal skenario berisi langkah PLP | Menjadi `PLP` |
| 7 | US-21 | Judul tidak konsisten | Menjadi `Ubah Katalog Ruangan & Tarif` |
| 8 | US-27 / US-30 | Judul tertulis "Lihat Data Bahan dan Ketersediaan Mebeler" | Menjadi `Lihat Data Mebeler` |
| 9 | Seluruh kelompok | Kolom *Story Point* kosong | Ditulis `TBD` dan wajib diisi pada *sprint planning* |

## Lampiran B · Gap User Story

User story **belum tersedia** untuk modul transaksi Sprint 1. Rincian gap ada pada [sprint1.md §4](sprint1.md#4-gap-dokumentasi-sprint-1) (temuan **C8**).

| Kelompok yang perlu ditambahkan | Rujukan requirement |
| --- | --- |
| Keranjang sesi sementara (tambah/lihat/hapus item) | `REQ-13` |
| Pembuatan pengajuan peminjaman (*checkout*) | `REQ-14` |
| Pemilihan & verifikasi pembayaran eksternal | `REQ-16`, `REQ-22` |
| Persetujuan/penolakan item-level oleh KaLab/Admin | `REQ-17`, `REQ-18` |
| Pembatalan pengajuan mandiri | `REQ-19`, `BR-5` |
| Penyerahan fisik & perubahan status menjadi Dipinjam | `REQ-20` |
| Validasi pengembalian fisik & penangguhan otomatis | `REQ-20`, `REQ-21` |
| Riwayat peminjaman per item | `REQ-27` |
| Bebas laboratorium & cetak surat | `REQ-31`, `REQ-32` |
| Dokumentasi kegiatan & laporan maintenance/kalibrasi | `REQ-23`, `REQ-24` |
| Ekspor laporan inventarisasi & keuangan | `REQ-28`, `REQ-29` |
| Dashboard layanan tarif eksternal | `REQ-26` |
| Halaman informasi statik (SOP/persyaratan/FAQ) | `REQ-30` |
