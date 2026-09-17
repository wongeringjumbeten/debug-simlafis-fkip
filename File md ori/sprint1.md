SPRINT 1
ANALISIS KEBUTUHAN SISTEM

Analisis Kebutuhan Fitur : 

Analisis Kebutuhan Fungsional
1.1. Analisis Memulai Sistem
Prosedur Login (Admin, Kalab, PLP, Mahasiswa, Dosen, Eksternal)
Pengguna membuka website Simlafis
Sistem menampilkan homepage
Pengguna klik “Login”
Sistem menampilkan form login yang berisi:
Email: Varchar (255 char)
Password: Varchar (255 char)
Pengguna mengisi form login
Pengguna klik tombol “Login Sekarang”
Sistem melakukan validasi data login:
Jika pengguna klik tombol “Login” dengan keadaan form masih kosong atau tidak lengkap, maka sistem akan menampilkan pesan “Semua informasi harus diisi” dan kembali ke form login.
Jika form sudah terisi lengkap, maka sistem akan melakukan pengecekan data akun:
Jika data akun yang diinputkan sesuai dengan data pada sistem, maka sistem akan:
Mengidentifikasi role pengguna (admin / kalab/PLP/mahasiswa/dosen/eksternal)
Menampilkan halaman dashboard sesuai role pengguna
Jika data akun yang diinputkan tidak sesuai, maka sistem akan menampilkan pesan “Akun belum terdaftar” dan kembali ke form login.
Setelah berhasil login, sistem membuat sesi (session) pengguna.

Prosedur Lupa Password (Admin, Kalab, PLP, Mahasiswa, Dosen, Eksternal)
Pengguna membuka website sistem SIMLAFIS
Sistem menampilkan homepage
Pengguna membuka halaman login pada sistem SIMLAFIS
Sistem menampilkan halaman login
Pengguna mengklik tautan “Lupa Password”
Sistem menampilkan form pemulihan kata sandi yang berisi: 
Email Terdaftar: Varchar (255 char)
Pengguna menginputkan email yang terdaftar pada sistem
Pengguna klik tombol “Kirim Link Reset Password”
Sistem melakukan validasi email: 
Jika email tidak diisi, sistem menampilkan pesan "Email tidak boleh kosong".
Jika email tidak terdaftar dalam sistem, sistem menampilkan pesan "Email tidak terdaftar pada sistem".
Jika email valid dan terdaftar, sistem akan menggenerate token reset password sementara dan mengirimkan email berisi tautan pembaruan kata sandi.
Pengguna membuka tautan reset password dari email.
Sistem menampilkan form reset password baru yang berisi:
Password Baru: Varchar (255 char)
Konfirmasi Password Baru: Varchar (255 char)
Pengguna mengisi kata sandi baru dan mengklik "Perbarui Password". 
Sistem melakukan validasi:
Jika Password Baru dan Konfirmasi Password Baru tidak identik, sistem menampilkan pesan "Konfirmasi password tidak cocok".
Jika identik, sistem memperbarui kata sandi di basis data, menghapus token sementara, menampilkan pesan "Password berhasil diperbarui, silakan login kembali", dan mengarahkan pengguna ke halaman login.

