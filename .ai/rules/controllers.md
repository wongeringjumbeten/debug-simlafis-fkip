---
paths:
  - app/Http/Controllers/DashboardController.php
---

# Controllers

## Dashboard scope: lab-wide vs personal per role
Dashboard widgets are the same across roles but SCOPE differs (Product Functions §2 footnote 2): admin/kalab/plp see lab-wide aggregates (labMetrics), while dosen/mhs/ekst see only their own data (personalMetrics). Revenue (ADM-04) is admin-only; never send pendapatanBulanIni to non-admins. Status cards follow ADM-05's five buckets (Seluruh/Pending/Disetujui/Ditolak/Sedang Dipinjam) — no "Selesai". The page consumes all data via props; when the Peminjaman model lands, replace the bodies of labMetrics()/personalMetrics() with real queries (REQ-13) — do not reintroduce hardcoded arrays in dashboard.tsx.
