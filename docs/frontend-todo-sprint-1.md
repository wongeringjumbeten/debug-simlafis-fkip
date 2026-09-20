# To-Do Frontend — Menyelesaikan Sprint 1

> Rencana kerja front-end yang dapat dikerjakan **tanpa menunggu backend**, disusun dari hasil
> [Verifikasi Implementasi Sprint 1](../File%20md%20ori/Verifikasi%20Implementasi%20Sprint%201.md)
> dan `Frontend Plan` tim (berkas aslinya ada di riwayat git, folder `File Markdown/`).
>
> Kebutuhan yang **butuh backend** tidak ada di sini — lihat [Kebutuhan Backend Sprint 1](backend-handoff-sprint-1.md).

| Atribut | Nilai |
| --- | --- |
| Tanggal | 20 September 2026 |
| Cakupan | Hanya `resources/js/**` dan `resources/css/app.css` |
| Target | Semua halaman Sprint 1 terbangun + tampilan konsisten dengan `Design.md` |
| Dokumen terkait | [Design.md](../File%20md%20ori/Design.md) · [Kebutuhan Backend](backend-handoff-sprint-1.md) |

## Daftar Isi

1. [Aturan main](#1-aturan-main)
2. [Prioritas 1 — Menutup lubang Sprint 1](#2-prioritas-1--menutup-lubang-sprint-1)
3. [Prioritas 2 — Penyempurnaan tampilan](#3-prioritas-2--penyempurnaan-tampilan)
4. [Prioritas 3 — Kebersihan kode](#4-prioritas-3--kebersihan-kode)
5. [Checklist desain tim](#5-checklist-desain-tim)
6. [Yang TIDAK bisa dikerjakan front-end](#6-yang-tidak-bisa-dikerjakan-front-end)
7. [Urutan pengerjaan yang disarankan](#7-urutan-pengerjaan-yang-disarankan)
8. [Penyempurnaan pasca-Sprint — Redesign katalog](#8-penyempurnaan-pasca-sprint--redesign-katalog-20-sep-2026)
9. [Penyempurnaan pasca-Sprint — Redesign profil](#9-penyempurnaan-pasca-sprint--redesign-profil-20-sep-2026)
10. [Verifikasi](#10-verifikasi)

---

## 1. Aturan main

Tiga batasan yang menentukan bentuk daftar ini:

1. **Tidak menambah dependency** tanpa persetujuan (aturan dari `Frontend Plan §2`). Semua item di bawah
   dapat diselesaikan dengan Radix UI, Tailwind, Lucide, dan komponen yang sudah ada di `components/ui/`.
2. **Tidak menambah folder dasar baru** (`AGENTS.md`). Semua berkas baru diletakkan di folder yang sudah ada.
3. **Jangan menulis data palsu yang terlihat nyata.** Halaman yang datanya belum ada harus menampilkan
   keadaan kosong yang jujur, bukan angka karangan. Ini sudah menjadi temuan `V4`/`V5` pada verifikasi —
   jangan menambah kasus serupa.

---

## 2. Prioritas 1 — Menutup lubang Sprint 1

### F1 · Antarmuka registrasi unit alat (menutup `PR-18`) — ✅ **SELESAI 20 Sep 2026**

**Kondisi:** backend-nya **sudah siap dan berfungsi** — route `POST /katalog/alat/{alat}/unit`
(`katalog.alat.unit.store`) dan `InventoryController::storeDetailAlat` sudah memvalidasi
`no_seri_unit`, `kondisi`, `status`, `tahun_pengadaan`, `sumber_dana`, `harga_beli`, `catatan`.
Yang hilang **hanya antarmukanya** — tidak ada satu pun komponen yang memanggil route tersebut.

**Yang dikerjakan:**

- [x] Dialog "Tambah Unit Alat" (`katalog/unit-form-dialog.tsx`) dengan field sesuai validasi backend.
- [x] Tombol pemicu pada baris alat di `katalog/index.tsx`, hanya tampil bila
      `canManageKategori(role, 'alat')` bernilai true (Admin & PLP).
- [x] Kirim via `router.post` dengan `preserveScroll: true`, ikuti pola `simpanAset()` yang sudah ada.
- [x] Setelah sukses, perbarui `stokTotal`/`stokTersedia` di state lokal agar kartu langsung mencerminkan unit baru.

**Selesai bila:** PLP dapat menambah unit alat dari antarmuka dan jumlah stok bertambah di kartu katalog.

**Berkas yang berubah:**

| Berkas | Perubahan |
| --- | --- |
| `katalog/unit-form-dialog.tsx` | **Baru** — formulir 7 field, plus penjelasan pembeda Kondisi vs Status |
| `katalog/aset-card.tsx` | Properti `onTambahUnit` + tombol "Tambah Unit" (khusus kategori alat) |
| `katalog/index.tsx` | State `unitAlat`/`unitError`, handler `simpanUnit()`, render dialog |
| `katalog/helpers.ts` | Label `kondisiUnitLabels` & `statusUnitLabels` (nilai mentah backend) |
| `types/katalog.ts` | Tipe `KondisiUnit`, `StatusUnit`, `UnitAlat` |

**Catatan penting:** nilai `kondisi` pada formulir ini **berbeda** dari tipe `KondisiAset` yang dipakai
tampilan. Tampilan memakai `baik \| perlu_perawatan \| rusak`, sedangkan `detail_alat` menyimpan
`baik \| rusak \| sedang perbaikan`. Karena itu ditambahkan tipe terpisah — jangan disatukan.

**Verifikasi:** `npx tsc --noEmit` lolos · `npx vite build` lolos · `php artisan test --filter=InventoryCrudTest`
**6 lolos** (termasuk `plp dapat menambahkan detail unit fisik alat`).

> Ini fitur dengan rasio nilai/effort terbaik: backend selesai, tinggal UI.

### F2 · Widget dashboard peminjam (menutup `PR-13`) — ✅ **SELESAI 20 Sep 2026**

**Kondisi:** `DashboardController::personalMetrics` sudah mengirim `stats` dan `recentPengajuan`.
Dua widget yang dijanjikan `PR-13` belum ada sama sekali.

**Yang dikerjakan:**

- [x] **Notifikasi Pengembalian** — daftar peminjaman berstatus `dipinjam`, disaring dari `recentPengajuan`.
- [x] **Akses Cepat** — tombol pintas ke Katalog dan Riwayat.
- [x] Keduanya hanya tampil untuk peran peminjam (`!isLab`), diletakkan tepat di bawah header agar terlihat.

**Selesai bila:** pengguna `dosen`/`mhs`/`ekst` melihat peringatan pengembalian dan tombol pintas di dashboard.

**Catatan tenggat pengembalian.** `recentPengajuan` belum memuat tanggal jatuh tempo — yang dikirim
hanya `tanggal_peminjaman` (tanggal pengajuan dibuat), sedangkan jatuh tempo sebenarnya ada di
`detail_alat.waktu_selesai`. Karena itu widget **tidak menampilkan tanggal apa pun** saat ini, alih-alih
mengarang tenggat.

Frontend sudah disiapkan untuk menerimanya: tipe `DashboardRow` memuat `jatuhTempo?`, dan
`labelTenggat()` otomatis menampilkan *"Terlambat N hari"* (merah), *"Jatuh tempo hari ini"* (merah),
atau *"N hari lagi"* (kuning bila ≤ 2 hari). **Begitu backend mengirim field itu, peringatan tenggat
langsung aktif tanpa perubahan frontend** — lihat `P1-9` pada dokumen backend.

**⚠️ Perlu diketahui:** `personalMetrics` mengembalikan **data contoh** (termasuk 2 baris berstatus
`dipinjam` berlabel peminjam `'Anda'`) bila pengguna belum punya pengajuan sama sekali. Artinya pengguna
baru bisa melihat *"2 peminjaman masih berjalan"* berisi alat yang tidak pernah ia pinjam. Ini masalah
backend — sudah dicatat sebagai `P1-8` dengan prioritas tinggi.

**Verifikasi:** `npx tsc --noEmit` lolos · `npx vite build` lolos (`dashboard` 11.57 → 15.85 kB).

### F3 · Halaman tarif publik `/tarif`

**Kondisi:** direncanakan di `Frontend Plan §1` (`pages/katalog/publik.tsx`) tetapi belum pernah dibuat.
Halaman ini menutup kebutuhan informasi publik (`PUB-*`) yang saat ini hanya berupa tabel statis
di homepage.

**Yang dikerjakan:**

- [ ] Route Inertia `/tarif` — **publik, tanpa middleware auth** (mengikuti pola `Route::inertia('/', 'welcome')`).
- [ ] Tabel tarif alat & ruangan dengan filter unit lab dan pencarian.
- [ ] Tautkan dari homepage (footer & seksi tarif) menggantikan tabel statis yang sekarang hardcode.

**Catatan:** tarif masih perlu data dari backend (lihat `B1` di dokumen backend). Sampai itu tersedia,
pakai `mockAset` yang sudah ada **dan beri label jelas** bahwa angkanya contoh.

### F4 · Rapikan halaman `/dokumentasi` — ✅ **SELESAI 20 Sep 2026**

**Kondisi:** sebelumnya placeholder 40 baris ("Repositori dokumentasi segera tersedia"). Ini satu-satunya
halaman yang tampil sepenuhnya kosong di sidebar.

**Yang dikerjakan:**

- [x] Bangun kerangka UI untuk tiga modul: Dokumentasi Kegiatan, Maintenance & Kalibrasi,
      serta Pelaporan & Ekspor.
- [x] Tampilkan status setiap modul, rujukan requirement, dan ketergantungan backend dengan jujur.
- [x] Tambahkan area repositori dengan tombol unggah **nonaktif** dan penjelasan eksplisit bahwa
      tidak ada berkas yang diunggah/disimpan dari halaman ini saat ini.
- [x] Tautkan SOP yang benar-benar tersedia: unduh PDF + link ke halaman `/prosedur`.
- [x] Tambahkan langkah integrasi 01–03 agar tim tahu urutan modul saat API backend siap.

**Prinsip penting:** tidak ada data dokumen fiktif dan tidak ada unggah palsu. Tombol unggah sengaja
dinonaktifkan sampai endpoint dokumentasi tersedia (`P1-7` pada dokumen backend).

**Verifikasi:** `npx tsc --noEmit` lolos · `npx vite build` lolos (`dokumentasi` 9.88 kB).

**Selesai bila:** halaman tidak lagi terasa "belum jadi" meski backend repositori belum tersambung.

---

## 3. Prioritas 2 — Penyempurnaan tampilan

### F5 · Definisi token dark mode — ✅ **SELESAI 20 Sep 2026**

**Kondisi awal:** `use-appearance.tsx` mendukung `light | dark | system`, halaman
`settings/appearance.tsx` menampilkan pengalihnya, dan `app.css` sudah mendeklarasikan
`@custom-variant dark (&:is(.dark *))`. **Tetapi `app.css` tidak punya blok `.dark` sama sekali** —
hanya `:root` berisi nilai terang. Akibatnya mengaktifkan mode gelap tidak mengubah apa pun.

#### Blok `.dark` ditambahkan

Seluruh variabel dari `:root` didefinisikan ulang: `background`, `foreground`, `card`, `popover`,
`primary`, `secondary`, `muted`, `accent`, `destructive`, `success`, `warning`, `info`, `border`,
`input`, `ring`, `chart-1..5`, dan `sidebar*`.

Dasar tetap **navy** (`--background: #0f1e30`, warna Ink dari design system) agar identitas visual
tidak hilang. Sidebar dibuat lebih gelap (`#0b1725`) supaya terpisah jelas dari halaman.

**Keputusan penting — token dicerahkan, bukan sekadar dibalik.** Di mode terang `--primary`,
`--success`, `--warning`, dan `--destructive` dipakai sebagai warna **isian** (latar tombol). Di mode
gelap token yang sama juga dipakai sebagai warna **teks dan ikon** (mis. `text-primary` pada ikon
katalog, `text-success` pada badge). Nilai gelap akan tidak terbaca di atas permukaan gelap, jadi
token ini sengaja dicerahkan — mis. `--primary` dari `#0f4c81` menjadi `#5aa9e6`.

#### Warna hex hardcode

Terdapat **108 pemakaian hex** di 10 berkas. Strateginya dibedakan menurut kasus:

| Kasus | Perlakuan | Contoh |
| --- | --- | --- |
| Nilai **persis sama** dengan token mode terang | Diganti token langsung — mode terang tidak berubah sedikit pun | `text-[#4A6274]` → `text-muted-foreground`, `border-[#D7E3E8]` → `border-border`, `bg-[#F1FAEE]` → `bg-background`, `bg-white` → `bg-card` |
| Nilai **berbeda** dari token (mis. versi lebih gelap untuk kontras di atas tint terang) | Ditambah varian `dark:` agar mode terang tetap identik | `text-[#1D3557]` → `text-[#1D3557] dark:text-foreground`, `text-[#A32E38]` → `text-[#A32E38] dark:text-destructive` |
| Warna **navy/teal di atas latar navy** (hero, footer, gradien homepage) | **Dibiarkan** — sudah terbaca di kedua mode | `text-[#A8DADC]`, `bg-[#1D3557]`, `from-[#1D3557]` |

Berkas yang disentuh: `welcome.tsx` (63), `dashboard.tsx`, `prosedur/index.tsx`,
`dokumentasi/index.tsx`, `katalog/*` (4 berkas), `auth/login.tsx`, `auth/forgot-password.tsx`,
`auth/verify-email.tsx`, `components/status-badge.tsx`.

Dua perbaikan tambahan yang diperlukan agar mode gelap benar-benar bekerja:

- **`components/ui/button.tsx`** — varian `destructive` memakai `text-white` hardcode, sehingga tidak
  bisa menyesuaikan tema. Diubah menjadi `text-destructive-foreground`.
- **Palet bawaan Tailwind** yang tidak adaptif: `bg-red-50`/`border-red-300` pada peringatan galat
  katalog dan `green-600` pada halaman auth diganti token `destructive`/`success`.

#### Verifikasi kontras (WCAG)

Seluruh pasangan warna utama diuji dengan rumus kontras WCAG 2.1:

| Pasangan | Rasio |
| --- | --- |
| Teks utama di halaman | 14.35:1 |
| Teks utama di kartu | 12.71:1 |
| Teks sekunder di halaman / kartu | 7.69:1 / 6.81:1 |
| Tombol primary | 6.90:1 |
| Tombol destructive | 6.11:1 |
| Badge success / warning / info / destructive | 6.43 / 8.01 / 5.86 / **4.98**:1 |
| Teks sidebar | 15.40:1 |
| Tombol secondary | 9.56:1 |

**Semua lolos ambang WCAG AA (4.5:1).** Nilai `--destructive` sempat ditetapkan `#e35d68` dan
menghasilkan 4.28:1 — di bawah ambang — lalu dinaikkan menjadi `#ec6d77`.

**Verifikasi:** `npx tsc --noEmit` lolos · `npx vite build` lolos · blok `.dark` beserta seluruh
nilainya terkonfirmasi ada di CSS hasil kompilasi.

> **Catatan cakupan.** Perubahan ini membuat mode gelap berfungsi dan terbaca, tetapi belum diuji
> secara visual di peramban pada setiap halaman. Yang terverifikasi adalah kompilasi, keberadaan
> token di keluaran, dan rasio kontras tiap pasangan warna.

### F6 · Hapus shadow yang tidak sesuai design system — ✅ **SELESAI 20 Sep 2026**

Checklist `Frontend Plan §4` menyatakan: *"Border hairline `#D7E3E8`, bukan shadow generik;
shadow navy-tint hanya untuk elemen melayang."* Pelanggaran yang ditemukan sudah dibereskan:

| Berkas | Perubahan |
| --- | --- |
| `components/ui/card.tsx` | Hapus `shadow-sm` dari komponen dasar Card — berlaku konsisten untuk seluruh kartu aplikasi |
| `persetujuan/index.tsx`, `riwayat/index.tsx` | Hapus `shadow-sm` eksplisit pada kontainer daftar/tabel |
| `welcome.tsx` | Ganti `shadow-lg` gambar hero dengan border teal tipis (`border-[#A8DADC]/40`) |
| `components/ui/button.tsx` | Hapus `shadow-xs` dari semua varian tombol (primary, destructive, outline, secondary) |
| `components/ui/input.tsx` | Hapus `shadow-xs` dari input standar |
| `components/ui/checkbox.tsx`, `toggle.tsx`, `toggle-group.tsx`, `input-otp.tsx` | Hapus shadow dekoratif pada kontrol non-melayang |
| `dashboard.tsx` | Hapus `shadow-xs` pada tab grafik aktif |

**Pengecualian yang dipertahankan:** shadow pada dialog, sheet, dropdown, select, tooltip, dan navigation
menu **tetap ada** karena elemen-elemen tersebut memang melayang di atas konten. Satu `shadow-none` di
toggle group juga dipertahankan — itu instruksi eksplisit untuk menonaktifkan shadow.

**Verifikasi:** pemeriksaan lintas halaman dan kontrol non-melayang tidak menemukan shadow dekoratif tersisa.
`npx tsc --noEmit` dan `npx vite build` lolos.

### F7 · Seragamkan komponen input — ✅ **SELESAI 20 Sep 2026**

**Kondisi:** audit awal menyebut `users/index.tsx` dan `katalog/item-form-dialog.tsx` menulis ulang
seluruh kelas "input" secara manual. Setelah diperiksa, elemen yang dimaksud sebenarnya `<textarea>`,
bukan `<input>` — dan proyek belum memiliki komponen textarea bersama.

**Yang dikerjakan:**

- [x] Tambah `components/ui/textarea.tsx` dengan token, focus ring, aria-invalid, disabled state,
      dan ukuran minimum yang konsisten dengan `Input`.
- [x] Ganti seluruh textarea manual dengan `<Textarea>`: spesifikasi aset, catatan unit alat,
      alasan penangguhan, dan alasan pemblokiran.
- [x] Hapus kelas yang diduplikasi dari empat pemakaian tersebut.
- [x] Seragamkan `<Input>` dan select native yang tersisa dengan menghapus shadow dekoratif
      (bagian dari `F6`).

**Hasil:** tidak ada `<textarea>` manual tersisa pada `resources/js/pages/**`; semua empat pemakaian
melewati komponen bersama. Ini membuat focus ring, validasi visual, dan token dark mode berikutnya
konsisten dari satu tempat.

**Verifikasi:** `npx tsc --noEmit` dan `npx vite build` lolos.

### F8 · Keadaan kosong, muat, dan galat — ✅ **SELESAI 20 Sep 2026**

#### Bug yang ditemukan dan diperbaiki

Dialog `ItemFormDialog` dan `UnitFormDialog` mengelola status "menyimpan" **sendiri**, sementara
induk tidak pernah memberi tahu kapan permintaan selesai. Akibatnya:

| Masalah | Dampak |
| --- | --- |
| `UnitFormDialog` tidak pernah mereset `saving` saat backend menolak | Tombol **macet** di "Menyimpan..." dan tidak bisa diklik lagi — pengguna tidak bisa mencoba ulang |
| `ItemFormDialog` menutup dialog saat galat | Isian pengguna **hilang** dan harus diisi ulang dari nol |
| `simpanAset` hanya `console.error` saat gagal | Tidak ada pesan apa pun yang terlihat pengguna |

**Perbaikan:** status permintaan dipindah ke induk dan direset lewat `onFinish`, sehingga selalu
kembali normal apa pun hasilnya. Dialog kini menerima `submitting` dan `errorBackend` sebagai prop.
Saat backend menolak, **dialog tetap terbuka** dan pesan galat tampil di dalamnya.

#### Indikator muat yang ditambahkan

| Aksi | Sebelum | Sesudah |
| --- | --- | --- |
| Simpan aset (`ItemFormDialog`) | Ada, tapi macet bila gagal | Spinner + tombol nonaktif, selalu pulih |
| Simpan unit alat (`UnitFormDialog`) | **Tidak ada** | Spinner + tombol nonaktif |
| Ajukan peminjaman (`CartDialog`) | **Tidak ada** | Spinner "Mengirim...", item tidak bisa diubah saat proses |
| Setujui item (`persetujuan`) | **Tidak ada** | Spinner per-item — hanya tombol item yang diproses yang berputar |
| Tolak item (`persetujuan`) | Teks saja | Ditambah spinner |
| Aktifkan kembali akun (`users`) | **Tidak ada** | Penjaga klik ganda |

> **Catatan:** Inertia sudah menampilkan bilah kemajuan global di atas halaman. Spinner per-tombol
> melengkapinya agar pengguna tahu **aksi mana** yang sedang berjalan, bukan sekadar "ada yang berjalan".

#### Keadaan kosong

`users`, `persetujuan`, `riwayat`, `cart-dialog`, dan `dokumentasi` sudah baik — memuat judul dan
penjelasan tindakan lanjutan. Satu yang diperbaiki:

- **`katalog/index.tsx`** selalu menulis *"tidak cocok dengan pencarian"* meski katalognya memang
  belum berisi data. Sekarang dibedakan:
  - filter aktif → *"Tidak ada {kategori} yang cocok"* + saran ubah filter + **tombol Reset filter**
  - katalog kosong → *"Belum ada data {kategori}"* + arahan sesuai peran (pengelola diminta menambah,
    peminjam diberi tahu menunggu data)

#### Keadaan galat

- Galat validasi backend kini tampil di dalam dialog, bukan hanya di konsol.
- Kegagalan pengajuan peminjaman menampilkan pesan di halaman katalog dan membuka kembali keranjang
  agar item tidak hilang.
- Formulir berbasis `<Form>` (`users`, `settings`) sudah memakai `InputError` bawaan Inertia — tidak diubah.

**Verifikasi:** `npx tsc --noEmit` lolos · `npx vite build` lolos.

### F9 · Aksesibilitas dan responsif — ✅ **SELESAI 20 Sep 2026**

Checklist `Frontend Plan §4`: *"Semua interaksi bisa diakses keyboard dengan focus ring terlihat."*

#### Focus ring pada tombol kustom

`<Button>` bawaan sudah punya focus ring, tetapi tombol `<button>` yang ditulis manual tidak.
Yang diperbaiki:

| Berkas | Elemen |
| --- | --- |
| `katalog/index.tsx` | Tab kategori + 2 tombol "Tutup" pada notifikasi |
| `katalog/cart-dialog.tsx` | Tab Alat / Ruangan |
| `prosedur/index.tsx` | Tab unit laboratorium |
| `components/appearance-tabs.tsx` | Pengalih tema terang/gelap/sistem |

Pemeriksaan menyeluruh `resources/js/pages/**` + `resources/js/components/**` menyisakan **dua**
tombol tanpa focus ring, dan keduanya **bukan masalah**:

- `components/delete-user.tsx` — tombol di dalam `<Button asChild>`; Radix `Slot` mewariskan kelas
  Button ke elemen anak, jadi focus ring-nya tetap ada.
- `components/ui/sidebar.tsx` — `SidebarRail` memakai `tabIndex={-1}`; memang pegangan geser
  khusus tetikus, bukan kontrol keyboard.

#### Hierarki heading

Beberapa halaman melompat dari `h1` langsung ke `h3`, menyulitkan navigasi pembaca layar.

| Berkas | Perubahan |
| --- | --- |
| `dashboard.tsx` | 4 `h3` section → `h2` (sebelumnya halaman hanya punya `h1` + `h3`) |
| `persetujuan/index.tsx` | Kode transaksi pada kepala kartu dijadikan `h2` (`inline-block` agar tata letak tetap) |
| `katalog/aset-card.tsx` | Judul aset `h3` → `h2` — sebelumnya halaman hanya punya `h1` lalu langsung `h3` |

`riwayat/index.tsx` **tidak diubah**: satu-satunya `h3` berada di dalam dialog, dan `DialogTitle`
Radix sudah menjadi `h2` — jadi hierarkinya sudah benar.

Hasil akhir: setiap halaman punya tepat satu `h1`, dan tidak ada lagi lompatan level.

#### Responsif

Tiga tabel tidak dapat digulir di layar sempit karena hanya memakai `overflow-hidden` — isinya
terpotong tanpa cara menggeser. Diperbaiki menjadi `overflow-x-auto`, yang tetap memotong sudut
melengkung **sekaligus** memungkinkan gulir horizontal:

| Berkas | Tabel |
| --- | --- |
| `riwayat/index.tsx` | Riwayat peminjaman (7 kolom) |
| `welcome.tsx` | Tabel tarif alat & tarif ruangan |

`users/index.tsx` dan `prosedur/index.tsx` sudah benar sejak awal.

Selain itu, grid dua kolom berisi input `type="date"` dan `type="time"` berubah menjadi satu kolom
di bawah 640px (`sm:grid-cols-2`), karena input tanggal bawaan peramban butuh lebar minimum dan
berisiko meluber di layar 375px:

- `katalog/add-to-cart-dialog.tsx` (2 grid)
- `auth/register.tsx` (grid Provinsi/Kabupaten)

#### Yang sudah baik dan tidak diubah

- Semua gambar punya `alt` yang bermakna (`Foto {nama}`, `Logo FKIP UNEJ`, dst.).
- Setiap tombol ikon punya `aria-label` (`Hapus {nama aset}`, `Aksi untuk {nama}`).
- Tab memakai `role="tab"` + `aria-selected` dan wadahnya `role="tablist"` + `aria-label`.
- Pesan galat memakai `role="alert"`.
- Formulir berbasis `<Form>` Inertia memakai `InputError` yang sudah menautkan galat ke field.

**Verifikasi:** `npx tsc --noEmit` lolos · `npx vite build` lolos · pemeriksaan otomatis atas seluruh
`<button>` dan hierarki heading bersih.

---

## 4. Prioritas 3 — Kebersihan kode

### F10 · Hapus debug tertinggal — ✅ **SELESAI 20 Sep 2026**

`resources/js/pages/katalog/index.tsx` baris **130–139** memuat **8 baris `console.log('[DEBUG] …')`**
di dalam `tambahItemKeCart`. Ini membocorkan struktur data ke konsol peramban.

- [x] Hapus kedelapan baris tersebut. Fungsi `validasiCartItem` tetap dipanggil seperti biasa.
- [x] Rapikan indentasi blok fungsi yang ikut rusak.

**Verifikasi:** `grep -rn "console\.log" resources/js` → tidak ada hasil.

### F11 · Bersihkan fallback mock

- [ ] `KatalogController` mengirim `asets: null` bila driver bukan pgsql, dan `katalog/index.tsx`
      diam-diam jatuh ke `mockAset`. Pastikan tidak ada data contoh yang bisa tampil di lingkungan
      produksi tanpa disadari — bila `asets` null, tampilkan keadaan kosong yang jelas.
- [ ] `welcome.tsx` masih memakai `mockAset` untuk ringkasan katalog. Setelah `F3` selesai,
      arahkan ke data nyata bila tersedia.

---

## 5. Checklist desain tim

Status kepatuhan terhadap `Frontend Plan §4`:

| Butir checklist | Status | Catatan |
| --- | --- | --- |
| Sidebar navy `#1D3557`, item aktif bergaris kiri teal | ✅ | `--sidebar` terdefinisi; mode gelap memakai `#0b1725` |
| Badge status selalu menyertakan label teks | ✅ | `components/status-badge.tsx` mewajibkan `label` |
| Teal & btn-tint hanya sebagai latar dengan teks navy | ✅ | sesuai token `--accent`/`--accent-foreground` |
| Kode alat / ID transaksi memakai IBM Plex Mono | ✅ | `--font-mono` + dipakai di 10+ berkas |
| Border hairline, bukan shadow generik | ✅ | diselesaikan pada `F6` |
| Semua interaksi dapat diakses keyboard dengan focus ring | ✅ | diselesaikan pada `F9` |
| **Mode gelap berfungsi dan terbaca** | ✅ | ditambahkan pada `F5` — di luar checklist awal, kontras terverifikasi WCAG AA |

---

## 6. Yang TIDAK bisa dikerjakan front-end

Jangan buang waktu mengerjakan ini sebelum backend menyediakan kontraknya — rincian lengkap ada di
[Kebutuhan Backend Sprint 1](backend-handoff-sprint-1.md):

| Fitur | Terblokir karena |
| --- | --- |
| Kalender jadwal ruangan (`PR-25`–`PR-29`) | Belum ada tabel, model, maupun endpoint jadwal |
| Rincian unit alat di dialog Detail (`PR-15`/`PR-17`/`PR-19`) | `KatalogController::alatRows` tidak mengirim koleksi `detailAlat` |
| Ubah data unit alat (`PR-20`) | Tidak ada route `PATCH` untuk unit alat |
| Ketersediaan dinamis per rentang tanggal (`PR-21`) | Perhitungan dilakukan di backend, bukan frontend |
| Serah terima & pengembalian alat (`PR-46`/`PR-47`) | Belum ada endpoint perubahan status |
| Ekspor laporan PDF/Excel (`PR-52`) | Belum ada endpoint ekspor |
| Tarif nyata di halaman publik | Tarif masih hardcode; perlu endpoint publik |

**Kalender jadwal ruangan** layak dipertimbangkan sebagai pekerjaan UI-first (komponen kalender dengan
data contoh) mengikuti metode tim. Namun karena bentuk data jadwalnya belum ditentukan backend,
risiko rework tinggi — sebaiknya tunggu kontrak `B3` disepakati lebih dulu.

---

## 7. Urutan pengerjaan yang disarankan

Urutan ini menjaga agar perubahan besar (token warna) dikerjakan setelah halaman stabil.

| Urutan | Item | Status | Alasan urutan |
| --- | --- | --- | --- |
| 1 | `F10` hapus debug | ✅ selesai | 5 menit, langsung menutup temuan `V1` |
| 2 | `F1` UI registrasi unit alat | ✅ selesai | Nilai tertinggi; backend sudah siap |
| 3 | `F2` widget dashboard peminjam | ✅ selesai | Menutup `PR-13`, data sudah tersedia |
| 4 | `F4` rapikan halaman dokumentasi | ✅ selesai | Menghilangkan satu-satunya halaman kosong |
| 5 | `F3` halaman tarif publik | ⬜ tertahan | Membutuhkan keputusan sumber data (`B1`) |
| 6 | `F7` seragamkan input | ✅ selesai | Komponen `Textarea` bersama ditambahkan |
| 7 | `F6` hapus shadow | ✅ selesai | Kontrol non-melayang kini berbasis border |
| 8 | `F8` keadaan kosong/muat/galat | ✅ selesai | Memperbaiki dialog macet & menambah indikator muat |
| 9 | `F9` aksesibilitas & responsif | ✅ selesai | Focus ring, hierarki heading, tabel bisa digulir |
| 10 | `F5` token dark mode | ✅ selesai | Blok `.dark` + 108 hex dikonversi |

**Progres:** **9 dari 11 item selesai** (`F1`, `F2`, `F4`, `F5`, `F6`, `F7`, `F8`, `F9`, `F10`).
Seluruh halaman Sprint 1 sudah terbangun, konsisten dengan design system, lolos audit aksesibilitas
dasar, dan mendukung mode gelap dengan kontras yang terverifikasi.

**Satu item tersisa: `F3` halaman tarif publik** — tertahan karena tarif masih hardcode di
`welcome.tsx` dan endpoint publik `/tarif` belum ada. Lihat `P1-5` pada
[Kebutuhan Backend](backend-handoff-sprint-1.md). Halaman ini sebaiknya tidak dibuat dengan angka
contoh, karena halaman tarif publik adalah halaman yang paling mungkin diakses calon pengguna luar.

---

## 8. Penyempurnaan pasca-Sprint — Redesign katalog (20 Sep 2026)

Katalog telah di-redesign setelah checklist Sprint 1 selesai, tanpa mengubah kontrak backend atau
alur yang sudah berjalan (pencarian, filter, detail, keranjang, peminjaman, tambah/ubah aset, dan
tambah unit).

| Area | Perubahan |
| --- | --- |
| Header | Panel ringkasan profesional dengan kategori aktif, jumlah item, unit tersedia, CTA yang responsif, dan konteks peran pengguna |
| Tab kategori | Tab berikon dengan indikator border, bisa digulir horizontal di ponsel |
| Filter | Search utama + grid filter yang menjadi satu kolom di ponsel dan horizontal di desktop; reset hanya muncul ketika filter aktif |
| Hasil | Ringkasan "menampilkan X dari Y" + indikator filter aktif |
| Kartu aset | Visual kategori bila foto kosong, kode inventaris, spesifikasi, metadata lokasi/kapasitas, progress ketersediaan, tarif, dan CTA yang diprioritaskan menurut peran |
| Mobile | Header/CTA bertumpuk, tab tidak terpotong, filter responsif, kartu satu kolom lalu 2/3 kolom di layar besar |

**Catatan:** `stokTersedia` masih memakai data master sampai endpoint ketersediaan dinamis tersedia
(lihat `P1-4` di dokumen backend). Redesign tidak mengklaim perhitungan ketersediaan waktu nyata.

## 9. Penyempurnaan pasca-Sprint — Redesign profil (20 Sep 2026)

### Bug yang diperbaiki: unggah foto profil tidak memberi umpan balik

Halaman profil memakai komponen unggah tanpa menyimpan berkasnya sama sekali:

```tsx
<FileUpload file={null} onChange={() => {}} name="foto_profil" />
```

`onChange` kosong membuat prop `file` selalu `null`, sehingga komponen **tidak pernah menampilkan
pratinjau**. Pengguna memilih berkas dan tidak melihat apa pun berubah — terkesan rusak.

Backend-nya sendiri sudah benar dan **dibuktikan dengan test**: berkas disimpan ke `profiles/`,
berkas lama dihapus, dan validasi menolak non-gambar serta berkas di atas 2 MB.

Perbaikan pada `components/file-upload.tsx`: saat validasi gagal, elemen input kini dikosongkan agar
berkas yang ditolak tidak ikut terkirim. Format yang diterima juga diambil dari prop `accept`,
bukan lagi daftar tetap `jpg/png`.

### Redesign halaman

| Area | Perubahan |
| --- | --- |
| Kartu ringkasan | Banner navy dengan avatar besar menimpa, nama, email, badge peran & kategori, status verifikasi email |
| Tata letak | Satu kolom di ponsel, dua kolom di desktop — informasi akun/institusi/identitas di kiri, foto & status di kanan |
| Foto profil | Pratinjau langsung, nama berkas, tombol batalkan pilihan, keterangan batas 2 MB |
| Identitas | Grid read-only yang lebih rapi + menampilkan foto identitas lewat tautan terotorisasi |
| Simpan | Bilah melekat di bawah dengan status "tersimpan" / "berlaku setelah disimpan" |
| Verifikasi email | `mustVerifyEmail` dan `status` sebelumnya diterima tetapi tidak pernah ditampilkan — kini dipakai |

### Prasyarat test yang sebelumnya hilang

`User::save()` sengaja mengembalikan `false` untuk record baru, sehingga
`User::factory()->create()` **tidak membuat baris apa pun** pada skema PostgreSQL 3NF. Itulah sebabnya
enam test profil gagal.

Ditambahkan dua helper di `tests/Pest.php`:

- `buatPenggunaLengkap()` — membuat baris nyata pada `pengguna`, `kredensial`, dan `akun`
  (beserta subtipe dosen/mahasiswa/eksternal), lalu mengembalikan model yang terbaca dari view.
- `idPengguna()` — **`$user->id` adalah `id_akun`, bukan `id_pengguna`.** Keduanya berasal dari
  sequence berbeda dan tidak boleh dipertukarkan saat menulis assertion.

### Hasil

| Pemeriksaan | Sebelum | Sesudah |
| --- | --- | --- |
| `ProfileUpdateTest` | 3 lolos · 6 gagal | **11 lolos** (33 assertion) |
| Seluruh suite | 60 lolos · 40 gagal | **68 lolos · 34 gagal** |

Tiga test baru khusus foto: unggah berhasil + berkas lama terhapus, tolak non-gambar, tolak berkas > 2 MB.

### ⚠️ Temuan data yang menunggu keputusan

`pengguna.foto_profil` untuk akun bawaan berisi **nama berkas telanjang tanpa folder** —
`admin.png`, `annisa_riska.png`, `eko_prasetyo.png`, dan seterusnya. Berkas-berkas itu **tidak ada
di mana pun di proyek** dan tidak ada seeder yang mengisinya, sehingga `Storage::url()` menghasilkan
tautan 404 dan avatar akun-akun tersebut selalu kosong. Dua akun lain memiliki nilai
`profiles/xxx.jpg` yang berkasnya benar-benar ada dan tampil normal.

Antarmuka sudah dibuat tahan terhadap hal ini — `Avatar` Radix otomatis jatuh ke inisial ketika gambar
gagal dimuat. Namun **datanya sendiri belum diubah** karena menyentuh basis data bersama; perlu
keputusan apakah akan dikosongkan atau diisi berkas aslinya.

## 10. Verifikasi

Setiap perubahan wajib melewati dua pemeriksaan berikut sebelum dianggap selesai:

```bash
npx tsc --noEmit        # pemeriksaan tipe
npx vite build          # kompilasi + tulis ke public/build
```

### ⚠️ Build verifikasi tidak sama dengan build yang dilihat pengguna

Ini pernah menimbulkan kebingungan nyata: perintah `vite build --outDir <folder-sementara>` **hanya**
memeriksa apakah kode terkompilasi — ia **tidak** memperbarui `public/build`. Selama `public/build`
belum dibangun ulang, peramban tetap menyajikan bundel lama, sehingga perubahan tidak terlihat
meskipun kodenya sudah benar.

| Perintah | Kegunaan |
| --- | --- |
| `npx vite build --outDir /tmp/...` | **Hanya** cek kompilasi. Jangan dipakai untuk melihat hasil. |
| `npx vite build` | Build sebenarnya — memperbarui `public/build` yang disajikan ke peramban. |

Setelah build sebenarnya, lakukan **hard refresh** (`Ctrl + Shift + R`) karena peramban mungkin masih
memegang berkas HTML lama.

**Catatan sandbox.** Vite mengosongkan `public/build` sebelum menulis. Bila jumlah berkasnya melewati
ambang pengaman, operasi itu bisa ditolak. Karena `public/build` ada di `.gitignore` dan sepenuhnya
dapat diregenerasi, folder itu boleh dihapus lebih dulu:

```bash
rm -rf public/build && npx vite build
```

### Catatan lingkungan lain

`npm run check` dan `npm run build` memakai pembungkus `vp` yang gagal di mesin ini dengan galat
`Cannot find binary path for command 'node'`. Gunakan `npx tsc --noEmit` dan `npx vite build`
secara langsung.

Pengujian otomatis sisi frontend belum tersedia (belum ada berkas `*.test.tsx`). Bila ingin menambah,
Vitest sudah terpasang di `node_modules`.
