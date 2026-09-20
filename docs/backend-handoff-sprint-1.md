# Kebutuhan Backend — Sprint 1

> Daftar hal yang masih kurang atau perlu ditangani di sisi backend, disusun dari hasil
> [Verifikasi Implementasi Sprint 1](../File%20md%20ori/Verifikasi%20Implementasi%20Sprint%201.md).
>
> Dokumen ini adalah **serah terima dari front-end ke tim backend**. Isinya menjelaskan konteks,
> prioritas, dan secara konkret apa yang dibutuhkan agar pekerjaan front-end dapat dilanjutkan.
>
> Untuk pekerjaan yang bisa dikerjakan tanpa backend, lihat [To-Do Frontend Sprint 1](frontend-todo-sprint-1.md).

| Atribut | Nilai |
| --- | --- |
| Tanggal | 20 September 2026 |
| Basis | Commit berjalan, database `postgres` (Supabase) |
| Ruang lingkup | Sprint 1 |
| Status verifikasi | 24 dari 38 prosedur terimplementasi · 8 sebagian · 6 belum |

## Daftar Isi

1. [Ringkasan untuk tim backend](#1-ringkasan-untuk-tim-backend)
2. [P0 — Keputusan yang dibutuhkan segera](#2-p0--keputusan-yang-dibutuhkan-segera)
3. [P1 — Yang menghambat frontend](#3-p1--yang-menghambat-frontend)
4. [P2 — Kesehatan teknis](#4-p2--kesehatan-teknis)
5. [Ringkasan kontrak API yang diusulkan](#5-ringkasan-kontrak-api-yang-diusulkan)
6. [Yang TIDAK dibutuhkan dari backend](#6-yang-tidak-dibutuhkan-dari-backend)
7. [Lampiran A — Kondisi test suite](#lampiran-a--kondisi-test-suite)

---

## 1. Ringkasan untuk tim backend

**Kabar baik:** modul akses, profil, manajemen pengguna, dashboard, dan katalog master sudah berjalan.
Test suite yang sebelumnya **tidak bisa dijalankan sama sekali** kini sudah hidup
(lihat [Lampiran A](#lampiran-a--kondisi-test-suite)).

**Yang menghambat frontend:** enam prosedur tidak dapat diselesaikan karena kontraknya belum ada.
Yang paling terasa adalah **seluruh modul jadwal ruangan** (`PR-25`–`PR-29`) — lima prosedur sekaligus
tanpa tabel, model, maupun endpoint. Akibat lanjutannya, janji `PR-26` bahwa jadwal kuliah reguler
memblokir pemesanan **belum dapat dipenuhi**: `PeminjamanService::checkRoomCollision` saat ini hanya
memeriksa bentrok antar-transaksi peminjaman, karena jadwal reguler belum punya tempat di basis data.

**Satu keputusan arsitektur menunggu** — migrasi `merge_pengguna_to_users_table` rusak dan harus
diputuskan nasibnya ([P0-1](#p0-1--nasib-migrasi-merge_pengguna_to_users_table)).

### Cara membaca prioritas

| Prioritas | Arti | Tindakan |
| --- | --- | --- |
| **P0** | Menghalangi pekerjaan lain atau memblokir test | Perlu keputusan/penanganan segera |
| **P1** | Frontend tidak dapat melanjutkan tanpa ini | Dikerjakan Sprint 1 |
| **P2** | Bukan penghalang, tetapi menumpuk jadi utang teknis | Dijadwalkan setelah P0/P1 |

---

## 2. P0 — Keputusan yang dibutuhkan segera

### P0-1 · Nasib migrasi `merge_pengguna_to_users_table`

**Berkas:** `database/migrations/2026_09_18_062129_merge_pengguna_to_users_table.php`

**Konteks.** Migrasi ini **gagal bahkan pada database bersih**:

```
SQLSTATE[2BP01]: cannot drop table akun because other objects depend on it
DETAIL: constraint riwayat_status_akun_id_akun_fkey on table riwayat_status_akun depends on table akun
        view v_auth_users depends on table akun
```

Statusnya **Pending di database kerja** — artinya memang belum pernah berhasil dijalankan.
Isinya menambah kolom ke `users`, mengganti nama `dosen.id_pengguna` → `user_id` dan
`mahasiswa.id_pengguna` → `user_id`, lalu **menghapus tabel `akun` dan `pengguna`**.

**Mengapa ini tidak bisa dijalankan sekarang.** Seluruh kode aplikasi masih membaca `akun` dan `pengguna`:

| Berkas | Penggunaan |
| --- | --- |
| `app/Http/Controllers/KatalogController.php` | tidak ada — memakai model |
| `app/Http/Controllers/Users/UserController.php` | `DB::table('akun')`, `DB::table('pengguna')` |
| `app/Http/Controllers/Settings/ProfileController.php` | `DB::table('akun')`, `dosen`, `mahasiswa`, `eksternal` |
| `app/Services/PeminjamanService.php` | `DB::table('akun')->value('id_pengguna')` |
| `app/Services/AccountProfileService.php`, `AccountStatusService.php` | tabel `akun` |
| `app/Auth/AccountUserProvider.php` | menulis `remember_token` ke `akun` |
| `app/Http/Controllers/DashboardController.php` | `DB::table('akun')` |
| View `v_auth_users` | join `akun` + `pengguna` + `kredensial` + `peran` |

Jadi menjalankannya akan **merusak aplikasi yang sedang berjalan**.

**Yang dibutuhkan dari tim backend — pilih satu:**

| Opsi | Konsekuensi |
| --- | --- |
| **A. Hapus migrasi** *(disarankan)* | Bersih. Arsitektur `akun`+`pengguna`+`v_auth_users` dipertahankan. Berkas ter-commit di `db25ab5` sehingga dapat dipulihkan bila perlu. |
| **B. Selesaikan merge** | Refactor besar: pindahkan data ke `users`, perbarui seluruh berkas di tabel atas, ganti view `v_auth_users`, dan sesuaikan semua test. Tidak realistis untuk Sprint 1. |

**Status saat ini:** berkas sudah disisihkan ke `.workbuddy-ai/tmp/` agar test suite dapat berjalan.
Git mencatatnya sebagai deleted. Pulihkan dengan:

```bash
mv .workbuddy-ai/tmp/2026_09_18_062129_*.php database/migrations/
```

> **Frontend tidak terpengaruh** oleh keputusan ini. Ini murni keputusan arsitektur backend, tetapi
> menghalangi test suite karena `migrate:fresh` menjalankan seluruh migrasi.

### P0-2 · Perbaiki 40 test yang gagal

Setelah test suite dihidupkan, **40 test gagal**. Rincian lengkap ada di [Lampiran A](#lampiran-a--kondisi-test-suite).
Sebagian besar adalah **bug di berkas test**, bukan di kode aplikasi — misalnya 13 test memanggil
`route('users.status')` tanpa parameter `{user}` yang diwajibkan.

**Yang dibutuhkan:** triase dan perbaikan. Ini penting karena tanpa suite yang hijau, setiap perubahan
backend berikutnya tidak dapat diverifikasi.

---

## 3. P1 — Yang menghambat frontend

### P1-1 · Kirim rincian unit alat ke katalog — `PR-15`, `PR-17`, `PR-19`

**Konteks.** Ketiga prosedur mensyaratkan langkah "Detail" menampilkan rincian **per `id_detail_alat`**:
No Seri Unit, Lokasi Penyimpanan, Kondisi, Status, Tahun Pengadaan, Sumber Dana, Harga Beli, Catatan.
Saat ini `KatalogController::alatRows` hanya menghitung agregat
(`$detailList->count()`) dan **tidak pernah mengirim koleksi `detailAlat`** ke frontend.

Akibatnya `katalog/detail-dialog.tsx` hanya bisa menampilkan angka gabungan. Prosedur pengawasan aset
presisi — inti nilai bisnis peran PLP — belum bisa dijalankan lewat antarmuka.

**Dampak frontend:** dialog Detail tidak dapat dilengkapi. Tiga prosedur tertahan.

**Yang dibutuhkan — tambahkan properti `unit` pada setiap baris alat:**

```jsonc
// GET /katalog → props.asets[] (khusus kategori "alat")
{
  "id": 12,
  "kode": "BRG-012",
  "nama": "Osiloskop Digital",
  "kategori": "alat",
  "unit": [
    {
      "id": 41,                                  // id_detail_alat
      "noSeriUnit": "OSC-2024-001",
      "kondisi": "baik",                          // baik | rusak | sedang perbaikan
      "status": "tersedia",                       // tersedia | tidak tersedia | sedang perbaikan
      "tahunPengadaan": "2024",
      "sumberDana": "PNBP",
      "hargaBeli": 4500000,
      "catatan": null,
      "lokasi": "Lab Elektronika"                 // nama ruangan, null bila belum ditempatkan
    }
  ]
}
```

**Catatan teknis:** relasi `Alat::detailAlat` dan `DetailAlat::ruangan` sudah ada di model, jadi
cukup `with(['detailAlat.ruangan.barang'])` (sudah dilakukan) dan memetakan koleksinya — bukan `count()`.

---

### P1-2 · Modul jadwal ruangan — `PR-25`, `PR-26`, `PR-27`, `PR-28`, `PR-29`

**Konteks.** Ini **lubang terbesar Sprint 1**: lima prosedur tanpa jejak implementasi sama sekali —
tidak ada tabel, model, route, maupun controller. Pencarian menyeluruh pada `resources/js` untuk
`calendar|kalender|jadwal|schedule` hanya menemukan kecocokan insidental (teks bantuan, kolom waktu
pada item pengajuan, dan kalimat pemasaran di homepage).

**Dampak berantai yang perlu diperhatikan.** `PR-26` menjanjikan *"slot waktu perkuliahan terblokir dan
tidak dapat dibooking pihak lain"*. Janji itu **belum dapat dipenuhi**: `checkRoomCollision` hanya
memeriksa bentrok antar-transaksi peminjaman, karena jadwal reguler belum punya tempat di basis data.
Artinya saat ini ruangan **dapat** dibooking pada jam kuliah.

**Yang dibutuhkan dari tim backend:**

1. **Tabel `jadwal_ruangan`** — usulan struktur:

   | Kolom | Tipe | Keterangan |
   | --- | --- | --- |
   | `id_jadwal` | bigserial PK | |
   | `id_ruangan` | bigint FK → `ruangan` | |
   | `jenis` | varchar(20) | `reguler` (jadwal kuliah berulang) atau `khusus` (acara terjadwal) |
   | `judul` | varchar(255) | mis. "Praktikum Elektronika Dasar I" |
   | `hari` | smallint null | 1=Senin … 7=Minggu; dipakai untuk `reguler` |
   | `tanggal` | date null | dipakai untuk `khusus` |
   | `waktu_mulai` | time | |
   | `waktu_selesai` | time | |
   | `semester` | varchar(20) null | |
   | `tahun_akademik` | varchar(20) null | |
   | `is_aktif` | boolean default true | |
   | `created_by` | bigint null FK → `akun` | |
   | `timestamps` | timestamptz | |

2. **Endpoint CRUD** (PLP & Admin):

   | Method | Route | Keterangan |
   | --- | --- | --- |
   | `GET` | `/jadwal?ruangan={id}&dari=YYYY-MM-DD&sampai=YYYY-MM-DD` | Daftar jadwal pada rentang tanggal |
   | `POST` | `/jadwal` | Buat jadwal reguler atau khusus |
   | `PATCH` | `/jadwal/{jadwal}` | Ubah jadwal |
   | `DELETE` | `/jadwal/{jadwal}` | Hapus jadwal |

   Bentuk respons yang diharapkan frontend:

   ```jsonc
   [
     {
       "id": 7,
       "idRuangan": 3,
       "jenis": "reguler",
       "judul": "Praktikum Elektronika Dasar I",
       "hari": 2,                       // null bila jenis "khusus"
       "tanggal": null,                 // null bila jenis "reguler"
       "waktuMulai": "08:00",
       "waktuSelesai": "10:00",
       "namaRuangan": "Lab Elektronika"
     }
   ]
   ```

3. **Perluas `PeminjamanService::checkRoomCollision`** agar ikut memeriksa `jadwal_ruangan` yang
   `is_aktif`, bukan hanya transaksi peminjaman. Tanpa langkah ini, `PR-26` tetap tidak terpenuhi
   meski tabel dan endpoint-nya sudah ada.

> **Catatan koordinasi.** Tim frontend **belum** membangun komponen kalender. Begitu bentuk respons di
> atas disepakati, komponen dapat dikerjakan paralel — frontend tidak perlu menunggu data terisi.

---

### P1-3 · Endpoint ubah unit alat — `PR-20`

**Konteks.** `routes/web.php` hanya mendaftarkan tiga route terkait alat:

```php
Route::post('/katalog/alat', [InventoryController::class, 'storeAlat'])->name('katalog.alat.store');
Route::patch('/katalog/alat/{alat}', [InventoryController::class, 'updateAlat'])->name('katalog.alat.update');
Route::post('/katalog/alat/{alat}/unit', [InventoryController::class, 'storeDetailAlat'])->name('katalog.alat.unit.store');
```

Tidak ada `PATCH` untuk unit, dan tidak ada metode `updateDetailAlat`. Akibatnya PLP **tidak dapat**
memperbarui lokasi penyimpanan, kondisi fisik, maupun status operasional sebuah unit alat — padahal
inilah prosedur inti peran PLP sebagai pengelola teknis harian.

**Yang dibutuhkan:**

| Method | Route | Payload |
| --- | --- | --- |
| `PATCH` | `/katalog/alat/{alat}/unit/{unit}` | `no_seri_unit`, `id_ruangan`, `kondisi`, `status`, `tahun_pengadaan`, `sumber_dana`, `harga_beli`, `catatan` |

**Catatan:** harap sekalian terapkan aturan `unique` pada `no_seri_unit` (lihat [P2-4](#p2-4--nomor-seri-unit-belum-unik)).

---

### P1-4 · Ketersediaan dinamis per rentang tanggal — `PR-21`

**Konteks.** `PR-21` langkah 4 mewajibkan ketersediaan dihitung dari `detail_alat` berstatus `tersedia`
dan berkondisi `baik`, **dikurangi unit yang sudah ter-booking pada rentang tanggal yang dipilih**.
Saat ini `stokTersedia` adalah angka statis dari `KatalogController`, tidak memperhitungkan transaksi
berjalan. Halaman katalog menyatakan sendiri keterbatasan ini kepada pengguna
("Kalkulasi stok dinamis mengikuti transaksi aktif — aktif setelah integrasi backend").

**Dampak frontend:** filter rentang tanggal di katalog saat ini hanya kosmetik — angkanya tidak berubah.

**Yang dibutuhkan — salah satu dari dua pendekatan:**

| Pendekatan | Bentuk |
| --- | --- |
| **A. Sertakan di `/katalog`** | Bila query `mulai` dan `selesai` dikirim, isi `stokTersedia` dengan hasil perhitungan dinamis. Paling sederhana bagi frontend karena tidak mengubah bentuk data. |
| **B. Endpoint terpisah** | `GET /katalog/ketersediaan?id_alat[]=1&id_alat[]=2&mulai=…&selesai=…` → `{ "1": { "tersedia": 3, "total": 5 } }`. Lebih baik bila frontend perlu memperbarui tanpa memuat ulang katalog. |

Frontend condong ke **A** karena filter tanggal sudah ada di `katalog/index.tsx` dan tidak perlu
perubahan struktural.

---

### P1-5 · Tarif untuk halaman publik — mendukung halaman `/tarif`

**Konteks.** Halaman `/tarif` direncanakan sejak `Frontend Plan` tetapi belum dibuat. Saat ini tarif
di homepage **hardcode** di `welcome.tsx` (konstanta `tarifAlat` dan `tarifRuangan`) dan halaman itu
sendiri menyatakan "Data tarif di atas adalah contoh placeholder".

**Yang dibutuhkan:** endpoint publik (tanpa autentikasi) yang mengembalikan tarif alat & ruangan aktif.

```
GET /tarif   →   {
  "alat":    [{ "nama": "Osiloskop Digital", "unitLab": "elektronika", "tarifInternalUnej": 0, "tarifLuarUnej": 25000 }],
  "ruangan": [{ "nama": "Lab Fisika Dasar", "kapasitas": 30, "tarifInternalUnej": 0, "tarifLuarUnej": 150000 }]
}
```

**Perlu keputusan:** apakah tarif Internal UNEJ (`0`) ditampilkan sebagai "Gratis" atau disembunyikan.
Saat ini homepage menulis *"Civitas UNEJ tidak dikenakan biaya"*.

---

### P1-6 · Serah terima & pengembalian alat — `PR-46`, `PR-47`

**Konteks.** Kedua prosedur ini belum ada sama sekali. `STATUS_DIPINJAM` dan `STATUS_DIKEMBALIKAN`
sudah terdefinisi di model `PengajuanPeminjaman`, tetapi **tidak ada route maupun controller** yang
mentransisikan status ke sana. Saat ini pengajuan berhenti di `disetujui` selamanya.

**Yang dibutuhkan:**

| Method | Route | Payload | Efek |
| --- | --- | --- | --- |
| `PATCH` | `/peminjaman/{peminjaman}/serah-terima` | — | Item disetujui → `dipinjam`; catat waktu serah terima |
| `PATCH` | `/peminjaman/{peminjaman}/pengembalian` | `kondisi_kembali`, `catatan` | Item `dipinjam` → `dikembalikan`; perbarui kondisi `detail_alat` |

**Perlu diperhatikan:** pengembalian dengan kondisi rusak/hilang seharusnya memengaruhi status unit
`detail_alat` dan berpotensi memicu penangguhan (lihat [P2-5](#p2-5--penangguhan-akun-belum-otomatis)).

---

### P1-7 · Dokumentasi & ekspor laporan — `PR-51`, `PR-52`

**Konteks.** Halaman `/dokumentasi` masih placeholder ("Repositori dokumentasi segera tersedia").
Frontend dapat membangun kerangka antarmukanya, tetapi tanpa endpoint tidak ada yang bisa diunggah
atau diekspor.

**Yang dibutuhkan:**

| Method | Route | Keterangan |
| --- | --- | --- |
| `GET` | `/dokumentasi` | Daftar dokumen + filter kategori |
| `POST` | `/dokumentasi` | Unggah berkas (multipart) |
| `DELETE` | `/dokumentasi/{dokumentasi}` | Hapus dokumen |
| `GET` | `/laporan/{jenis}/ekspor?format=pdf\|xlsx` | Ekspor laporan |

**Perlu keputusan:** pustaka ekspor apa yang dipakai. `composer.json` saat ini **belum memuat**
pustaka PDF/Excel. Menambah dependency perlu persetujuan (`AGENTS.md`).

---

### P1-8 · Data contoh bisa tampil sebagai data milik pengguna — ✅ **SELESAI 20 Sep 2026**

**Konteks.** `DashboardController::personalMetrics` hanya membaca basis data **bila pengguna sudah
punya minimal satu pengajuan**; selain itu ia mengembalikan data karangan dengan label peminjam
**`'Anda'`**, sehingga pengguna baru melihat "2 peminjaman masih berjalan" berisi alat yang tidak
pernah ia pinjam.

**Penyelesaian.** Seluruh fallback data contoh di `DashboardController` dihapus — bukan hanya yang
ini, tetapi juga statistik cakupan lab (156/23/67/12/31), 10 baris contoh berlabel "(contoh)",
grafik yang dibangkitkan rumus `labValue()`/`personalValue()`, dan pendapatan hardcode
`4_250_000`. Semua angka kini dihitung dari basis data; bila belum ada transaksi, yang tampil
adalah nol dan daftar kosong beserta keadaan kosong yang menjelaskan.

Rincian perubahan ada di [To-Do Frontend §11](frontend-todo-sprint-1.md).

---

### P1-9 · Kirim tanggal jatuh tempo ke dashboard — ✅ **SELESAI 20 Sep 2026**

**Konteks.** Widget Notifikasi Pengembalian tidak dapat memperingatkan tenggat karena
`formatRecentPengajuan` hanya meneruskan `tanggal_peminjaman`.

**Penyelesaian.** `DashboardController::jatuhTempo()` kini mengambil `waktu_selesai` paling akhir
dari item pengajuan, dan endpoint baru `notifikasiPengembalian` mengirimkannya bersama
`hariTersisa` serta penanda `terlambat`. Antarmuka menampilkan:

| Kondisi | Yang tampil |
| --- | --- |
| Terlambat | `Terlambat N hari` (merah) |
| Jatuh tempo hari ini | `Jatuh tempo hari ini` (merah) |
| ≤ 2 hari | `N hari lagi` (kuning) |
| > 2 hari | `N hari lagi` (netral) |

---

### P1-10 · Referensi unit laboratorium — menghambat filter grafik

**Konteks.** Dashboard sebelumnya punya filter grafik per unit laboratorium
(dasar/elektronika/lanjut/elf). Filter itu **dihapus** pada penyeragaman 20 Sep 2026 karena tidak
dapat dihitung dengan benar: tidak ada kolom unit lab pada tabel `barang` maupun `ruangan`, dan
`KatalogController` hanya memakai peta sementara `RUANG_KE_LAB = [1 => 'dasar']`.

Selama referensi resmi belum ada, setiap ruangan selain `id_ruangan = 1` akan salah terbaca
sebagai unit "dasar".

**Yang dibutuhkan:** tabel atau kolom referensi unit laboratorium, lalu:

1. ganti peta sementara di `KatalogController`;
2. kembalikan filter unit pada grafik dashboard dengan agregasi nyata.

---

## 4. P2 — Kesehatan teknis

### P2-1 · 24 cabang `DB::getDriverName()` — sisa era SQLite

Aplikasi sudah **murni PostgreSQL** di runtime (`.env` → `pgsql`), tetapi masih membawa **24 cabang
`DB::getDriverName()` di 16 berkas**. Cabang non-pgsql kini menjadi kode mati yang tetap harus
dipelihara, dan beberapa di antaranya menyembunyikan perbedaan perilaku:

| Berkas | Perilaku yang berbeda |
| --- | --- |
| `KatalogController:40` | `asets` = `null` bila bukan pgsql → UI diam-diam jatuh ke `mockAset` |
| `DashboardController` | Pendapatan jatuh ke angka hardcode `4_250_000` bila tabel transaksi kosong |
| `ProfileController:33` | `canDeleteAccount = DB::getDriverName() !== 'pgsql'` — hapus akun mandiri **hanya hidup di non-pgsql**, mati di produksi |
| `AccountUserProvider:15` | Menulis `remember_token` ke `akun` (karena `v_auth_users` view read-only) hanya bila pgsql |

Sebaran: `UserController` (4), `ProfileController` (3), `WilayahController` (3), `DashboardController` (2),
sisanya masing-masing 1.

**Yang dibutuhkan:** setelah test suite hijau, hapus cabang-cabang ini, hapus migrasi khusus SQLite
`2026_09_17_150000_create_inventory_and_master_tables_for_testing.php`, dan ubah
`config/database.php` dari `env('DB_CONNECTION', 'sqlite')` menjadi `'pgsql'`.

> **Penting:** jangan dikerjakan sebelum test suite hijau. Perubahan ini menyentuh 16 berkas dan
> tidak dapat diverifikasi tanpa test yang berjalan.

### P2-2 · Ketidaksesuaian ID requirement antara kode dan dokumen

| Temuan | Kode | Dokumen |
| --- | --- | --- |
| Data bahan & mebeler | `PLP-07`/`PLP-08` (bahan), `PLP-09`/`PLP-10` (mebeler) | `PLP-05` (bahan), `PLP-06` (mebeler) |
| Halaman prosedur | `KLB-10` | `KLB-11` |

**Yang dibutuhkan:** pilih satu sisi dan samakan. Ini memengaruhi ketertelusuran dokumen ke kode.

### P2-3 · Dokumen aturan proyek yang usang

`.ai/rules/settings.md` masih menyebut *"Fortify hanya membuka register untuk pengguna eksternal"*,
padahal registrasi multi-kategori sudah berjalan (mahasiswa, dosen, eksternal). Perbarui lewat
`record-rule` — bukan edit manual.

### P2-4 · Nomor seri unit belum unik

`PR-18` mensyaratkan No Seri Unit sebagai **kunci unik** dengan pesan *"No Seri Unit sudah terdaftar"*.
`InventoryController::storeDetailAlat` menandainya `nullable` **tanpa aturan `unique`**, sehingga
nomor seri ganda dapat tersimpan.

**Yang dibutuhkan:** tambahkan aturan `unique` pada validasi (dan pertimbangkan unique index di
basis data). Perlu diperhatikan: data lama mungkin sudah memuat duplikat.

### P2-5 · Penangguhan akun belum otomatis

`AccountStatusService` hanya dipicu manual oleh Admin. Belum ada mekanisme penangguhan otomatis
untuk keterlambatan pengembalian, padahal `PR-48` dan `BR-3` menyiratkan sanksi tersebut.

**Yang dibutuhkan:** tentukan pemicunya (terlambat berapa hari → status apa) sebelum diimplementasikan.

### P2-6 · Angka dashboard masih simulasi

| Komponen | Kondisi |
| --- | --- |
| Grafik batang peminjaman | Nilai dibangkitkan rumus deterministik `labValue()` / `personalValue()`, bukan agregasi basis data |
| Akumulasi Pendapatan | Query nyata bila tabel transaksi berisi data; jika kosong jatuh ke hardcode `4_250_000.0` |

**Yang dibutuhkan:** ganti dengan agregasi nyata. Sebelum itu, frontend sebaiknya menampilkan
penanda bahwa angka masih contoh agar tidak menyesatkan pengguna.

### P2-7 · Batas durasi 7 hari hanya untuk Mahasiswa

`PeminjamanService` baris 84 menerapkan batas 7 hari hanya bila `role === 'mhs'`, sedangkan
`sprint1.md §3` juga menjanjikannya untuk **Dosen**.

**Yang dibutuhkan:** putuskan aturan yang benar, lalu samakan kode atau dokumennya.

### P2-8 · Peta unit lab masih sementara

`KatalogController` memakai `private const RUANG_KE_LAB = [1 => 'dasar'];` dengan komentar
*"sampai backend menyediakan referensi unit lab resmi"*. Akibatnya setiap ruangan selain `id_ruangan = 1`
akan tampil sebagai unit "dasar".

**Yang dibutuhkan:** referensi resmi unit laboratorium (tabel atau kolom), lalu ganti peta sementara itu.

---

## 5. Ringkasan kontrak API yang diusulkan

Tabel ini merangkum seluruh kebutuhan di atas agar dapat langsung dijadikan tiket.

| # | Method | Route | Untuk | Prioritas |
| --- | --- | --- | --- | --- |
| 1 | `GET` | `/katalog` (tambah properti `unit[]` per alat) | `PR-15`, `PR-17`, `PR-19` | P1 |
| 2 | `GET` | `/jadwal?ruangan=&dari=&sampai=` | `PR-25`, `PR-27`, `PR-29` | P1 |
| 3 | `POST` | `/jadwal` | `PR-26` | P1 |
| 4 | `PATCH` | `/jadwal/{jadwal}` | `PR-28` | P1 |
| 5 | `DELETE` | `/jadwal/{jadwal}` | pendukung | P1 |
| 6 | — | perluas `checkRoomCollision` ke `jadwal_ruangan` | `PR-26` | P1 |
| 7 | `PATCH` | `/katalog/alat/{alat}/unit/{unit}` | `PR-20` | P1 |
| 8 | `GET` | `/katalog?mulai=&selesai=` (ketersediaan dinamis) | `PR-21` | P1 |
| 9 | `GET` | `/tarif` (publik) | halaman `/tarif` | P1 |
| 10 | `PATCH` | `/peminjaman/{peminjaman}/serah-terima` | `PR-46` | P1 |
| 11 | `PATCH` | `/peminjaman/{peminjaman}/pengembalian` | `PR-47` | P1 |
| 12 | `GET`/`POST`/`DELETE` | `/dokumentasi` | `PR-51` | P1 |
| 13 | `GET` | `/laporan/{jenis}/ekspor` | `PR-52` | P1 |
| 14 | `GET` | `/dashboard` — hapus fallback data contoh pada `personalMetrics` | `PR-13`, temuan `V4`/`V5` | ✅ selesai |
| 15 | `GET` | `/dashboard` — tambah `recentPengajuan[].jatuhTempo` | `PR-13` | ✅ selesai |
| 16 | — | Referensi unit laboratorium (tabel/kolom) | filter unit grafik | **P1** |

---

## 6. Yang TIDAK dibutuhkan dari backend

Agar jelas batasnya — hal-hal berikut sudah berjalan dan **tidak perlu dikerjakan ulang**:

- Autentikasi (login, logout, lupa/reset password, verifikasi email) — Fortify sudah berfungsi.
- Otorisasi per peran — middleware `admin`, `account.active`, `borrower.active` sudah terpasang.
- Manajemen pengguna (`PR-08`–`PR-11`) — sudah lengkap, termasuk status akun dan riwayat perubahan.
- Katalog master alat, ruangan, bahan, mebeler — CRUD sudah berjalan untuk Admin dan PLP.
- Keranjang sesi dan pembuatan pengajuan (`PR-39`/`G2`) — sudah berjalan.
- Persetujuan item-level (`PR-44`/`G6`) — sudah berjalan, termasuk alasan penolakan per item.
- Pembatalan mandiri (`PR-45`/`G7`) — sudah berjalan dengan aturan `isCancellable()`.
- Riwayat peminjaman (`PR-49`/`G11`) — sudah berjalan dengan pemisahan cakupan data per peran.
- Unggah foto profil & identitas, penyajian foto identitas lewat route terotorisasi — sudah berjalan.

---

## Lampiran A — Kondisi test suite

### Status sebelum dan sesudah

| | Sebelum | Sesudah |
| --- | --- | --- |
| Test dapat dijalankan | ❌ 0 (semua gagal) | ✅ 60 lolos · 40 gagal · 7 dilewati |
| Assertion | 0 | 537 |
| Skema dapat dibangun dari migrasi | ❌ | ✅ |

### Akar masalah yang sudah diperbaiki

Skema tidak dapat dibangun ulang dari migrasi: **11 tabel inti dibuat manual di Supabase** di luar
sistem migrasi — `akun`, `peran`, `kredensial`, `dosen`, `mahasiswa`, `eksternal`,
`riwayat_status_akun`, `provinces`, `regencies`, `districts`, `villages`.

Perbaikan: ditambahkan `database/migrations/2026_09_17_120000_create_base_schema.php`, dan
`phpunit.xml` diarahkan ke database uji PostgreSQL `simlafis_testing` (bukan lagi SQLite).

**Verifikasi skema** — dibandingkan dengan database kerja lewat `information_schema`:

| Pemeriksaan | Hasil |
| --- | --- |
| Tabel | 34 vs 34 — selisih 0 |
| Kolom | 247 vs 247 — selisih 0 |
| Beda tipe | 3, semuanya tabel infrastruktur Laravel |

### 40 test yang masih gagal

| Penyebab | Jumlah | Letak masalah |
| --- | --- | --- |
| `UrlGenerationException` | 13 | **Berkas test** — 8× `route('users.status')` tanpa `{user}`, 3× `verification.verify`, 2× `users.update` |
| `not null violation: id_pengguna` pada `pengajuan_peminjaman` | 4 | **Berkas test** — `PeminjamanTransactionTest` tidak membentuk rantai `akun`/`pengguna` |
| `ModelNotFoundException` | 4 | Mengharapkan data seed yang tidak ada di database bersih |
| Assertion gagal | ~18 | Mengharapkan data seed (`size 0 vs 5`, dan sejenisnya) |

Berkas yang terdampak: `Users/UserManagementTest`, `Settings/ProfileUpdateTest`, `Settings/SecurityTest`,
`Peminjaman/PeminjamanTransactionTest`, `PostgresIntegrationTest`, `Dashboard/DashboardRealMetricsTest`,
`Auth/AuthenticationTest`, `Auth/PasswordResetTest`, `Auth/EmailVerificationTest`,
`Auth/RegistrationTest`, `DatabaseSeederTest`.

> **Catatan:** `PostgresIntegrationTest` sudah ada dan memang dirancang untuk PostgreSQL — arah
> pgsql ini sudah pernah diniatkan sebelumnya.

### Perintah yang berguna

```bash
php artisan test                                      # seluruh suite
php artisan test --filter=NamaTest                    # satu berkas
php artisan migrate:fresh --env=testing --force       # bangun ulang database uji
```

> ⚠️ **Jangan pernah mengarahkan test ke database `postgres`.** `tests/Pest.php` memakai
> `RefreshDatabase`, sehingga menjalankannya ke database bersama akan **menghapus seluruh data**.
> Peringatan yang sama tertulis di `.env.testing.example`: *"Never point tests at the shared development DB."*
