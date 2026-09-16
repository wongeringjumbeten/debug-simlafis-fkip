# Design System — SIMLAFIS
Sistem Informasi Manajemen Laboratorium Fisika · Capstone MBKM FKIP UNEJ

## 1. Prinsip Desain

SIMLAFIS bukan landing page marketing — ini alat kerja harian: laboran mencatat kondisi alat, mahasiswa mengecek jadwal dan mengajukan peminjaman, asisten mem-validasi. Referensi yang dikasih (landing page kesehatan bergaya gradasi biru-teal) diadaptasi jadi tiga prinsip, bukan ditiru mentah:

1. **Presisi di atas dekorasi.** Data (kode alat, status ketersediaan, jadwal) harus langsung terbaca tanpa harus menebak. Warna dan bentuk dipakai untuk menandai arti (status, prioritas), bukan buat mempercantik.
2. **Tenang dan bisa dipercaya.** Navy tua sebagai warna otoritas/kepercayaan, teal muda sebagai aksen tenang khas ruang lab, off-white sebagai kanvas bersih — bukan gradasi ramai seperti referensi.
3. **Konsisten lintas peran.** Laboran, mahasiswa, dan asisten pakai komponen yang sama (badge status, tabel, form) — beda hanya isi, bukan bahasa visualnya.

Referensi gradasi biru-ke-teal di hero landing page tetap dipakai di satu tempat saja: halaman login/landing publik (bagian 9), sebagai satu-satunya momen "branding". Di dalam aplikasi (dashboard, tabel, form), warna dipakai lebih hemat dan fungsional.

## 2. Sistem Warna

Palet inti dari tim dipakai sebagai basis, ditambah token turunan supaya konsisten di seluruh komponen.

| Token | Hex | Peran |
|---|---|---|
| `color-navy` | `#1D3557` | Warna utama — teks judul, sidebar, elemen otoritatif |
| `color-teal` | `#A8DADC` | Aksen sekunder — highlight, ikon, background tint (bukan warna teks di atas putih, kontrasnya kurang) |
| `color-offwhite` | `#F1FAEE` | Background dasar aplikasi (pengganti putih polos) |
| `color-btn-primary` | `#0F4C81` | Tombol utama, link aktif |
| `color-btn-tint` | `#D0E1F2` | Background tombol sekunder/hover state (teks tetap navy, bukan putih) |
| `color-navy-90` | `#16283F` | Hover/active state dari navy (untuk tombol primary saat ditekan) |
| `color-teal-tint` | `#EAF6F6` | Background badge/kartu status "netral" (lebih pucat dari teal utama) |
| `color-ink` | `#0F1E30` | Teks body, lebih gelap dari navy supaya nyaman dibaca lama (tabel, form) |
| `color-border` | `#D7E3E8` | Garis tepi kartu/tabel — hairline, bukan shadow abu-abu generik |

**Warna status** (belum ada di brief tim, diusulkan — perlu dikonfirmasi ke SA/tim sebelum dipakai final):

| Status | Hex | Contoh pemakaian |
|---|---|---|
| Tersedia / Sukses | `#2A9D6F` | Badge alat tersedia, konfirmasi berhasil |
| Dipinjam / Info | `#0F4C81` | Badge alat sedang dipinjam |
| Perlu perhatian | `#E9A23B` | Badge maintenance terjadwal |
| Rusak / Error | `#D64550` | Badge alat rusak, pesan error form |

**Aturan kontras:** `color-teal` (`#A8DADC`) dan `color-btn-tint` (`#D0E1F2`) hanya dipakai sebagai *background*, selalu dengan teks `color-navy` di atasnya. Jangan pernah dipakai sebagai warna teks di atas putih/off-white — kontrasnya di bawah standar keterbacaan (WCAG AA).

## 3. Tipografi

Dua keluarga font, peran jelas berbeda — dipilih karena SIMLAFIS berurusan dengan data teknis (kode alat, angka, satuan pengukuran), bukan sekadar konten pemasaran:

- **IBM Plex Sans** — judul, navigasi, body text, label form. Punya karakter teknis-rapi yang cocok konteks akademik/sains tanpa terasa dingin.
- **IBM Plex Mono** — dipakai *khusus* untuk data teknis: kode inventaris alat (`FIS-OSC-014`), timestamp log, ID peminjaman. Bukan dekorasi — dipakai karena kode alat butuh dibedakan jelas dari teks biasa (mis. huruf O vs angka 0).

| Elemen | Font | Ukuran | Weight |
|---|---|---|---|
| H1 (judul halaman) | Plex Sans | 28px | SemiBold |
| H2 (judul section) | Plex Sans | 20px | SemiBold |
| H3 (judul kartu) | Plex Sans | 16px | Medium |
| Body | Plex Sans | 14px | Regular |
| Label form / caption | Plex Sans | 12px | Medium |
| Kode alat / data teknis | Plex Mono | 13px | Regular |

Line length body text dijaga di bawah ±75 karakter per baris (form dan deskripsi alat, bukan tabel).

## 4. Spacing & Grid

