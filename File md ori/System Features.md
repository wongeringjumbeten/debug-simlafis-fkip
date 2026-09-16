System Features 
Sistem Informasi Manajemen Laboratorium Fisika (SIMLAFIS) dirancang sebagai solusi terintegrasi yang membagi ruang lingkup operasional laboratorium ke dalam dua arsitektur utama: Sistem Internal (Back-Office) untuk mengoptimalkan manajemen inventaris, verifikasi transaksi, penjadwalan anti-collision, dan pencetakan dokumen administratif; serta Sistem Eksternal (Front-Office) yang berfungsi sebagai etalase katalog publik, katalog layanan sewa, dan modul pengajuan bagi civitas akademika UNEJ maupun pengguna eksternal. Guna menjamin keamanan data, mencegah tumpang tindih wewenang, dan memitigasi risiko penyalahgunaan akses (fraud), sistem ini menerapkan mekanisme Kendali Akses Berbasis Peran (Role-Based Access Control / RBAC) yang membagi pengguna ke dalam 6 hak akses tunggal (single-role): Admin, Kepala Laboratorium (KaLab), Pranata Laboratorium Pendidikan (PLP), Dosen, Mahasiswa, dan Pengguna Eksternal. 
4.1 Fitur Autentikasi, Manajemen Pengguna, dan Profil  
4.1.1	Description and Priority
Fitur ini mengelola hak akses ke dalam sistem, pembuatan akun eksternal, pemulihan kata sandi, pembaruan profil mandiri, sesi logout, serta fitur pembukaan blokir (unblock) akun pengguna oleh Admin. 
Prioritas: High
Komponen Prioritas:
Benefit: 5 – Menjamin keamanan sistem dan pengelolaan identitas pengguna secara terpusat. 
Penalty: 5 – Tanpa fitur ini, pengguna tidak dapat masuk, memulihkan akun, atau mengamankan sesi transaksi.  
Cost: 3 – Membutuhkan pengembangan autentikasi berbasis sesi/token dan integrasi RBAC 6 role.
Risk: 2 – Risiko keamanan seperti unauthorized access dapat dimitigasi dengan enkripsi dan penanganan sesi yang valid. 

