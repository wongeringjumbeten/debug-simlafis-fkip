# Business Rules — SIMLAFIS

Aturan bisnis: prinsip/ketentuan operasional yang mengatur cara sistem digunakan. Bukan persyaratan fungsional langsung, tetapi memengaruhi bagaimana fitur dibangun. Dirujuk dari [Business Requirements.md](./Business%20Requirements.md) dan [System Features.md](./System%20Features.md) dengan ID `BR-<nomor>`.

| ID | Nama Aturan | Ketentuan Operasional |
|---|---|---|
| BR-1 | Otoritas Manajemen Akun | Pendaftaran (registration), penonaktifan (deactivation), dan reset password akun civitas (PLP, KaLab, Dosen, Mahasiswa) sepenuhnya wewenang **Admin secara terpusat**. Pengguna level internal **tidak boleh** membuat akun sendiri. Konsekuensi: halaman register hanya untuk Eksternal. |
| BR-2 | Diferensiasi Tarif Eksternal | Sistem wajib membedakan nominal tarif sewa berdasarkan sub-kategori akun eksternal: **Eksternal Internal-UNEJ** mendapat tarif lebih murah; **Eksternal Luar-UNEJ** membayar tarif komersial penuh. |
| BR-3 | Sanksi Penangguhan Akses (Manual Block) | Mahasiswa/pengguna eksternal yang merusak, menghilangkan, atau **terlambat mengembalikan alat > 7 hari** dapat ditangguhkan. Admin/PLP mengubah status akun menjadi "Ditangguhkan" (Suspended) untuk mengunci pembuatan pengajuan peminjaman baru. |
| BR-4 | Hierarki Otoritas (Item-Level Approval) | Setiap item (ruangan maupun alat) dalam satu nomor transaksi diproses **independen**. Item ruangan ditolak (mis. bentrok jadwal) tidak mempengaruhi status item alat dalam transaksi yang sama. KaLab/Admin berhak meninjau, menyetujui, atau menolak tiap item secara terpisah. |
| BR-5 | Hak Pembatalan Mandiri Pengguna | Pengguna (Mahasiswa, Dosen, Eksternal) boleh membatalkan transaksi mandiri lewat Riwayat Peminjaman selama status masih **Pending atau Approved** (sebelum PLP mengubah status menjadi "Dipinjam/Diserahkan"). Ini mengakomodasi pembatalan parsial (mis. ruangan ditolak → alat yang disetujui tak dibutuhkan). Setelah dibatalkan, sistem otomatis melepas alokasi kuota alat dan kunci slot jadwal ruangan. |
| BR-6 | Eksklusivitas Peran (Single Role) | Setiap akun hanya boleh terikat **satu peran** — menghindari tumpang tindih tanggung jawab. |
| BR-7 | Ketersediaan Informasi Publik | Halaman katalog tarif sewa (alat & ruangan) **terbuka untuk publik tanpa login**. Manajemen internal, kalender pengajuan, dan riwayat transaksi **wajib login**. |

## Implikasi Praktis ke UI (cheatsheet)

- **BR-1** → Halaman register hanya menampilkan pendaftaran akun Eksternal (dengan pilihan kategori tarif). Menu "Manajemen Pengguna" hanya untuk Admin.
- **BR-2** → Komponen tabel tarif harus punya dua kolom/badge tarif: `Internal-UNEJ` dan `Luar-UNEJ`.
- **BR-3** → Badge status akun: `Active` / `Ditangguhkan`. Akun suspended: tombol "Ajukan Peminjaman" dinonaktifkan + pesan alasan.
- **BR-4** → UI persetujuan menampilkan item per baris dengan aksi Setuju/Tolak individual (bukan satu tombol untuk seluruh transaksi), plus field alasan saat menolak.
- **BR-5** → Tombol "Batalkan" di Riwayat Peminjaman hanya aktif saat status `Pending`/`Approved`; disabled + tooltip saat `Dipinjam` atau lebih lanjut.
- **BR-6** → Tidak ada pemilihan multi-role di register/manajemen pengguna; satu akun = satu role.
- **BR-7** → Halaman tarif publik di-render tanpa middleware auth; menu internal tidak tampil di state belum login.