Skala 4px sebagai basis: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.

- Konten utama dashboard: grid 12 kolom, gutter 24px, max-width kontainer 1280px.
- Sidebar navigasi tetap 240px, collapsible ke ikon-saja di layar sempit.
- Padding kartu standar: 16px (kartu di dalam tabel/list), 24px (kartu ringkasan/statistik).

## 5. Radius & Elevasi

Radius dibedakan per tingkat hierarki elemen — bukan satu radius seragam untuk semuanya:

| Elemen | Radius |
|---|---|
| Tombol, input, badge | 6px |
| Kartu (card), modal kecil | 12px |
| Modal besar, panel | 16px |

Elevasi pakai border tipis `color-border` sebagai default (bukan shadow abu-abu generik). Shadow (`0 2px 8px rgba(29,53,87,0.08)` — pakai tint navy, bukan hitam polos) hanya untuk elemen yang benar-benar melayang: dropdown, modal, toast notifikasi.

## 6. Komponen

**Tombol**
- Primary: background `color-btn-primary`, teks putih, hover → `color-navy-90`. Dipakai untuk 1 aksi utama per layar (mis. "Ajukan Peminjaman").
- Secondary: background `color-btn-tint`, teks `color-navy`, border 1px `color-border`. Untuk aksi kedua (mis. "Batal", "Lihat Detail").
- Ghost/text button: tanpa background, teks `color-btn-primary`, untuk aksi tersier di dalam tabel.

**Badge status** — pill kecil (radius 6px), background tint dari warna status + teks warna status versi gelap (bukan putih di atas warna cerah, supaya tetap kebaca di layar kualitas rendah proyektor kelas).

**Kartu ringkasan (dashboard)** — dipakai untuk angka kunci: total alat, alat tersedia, peminjaman aktif, alat perlu maintenance. Layout mengikuti pola 3-kartu di referensi (icon + angka + label), tapi tanpa gradient dan tanpa shadow tebal — cukup border hairline.

**Tabel data** (inventaris alat, riwayat peminjaman) — header sticky, baris zebra sangat tipis (`color-teal-tint` selang-seling), kolom kode alat pakai Plex Mono, kolom status pakai badge.

**Form** (pengajuan peminjaman, input data alat) — label di atas input (bukan placeholder-only), border `color-border`, focus state border `color-btn-primary` + outline 2px untuk aksesibilitas keyboard.

**Navigasi sidebar** — background `color-navy`, teks putih/`color-teal` untuk item non-aktif, item aktif dapat indikator garis kiri warna `color-teal` + background sedikit lebih terang dari navy dasar.

## 7. Ikonografi & Gambar

- Ikon: line-icon konsisten satu set (mis. Lucide/Phosphor), stroke width seragam — bukan campur filled dan outline.
- Foto/ilustrasi (kalau dipakai di halaman landing/login saja): foto lab fisika riil UNEJ kalau ada, atau ilustrasi flat sederhana bertema alat ukur fisika (osiloskop, multimeter, dsb) — bukan stok foto tenaga medis seperti referensi, karena beda subjek.

## 8. Aksesibilitas — Checklist Minimum

- [ ] Semua teks body kontras minimal 4.5:1 terhadap background
- [ ] Semua tombol/link bisa diakses via keyboard, ada visible focus ring
- [ ] Status alat tidak hanya dibedakan lewat warna — selalu disertai label teks ("Tersedia", bukan cuma titik hijau)
- [ ] Form menampilkan pesan error yang jelas di dekat field, bukan cuma warna merah di border

## 9. Wireframe Referensi

**Halaman login/landing publik** — satu-satunya tempat gaya "hero" dari referensi dipakai, disederhanakan:

```
┌─────────────────────────────────────────┐
│  Logo SIMLAFIS         [Masuk]           │
├─────────────────────────────────────────┤
│  Judul singkat sistem                    │
│  Deskripsi 1-2 kalimat      [gambar lab] │
│  [Tombol Masuk]                          │
├─────────────────────────────────────────┤
│  [Kartu] Total Alat  [Kartu] Lab Aktif   │
└─────────────────────────────────────────┘
```

**Dashboard utama (setelah login):**

```
┌────────┬────────────────────────────────┐
│        │  Ringkasan: [4 kartu statistik] │
│ Side   ├────────────────────────────────┤
│ bar    │  Tabel: Peminjaman Terbaru      │
│ (nav)  │  [kode | alat | status | aksi]  │
│        ├────────────────────────────────┤
│        │  Jadwal Praktikum Minggu Ini    │
└────────┴────────────────────────────────┘
```

## 10. Yang Perlu Dikonfirmasi ke Tim

- Warna status (hijau/kuning/merah di bagian 2) diusulkan berdasarkan konvensi umum, belum ada di brief awal — cek dulu apakah SA/dosen punya preferensi lain.
- Logo dan nama resmi SIMLAFIS untuk dipasang di sidebar/header.
- Ketersediaan foto lab fisika FKIP UNEJ asli untuk halaman login (kalau tidak ada, pakai ilustrasi).