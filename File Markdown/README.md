# File Markdown — Dokumen SIMLAFIS

Spesifikasi Sistem Informasi Manajemen Laboratorium Fisika (Capstone MBKM FKIP UNEJ). Index dokumen:

| File | Isi | Dipakai untuk |
|---|---|---|
| [Architecture.md](./Architecture.md) | Stack teknologi aktual repo, strategi fase UI-first, struktur direktori FE | Keputusan teknis saat koding |
| [Business Requirements.md](./Business%20Requirements.md) | Kebutuhan per role dengan ID (`ADM-01`, `PLP-03`, dst.) + catatan inkonsistensi | Referensi fitur per role |
| [Business Rule.md](./Business%20Rule.md) | 7 aturan bisnis (`BR-1`…`BR-7`) + implikasi praktis ke UI | Constraint saat mendesain komponen |
| [Product Functions.md](./Product%20Functions.md) | Matriks fitur × role (C/R/U/D/X) | Menu sidebar per role, scope akses |
| [System Features.md](./System%20Features.md) | Spesifikasi fungsional per modul (REQ-1…REQ-31) dengan alur stimulus-response | Acuan detail perilaku fitur |
| [Design.md](./Design.md) | Design system: warna, tipografi, spacing, komponen, wireframe | Semua pekerjaan tampilan |
| [Frontend Plan.md](./Frontend%20Plan.md) | Status halaman, urutan kerja, konvensi mock data, checklist desain | Kerja harian fase UI-first |

Catatan:
- Nomor REQ & BR antar dokumen saling dirujuk — jangan mengubah ID tanpa update lintas file.
- `Design.md` adalah satu-satunya sumber design system (duplikat lama di root `DESIGN.md` sudah usang — jangan dipakai).
- Perubahan keputusan (mis. soal register role internal, warna status) dicatat langsung di dokumen terkait.
