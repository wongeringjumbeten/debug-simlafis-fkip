# SIMLAFIS (Sistem Informasi Manajemen Laboratorium Fisika)

Aplikasi manajemen inventaris laboratorium fisika FKIP berbasis web yang memfasilitasi pendataan alat/bahan, pengelolaan katalog, proses peminjaman & persetujuan, serta pelaporan inventaris laboratorium.

---

## 🚀 Tech Stack

- **Backend:** [Laravel](https://laravel.com/) (PHP 8.3+), [Laravel Fortify](https://laravel.com/docs/fortify), [Wayfinder](https://github.com/laravel/wayfinder)
- **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Inertia.js v3](https://inertiajs.com/), [Tailwind CSS v4](https://tailwindcss.com/)
- **UI & Components:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), Sonner
- **Database:** [PostgreSQL](https://www.postgresql.org/) / Supabase (View-based auth schema `v_auth_users` & trigger-based architecture)
- **Build & Quality Tooling:** Vite, Vite Plus (`vp`), Pest PHP, Laravel Pint

---

## 📋 Fitur Utama

1. **Autentikasi & Akun Pengguna**
   - Registrasi multi-tabel dengan validasi data pengguna dan kredensial.
   - Verifikasi email terintegrasi.
   - Autentikasi aman (Fortify) dan proteksi rute via middleware.
   - Pengaturan profil pengguna, avatar foto profil, dan kata sandi.

2. **Dashboard Analitik**
   - Ringkasan metrik inventaris laboratorium, total alat, stok aktif, dan status peminjaman.
   - Grafik dan indikator visual status alat laboratorium.

3. **Katalog & Inventaris Alat**
   - Katalog publik dan internal alat/bahan praktikum fisika.
   - Pencarian, filter kategori, status kondisi, dan ketersediaan unit.
   - Manajemen data inventaris untuk laboran dan administrator.

4. **Peminjaman & Persetujuan**
   - Alur pengajuan peminjaman alat laboratorium secara terstruktur.
   - Modul persetujuan (approval) dan penolakan oleh laboran.
   - Pelacakan status peminjaman dan pencatatan pengembalian alat.

5. **Riwayat & Monitoring**
   - Riwayat peminjaman per pengguna dan riwayat operasional lab.

---

## 🛠️ Persyaratan Sistem

- **PHP** >= 8.3
- **Node.js** >= 20.x & **npm**
- **Composer** >= 2.x
- **PostgreSQL** >= 14 (atau akun Supabase Database)

---

## ⚙️ Instalasi & Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone https://github.com/capstoneprojectfasilkom/lab-inventory-management-fkip.git simlafis-app
cd simlafis-app
```

### 2. Install Dependensi Backend
```bash
composer install
```

### 3. Konfigurasi Lingkungan (`.env`)
Salin file konfigurasi dari template:
```bash
cp .env.example .env
```
Generate application key:
```bash
php artisan key:generate
```
Sesuaikan konfigurasi koneksi database PostgreSQL pada file `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=simlafis_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 4. Menjalankan Migrasi Database
Jalankan migrasi untuk menyiapkan tabel, view, dan trigger:
```bash
php artisan migrate
```
*(Opsional)* Jalankan seeder data awal:
```bash
php artisan db:seed
```

### 5. Setup Storage Link
Buat symlink direktori storage agar media/avatar dapat diakses publik:
```bash
php artisan storage:link
```

### 6. Install Dependensi Frontend
```bash
npm install
```

### 7. Menjalankan Server Pengembangan
Jalankan server Laravel dan Vite secara bersamaan:
```bash
# Terminal 1: Backend Laravel
php artisan serve

# Terminal 2: Vite Dev Server
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:8000`.

---

## 🧪 Testing & Code Quality

- **Menjalankan Unit & Feature Test:**
  ```bash
  php artisan test --compact
  ```

- **Format Code PHP (Laravel Pint):**
  ```bash
  vendor/bin/pint --dirty --format agent
  ```

- **Pemeriksaan & Format Frontend (Vite Plus):**
  ```bash
  npm run check:fix
  ```

- **Pemeriksaan Type (TypeScript):**
  ```bash
  npm run types:check
  ```

---

## 🌿 Git Workflow (Commit & Push ke Branch Sprint 1)

Berikut panduan langkah demi langkah untuk melakukan commit dan push perubahan pada branch `draft-sprint1`:

### 1. Periksa Status File
Pastikan file apa saja yang telah diubah atau ditambahkan:
```bash
git status
```

### 2. Jalankan Formatter & Linter
Pastikan kode sudah terformat rapi sesuai standar proyek:
```bash
# Format kode PHP
vendor/bin/pint --dirty --format agent

# Format & periksa kode frontend
npm run check:fix
```

### 3. Tambahkan File ke Staging Area
```bash
git add .
```

### 4. Buat Commit
Gunakan pesan commit yang deskriptif:
```bash
git commit -m "feat(sprint-1): update dokumentasi readme dan integrasi sprint 1"
```

### 5. Push ke Remote Repository
- **Ke repository pribadi / fork (`origin`):**
  ```bash
  git push -u origin draft-sprint1
  ```
- **Ke repository tim / capstone (`target-repo`):**
  ```bash
  git push target-repo draft-sprint1
  ```

---

## 📄 Lisensi

Proyek ini dikembangkan di bawah lisensi [MIT](LICENSE).