4.1.2	Stimulus/Response Sequences 
Login & Logout: Pengguna memasukkan email/username dan password → Sistem memvalidasi dan mengarahkan ke dashboard → Untuk keluar, pengguna mengklik "Logout" → Sistem menghapus sesi dan mengarahkan ke halaman login utama.  
Registrasi Pengguna Eksternal: Pengguna eksternal mengklik "Daftar Akun Publik" → Sistem menampilkan formulir pendaftaran (Nama, Instansi, Kategori [Internal-UNEJ/Luar-UNEJ], Email, No HP, Password) → Pengguna mengisi dan mengklik "Daftar" → Sistem menyimpan data dan menampilkan pesan: "Registrasi berhasil, silakan login." 
Lupa Password: Pengguna mengklik "Lupa Password" pada halaman login → Sistem meminta input email terdaftar → Sistem mengirimkan instruksi/tautan reset kata sandi → Pengguna memasukkan password baru → Sistem memperbarui kredensial. 
Unblock Akun Terblokir (Admin): Admin membuka menu "Manajemen Akun" → Admin memilih akun berstatus Suspended → Admin mengklik "Buka Blokir (Unblock)" → Sistem memvalidasi bahwa tidak ada sanksi aktif → Sistem memperbarui status akun menjadi Active dan menampilkan pemberitahuan: "Akun berhasil diaktifkan kembali."
Ubah Password & Profil: Pengguna membuka menu "Pengaturan Profil" → Pengguna memperbarui foto profil, nomor telepon, atau menginput password lama dan password baru → Sistem memvalidasi kredensial lama → Sistem menyimpan perubahan profil. 
4.1.3	Functional Requirements 
REQ-1: Sistem harus mengimplementasikan Role-Based Access Control (RBAC) dengan 6 role terspesialisasi: Admin, KaLab, PLP, Dosen, Mahasiswa, dan Pengguna Eksternal.  
REQ-2: Sistem harus memverifikasi kombinasi email/username dan password terenkripsi sebelum memberikan hak akses ke dashboard masing-masing role.  
REQ-3: Sistem harus menyediakan formulir pendaftaran khusus bagi Pengguna Eksternal dengan klasifikasi kategori tarif (Internal-UNEJ / Luar-UNEJ).  
REQ-3: Sistem harus menyediakan fitur "Lupa Password" dan "Ubah Password" dengan verifikasi password lama/kredensial yang valid.
REQ-4: Sistem harus menyediakan fitur "Ubah Profil" untuk memperbarui data personal pengguna dan fitur "Logout" untuk mengakhiri sesi pengguna secara aman.
REQ-5: Sistem harus menyediakan wewenang khusus bagi Admin untuk melakukan pembukaan blokir (unblock) akun pengguna yang diblokir oleh aturan bisnis sistem. 
4.2 Fitur Manajemen Master Data Aset (Alat, Mebeler, Bahan, dan Ruangan) 
4.2.1	Description and Priority
Fitur ini digunakan oleh PLP dan Admin untuk mengelola (Create, Read, Update, Delete) master data inventaris yang mencakup alat laboratorium, mebeler, bahan habis pakai, serta ruang laboratorium. 
Prioritas: High
Komponen Prioritas:
Benefit: 5 – Menyediakan basis data inventaris yang akurat dan terstruktur.  
Penalty: 5 – Tanpa master data, transaksi peminjaman dan katalog tidak dapat berfungsi.
Cost: 3 – Pembuatan modul CRUD aset terintegrasi dengan struktur lab.  
Risk: 2 – Potensi duplikasi data inventaris. 
4.2.2	Stimulus/Response Sequences 
Tambah Data Aset: PLP/Admin memilih kategori (Alat / Mebeler / Bahan / Ruangan) → Mengklik "Tambah Data" → Memilih unit laboratorium (Dasar/Elektronika/Lanjut/ELF) → Mengisi spesifikasi, kondisi, dan jumlah → Klik "Simpan" → Sistem memperbarui master data.
Mengubah Data Aset: PLP/Admin memilih aset → Mengklik "Ubah" → Sistem memvalidasi bahwa aset tidak sedang terikat peminjaman aktif → Sistem menyimpan perubahan atau menghapus data.
4.2.3	Functional Requirements 
REQ-6: Sistem harus menyediakan fungsi CRUD data alat, mebeler, bahan dan ruangan yang terikat pada 4 unit laboratorium.  
REQ-7: Sistem harus memvalidasi penghapusan data aset agar tidak merusak riwayat transaksi peminjaman yang sedang berlangsung. 
4.3 Fitur Katalog Interaktif, Search Rentang Waktu, & Temporary Session Cart  
4.3.1	Description and Priority
Fitur ini menyajikan etalase publik untuk pencarian alat, mebeler, dan ruangan. Katalog dilengkapi fitur pencarian nama serta pencarian berdasarkan rentang waktu, sehingga stok yang ditampilkan bersifat dinamis sesuai ketersediaan pada tanggal tersebut. Kategori Bahan secara khusus disembunyikan dari tampilan Dosen, Mahasiswa, dan Eksternal. 
Prioritas: High
Komponen Prioritas:
Benefit: 5 – Memberikan kepastian ketersediaan stok riil pada tanggal yang direncanakan pengguna.
Penalty: 4 – Mencegah kekeliruan pemesanan barang yang sebenarnya sudah dipesan orang lain pada tanggal tersebut.
Cost: 4 – Pengembangan logika kalkulasi stok dinamis berdasarkan rentang tanggal.
Risk: 3 – Pemrosesan pencarian stok dinamis yang membutuhkan query teroptimasi.
4.3.2	Stimulus/Response Sequences 
Pencarian Katalog Berdasarkan Rentang Waktu: Pengguna memilih rentang tanggal peminjaman dan memasukkan kata kunci nama barang/ruangan → Sistem memindai transaksi aktif pada rentang tanggal tersebut → Sistem menampilkan sisa stok fisik yang benar-benar Available pada periode waktu tersebut.
Filter Akses Kategori Bahan: Dosen, Mahasiswa, atau Pengguna Eksternal membuka katalog → Sistem secara otomatis menyembunyikan kategori Bahan Habis Pakai dari etalase.
Temporary Session Cart (2-Tab Modal): Pengguna memilih barang/ruangan → Sistem menyimpan sementara ke Pop-up Modal Keranjang Sesi (Tab 1: Alat, Tab 2: Ruangan) sebelum diajukan.
4.3.3	Functional Requirements 
REQ-8: Sistem harus menyediakan fitur pencarian katalog berdasarkan nama aset dan kriteria rentang tanggal peminjaman.
REQ-9: Sistem harus menyajikan informasi stok alat dan ruangan secara dinamis berdasarkan kalkulasi sisa stok yang belum terbooking pada rentang waktu yang dipilih.
REQ-10: Sistem harus menyembunyikan kategori data Bahan dari antarmuka katalog pengguna Dosen, Mahasiswa, dan Pengguna Eksternal.
REQ-11: Sistem tidak boleh menampilkan harga bagi Dosen/Mahasiswa, namun wajib menampilkan kalkulasi biaya otomatis bagi Pengguna Eksternal.
REQ-12: Sistem harus menyediakan Temporary Session Cart berupa pop-up modal 2-tab untuk memisahkan item Alat dan Ruangan.
4.4 Fitur Transaksi Peminjaman, Anti-Collision, & Opsi Pembayaran 
4.4.1	Description and Priority
Mengelola pengajuan transaksi dari keranjang, verifikasi bentrok jadwal ruangan (anti-collision), pembatasan durasi, dan pilihan pembayaran sewa bagi Pengguna Eksternal. 
Prioritas: High
Komponen Prioritas:
Benefit: 5 | Penalty: 5 | Cost: 4 | Risk: 3 

