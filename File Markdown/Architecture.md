# Architecture — SIMLAFIS

Sistem Informasi Manajemen Laboratorium Fisika · Capstone MBKM FKIP UNEJ

## 1. Stack Teknologi (aktual di repo)

| Lapisan | Teknologi | Keterangan |
|---|---|---|
| Backend | Laravel 12 · PHP 8.3 | Dikerjakan rekan (backend). Belum ada migration/model. |
| Autentikasi | Laravel Fortify | Login, register, reset password, 2FA, passkey — halaman & action FE sudah tersedia dari starter kit. |
| Jembatan FE↔BE | Inertia.js v3 (React adapter) | SPA tanpa API terpisah. Halaman dirender via `Route::inertia()` / `Inertia::render()`. |
| Frontend | React 19 + TypeScript + Vite (`vite-plus`) | Entry: `resources/js/app.tsx`, halaman di `resources/js/pages`. |
| Styling | Tailwind CSS v4 | Token warna SIMLAFIS sudah didefinisikan di `resources/css/app.css` (navy/teal/off-white sesuai [Design.md](./Design.md)). |
| Komponen UI | Gaya shadcn/ui (Radix UI + CVA + tailwind-merge) | Semua di `resources/js/components/ui/` — jangan buat komponen duplikat, pakai yang ada. |
| Ikon | Lucide (`lucide-react`) | Line-icon, stroke konsisten. |
| Routing FE | Wayfinder | Fungsi TS hasil generate di `resources/js/actions/` (controller) & `resources/js/routes/` (named routes). |
| Database | PostgreSQL (Supabase) | ⏳ Menunggu backend. |

## 2. Strategi Pengembangan: Fase UI-First

Database & API belum siap, jadi frontend dibangun dengan urutan:

1. **Fase sekarang (UI-first):** semua halaman dibuat dengan **data dummy** — typed, terpusat, mudah diganti.
2. **Fase integrasi:** begitu backend siap, sumber data dummy diganti props Inertia / Wayfinder action. Interface type tidak berubah.

**Aturan selama fase UI-first:**

- Data dummy ditulis di `resources/js/mock/` (satu file per domain: `katalog.ts`, `users.ts`, `peminjaman.ts`, dst) dan **di-type** sesuai interface di `resources/js/types/`.
- Halaman menerima data via props, bukan import langsung dari mock di dalam komponen dalam — supaya integrasi tinggal mengganti sumber di level halaman.
- **Tidak** memanggil action Wayfinder untuk endpoint yang belum ada di backend (akan error). Form boleh dibuat dengan `useForm` Inertia tapi submit di-stub (mis. log/void) sampai backend siap.
- Penamaan & bentuk type dibuat mengikuti [Business Requirements.md](./Business%20Requirements.md) dan [System Features.md](./System%20Features.md) — bukan asal-asalan, agar tidak direfactor dua kali.

## 3. Struktur Direktori Frontend (yang relevan)

```
resources/js/
├── actions/            # Wayfinder: fungsi controller (jangan edit manual)
├── routes/             # Wayfinder: named routes (jangan edit manual)
├── components/
│   ├── ui/             # Button, Card, Dialog, Table, Badge, Input, Sidebar, dst.
│   └── ...             # komponen aplikasi (app-sidebar, nav-main, heading, dst.)
├── layouts/
│   ├── app-layout.tsx            # layout aplikasi (login) — sidebar navy + header
│   ├── auth-layout.tsx           # layout halaman auth
│   └── settings/layout.tsx       # layout halaman pengaturan/profil
├── pages/
│   ├── welcome.tsx               # homepage/landing publik
│   ├── dashboard.tsx             # dashboard per role
│   ├── auth/                     # login, register, forgot/reset password, 2FA
│   ├── settings/                 # profil, keamanan, tampilan
│   └── (modul baru: katalog, users/hak-akses, dst.)
├── types/               # interface TS (User, Aset, Peminjaman, dst.)
└── hooks/               # use-appearance, use-mobile, dst.
```

Modul baru yang perlu dibuat (folder `pages/`): `katalog/`, `users/`, `persetujuan/`, `riwayat/`, `dokumentasi/`, `prosedur/`. Untuk pekerjaan saat ini (UI tampilan saja) fokus: `katalog/` dan `users/`.

## 4. Peta Akses & Layout

| Zona | Halaman | Layout |
|---|---|---|
| Publik (tanpa login) | Homepage, Katalog Tarif (read-only), SOP/Persyaratan/FAQ | Layout landing bebas sidebar |
| Auth | Login, Register (khusus Eksternal — lihat BR-1), Lupa Password | `auth-layout` |
| Aplikasi (login) | Dashboard, Katalog internal, Hak Akses, Persetujuan, Riwayat, Profil, dst. | `app-layout` (sidebar navy 240px + header) |

Distribusi menu sidebar per role mengikuti matriks di [Product Functions.md](./Product%20Functions.md).