Prosedur Register( Mahasiswa, Dosen, Eksternal)
Pengguna membuka website Simlafis
Sistem menampilkan homepage
Pengguna klik “Daftar Akun”
Sistem menampilkan form registrasi yang berisi: 
Nama Lengkap: Varchar (255 char)
Kategori Pengguna: Enum (‘Mahasiswa UNEJ’, ‘Dosen UNEJ’, ‘Pengguna Umum (Non-UNEJ)')
Nomor Telepon/WA: Varchar (20 char)
Email: Varchar (255 char)
Pengguna mengisi seluruh data pada form registrasi dan mengklik tombol "Lanjut".
Sistem melakukan validasi masukan:
Jika ada field yang belum diisi, sistem menampilkan pesan "Semua kolom wajib diisi".
Jika format email tidak valid, sistem menampilkan pesan "Format email tidak sesuai".
Jika email sudah pernah terdaftar, sistem menampilkan pesan "Email sudah terdaftar, silakan gunakan email lain".
Jika seluruh data valid, sistem menampilkan form register sesuai kategori pengguna.
Jika kategori pengguna Dosen unej, sistem menampilkan form register dosen yang berisi:
NIP:Integer (Unique)
Fakultas: VarChar(255)
Prodi: VarChar(255)
Password: Varchar (255 char)
Konfirmasi Password: Varchar (255 char)
Unggah Foto Profil (format jpg/png): Varchar (255 char)
Unggah Foto Kartu Pegawai (format jpg/png):  Varchar (255 char)
Jika kategori pengguna Mahasiswa unej, sistem menampilkan form register mahasiswa yang berisi:
NIM: Integer (Unique)
Fakultas:VarChar(255)
Prodi: VarChar(255)
Password: Varchar (255 char)
Konfirmasi Password: Varchar (255 char)
Unggah Foto Profil (format jpg/png): Varchar (255 char)
Unggah Foto Kartu Tanda Mahasiswa (format jpg/png):  Varchar (255 char)
Jika kategori pengguna Umum (non-unej), sistem menampilkan form register umum yang berisi:
NIK: Integer (Unique)
Instansi: Varchar (255 char)
Provinsi (tempat tinggal):VarChar(100 char)
Kabupaten (tempat tinggal): VarChar(100 char)
Kecamatan (tempat tinggal): VarChar(100 char)
Kelurahan/Desa (tempat tinggal): VarChar(100 char)
Alamat Lengkap (tempat tinggal): Varchar (255 char)
Password: Varchar (255 char)
Konfirmasi Password: Varchar (255 char)
Unggah Foto Profil (format jpg/png): Varchar (255 char)
Unggah Foto Kartu Tanda Penduduk (format jpg/png):  Varchar (255 char)
Pengguna mengisi seluruh data pada form registrasi dan mengklik tombol "Daftar Sekarang".
Sistem melakukan validasi masukan:
Jika ada field yang belum diisi, sistem menampilkan pesan "Semua kolom wajib diisi".
Jika ukuran unggahan foto melebihi batas 2MB atau format bukan JPG/PNG, sistem menampilkan pesan "Format foto harus JPG/PNG dan maksimal 2MB".
Jika Password dan Konfirmasi Password tidak sama, sistem menampilkan pesan "Konfirmasi password tidak cocok".
Jika seluruh data valid, sistem menampilkan pop up "Yakin ingin melakukan registrasi?"
Jika pengguna mengklik "Ya", maka sistem akan:
Menyimpan data akun pengguna baru sesuai kategori pengguna
Menampilkan pesan"Registrasi akun berhasil, silakan login"
Mengarahkan pengguna ke halaman login
Jika pengguna mengklik "Batal", maka sistem akan:
 Menampilkan pesan “Batal Melakukan Registrasi”
Tetap menampilkan form registrasi

Prosedur Melihat Profil  (Admin, Kalab, PLP, Mahasiswa, Dosen, Eksternal)
Pengguna masuk ke halaman dashboard sesuai role. 
Pengguna mengklik menu/foto "Profil Saya".
Sistem mengambil data profil pengguna dari basis data berdasarkan ID sesi aktif.
Sistem menampilkan halaman profil yang mencakup:
Foto Profil
Nama Lengkap
NIM / NIP / ID Identitas
Instansi / Program Studi
Email
Nomor Telepon
Hak Akses / Role
File Identitas

Prosedur Mengubah Profil  (Admin, Kalab, PLP, Mahasiswa, Dosen, Eksternal)
Pengguna membuka halaman "Profil Saya" dan mengklik tombol "Ubah Profil".
Sistem menampilkan form ubah profil dengan data yang terisi sebelumnya:
Foto Profil: File (JPG/PNG, Max 2MB)
Nama Lengkap: Varchar (255 char)
Nomor Telepon: Varchar (20 char)
Instansi / Program Studi: Varchar (255 char)
Pengguna memperbarui data yang ingin diubah dan mengklik tombol "Simpan Perubahan".
Sistem melakukan validasi:
Jika ada form yang kosong, sistem menampilkan pesan "Semua kolom wajib diisi".
Jika ukuran unggahan foto melebihi batas 2MB atau format bukan JPG/PNG, sistem menampilkan pesan "Format foto harus JPG/PNG dan maksimal 2MB".
Jika semua data valid, maka sistem akan menampilkan pop-up dialog "Yakin ingin menyimpan perubahan?".
Jika pengguna mengklik "Ya", maka sistem akan:
Memperbarui basis data dan Memperbarui tampilan profil pengguna 
Menampilkan pesan "Profil berhasil diperbarui".
Jika pengguna mengklik "Batal", maka sistem akan:
Menampilkan pesan  “Data profil batal diubah”
Tetap menampilkan form ubah profil.
Prosedur Mengubah Password (sesudah login)  (Admin, Kalab, PLP, Mahasiswa, Dosen, Eksternal) 
Pengguna membuka halaman "Profil Saya" lalu memilih tab "Ubah Password".
Sistem menampilkan form ubah password yang berisi:
Password Lama: Varchar (255 char)
Password Baru: Varchar (255 char)
Konfirmasi Password Baru: Varchar (255 char)
Pengguna menginputkan data dan mengklik tombol "Perbarui Password".
Sistem melakukan validasi:
Jika ada form yang kosong, sistem menampilkan pesan "Seluruh kolom password wajib diisi".
Sistem mencocokkan Password Lama dengan password terenkripsi di basis data. Jika tidak cocok, sistem menampilkan pesan "Password lama Anda salah".
Jika Password Baru dan Konfirmasi Password Baru tidak sama, sistem menampilkan pesan "Konfirmasi password baru tidak cocok".
Jika validasi berhasil, maka sistem akan menampilkan pop-up dialog "Yakin ingin menyimpan perubahan password?".
Jika pengguna mengklik "Ya", maka sistem akan:
Memperbarui data kata sandi di basis data
Menampilkan pesan “Password berhasil diubah”
Jika pengguna mengklik "Batal", maka sistem akan:
Menampilkan pesan  “Password batal diubah”
Tetap menampilkan form ubah password.

Prosedur Melihat Daftar Pengguna (Admin)
Admin memilih menu "Manajemen Pengguna".
Sistem melakukan query ke basis data untuk mengambil daftar seluruh pengguna.
Sistem menampilkan tabel daftar pengguna yang dilengkapi fitur pencarian dan filter role, dengan kolom:
Nama Lengkap
Foto Profil
Email
Institusi
Hak Akses (Role)
Status Akses ('active', 'blocked', 'suspended')
Aksi (Detail, Edit, Ubah Status)
Pengguna mengklik tombol "Detail" pada salah satu data pengguna. 
Sistem menampilkan pop-up / halaman detail:
ID Pengguna
Nama Lengkap
Foto Profil
Email
No Identitas
No Telepon
Institusi
Hak Akses (Role)
Status Akses ('active', 'blocked', 'suspended')
Foto Identitas
Prosedur Membuat Data Pengguna (Admin)
Admin berada di halaman "Manajemen Pengguna" dan mengklik tombol "Tambah Pengguna".
Sistem menampilkan form pembuatan pengguna baru yang berisi:
Nama Lengkap: Varchar (255 char)
Instansi / Organisasi: Varchar (255 char)
Role: Enum (‘Admin’, ‘Kalab’, ‘PLP’, ‘Mahasiswa’, ‘Internal-UNEJ’, 'Luar-UNEJ')
Nomor Telepon/WA: Varchar (20 char)
No Identitas: Varchar (100 char)
Email: Varchar (255 char)
Password: Varchar (255 char)
Konfirmasi Password: Varchar (255 char)
Foto Profil: Varchar (255 char)
Foto Identitas (KTM atau KTP):  Varchar (255 char)
Admin mengisi seluruh informasi dan mengklik tombol "Simpan Data".
Sistem melakukan validasi data:
Jika ada field yang belum diisi, sistem menampilkan pesan "Semua kolom wajib diisi".
Jika format email tidak valid, sistem menampilkan pesan "Format email tidak sesuai".
Jika email sudah pernah terdaftar, sistem menampilkan pesan "Email sudah terdaftar, silakan gunakan email lain".
Jika Password dan Konfirmasi Password tidak sama, sistem menampilkan pesan "Konfirmasi password tidak cocok".
Jika data valid, sistem menyimpan pengguna baru ke basis data dan menampilkan pesan "Data pengguna berhasil ditambahkan". 

Prosedur Mengubah Data Pengguna (Admin)
Admin mengklik tombol "Edit" pada salah satu baris pengguna di tabel daftar pengguna.
Sistem menampilkan form ubah pengguna yang terisi data pengguna saat ini.
Admin mengubah informasi pengguna (seperti Nama, Email, Nomor Telepon, atau Role) dan mengklik tombol "Perbarui Data".
Sistem melakukan validasi kelengkapan data.
Jika data valid, sistem memperbarui informasi pengguna di basis data dan menampilkan pesan "Data pengguna berhasil diperbarui".

Prosedur Mengubah Status Hak Akses Pengguna (Mengaktifkan / Membatasi Akses Peminjaman) (Admin)
Admin memilih pengguna pada tabel data pengguna dan mengklik tombol "Ubah Status".
Sistem menampilkan jendela pop-up modal pilihan status akses:
Status Akses: Dropdown ('active', 'blocked', 'suspended') 
Alasan Perubahan Status: TEXT
Admin memilih status (misalnya mengubah dari 'active' menjadi suspended' akibat keterlambatan/kerusakan, atau sebaliknya mengaktifkan kembali dari suspended' menjadi 'active') dan mengisi alasan, lalu mengklik tombol "Simpan Status".
Sistem memperbarui kolom status hak akses pengguna di basis data.
Jika status diubah menjadi Suspended, sistem secara otomatis menolak akses pengguna tersebut untuk membuat pengajuan peminjaman baru di katalog.
Jika status diubah menjadi blocked, sistem secara otomatis menolak akses pengguna tersebut untuk mengakses semua fitur yang ada di sistem.
Sistem menampilkan pesan "Status hak akses pengguna berhasil diperbarui".

Prosedur Melihat Dashboard Publik / Sebelum Login (Pengguna Eksternal) 
Pengguna Eksternal membuka alamat situs web SIMLAFIS tanpa melakukan login.
Sistem menampilkan halaman Dashboard Publik yang memuat:
Banner / Informasi Ringkas SIMLAFIS: Pengenalan fasilitas dan layanan laboratorium.
Menu Katalog Alat Publik: Menampilkan kartu (card) alat yang berisi foto, nama alat, lokasi penyimpanan, spesifikasi singkat, stok tersedia, serta estimasi tarif sewa publik (Internal UNEJ / Luar UNEJ).
Menu Katalog Ruangan: Menampilkan daftar ruangan laboratorium, fasilitas, tarif sewa.
Bilah Pencarian & Filter: Pencarian alat/ruangan berdasarkan kata kunci atau unit laboratorium.
Tombol Aksi "Login untuk Peminjaman": Jika pengguna eksternal mengklik tombol "Pinjam" atau "Tambah ke Keranjang", sistem akan menampilkan dialog petunjuk dan mengarahkan pengguna ke halaman Login / Registrasi Akun Eksternal.

Prosedur Melihat Dashboard Setelah Login(Admin, KaLab, PLP) 
Pengguna dengan role Admin, KaLab, atau PLP berhasil melakukan login.
Sistem secara otomatis mengarahkan pengguna ke halaman Dashboard Utama.
Sistem melakukan kalkulasi dan menampilkan komponen analitikal real-time sebagai berikut:
Melihat Akumulasi Pendapatan: Sistem menghitung total nominal penerimaan uang tunai (cash) dan transfer bank dari transaksi peminjaman alat dan ruangan yang berstatus lunas. (khusus admin)
Melihat Statistik Peminjaman Alat: Sistem menampilkan kotak ringkasan total angka untuk transaksi alat dengan rincian: Total Seluruh Pengajuan, Pending (Menunggu Approval), Disetujui, Ditolak, dan Sedang Dipinjam.
Melihat Statistik Peminjaman Ruangan: Sistem menampilkan kotak ringkasan total angka untuk transaksi ruangan dengan rincian: Total Seluruh Pengajuan, Pending (Menunggu Approval), Disetujui, Ditolak, dan Sedang Dipinjam.
Melihat Grafik Batang Rekapitulasi Statistik Peminjaman Alat: Sistem merender grafik batang (bar chart) yang menyajikan tren frekuensi peminjaman alat secara bulanan dalam periode tahun berjalan.
Melihat Grafik Batang Rekapitulasi Statistik Peminjaman Ruangan: Sistem merender grafik batang (bar chart) yang menyajikan tren frekuensi peminjaman dan penggunaan ruangan secara bulanan dalam periode tahun berjalan.
Menampilkan 10 Pengajuan Peminjaman Terbaru: Sistem mengambil dan menampilkan tabel ringkas berisi 10 baris transaksi pengajuan peminjaman alat dan ruangan paling akhir yang masuk ke sistem beserta status langsungnya.

Melihat Dashboard Setelah Login (Mahasiswa, Dosen, Eksternal) 
Pengguna (Mahasiswa, Dosen, Eksternal) telah berhasil login ke dalam sistem SIMLAFIS.
Sistem menampilkan halaman Dashboard Mahasiswa yang berisi: 
Ringkasan Aktivitas Peminjaman: Total peminjaman aktif, peminjaman menunggu persetujuan, dan riwayat peminjaman.
Status Peminjaman Terkini: Widget status pengajuan alat/ruangan (Draft, Pending Approval PLP/KaLab, Approved, Disetujui, Ditolak, Berjalan, Selesai).
Notifikasi Pengembalian: Peringatan batas waktu (deadline) pengembalian alat yang sedang dipinjam. 
Akses Cepat (Quick Links): Tombol pintas ke "Katalog Alat", "Katalog & Jadwal Ruangan"
Prosedur Membuat Data Katalog dan Layanan Tarif Alat (Admin)
Pengguna (Admin) telah berhasil login ke dalam sistem SIMLAFIS.
Sistem menampilkan halaman dashboard sesuai role Admin.
Pengguna memilih menu "Katalog Laboratorium"
Sistem menampilkan halaman daftar katalog alat.
Pengguna mengklik tombol "Tambah Alat & Tarif".
Sistem menampilkan form tambah data alat dan layanan tarif yang berisi:
Id Alat: Varchar (100 char)
Nama Alat: Varchar (255 char)
Foto Alat : VarChar(255) (file JPG/PNG max 2MB)
Deskripsi : Text
Tarif Eksternal Internal Unej : Decimal(12,2) (Default: 0.00)
Tarif Eksternal Luar Unej: Decimal(12,2) (Default: 0.00)
(Catatan: Stok tidak diinput secara manual, melainkan dihitung otomatis oleh sistem berdasarkan akumulasi data id_detail_alat) 
Pengguna mengisi seluruh informasi data alat dan layanan tarif.
Pengguna mengklik tombol "Simpan Data Alat".
Sistem melakukan validasi masukan data:
Jika terdapat field yang belum diisi atau kosong, maka sistem akan menampilkan pesan "Semua informasi harus diisi" dan kembali ke form.
Jika id_alat sudah terdaftar sebelumnya (duplikat Primary Key), maka sistem akan menampilkan pesan "ID Alat sudah terdaftar di sistem" dan kembali ke form.
Jika input nominal tarif berupa data numerik yang tidak valid (kurang dari 0 atau berupa huruf), maka sistem akan menampilkan pesan "Data numerik tarif tidak valid" dan kembali ke form.
Jika ukuran unggahan foto melebihi 2MB atau format bukan JPG/PNG, maka sistem akan menampilkan pesan "Format foto harus JPG/PNG dan maksimal 2MB" dan kembali ke form.
Jika semua data valid, maka sistem akan menampilkan pop-up dialog "Yakin ingin menyimpan data alat baru?".
Jika pengguna mengklik "Ya", maka sistem akan:
Menyimpan data katalog alat dan acuan tarif sewa publik baru ke dalam basis data.
Menampilkan pesan "Data alat dan layanan tarif berhasil ditambahkan".
Menampilkan kembali halaman daftar katalog alat dengan data terbaru.
Jika pengguna mengklik "Batal", maka sistem akan:
Menampilkan pesan "Penambahan data alat dibatalkan".
Tetap menampilkan halaman daftar katalog alat.

Prosedur Melihat Katalog, Ketersediaan, dan Layanan Tarif Alat (Admin) 
Pengguna (Admin) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard Admin.
Pengguna memilih menu "Katalog Laboratorium"
Sistem melakukan query ke basis data untuk mengambil seluruh data inventaris alat dan informasi tarif.
Sistem menampilkan halaman katalog alat dalam bentuk tabel/kartu interaktif yang berisi:
Id Alat
Nama Alat
Foto Alat
Stok Total (Kalkulasi Otomatis Sistem) 
Stok Ketersediaan Riil (Kalkulasi otomatis sistem tapi yang statusnya tersedia)
Deskripsi 
Tarif Eksternal Internal Unej
Tarif Eksternal Luar Unej
Aksi: Tombol 'Detail' dan 'Ubah', 
Pengguna mengklik tombol "Detail" pada salah satu alat. 
Sistem menampilkan halaman detail rincian aset berdasarkan seluruh id_detail_alat yang terdaftar: 
ID Detail Alat: VarChar(100)
Nama Alat: VarChar
Lokasi Penyimpanan (Unit Lab): Dropdown/Text
Kondisi: Enum ('baik', 'rusak')
Status: Enum ('tersedia', 'tidak tersedia', 'sedang perbaikan')
Tahun Pengadaan: Year / VarChar(4)
Sumber Dana: VarChar(255)
Status Kepemilikan: VarChar(100)
Harga Beli: Decimal(12,2)
Catatan: Text
Pengguna dapat memilih filter unit laboratorium atau memasukkan kata kunci pada bilah pencarian nama alat.
Sistem menyaring dan memperbarui tampilan daftar katalog secara real-time sesuai kriteria filter.

Prosedur Mengubah Data Katalog dan Layanan Tarif Alat (Admin)
Pengguna (Admin) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard Admin.
Pengguna memilih menu "Katalog Laboratorium"
Sistem menampilkan daftar data alat beserta layanan tarif.
Pengguna memilih salah satu data alat yang akan diubah dengan klik tombol "Ubah".
Sistem menampilkan form ubah data master alat yang terisi data saat ini:
Id Alat (Read-Only)
Nama Alat
Foto Alat
Deskripsi 
Tarif Eksternal Internal Unej
Tarif Eksternal Luar Unej
Pengguna melakukan perubahan data master alat atau penyesuaian nominal tarif sewa.
Pengguna mengklik tombol "Simpan Perubahan".
Sistem melakukan validasi masukan data:
Jika terdapat field yang kosong, maka sistem akan menampilkan pesan "Semua informasi harus lengkap" dan kembali ke form.
Jika nominal tarif berisi masukan numerik tidak valid, maka sistem akan menampilkan pesan "Data numerik tarif tidak valid" dan kembali ke form.
Jika gambar diubah tetapi file tidak sesuai ketentuan (bukan JPG/PNG atau >2MB), maka sistem akan menampilkan pesan "Format foto harus JPG/PNG dan maksimal 2MB" dan kembali ke form.
Jika semua data valid, maka sistem akan menampilkan pop-up dialog "Yakin ingin menyimpan perubahan data alat?".
Jika pengguna mengklik "Ya", maka sistem akan:
Memperbarui data master katalog alat dan layanan tarif pada basis data.
Menampilkan pesan "Data alat dan layanan tarif telah berhasil diubah".
Menampilkan kembali halaman katalog alat dengan data yang paling baru.
Jika pengguna mengklik "Batal", maka sistem akan: 
Menampilkan pesan "Perubahan data alat dibatalkan".
Tetap menampilkan halaman daftar katalog alat.

Prosedur Melihat Katalog Alat dan Detail Spesifikasi (KaLab)  
Pengguna (Kalab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard Kalab.
Pengguna memilih menu "Katalog Laboratorium"
Sistem melakukan query ke basis data untuk mengambil seluruh data inventaris alat dan informasi tarif.
Sistem menampilkan halaman katalog alat dalam bentuk tabel/kartu interaktif yang berisi:
Id Alat
Nama Alat
Foto Alat
Stok Total (Kalkulasi Otomatis Sistem) 
Stok Ketersediaan Riil (Kalkulasi otomatis sistem tapi yang statusnya tersedia)
Deskripsi 
Tarif Eksternal Internal Unej
Tarif Eksternal Luar Unej
Aksi: Tombol 'Detail' 
Pengguna mengklik tombol "Detail" pada salah satu alat. 
Sistem menampilkan pop-up / halaman detail rincian aset berdasarkan seluruh id_detail_alat yang terdaftar: 
ID Detail Alat: VarChar(100)
Nama Alat: VarChar
Lokasi Penyimpanan (Unit Lab): Dropdown/Text
Kondisi: Enum ('baik', 'rusak')
Status: Enum ('tersedia', 'tidak tersedia', 'sedang perbaikan')
Tahun Pengadaan: Year / VarChar(4)
Sumber Dana: VarChar(255)
Status Kepemilikan: VarChar(100)
Harga Beli: Decimal(12,2)
Catatan: Text
Pengguna dapat memilih filter unit laboratorium atau memasukkan kata kunci pada bilah pencarian nama alat.
Sistem menyaring dan memperbarui tampilan daftar katalog secara real-time sesuai kriteria filter.
Membuat Data Detail Alat / Register Unit Alat (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem SIMLAFIS.
Sistem menampilkan halaman dashboard sesuai role PLP.
Pengguna memilih menu "Katalog Laboratorium"
Pengguna mengklik tombol "Tambah Unit Detail Alat".
Sistem menampilkan form registrasi detail alat yang berisi:
ID Detail Alat: VarChar(100) (PK)
Nama Alat: Select Master Alat / Varchar
Lokasi Penyimpanan: Dropdown ('Lab Fisika Dasar', 'Lab Elektronika', 'Lab Fisika Lanjut', 'Lab ELF')
Kondisi: Dropdown Enum ('baik', 'rusak')
Status: Dropdown Enum ('tersedia', 'tidak tersedia', 'sedang perbaikan')
Tahun Pengadaan: Year / VarChar(4)
Sumber Dana: VarChar(255)
Status Kepemilikan: VarChar(100)
Harga Beli: Decimal(12,2) (Nullable)
Catatan: Text (Nullable)
Pengguna mengisi seluruh informasi detail unit alat.
Pengguna mengklik tombol "Simpan Detail Alat".
Sistem melakukan validasi data:
Jika terdapat field wajib yang belum diisi, maka sistem akan menampilkan pesan "Semua informasi wajib harus diisi" dan kembali ke form.
Jika id_detail_alat sudah terdaftar sebelumnya (duplikat Primary Key), maka sistem akan menampilkan pesan "ID Detail Alat sudah terdaftar di sistem" dan kembali ke form.
Jika format inputan tahun atau harga beli tidak valid, sistem menampilkan pesan "Format data numerik/tahun tidak valid".
Jika semua data valid, maka sistem menampilkan pop-up "Yakin ingin menambahkan unit alat ini?".
Jika pengguna mengklik "Ya", maka sistem akan:
Menyimpan unit detail alat baru ke dalam basis data inventaris.
Mengkalkulasi ulang (menambah +1) jumlah stok fisik otomatis pada katalog master alat terkait.
Menampilkan pesan "Detail unit alat berhasil disimpan".
Menampilkan kembali halaman daftar katalog alat PLP.
Jika pengguna mengklik "Batal", maka sistem akan: 
Menampilkan pesan "Batal menyimpan detail data alat".
Tetap menampilkan  tabel daftar pengguna.

Prosedur Melihat Katalog dan Detail Unit Alat (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard PLP.
Pengguna memilih menu "Katalog Laboratorium"
Pengguna memilih menu "Katalog Alat" 
Sistem melakukan query ke basis data untuk mengambil seluruh data inventaris alat dan informasi tarif.
Sistem menampilkan halaman katalog alat dalam bentuk kartu interaktif yang berisi:
Id Alat
Nama Alat
Foto Alat
Stok Total (Kalkulasi Otomatis Sistem) 
Stok Ketersediaan Riil (Kalkulasi otomatis sistem tapi yang statusnya tersedia)
Deskripsi 
Tarif Eksternal Internal Unej
Tarif Eksternal Luar Unej
Aksi: Tombol 'Detail' 
Pengguna mengklik tombol "Detail" pada salah satu alat. 
Sistem menampilkan pop-up / halaman detail rincian aset berdasarkan seluruh id_detail_alat yang terdaftar: 
ID Detail Alat: VarChar(100)
Nama Alat: VarChar
Lokasi Penyimpanan (Unit Lab): Dropdown/Text
Kondisi: Enum ('baik', 'rusak')
Status: Enum ('tersedia', 'tidak tersedia', 'sedang perbaikan')
Tahun Pengadaan: Year / VarChar(4)
Sumber Dana: VarChar(255)
Status Kepemilikan: VarChar(100)
Harga Beli: Decimal(12,2)
Catatan: Text
Aksi: Tombol 'Ubah' 
Pengguna dapat memilih filter unit laboratorium atau memasukkan kata kunci pada bilah pencarian nama alat.
Sistem menyaring dan memperbarui tampilan daftar katalog secara real-time sesuai kriteria filter.
Prosedur Mengubah Data Detail Alat (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard PLP.
Pengguna memilih menu "Katalog Laboratorium"
Pengguna memilih menu "Katalog Alat" 
Sistem menampilkan halaman katalog alat dalam bentuk kartu interaktif
Pengguna memilih salah satu data alat yang akan diperbarui dan mengklik tombol "Ubah".
Sistem menampilkan form ubah detail alat yang terisi data saat ini:
ID Detail Alat (Read-only)
Nama Alat
Lokasi Penyimpanan
Kondisi
Status
Tahun Pengadaan
Sumber Dana
Status Kepemilikan
Harga Beli
Catatan
Pengguna melakukan penyesuaian lokasi, perubahan kondisi fisik (baik/rusak), atau status operasional (tersedia/tidak tersedia/sedang perbaikan).
Pengguna mengklik tombol "Simpan Perubahan".
Sistem melakukan validasi masukan data:
Jika terdapat field yang kosong, maka sistem akan menampilkan pesan "Semua informasi harus lengkap" dan kembali ke form.
Jika nominal harga beli dan tahun pengadaan berisi masukan numerik tidak valid, maka sistem akan menampilkan pesan "Data numerik tidak valid" dan kembali ke form.
Jika semua data valid, maka sistem akan menampilkan pop-up dialog "Yakin ingin mengubah data unit detail alat ini?".
Jika pengguna mengklik "Ya", maka sistem akan:
Memperbarui data detail alat di basis data.
Menampilkan pesan "Data detail alat berhasil diperbarui".
Menampilkan kembali halaman katalog alat dengan data yang paling baru.
Jika pengguna mengklik "Batal", maka sistem akan: 
Menampilkan pesan "Perubahan data alat dibatalkan".
Tetap menampilkan form ubah data detail alat.

Prosedur Melihat Katalog Alat dan Ketersediaan Alat (Mahasiswa, Dosen, Eksternal) 
Pengguna telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard role.
Pengguna memilih menu "Katalog Laboratorium"
Pengguna dapat menginputkan kriteria pencarian yang berisi:
Kata Kunci Nama Alat: Varchar (255 char)
Rentang Tanggal Peminjaman: Tanggal Mulai s.d. Tanggal Selesai
Pengguna mengklik "Cari Alat".
Sistem melakukan kalkulasi ketersediaan secara dinamis:
Menghitung total id_detail_alat yang memiliki status 'tersedia' dan kondisi 'baik'.
Dikurangi kuantitas unit id_detail_alat yang sudah ter-booking disetujui pada rentang tanggal tersebut.
Sistem menampilkan daftar kartu (card) alat yang berisi:
Foto Alat
Nama Alat
Lokasi Penyimpanan
Spesifikasi Singkat
Stok Tersedia Riil pada Rentang Tanggal Tersebut
Ketentuan Tampilan Tarif/Harga:
Untuk Mahasiswa dan Dosen: Sistem tidak menampilkan nominal harga/tarif sewa.
Untuk Pengguna Eksternal: Sistem menampilkan estimasi biaya sewa per unit berdasarkan kategori pengguna (Internal UNEJ / Luar UNEJ).
Pengguna dapat mengklik tombol "Tambah ke Keranjang" untuk melakukan peminjaman. 
Prosedur Membuat Data Katalog dan Layanan Tarif Ruangan (Admin) 
Pengguna (Admin) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard Admin.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna memilih menu "Tab Jadwal Ruangan" dan mengklik "Tambah Ruangan & Tarif".
Sistem menampilkan form tambah ruangan yang berisi:
Id Ruangan : VarChar(100) (PK)
Nama Ruangan : VarChar(255)
Foto Ruangan : VarChar(255) 
kapasitas : Int
Tarif Sewa Eksternal (Internal UNEJ) : Decimal(12,2) (Default: 0.00) opsional
Tarif Sewa Eksternal (Luar UNEJ) : Decimal(12,2) (Default: 0.00) opsional
deskripsi : Text
Pengguna mengisi seluruh informasi dan mengklik tombol "Simpan Data Ruangan".
Sistem melakukan validasi:
Jika terdapat field yang belum diisi atau kosong, maka sistem akan menampilkan pesan "Semua informasi wajib harus diisi" dan kembali ke form, kecuali field Tarif Sewa Eksternal (Internal UNEJ) dan Tarif Sewa Eksternal (Luar UNEJ).
Jika id ruangan sudah terdaftar, maka sistem akan menampilkan  pesan “ID Ruangan sudah terdaftar di sistem” dan kembali ke from.
Jika kapasitas atau nominal tarif berisi data numerik tidak valid (kurang dari 0 atau berupa huruf), maka sistem akan menampilkan pesan "Data numerik kapasitas atau tarif tidak valid" dan kembali ke form.
Jika ukuran unggahan foto melebihi 2MB atau format bukan JPG/PNG, maka sistem akan menampilkan pesan "Format foto harus JPG/PNG dan maksimal 2MB" dan kembali ke form.
Jika semua data valid, maka sistem akan menampilkan pop-up dialog "Yakin ingin menyimpan data ruangan baru?".
Jika pengguna mengklik "Ya", maka sistem akan:
Menyimpan data ruangan dan acuan tarif sewa publik baru ke dalam basis data.
Menampilkan pesan "Data ruangan dan layanan tarif berhasil disimpan".
Menampilkan kembali halaman daftar katalog ruangan dengan data terbaru.
Jika pengguna mengklik "Batal", maka sistem akan: 
Menampilkan pesan "Penambahan data ruangan dibatalkan".
Tetap menampilkan form tambah data ruangan.

Prosedur Melihat Katalog, Ketersediaan, dan Layanan Tarif Ruangan (Admin) 
Pengguna (Admin) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard Admin.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna memilih menu "Tab Jadwal Ruangan".
Sistem melakukan query ke basis data untuk mengambil seluruh data master ruangan beserta tarif sewa.
Sistem menampilkan halaman katalog ruangan dalam bentuk tabel/kartu interaktif yang berisi:
Id Ruangan
Nama Ruangan
Foto Ruangan 
kapasitas
Tarif Sewa Eksternal (Internal UNEJ)
Tarif Sewa Eksternal (Luar UNEJ)
Aksi: Tombol 'Detail', dan 'Ubah'
Pengguna mengklik tombol "Detail" pada salah satu ruangan.
Sistem mengambil data jadwal dari basis data dan menyajikannya dalam bentuk kalender interaktif (weekly/monthly view). 
Sistem menampilkan halaman detail yang berisi:
Nama Ruangan
Deskripsi

Prosedur Mengubah Data Katalog Master dan Layanan Tarif Ruangan (Admin) 
Pengguna (Admin) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard Admin.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna memilih menu "Tab Jadwal Ruangan".
Sistem menampilkan daftar data ruangan beserta layanan tarif.
Pengguna memilih salah satu data ruangan yang akan diubah dengan mengklik tombol "Ubah".
Sistem menampilkan form ubah data ruangan yang terisi data saat ini: 
Id Ruangan (read-only)
Nama Ruangan
Foto Ruangan 
Kapasitas
Tarif Sewa Eksternal (Internal UNEJ)
Tarif Sewa Eksternal (Luar UNEJ)
Deskripsi
Pengguna melakukan perubahan data ruangan atau penyesuaian nominal tarif sewa.
Pengguna mengklik tombol "Simpan Perubahan".
Sistem melakukan validasi masukan data:
Jika terdapat field yang kosong, maka sistem akan menampilkan pesan " Semua informasi wajib diisi" dan kembali ke form, kecuali field Tarif Sewa Eksternal (Internal UNEJ) dan Tarif Sewa Eksternal (Luar UNEJ).
Jika data numerik tidak valid, maka sistem akan menampilkan pesan "Data numerik kapasitas atau tarif tidak valid" dan kembali ke form.
Jika gambar diubah tetapi tidak sesuai ketentuan (bukan JPG/PNG atau >2MB), maka sistem akan menampilkan pesan "Format foto harus JPG/PNG dan maksimal 2MB" dan kembali ke form.
Jika semua data valid, maka sistem akan menampilkan pop-up dialog "Yakin ingin menyimpan perubahan data ruangan?".
Jika pengguna mengklik "Ya", maka sistem akan:
Memperbarui data katalog ruangan dan layanan tarif pada basis data.
Menampilkan pesan "Data ruangan dan layanan tarif berhasil diubah".
Menampilkan kembali halaman katalog ruangan dengan data yang paling baru.
Jika pengguna mengklik "Batal", maka sistem akan: 
Menampilkan pesan "Perubahan data ruangan dibatalkan".
Tetap menampilkan form ubah data ruangan.
Prosedur Melihat Jadwal Penggunaan Ruangan Lab (KaLab)
Pengguna (KaLab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard KaLab.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna memilih menu "Tab Jadwal Ruangan".
Sistem mengambil data jadwal dari basis data dan menyajikannya dalam bentuk kalender interaktif (weekly/monthly view).
Sistem juga menampilkan informasi ruangan dalam bentuk tabel/kartu interaktif dibawah jadwal yang berbentuk kalender, yang berisi:
Id Ruangan
Nama Ruangan
Foto Ruangan 
kapasitas
Tarif Sewa Eksternal (Internal UNEJ)
Tarif Sewa Eksternal (Luar UNEJ)
Deskripsi
Pengguna mengklik salah satu blok jadwal pada kalender untuk menampilkan detail peminjaman/kegiatan: Nama Kegiatan, Nama Peminjam/Penanggung Jawab, Waktu Peminjaman, dan Catatan.

Prosedur Membuat Jadwal Ruangan / Input Jadwal Reguler (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem SIMLAFIS.
Sistem menampilkan halaman dashboard sesuai role PLP.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna memilih menu "Tab Jadwal Ruangan" dan mengklik tombol "Tambah Jadwal Reguler".
Sistem menampilkan form tambah jadwal yang berisi:
Pilihan Ruangan: Dropdown
Nama Kegiatan / Mata Kuliah: Varchar (255 char)
Penanggung Jawab / Dosen: Varchar (255 char)
Hari: Dropdown
Jam Mulai: Time
Jam Selesai: Time
Pengguna menginputkan data jadwal operasional ruangan.
Pengguna mengklik tombol "Simpan Jadwal".
Sistem melakukan pemeriksaan validasi dan pengecekan bentrok (anti-collision check):
Jika terdapat field wajib yang kosong, sistem menampilkan pesan "Semua informasi wajib harus diisi" dan kembali ke form.
Jika jam mulai lebih besar atau sama dengan jam selesai, sistem menampilkan pesan "Format rentang jam tidak valid" dan kembali ke form.
Jika pada tanggal dan rentang jam tersebut ruangan telah terisi oleh kegiatan praktikum lain atau peminjaman yang disetujui, maka sistem menolak dan menampilkan pesan "Jadwal bentrok dengan agenda lain yang terdaftar" dan kembali ke form.
Jika jadwal tidak bentrok dan data valid, sistem menampilkan pop-up "Yakin ingin menambahkan jadwal ruangan ini?".
Jika pengguna mengklik "Ya", maka sistem akan:
Menyimpan agenda jadwal ruangan baru ke dalam basis data.
Menampilkan pesan "Jadwal ruangan berhasil ditambahkan".
Menampilkan kembali kalender jadwal ruangan.
Jika pengguna mengklik "Batal", maka sistem akan: 
Menampilkan pesan "Penambahan jadwal dibatalkan".
Tetap menampilkan form tambah jadwal.

Prosedur Melihat Jadwal Ruangan (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard PLP.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna memilih menu "Tab Jadwal Ruangan".
Sistem mengambil data jadwal dari basis data dan menyajikannya dalam bentuk kalender interaktif (weekly/monthly view).
Sistem juga menampilkan informasi ruangan dalam bentuk tabel/kartu interaktif dibawah jadwal yang berbentuk kalender, yang berisi:
Id Ruangan
Nama Ruangan
Foto Ruangan 
kapasitas
Tarif Sewa Eksternal (Internal UNEJ)
Tarif Sewa Eksternal (Luar UNEJ)
Deskripsi
Pengguna mengklik salah satu blok jadwal pada kalender untuk menampilkan detail peminjaman/kegiatan: Nama Kegiatan, Nama Peminjam/Penanggung Jawab, Waktu Peminjaman, dan Catatan.

Prosedur Mengubah Jadwal Ruangan (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard PLP.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna memilih tab "Jadwal Ruangan" dan memilih blok agenda yang ingin diubah pada kalender, lalu mengklik tombol "Ubah Jadwal".
Sistem menampilkan form ubah jadwal ruangan yang terisi data saat ini.
Pengguna melakukan penyesuaian hari, jam operasional, atau penanggung jawab kegiatan.
Pengguna mengklik tombol "Simpan Perubahan".
Sistem melakukan verifikasi anti-collision check ke basis data untuk memastikan slot waktu baru tidak bentrok dengan kegiatan lain.
Jika jadwal bentrok, sistem menampilkan pesan "Slot waktu baru bentrok dengan kegiatan lain".
Jika valid dan aman, sistem menampilkan pop-up dialog "Yakin ingin menyimpan perubahan jadwal ini?".
Jika mengklik "Ya", sistem memperbarui data di basis data dan menampilkan pesan "Jadwal ruangan berhasil diperbarui". 
Jika "Batal", sistem kembali ke form.

Prosedur Melihat Katalog Ruangan dan Jadwal Ketersediaan (Mahasiswa, Dosen, Eksternal) 
Pengguna (Admin atau KaLab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard sesuai role.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna (Mahasiswa, Dosen, atau Eksternal) membuka menu "Tab Jadwal Ruangan".
Sistem menampilkan jadwal dalam bentuk kalender interaktif (weekly/monthly view).
Sistem menampilkan informasi ruangan dalam bentuk tabel/kartu interaktif dibawah jadwal yang berbentuk kalender yang berisi:
Id Ruangan
Nama Ruangan
Foto Ruangan 
kapasitas
Tarif Sewa Eksternal (Internal UNEJ) (jika pengguna eksternal internal unej)
Tarif Sewa Eksternal (Luar UNEJ) (jika pengguna eksternal luar unej)
Deskripsi
Pengguna dapat memilih tanggal dan ruangan untuk memeriksa slot waktu yang kosong (Available) atau terisi (Booked / Praktikum).
Ketentuan Tampilan Tarif/Harga:
Untuk Mahasiswa dan Dosen: Sistem tidak menampilkan tarif sewa.
Untuk Pengguna Eksternal: Sistem menampilkan estimasi tarif sewa per jam/hari berdasarkan kategori pengguna (Internal UNEJ / Luar UNEJ).
Pengguna dapat mengklik tombol "Detail" untuk melihat fasilitas ruangan atau "Ajukan Peminjaman" untuk memproses peminjaman slot waktu.

Prosedur Melihat Data Bahan dan Ketersediaan Bahan (Admin & KaLab) 
Pengguna (Admin atau KaLab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard sesuai role.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Bahan’.
Sistem melakukan query ke basis data dan menampilkan tabel daftar bahan yang berisi:
Kode Bahan
Nama Bahan
Foto Bahan
Lokasi Penyimpanan
Stok Awal
Sisa Stok Ketersediaan
Satuan (Gram / mL / Pcs / Pack)
Status
Catatan

Prosedur Membuat Data Bahan (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem SIMLAFIS.
Sistem menampilkan halaman dashboard sesuai role PLP.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Bahan’.
Sistem menampilkan daftar seluruh data aset bahan laboratorium
Pengguna mengklik tombol "Tambah Data Bahan".
Sistem menampilkan form tambah data bahan, yang berisi:
Id Bahan: VarChar(100) (PK)
Nama Bahan: VarChar (255 char)
Foto Bahan: VarChar (255 char)
Lokasi Penyimpanan: Dropdown ('Lab Fisika Dasar', 'Lab Elektronika', 'Lab Fisika Lanjut', 'Lab ELF')
Stok Awal: integer
Sisa Stok Ketersediaan: Integer
Satuan: VarChar (50 char) (Gram, mL, Pcs, Botol)
Tanggal Kadaluarsa: Date (Nullable)
Status: Dropdown ('aman', 'menipis', 'habis') 
Catatan: Text (Nullable)
Pengguna mengisi seluruh informasi detail bahan.
Pengguna mengklik tombol "Simpan Data Bahan".
Sistem melakukan validasi data:
Jika terdapat field wajib yang belum diisi, maka sistem akan menampilkan pesan "Semua informasi wajib harus diisi" dan kembali ke form.
Jika id_bahan sudah terdaftar (duplikat Primary Key), maka sistem akan menampilkan pesan "ID Bahan sudah terdaftar di sistem" dan kembali ke form.
Jika jumlah stok bernilai kurang dari 0 atau berupa teks, sistem menampilkan pesan "Data numerik stok tidak valid".
Jika semua data valid, maka sistem menampilkan pop-up dialog "Yakin ingin menyimpan data bahan baru?".
Jika pengguna mengklik "Ya", maka sistem akan:
Menyimpan data bahan ke dalam basis data.
Menampilkan pesan "Data bahan berhasil disimpan".
Menampilkan kembali halaman daftar katalog bahan PLP.
Jika pengguna mengklik "Batal", maka sistem akan: 
Menampilkan pesan "Penambahan data bahan dibatalkan".
Tetap menampilkan form tambah bahan.

 Prosedur Melihat Data Bahan (PLP)
Pengguna (Admin atau KaLab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard sesuai role.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Bahan’.
Sistem melakukan query ke basis data dan menampilkan tabel daftar bahan yang berisi:
Kode Bahan
Nama Bahan
Foto Bahan
Lokasi Penyimpanan
Stok Awal
Sisa Stok Ketersediaan
Satuan (Gram / mL / Pcs / Pack)
Status
Catatan
Aksi: ‘Ubah’
Prosedur Mengubah Data Bahan (PLP)
Pengguna (PLP) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard PLP.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Bahan’.
Sistem menampilkan daftar seluruh data aset bahan laboratorium
Pengguna memilih salah satu bahan yang akan diubah dan mengklik tombol "Ubah".
Sistem menampilkan form ubah data bahan yang terisi data saat ini:
Id Bahan
Nama Bahan
Foto Bahan
Lokasi Penyimpanan
Stok Awal
Sisa Stok Ketersediaan
Satuan
Tanggal Kadaluarsa
Status
Catatan
Pengguna melakukan penyesuaian kuantitas stok sisa, tanggal kadaluarsa, atau lokasi penyimpanan.
Pengguna mengklik tombol "Simpan Perubahan".
Sistem memvalidasi data masukan.
Jika valid, sistem menampilkan pop-up dialog "Yakin ingin menyimpan perubahan data bahan ini?".
Jika pengguna mengklik "Ya", sistem memperbarui data bahan di basis data dan menampilkan pesan "Data bahan berhasil diperbarui", sistem kembali tabel daftar bahan
Jika "Batal", sistem kembali ke form.

Prosedur Melihat Data Mebeler (Admin & KaLab) 
Pengguna (Admin atau KaLab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard sesuai role.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Mebeler’
Sistem menampilkan daftar seluruh aset mebeler laboratorium yang berisi:
Id Mebeler
Nama Mebeler (Meja Lab / Kursi / Almari / Display)
Foto Mebeler
Lokasi Penyimpanan (Unit Lab)
Kondisi
Tahun Pengadaan
Sumber Dana
Status Kepemilikan
Harga Beli
Catatan

Prosedur Membuat Data Mebeler (PLP) 
Pengguna (PLP) telah berhasil login ke dalam sistem SIMLAFIS.
Sistem menampilkan halaman dashboard sesuai role PLP.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Mebeler’
Sistem menampilkan tabel daftar seluruh aset mebeler laboratorium
Pengguna mengklik tombol "Tambah Unit Mebeler".
Sistem menampilkan form data mebeler yang berisi:
Id Mebeler:  VarChar(100) (PK)
Nama Mebeler: VarChar(255)
Foto Mebeler: VarChar(255)
Lokasi Penyimpanan (Unit Lab)
Kondisi:  Enum ('baik', 'rusak', 'sedang perbaikan')
Tahun Pengadaan: Year / VarChar(4)
Sumber Dana: VarChar(255)
Status Kepemilikan: VarChar(100)
Harga Beli: Decimal(12,2) (Opsional)
Catatan: Text (Opsional)
Pengguna menginputkan data aset mebeler.
Pengguna mengklik tombol "Simpan Mebeler".
Sistem melakukan validasi data:
Jika terdapat field wajib yang kosong, sistem menampilkan pesan "Semua informasi wajib harus diisi" dan kembali ke form.
Jika id_mebeler sudah terdaftar (duplikat PK), sistem menampilkan pesan "ID Mebeler sudah terdaftar" dan kembali ke form.
Jika input harga beli atau tahun pengadaan berupa angka yang tidak valid, sistem menampilkan pesan "Format data numerik/tahun tidak valid".
Jika semua data valid, sistem menampilkan pop-up dialog "Yakin ingin menyimpan data mebeler baru?".
Jika mengklik "Ya", sistem menyimpan data ke basis data dan menampilkan pesan "Data mebeler berhasil ditambahkan". 
Jika "Batal", sistem kembali ke form.

Prosedur Melihat Data Mebeler (PLP)
Pengguna (Admin atau KaLab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard sesuai role.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Mebeler’
Sistem menampilkan tabel daftar seluruh aset mebeler laboratorium yang berisi:
Id Mebeler
Nama Mebeler (Meja Lab / Kursi / Almari / Display)
Foto Mebeler
Lokasi Penyimpanan (Unit Lab)
Kondisi
Tahun Pengadaan
Sumber Dana
Status Kepemilikan
Harga Beli
Catatan
Aksi: ‘Ubah’
Prosedur Mengubah Data Mebeler (PLP)
Pengguna (Admin atau KaLab) telah berhasil login ke dalam sistem.
Sistem menampilkan halaman dashboard sesuai role.
Pengguna memilih menu "Katalog Laboratorium"
Sistem langsung membuka tab Alat.
Pengguna mengklik ‘Tab Data Mebeler’
Sistem menampilkan tabel daftar seluruh aset mebeler laboratorium
Pengguna memilih salah satu data mebeler yang ingin diubah dan mengklik tombol "Ubah". 
Sistem menampilkan form ubah data mebeler yang terisi data saat ini: 
Id Mebeler
Nama Mebeler (Meja Lab / Kursi / Almari / Display)
Foto Mebeler
Lokasi Penyimpanan (Unit Lab)
Kondisi
Tahun Pengadaan
Sumber Dana
Status Kepemilikan
Harga Beli
Catatan
Pengguna memperbarui kondisi fisik, status ketersediaan, atau lokasi penyimpanan.
Pengguna mengklik tombol "Simpan Perubahan".
Sistem melakukan validasi masukan data.
Jika data valid, sistem menampilkan pop-up dialog "Yakin ingin menyimpan perubahan data mebeler ini?".
Jika pengguna mengklik "Ya", sistem memperbarui basis data dan menampilkan pesan "Data mebeler telah berhasil diubah". Jika "Batal", sistem kembali ke form. 

Prosedur Logout
Pengguna yang sedang dalam keadaan login mengklik tombol/ikon "Logout" pada menu navigasi profil.
Sistem menampilkan konfirmasi dialog "Apakah Anda yakin ingin keluar dari sistem?".
Pengguna mengklik tombol "Ya, Logout".
Sistem menghapus sesi (session) login pengguna yang aktif.
Sistem menampilkan pesan "Anda telah berhasil logout" dan mengarahkan kembali pengguna ke halaman login utama.