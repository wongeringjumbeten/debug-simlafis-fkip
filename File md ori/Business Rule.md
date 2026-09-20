# Business Rule — SIMLAFIS

> Aturan bisnis (*business rules*) adalah prinsip atau ketentuan operasional yang mengatur bagaimana sistem digunakan berdasarkan kebijakan organisasi dan proses bisnis laboratorium. Aturan ini **bukan** persyaratan fungsional langsung, tetapi memengaruhi bagaimana fitur dibangun, digunakan, dan ditegakkan — kadang menuntut pengembangan fungsi tambahan.

| Atribut | Nilai |
| --- | --- |
| Versi | 2.0 |
| Fase | Sprint 1 |
| Jumlah aturan | 7 (`BR-1` … `BR-7`) |
| Dokumen terkait | [Business Requirements](Business%20Requirements.md) · [System Features](System%20Features.md) · [Overall Description](Overall%20Description.md) |

## Daftar Isi

1. [Ringkasan Aturan](#1-ringkasan-aturan)
2. [Detail Aturan](#2-detail-aturan)
3. [Pemetaan dengan Dokumen Asli](#3-pemetaan-dengan-dokumen-asli)

---

## 1. Ringkasan Aturan

| ID | Nama Aturan | Ringkas | Ditegakkan di |
| --- | --- | --- | --- |
| `BR-1` | Otoritas Manajemen Akun | Pembuatan, penonaktifan, dan reset password akun pengelola adalah wewenang Admin. Registrasi mandiri hanya untuk Mahasiswa, Dosen, dan Eksternal | Middleware `admin`, `RegistrationService`, `AccountStatusService` |
| `BR-2` | Kategori Tarif Eksternal | Pengguna eksternal diklasifikasikan `internal_unej` atau `luar_unej`; kategori tarif adalah atribut akun, bukan peran, dan hanya dapat diubah Admin | `RegistrationService`, `ProfileUpdateRequest`, `UserController` |
| `BR-3` | Sanksi Penangguhan Akses | Perusakan, kehilangan, atau keterlambatan pengembalian melebihi 7 hari kalender memicu penangguhan akun oleh Admin/PLP | Middleware `borrower.active`, `AccountStatusService`, `PeminjamanService` |
| `BR-4` | Hierarki Otoritas (*Item-Level Approval*) | Setiap item dalam satu nomor transaksi diproses independen; penolakan ruangan tidak membatalkan item alat | `PersetujuanController`, `PengajuanPeminjaman` |
| `BR-5` | Hak Pembatalan Mandiri | Pemohon dapat membatalkan transaksinya sendiri selama belum berstatus "Dipinjam"; sistem melepas kuota alat dan slot jadwal ruangan | `PeminjamanController`, `PeminjamanService` |
| `BR-6` | Eksklusivitas Peran | Satu akun hanya terhubung dengan satu peran (*single-role*) | Kolom `role`, matriks akses, `nav-items.ts` |
| `BR-7` | Ketersediaan Informasi Publik | Katalog dan tarif dapat diakses tanpa autentikasi; manajemen internal, kalender pengajuan, dan riwayat transaksi wajib login | Routing publik vs grup middleware `auth` |

---

## 2. Detail Aturan

### BR-1 · Otoritas Manajemen Akun

**Deskripsi.** Pengelolaan identitas pengguna bersifat terpusat dan berlapis sesuai kelompok pengguna.

**Ketentuan operasional**

1. Akun pengelola (**Admin, KaLab, PLP**) dibuat, diubah, dan dinonaktifkan **secara terpusat oleh Admin**. Pengguna level internal tidak membuat akun pengelola sendiri.
2. Akun **Mahasiswa, Dosen, dan Eksternal** dapat dibuat melalui registrasi mandiri, dengan konsekuensi: verifikasi dokumen identitas (KTM / kartu pegawai / KTP) dilakukan manual.
3. Penonaktifan (*deactivation*) dan pengaturan ulang kata sandi (*reset password*) seluruh akun civitas tetap merupakan wewenang Admin.
4. Admin tidak boleh mengubah perannya sendiri dan tidak boleh menangguhkan akunnya sendiri (pengaman agar tidak terjadi *lockout*).

**Implikasi implementasi**

| Aspek | Keterangan |
| --- | --- |
| Rute | Registrasi hanya tersedia pada halaman publik; manajemen pengguna berada di grup middleware `admin` |
| Validasi | `CreateNewUser` → `RegistrationService`; `Users/*` Form Request memeriksa ulang peran pada `authorize()` |
| Atribut terlarang | `role` dan `kategori` tidak pernah masuk himpunan validasi pada alur profil mandiri |

> ⚠️ **Perubahan dari dokumen asli (temuan C6).** Dokumen asli menyatakan seluruh akun internal (PLP, KaLab, Dosen, Mahasiswa) dibuat Admin dan melarang registrasi mandiri. Keputusan product owner yang berlaku (tercatat pada `docs/srs-decisions.md`) mengizinkan registrasi mandiri untuk **Mahasiswa, Dosen, dan Eksternal**; larangan hanya berlaku untuk akun pengelola. Aturan di atas sudah mengikuti keputusan tersebut.

---

### BR-2 · Kategori Tarif Eksternal

**Deskripsi.** Tarif layanan dibedakan menurut klasifikasi pengguna, dan klasifikasi tersebut merupakan atribut akun — bukan peran tambahan.

**Ketentuan operasional**

1. Pengguna eksternal diklasifikasikan menjadi dua sub-kategori:
   - **Internal-UNEJ** — civitas Universitas Jember di luar Program Studi Pendidikan Fisika; mendapat tarif akademis universitas.
   - **Luar-UNEJ** — pihak di luar Universitas Jember; dikenakan tarif komersial penuh.
2. Pengguna internal (Dosen dan Mahasiswa Pendidikan Fisika) **tidak dikenakan tarif** dan tidak melihat label harga.
3. Kategori tarif hanya dapat ditetapkan/diubah oleh **Admin**; pengguna tidak dapat mengubah kategori tarifnya sendiri (mencegah manipulasi biaya).
4. Untuk peran selain eksternal, atribut `instansi` dan `kategori` dinormalkan menjadi kosong.

**Implikasi implementasi**

| Aspek | Keterangan |
| --- | --- |
| Nilai yang sah | `internal_unej`, `luar_unej` (kolom `kategori` pada `users`) |
| Kolom tarif | `alat.tarif_eksternal_luar_unej`, `alat.tarif_eksternal_internal_unej`, `ruangan.tarif_eksternal` (diperlakukan sebagai tarif Luar UNEJ) |
| Pengaman | `ProfileUpdateRequest` mengecualikan `kategori`; `UserController::normalizeExternal()` mengosongkan atribut eksternal untuk peran non-eksternal |

> ⚠️ **Temuan C5.** Aturan ini **tidak tertulis** pada dokumen Business Rule asli (yang hanya memuat 6 aturan), tetapi dirujuk sebagai `BR-2` oleh kode (`ProfileValidationRules`, `KatalogController`, `.ai/rules/users.md`) dan oleh Overall Description §2.3.7. Rumusan di atas disusun dari kedua sumber tersebut — **mohon dikonfirmasi tim**.

---

### BR-3 · Sanksi Penangguhan Akses (*Manual Block*)

**Deskripsi.** Sistem menegakkan kedisiplinan pengembalian aset melalui penangguhan akses peminjaman.

**Ketentuan operasional**

1. Mahasiswa atau pengguna eksternal yang **merusakkan**, **menghilangkan**, atau **terlambat mengembalikan** alat melebihi **7 hari kalender** dikenakan sanksi penangguhan.
2. Admin/PLP berhak mengubah status akun menjadi `suspended` untuk mengunci fitur pembuatan pengajuan peminjaman baru.
3. Akun `suspended` **tetap dapat login dan membaca data**, tetapi tidak dapat menambah keranjang atau membuat pengajuan baru.
4. Status `blocked` berbeda dari `suspended`: akun `blocked` **ditolak saat autentikasi** dan sesi aktifnya dicabut.
5. Setiap perubahan status wajib mencatat alasan dan pelaku perubahan.

**Implikasi implementasi**

| Aspek | Keterangan |
| --- | --- |
| Status | `active`, `suspended`, `blocked` |
| Middleware | `account.active` (blokir), `borrower.active` (penangguhan) |
| Pemicu otomatis | Validasi pengembalian oleh PLP memicu penangguhan bila terlambat > 7 hari atau aset rusak |
| Jejak audit | `suspended_at`, `alasan_suspended`, `status_changed_at`, `status_changed_by` |

---

### BR-4 · Hierarki Otoritas (*Item-Level Approval*)

**Deskripsi.** Persetujuan diberikan pada tingkat **item**, bukan tingkat transaksi.

**Ketentuan operasional**

1. Setiap item (ruangan maupun alat) di dalam satu nomor transaksi diproses **secara independen**.
2. Bila item **ruangan ditolak** oleh KaLab/Admin akibat bentrok jadwal atau pertimbangan operasional, status item **alat** pada nomor transaksi yang sama **tidak terpengaruh** secara otomatis.
3. KaLab/Admin memiliki otoritas penuh untuk meninjau, menyetujui, atau menolak setiap item alat secara terpisah sesuai relevansi dan kebutuhan kegiatan peminjam.
4. Admin memiliki kewenangan *override* persetujuan bila KaLab berhalangan.

**Implikasi implementasi**

| Aspek | Keterangan |
| --- | --- |
| Model data | Status hidup di `detail_pengajuan_peminjaman_alat.status_item` dan `detail_pengajuan_peminjaman_ruangan.status_item` |
| Status transaksi | `pengajuan_peminjaman.status_keseluruhan` hanya **rangkuman** turunan dari status item |
| Alasan penolakan | Kolom `alasan_penolakan` per item, wajib diisi saat menolak |

---

### BR-5 · Hak Pembatalan Mandiri Pengguna

**Deskripsi.** Pengguna berhak membatalkan transaksinya sendiri selama barang belum diserahkan.

**Ketentuan operasional**

1. Pengguna (Mahasiswa, Dosen, maupun Eksternal) dapat membatalkan transaksi secara mandiri melalui halaman **Riwayat Peminjaman**.
2. Pembatalan hanya dapat dilakukan selama status transaksi masih **Pending** atau **Approved** — yaitu sebelum PLP mengubah status menjadi **Dipinjam/Diserahkan**.
3. Aturan ini mengakomodasi **persetujuan parsial**: bila item ruangan ditolak sehingga item alat yang sudah disetujui tidak lagi dibutuhkan, pengguna tidak terpaksa melanjutkan peminjaman.
4. Begitu transaksi dibatalkan, sistem secara otomatis **melepaskan alokasi kuota alat** dan **penguncian slot jadwal ruangan**.

**Implikasi implementasi**

| Aspek | Keterangan |
| --- | --- |
| Rute | `POST /peminjaman/{peminjaman}/cancel` |
| Logika | `PeminjamanService::cancel()` + `PengajuanPeminjaman::bisaDibatalkan()` |
| Dampak | Kuota fisik alat dan slot jadwal ruangan kembali tersedia |

---

### BR-6 · Eksklusivitas Peran (*Single Role*)

**Deskripsi.** Satu akun hanya boleh terhubung dengan satu peran.

**Ketentuan operasional**

1. Setiap akun hanya memiliki **satu peran** untuk menghindari tumpang tindih tanggung jawab sesuai standar operasional laboratorium.
2. Peran tidak dapat ditingkatkan sendiri oleh pengguna; perubahan peran hanya oleh Admin.
3. Menu dan modul yang tampil pada antarmuka disaring menurut peran akun.

**Implikasi implementasi**

| Aspek | Keterangan |
| --- | --- |
| Nilai peran | `admin`, `kalab`, `plp`, `dosen`, `mhs`, `ekst` |
| Pengaman | `role` dikecualikan dari validasi profil mandiri; admin tidak dapat menurunkan perannya sendiri |
| Antarmuka | `resources/js/components/nav-items.ts` menyaring menu per peran |

---

### BR-7 · Ketersediaan Informasi Publik

**Deskripsi.** Informasi layanan bersifat terbuka, sedangkan data operasional bersifat tertutup.

**Ketentuan operasional**

1. Halaman katalog dan tarif sewa (alat dan ruangan) dapat diakses **secara terbuka oleh publik tanpa autentikasi**.
2. Akses ke fitur manajemen internal, kalender pengajuan, dan riwayat transaksi **mutlak memerlukan login**.
3. Dokumen identitas pengguna (KTP/KTM/kartu pegawai) **tidak** termasuk informasi publik dan hanya dapat diakses melalui rute ber-otorisasi.

**Implikasi implementasi**

| Aspek | Keterangan |
| --- | --- |
| Rute publik | `/` (homepage), `/wilayah/*` (dropdown wilayah untuk registrasi) |
| Rute terlindungi | Grup middleware `auth`, `verified`, `account.active` |
| Dokumen identitas | Disajikan melalui `IdentitasController` setelah pemeriksaan otorisasi — bukan akses langsung ke disk |

---

## 3. Pemetaan dengan Dokumen Asli

Dokumen asli memuat 6 aturan **tanpa nomor**. Penomoran `BR` di atas mengikuti rujukan yang sudah dipakai kode program. Berikut pemetaannya:

| Urutan dokumen asli | Nama aturan asli | ID sekarang | Keterangan |
| --- | --- | --- | --- |
| 1 | Otoritas Manajemen Akun | `BR-1` | Isi diselaraskan dengan keputusan registrasi mandiri (temuan C6) |
| — | *(belum ada)* | `BR-2` | **Baru:** Kategori Tarif Eksternal — dirumuskan dari Overall Description §2.3.7 dan kode (temuan C5) |
| 2 | Sanksi Penangguhan Akses (*Manual Block*) | `BR-3` | Diperluas dengan pembedaan `suspended` vs `blocked` |
| 3 | Hierarki Otoritas | `BR-4` | Diperluas dengan kewenangan *override* Admin |
| 4 | Hak Pembatalan Mandiri Pengguna | `BR-5` | — |
| 5 | Eksklusivitas Peran (*Role*) | `BR-6` | — |
| 6 | Ketersediaan Informasi Publik | `BR-7` | Diperluas dengan aturan akses dokumen identitas |

> **Aturan pemeliharaan.** Bila aturan bisnis baru ditambahkan, berikan nomor berikutnya (`BR-8`, `BR-9`, …) dan jangan menyisipkan di tengah, agar rujukan pada kode tetap valid.