4.4.2	Stimulus/Response Sequences 
Pengajuan Transaksi & Pengecekan Bentrok: Pengguna melakukan checkout → Sistem mengecek jadwal ruangan → Jika bentrok, sistem menolak pengajuan; jika aman, status menjadi "Menunggu Approval".
Pembayaran Eksternal: Pengguna Eksternal memilih Transfer Bank (wajib upload bukti) atau Cash via PLP.
4.4.3	Functional Requirements 
REQ-13: Sistem harus memvalidasi jadwal ruangan guna menghindari bentrok jadwal (Anti-Collision Schedule).
REQ-14: Sistem harus membatasi durasi peminjaman Mahasiswa maksimal 7 hari kalender.
REQ-15: Sistem harus menyediakan pilihan pembayaran Transfer Bank (dengan unggah bukti) atau Cash via PLP khusus bagi Pengguna Eksternal.
4.5 Fitur Verifikasi & Persetujuan Parsial (Item-Level Approval) 
4.5.1	Description and Priority
Memfasilitasi KaLab dan PLP untuk menyetujui transaksi secara parsial (item-level), memverifikasi pembayaran, serta memproses pembatalan mandiri sebelum barang diambil.
Prioritas: High
Komponen Prioritas:
Benefit: 5 | Penalty: 4 | Cost: 4 | Risk: 2 

4.5.2	Stimulus/Response Sequences 
Item-Level Approval: KaLab menyetujui item alat namun menolak item ruangan → Transaksi alat tetap diproses tanpa membatalkan seluruh pengajuan.
Pembatalan Mandiri: Pemohon membatalkan item yang telah disetujui sebelum status berubah menjadi "Dipinjam".
4.5.3	Functional Requirements 
REQ-16: Sistem harus mendukung persetujuan/penolakan independen pada tingkat item (Item-Level Approval).
REQ-17: Penolakan ruangan tidak boleh membatalkan persetujuan alat secara otomatis.
REQ-18: Sistem harus mengizinkan pembatalan mandiri oleh pemohon sebelum barang fisik diserahkan.
4.6 Fitur Sirkulasi, Pengembalian, Sanksi Auto-Block, & Kasir Cash
4.6.1	Description and Priority
Digunakan oleh PLP untuk mencatat penyerahan/pengembalian barang, penerimaan pembayaran cash, dan pemicuan otomatis sanksi blokir akun akibat keterlambatan atau kerusakan. 
Prioritas: High
Komponen Prioritas:
Benefit: 5 | Penalty: 5 | Cost: 4 | Risk: 3 

