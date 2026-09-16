# Frontend Plan — SIMLAFIS (Fase UI-First)

Rencana kerja frontend selagi menunggu backend. Sumber kebutuhan: [Business Requirements.md](./Business%20Requirements.md), [Product Functions.md](./Product%20Functions.md), tampilan: [Design.md](./Design.md), teknis: [Architecture.md](./Architecture.md).

## 1. Status Halaman (per 2026-09-12)

| Halaman | Route (rencana) | Komponen | Status | Sumber data |
|---|---|---|---|---|
| Homepage/landing | `/` | `pages/welcome.tsx` | ✅ ada — tinggal disesuaikan konten (hero gradasi navy→teal, kartu statistik publik: total alat, lab aktif) | statis/mock |
| Katalog tarif publik | `/tarif` | `pages/katalog/publik.tsx` | ❌ baru | mock |
| SOP/Persyaratan/FAQ | `/prosedur`, `/faq` | `pages/prosedur/*.tsx` | ❌ baru (Low priority) | statis |
| Login | `/login` | `pages/auth/login.tsx` | ✅ ada (Fortify) — pertahankan, sesuaikan copy/logo | backend Fortify |
| Register (Eksternal saja) | `/register` | `pages/auth/register.tsx` | 🔧 ada — tambah field: Instansi, No HP, Kategori tarif (select Internal/Luar-UNEJ) | stub dulu |
| Lupa/Reset Password | `/forgot-password`, `/reset-password` | `pages/auth/*` | ✅ ada (Fortify) | backend Fortify |
| Dashboard | `/dashboard` | `pages/dashboard.tsx` | 🔧 stub — redesign: 4 kartu statistik + 2 grafik batang (alat, ruangan) + tabel 10 pengajuan terbaru; konten bervariasi per role | mock |
| Katalog internal (4 tab) | `/katalog` | `pages/katalog/index.tsx` | ❌ baru — tab: Alat, Ruangan (+jadwal), Bahan, Mebeler; filter rentang tanggal; modal cart 2-tab | mock |
| Hak Akses (Manajemen Pengguna) | `/pengguna` | `pages/users/index.tsx` | ❌ baru — tabel pengguna + dialog buat/ubah + aksi aktif/tangguhkan/unblock; khusus ADMIN | mock |
| Profil & Keamanan | `/settings/*` | `pages/settings/*` | ✅ ada — cukup rapikan label/branding | backend Fortify |
| Persetujuan | `/persetujuan` | `pages/persetujuan/index.tsx` | ❌ baru — item-level approval (BR-4); fokus modul berikutnya | mock |
| Riwayat Peminjaman | `/riwayat` | `pages/riwayat/index.tsx` | ❌ baru | mock |

Legend: ✅ sudah ada · 🔧 ada tapi perlu perubahan · ❌ belum ada.

**Scope kerja saat ini (yang diminta):** Homepage, Login/Logout, Profil, Hak Akses, Dashboard, Katalog (alat/bahan/ruangan/mebeler). Modul lain (persetujuan, riwayat, dokumentasi, dsb.) menyusul.

## 2. Urutan Pengerjaan (scope saat ini)

1. **Fondasi** — pastikan token [Design.md](./Design.md) konsisten di `app.css` (sudah), siapkan `resources/js/mock/` + interface type.
2. **Homepage** (`welcome.tsx`) — hero + kartu statistik publik + CTA Masuk/Daftar + link tarif publik.
3. **Login** — rapikan sesuai design (layout split sudah ada: `auth/auth-split-layout.tsx`).
4. **Dashboard** — redesign dengan mock data; komponen: `stat-card`, grafik batang (buat komponen chart sederhana atau pakai CSS bars dulu — jangan tambah dependency tanpa persetujuan), tabel pengajuan terbaru.
5. **Katalog** — halaman terbesar:
   - Shell tab (Alat / Ruangan / Bahan / Mebeler) + guard visibilitas tab per role (REQ-11).
   - Kartu/tabel item + badge ketersediaan + pencarian nama + filter rentang tanggal (UI saja).
   - Modal detail item (+tarif Internal/Luar-UNEJ jika EKST — REQ-12).
   - Modal cart 2-tab (untuk DOSEN/MHS/EKST) — simpan state di React dulu, bukan session backend.
6. **Hak Akses** — tabel pengguna (nama, email, role, unit lab, status akun) + dialog tambah/ubah + aksi status.
7. **Profil** — penyesuaian ringan halaman settings yang ada.

## 3. Konvensi Mock Data

- Lokasi: `resources/js/mock/` — `katalog.ts`, `users.ts`, `peminjaman.ts`.
- Interface di `resources/js/types/` (mis. `Aset`, `KategoriAset`, `StatusAset`, `User`, `StatusAkun`, `Pengajuan`, `Role`).
- Bentuk type mengikuti REQ: contoh `Aset` minimal: `id`, `kode` (Plex Mono, format `FIS-OSC-014`), `nama`, `kategori` (`alat|bahan|ruangan|mebeler`), `unitLab` (`dasar|elektronika|lanjut|elf`), `stokTotal`, `stokTersedia`, `kondisi`, `tarifInternalUnej?`, `tarifLuarUnej?` (hanya alat/ruangan).
- Role di FE: `admin | kalab | plp | dosen | mhs | ekst` (+ `ekst_internal | ekst_luar` untuk sub-kategori tarif — BR-2).
- Status akun: `aktif | ditangguhkan` (BR-3).
- Status pengajuan: `pending | disetujui | ditolak | dipinjam | dikembalikan | dibatalkan`.

## 4. Checklist Desain (dari Design.md — wajib di tiap halaman)

- [ ] Sidebar navy `#1D3557`, item aktif dengan garis kiri teal.
- [ ] Badge status: teks label selalu ada, bukan cuma titik warna.
- [ ] Teal & btn-tint hanya sebagai background dengan teks navy di atasnya.
- [ ] Kode alat / ID transaksi pakai IBM Plex Mono.
- [ ] Border hairline `#D7E3E8`, bukan shadow generik; shadow navy-tint hanya untuk elemen melayang.
- [ ] Semua interaksi bisa diakses keyboard dengan focus ring terlihat.
