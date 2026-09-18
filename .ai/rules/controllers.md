---
paths:
    - app/Http/Controllers/DashboardController.php
    - app/Http/Controllers/KatalogController.php
---

# Controllers

## Dashboard scope: lab-wide vs personal per role

Dashboard widgets are the same across roles but SCOPE differs (Product Functions §2 footnote 2): admin/kalab/plp see lab-wide aggregates (labMetrics), while dosen/mhs/ekst see only their own data (personalMetrics). Revenue (ADM-04) is admin-only; never send pendapatanBulanIni to non-admins. Status cards follow ADM-05's five buckets (Seluruh/Pending/Disetujui/Ditolak/Sedang Dipinjam) — no "Selesai". The page consumes all data via props; when the Peminjaman model lands, replace the bodies of labMetrics()/personalMetrics() with real queries (REQ-13) — do not reintroduce hardcoded arrays in dashboard.tsx.

## Katalog reads real DB on pgsql, mock fallback otherwise

Katalog reads PostgreSQL (barang/alat/detail_alat/ruangan/bahan/mebeler) only when the driver is pgsql; otherwise it passes asets=null and the page falls back to mockAset (sqlite tests/dev). Stock comes from detail_alat counts (total) and kondisi baik + status tersedia (available). ruangan.tarif_eksternal is treated as the Luar UNEJ tariff; internal tariff lives in tarif_eksternal_internal_unej. RUANG_KE_LAB is a temporary map until backend ships a unit-lab reference.