4.6.2	Stimulus/Response Sequences 
Pencatatan Pengembalian: PLP memeriksa kondisi barang dan menyelesaikan transaksi.
Auto-Block Keterlambatan/Kerusakan: Sistem mendeteksi keterlambatan >7 hari kalender atau laporan kerusakan aset → Sistem mengubah status akun pengguna menjadi Suspended.
4.6.3	Functional Requirements 
REQ-18: Sistem harus menyediakan pencatatan kondisi pengembalian aset oleh PLP.
REQ-19: Sistem harus secara otomatis memblokir akun yang terlambat mengembalikan alat >7 hari kalender atau merusakkan aset.
REQ-20: Sistem harus menyediakan modul kasir pembayaran cash bagi PLP.
4.7 Fitur Dokumentasi Kegiatan, Maintenance, dan Kalibrasi Alat
4.2.1	Description and Priority
Fitur ini digunakan oleh PLP untuk mengunggah dokumentasi kegiatan praktikum/penelitian laboratorium, serta mengunggah laporan hasil pemeliharaan (maintenance) dan kalibrasi berkala alat laboratorium.
Prioritas: Medium
Komponen Prioritas:
Benefit: 4 – Menjamin rekam jejak perawatan alat dan pendokumentasian kegiatan laboratorium.
Penalty: 3 – Sulit memantau kelayakan alat dan riwayat kegiatan laboratorium secara digital.
Cost: 3 – Pengembangan modul manajemen berkas (file upload PDF/Gambar).
Risk: 2 – Risiko ukuran berkas (file size) yang besar memerlukan pembatasan upload.
4.2.2	Stimulus/Response Sequences 
Unggah Dokumentasi Kegiatan: PLP membuka menu "Dokumentasi Kegiatan" → Mengisi nama kegiatan dan memilih foto/berkas dokumentasi → Klik "Simpan" → Sistem menyimpan berkas ke repositori.
Unggah Laporan Maintenance/Kalibrasi: PLP/KaLab memilih data alat → Mengklik "Tambah Catatan Maintenance/Kalibrasi" → Mengisi tanggal perbaikan dan mengunggah berkas laporan PDF → Sistem menyimpan rekam jejak perawatan alat.
4.2.3	Functional Requirements 
REQ-21: Sistem harus menyediakan fungsi bagi PLP untuk mengunggah dan mengelola berkas dokumentasi kegiatan laboratorium.
REQ-22: Sistem harus menyediakan fungsi untuk mengunggah berkas laporan hasil maintenance dan kalibrasi alat laboratorium yang terhubung ke master data alat terkait.
4.8 Fitur Dashboard Analitikal & Dashboard Layanan Tarif Eksternal 
4.2.1	Description and Priority
Menyajikan ringkasan eksekutif visual (statistik penggunaan, status inventaris, peminjaman aktif) untuk internal, serta Dashboard Layanan Tarif Eksternal khusus untuk memantau performa komersialisasi dan pemanfaatan fasilitas oleh pihak luar.
Prioritas: Medium
Komponen Prioritas:
Benefit: 4 – Memudahkan pengawasan operasional dan pengambilan keputusan strategis oleh KaLab dan Admin.
Penalty: 3 – Tanpa dashboard, pengelola harus merekap data secara manual dari tabel transaksi.
Cost: 3 – Visualisasi grafik dan agregasi data statistik.
Risk: 1 – Kinerja query statistik pada jumlah data yang besar.
4.2.2	Stimulus/Response Sequences 
Membuka Dashboard Internal: Admin/KaLab/PLP masuk ke sistem → Sistem menampilkan ringkasan jumlah peminjaman aktif, total alat dipinjam, alat rusak, dan statistik pengguna.
Membuka Dashboard Layanan Tarif Eksternal: KaLab/Admin membuka tab "Dashboard Tarif Eksternal" → Sistem menampilkan visualisasi statistik persewaan eksternal, total pendapatan, dan frekuensi penggunaan fasilitas oleh pihak luar.
4.2.3	Functional Requirements 
REQ-23: Sistem harus menyediakan Dashboard Analitikal ringkasan operasional laboratorium bagi Admin, KaLab, dan PLP.
REQ-24: Sistem harus menyediakan Dashboard Layanan Tarif Eksternal yang menampilkan grafik transaksi sewa publik dan rekapitulasi penggunaan fasilitas oleh pihak eksternal.
4.9 Fitur Riwayat Peminjaman & Unduh Pelaporan (Inventarisasi & Keuangan)
4.2.1	Description and Priority
Fitur ini memungkinkan pengguna melihat riwayat transaksi mereka, serta menyediakan fasilitas bagi Admin, KaLab, dan PLP untuk mengunduh laporan resmi berbentuk dokumen/spreadsheet meliputi Laporan Inventarisasi Aset dan Laporan Keuangan/Pendapatan Transaksi.  
Prioritas: High
Komponen Prioritas:
Benefit: 5 – Mendukung akuntabilitas keuangan dan pelaporan inventaris berkala untuk akreditasi.
Penalty: 4 – Proses audit dan rekapitulasi laporan laboratorium menjadi terhambat.
Cost: 3 – Pengembangan modul ekspor laporan (PDF/Excel).
Risk: 2 – Ketidaksesuaian format rekapitulasi laporan keuangan.
4.2.2	Stimulus/Response Sequences 
Melihat Riwayat Peminjaman: Pengguna membuka menu "Riwayat Peminjaman" → Sistem menampilkan daftar seluruh peminjaman terdahulu beserta statusnya.
Unduh Laporan Inventarisasi: PLP/KaLab memilih parameter lab dan rentang tahun → Mengklik "Unduh Laporan Inventarisasi" → Sistem menerbitkan berkas PDF/Excel daftar aset dan kondisinya.
Unduh Laporan Keuangan/Pendapatan: KaLab/Admin memilih periode bulan/tahun → Mengklik "Unduh Laporan Keuangan" → Sistem mengagregasi seluruh pendapatan sewa eksternal/denda dan menerbitkan laporan transaksi resmi.
4.2.3	Functional Requirements 
REQ-25: Sistem harus menampilkan riwayat peminjaman lengkap bagi setiap pengguna sesuai dengan hak aksesnya.
REQ-26: Sistem harus menyediakan fitur ekspor Laporan Inventarisasi Aset (alat, mebeler, bahan) dalam format PDF/Excel untuk pengelola lab.
REQ-27: Sistem harus menyediakan fitur ekspor Laporan Keuangan/Pendapatan Transaksi Sewa Eksternal dalam format PDF/Excel berdasarkan periode yang dipilih.
4.10 Fitur Informasi Statik (SOP, Persyaratan, dan FAQ) 
4.2.1	Description and Priority
Menyajikan halaman informasi statik publik mengenai Standard Operating Procedure (SOP) laboratorium, syarat & ketentuan peminjaman, serta Frequently Asked Questions (FAQ) untuk memandu pengguna. 
Prioritas: Low
Komponen Prioritas:
Benefit: 3 – Mengurangi pertanyaan berulang dan memberikan edukasi prosedur laboratorium.
Penalty: 2 – Informasi harus ditanyakan langsung ke pengelola jika halaman ini tidak ada.
Cost: 1 – Pembuatan halaman statik.
Risk: 1 – Risiko minimal karena konten bersifat statik.
4.2.2	Stimulus/Response Sequences 
Membuka Informasi Statik: Pengguna mengklik menu "SOP", "Persyaratan", atau "FAQ" pada navigasi utama → Sistem menampilkan halaman informasi berisi panduan teks, diagram alur, dan dokumen SOP. 
4.2.3	Functional Requirements 
REQ-28: Sistem harus menyediakan halaman informasi statik yang mudah diakses berisi SOP laboratorium, Persyaratan Peminjaman, dan FAQ. 

4.11 Fitur Surat Bebas Laboratorium Otomatis (PDF) 
4.2.1	Description and Priority
Fasilitas pencetakan mandiri Surat Bebas Laboratorium PDF bagi Mahasiswa, yang tombol unduhnya aktif otomatis jika seluruh tanggakan dan sanksi bernilai 0 (nihil).  
Prioritas: Medium
Komponen Prioritas:
Benefit: 4 | Penalty: 3 | Cost: 2 | Risk: 1 
4.2.2	Stimulus/Response Sequences 
Cetak Surat Bebas Lab: Mahasiswa membuka menu → Jika tunggakan = 0, tombol cetak aktif → Klik cetak → Sistem menerbitkan dokumen PDF otomatis. 
4.2.3	Functional Requirements 
REQ-29: Sistem harus mengecek riwayat peminjaman dan sanksi sebelum mengaktifkan fungsi cetak surat bebas lab.
REQ-30: Sistem harus merender dan mengunduh Surat Bebas Laboratorium secara mandiri dalam format PDF yang sah jika terbebas dari seluruh tunggakan.