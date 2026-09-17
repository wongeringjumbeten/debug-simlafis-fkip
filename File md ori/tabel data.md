TABEL DATA NORMALISASI 3NF
(Data yang diinputkan data dummy)


Data Peran
id_peran
role
1
admin
2
kalab
3
plp
4
dosen pendidikan fisika UNEJ
5
mahasiswa pendidikan fisika UNEJ
6
Eksternal (non pendidikan fisika UNEJ)

id_peran : BigInt (PK, Auto Increment)
 role: VarChar(30)

Data Kredensial
id_kredensial
password
1
&r2wife32eedd.
2
$2y$10$...
3
980fc$ddffe
4
0*p986mnnn
5
!r4667niidss
6
&r23j32eedd.
7
$2y$10$ww2..
8
980fc$1358fkkffe
9
0*p986mn6755nn
10
!r4667niy43dss

id_kredensial : BigInt (PK, Auto Increment)
 password: VarChar(255)
Data Fakultas
id_fakultas
nama_fakultas
1
Fakultas Ilmu Pendidikan dan Keguruan
2
Fakultas Matematika dan Ilmu Pengetahuan Alam
3
Fakultas Teknik
4
Fakultas Teknologi Pertanian

id_fakultas : BigInt (PK, Auto Increment)
nama_fakultas: VarChar(255)
Data Prodi
id_prodi
id_fakultas
nama_prodi
1
1
Pendidikan Fisika
2
1
Pendidikan Kimia
3
1
Pendidikan IPA
4
3
Teknik Elektro

id_prodi : BigInt (PK, Auto Increment)
nama_prodi: VarChar(255)
Data Dosen
id_dosen
id_pengguna
id_prodi
id_fakultas
nama_dosen
NIP/NIDN
1
1
1
1
admin
111111111110000000
2
2
2
1
Dr. Ahmad Dahlan
197503152005011002
3
3
3
1
Siti Rahmawati, A.Md.
199008202018012001
4
7
3
1
Eko Prasetyo, M.Pd.
198204122008121003
5
8
4
3
Gusti Ayu
19840403202010001

id_dosen : BigInt (PK, Auto Increment)
nama_dosen: VarChar(255)
NIP/NIDN: Integer (Unique)

Data Mahasiswa
id_mahasiswa
id_pengguna
id_prodi
id_fakultas
nama_mahasiswa
NIM
1
4
4
3
Annisa Riska
241910301065
2
5
2
1
Nisa anggita
220210201043
3
9
1
1
Maya Sari
240210101004
4
10
1
1
Nabila Rajwa
230210201045

id_mahasiswa : BigInt (PK, Auto Increment)
nama_mahasiswa: VarChar(255)
NIM: Integer(Unique)

Data Instansi
id_instansi
nama_instansi
1
Politeknik Negeri Jember
2
SMAN 2 Lumajang
3
Universitas Muhammadiyah Jember
4
SMAN 1 Jember
5
SMAN 4 Jember

id_instansi : BigInt (PK, Auto Increment)
nama_instansi: VarChar(255)

Data Provinsi
id_provinsi
nama_provinsi
1
Jawa Timur
2
Jawa Barat
3
Jawa Tengah
4
Bali
5
Kalimantan Selatan

id_provinsi : BigInt (PK, Auto Increment)
nama_provinsi: VarChar(100)
Data Kabupaten
id_kabupaten
id_provinsi
nama_kabupaten
1
1
Jember
2
1
Lumajang
3
1
Bondowoso
4
3
Solo
5
2
Bandung

id_kabupaten : BigInt (PK, Auto Increment)
nama_kabupaten: VarChar(100)
Data Kecamatan
id_kecamatan
id_kabupaten
id_provinsi
nama_kecamatan
1
1
1
Sumbersari
2
3
1
Tegalampel
3
2
1
Rowokangkung
4
4
3
Banjarsari
5
5
2
Bandung Kulon

id_kecamatan: BigInt (PK, Auto Increment)
nama_kecamatan: VarChar(100)
Data Kelurahan/desa
id_kelurahandesa
id_kecamatan
id_kabupaten
id_provinsi
nama_kelurahandesa
1
1
1
1
Tegal Boto
2
2
3
1
Tanggulangin
3
3
2
1
Sidorejo
4
4
4
3
Keprabon
5
5
5
2
Gajah Mekar

id_kelurahan : BigInt (PK, Auto Increment)
nama_kelurahan: VarChar(100)

Data Eksternal
id_eksternal
id_pengguna
nama_eksternal
NIK
id_instansi
alamat_lengkap
id_keluruhandesa
id_kecamatan
id_kabupaten
id_provinsi
1
6
Naraya aqila
3308062309060004
1
Jalan gajah mada 97
4
4
4
3
2
11
Alexandria
3509052204090002
4
Jalan Jawa VII
1
1
1
1
3
12
Scania
3503062402070001
2
Jalan hayam wuruk 132
2
2
3
1
4
13
Muhammad Narendra
3207082107060002
3
Jalan semeru 21
5
5
5
2

id_eksternal : BigInt (PK, Auto Increment)
nama_eksternal: VarChar(100)
NIK: VarChar(100) (Unique)
alamat_lengkap: VarChar(255)

Data Pengguna
id_pengguna
foto_profil
foto_identitas
email
no_telepon
1
admin.png
Null
admin@unej.ac.id
081234567890
2
Dr. Ahmad Dahlan.png
Null
kalab.fisika@unej.ac.id
081234567891
3
Siti Rahmawati, A.Md.png
NIDN_SitiRahmawati.png
plp.fisika@unej.ac.id
081234567892
4
annisariska.png
KTM_annisariska.png
annisa riska@unej.ac.id
081234567893
5
nisaanggita.png
KTM_nisaanggita.png
220210201043@unej.ac.id
081234567894
6
narayaaqila.png
KTP_rianhidayat.png
narayaaqila@gmail.com
081234567895
7
ekoprasetyo.png
NIP_ekoprasetyo.png
ekoprasetyo@gmail.com
082435873459
8
gustiayu.png
NIPgustiayu.png
gustiayu@gmail.com
0824356665431
9
mayasari.png
NIM_mayasari.png
240210101004@unej.ac.id
085698125342
10
nabilarajwa.png
NIM_nabilarajwa.png
230210201045@unej.ac.id
085643231112
11
alexandria.png
NIK_alexandria.png
alexandria@gmail.com
085467789922
12
scania.png
NIK_scania.png
scania@gmail.com
082456667122
13
muhammadnarendra.png
NIK_muhammadnarendra.png
muhammadnarendra@gmail.com


081876234511

id_pengguna : BigInt (PK, Auto Increment)
foto_profil: VarChar(255)
foto_identitas: VarChar(255)
email : VarChar(255) (Unique)
no_telepon : Integer

Data Akun
id_akun
id_pengguna
id_peran
id_kredensial
status
created_at
updated_at
suspended_at
alasan_suspended
1
1
1
1
active
2026-01-01
2026-01-01
NULL
NULL
2
2
2
2
active
2026-01-01
2026-01-01
NULL
NULL
3
3
3
3
active
2026-01-01
2026-01-01
NULL
NULL
4
4
6
4
active
2026-01-10
2026-01-10
NULL
NULL
5
5
5
5
active
2026-02-01
2026-02-01
NULL
NULL
6
6
6
4
active
2026-03-01
2026-03-01
NULL
NULL
7
7
4
6
active
2026-01-01
2026-01-01
NULL
NULL
8
8
6
7
active
2026-01-01
2026-01-01
NULL
NULL
9
9
4
10
active
2026-01-01
2026-01-01
NULL
NULL
10
10
4
9
active
2026-01-10
2026-01-10
NULL
NULL
11
11
6
8
active
2026-02-01
2026-02-01
NULL
NULL
12
12
6
8
active
2026-03-01
2026-03-01
NULL
NULL
13
13
6
2
active
2026-03-01
2026-03-01
NULL
NULL

id_akun : BigInt (PK, Auto Increment)
status: ('active', 'blocked', 'suspended') VarChar(10) → suspended berarti tidak bisa mengajukan peminjaman
created_at : Datetime
updated_at : Datetime (Nullable)
suspended_at : DateTime (Nullable)
alasan_suspended: Text (Nullable)


Data Barang 
id_barang
nama_barang
foto_barang
deskripsi_barang
jenis_barang
1
Multimeter Digital
multimeter.jpg
Alat ukur tegangan dan arus presisi tinggi
Alat
2
Mikroskop Binokuler
mikroskop.jpg
Mikroskop perbesaran hingga 1000x
Alat
3
Osiloskop Digital
osiloskop.jpg
Pengukur sinyal gelombang listrik
Alat
4
Laser He-Ne
laser.jpg
Laser Helium-Neon untuk eksperimen optik
Alat
5
Jangka Sorong Digital
jangka.jpg
Alat ukur ketelitian 0.01mm
Alat
6
Laboratorium Fisika Dasar
lab_fisdas.jpg
Dilengkapi projector & AC
Ruangan
7
Laboratorium Elektronika
lab_elka.jpg
Dilengkapi workbench oscilloscope
Ruangan
8
Laboratorium Fisika Lanjut
lab_fislan.jpg
25 Unit PC spesifikasi tinggi
Ruangan
9
Lab ELF
lab_anorg.jpg
Lemari asam terintegrasi
Ruangan
10
Asam Klorida (HCl) 1M
hcl.jpg
Asam Klorida dengan 1 Molaritas 
Bahan
11
Kertas PH Indikator
ph.jpg
Kertas PH indikator yang digunakan untuk mengukur tingkat keasaman suatu zat
Bahan
12
Natrium Klorida (NaCl)
nacl.jpg
senyawa kimia ionik yang terdiri dari natrium dan klorida dengan perbandingan 1:1 
Bahan
13
Alkohol 70%
alkohol.jpg
cairan antiseptik medis yang efektif membunuh kuman, bakteri, dan virus pada luka ringan atau permukaan benda.
Bahan
14
Tembaga(II) Sulfat
cuso4.jpg
senyawa kimia anorganik berbentuk kristal biru terang (hidrat) atau bubuk putih (anhidrat) yang dikenal sebagai terusi atau blue vitriol
Bahan
15
Meja Lab Kayu Jati
meja.jpg
-
Mebeler
16
Kursi Lab Putar
kursi.jpg
-
Mebeler
17
Lemari Alat Kaca
lemari.jpg
-
Mebeler
18
Papan Tulis Whiteboard
papan.jpg
-
Mebeler
19
Rak Besi Komponen
rak.jpg
-
Mebeler
17
Meja Dosen
meja_dsn.jpg
-
Mebeler

id_barang : BigInt (PK, Auto Increment)
nama_barang : VarChar(255)
foto_barang : VarChar(255)
deskripsi_barang : Text
jenis: varchar (10) / enum (alat, bahan, ruangan, mebeler)
Data Ruangan
id_ruangan
id_barang
kapasitas
tarif_eksternal
is_aktif
1
6
40 orang
0.00
true
2
7
30 orang
0.00
true
3
8
25 orang
0.00
true
4
9
20 orang
350000.00
true

id_ruangan : BigInt (PK, Auto Increment)
id_barang: BigInt FK
kapasitas : Int
tarif_eksternal: Decimal(12,2) (Default: 0.00) (Nullable)
is_aktif : Boolean (Default: true)
Data Alat 
id_alat
id_barang
tarif_eksternal_luar_unej
1
1
25000.00
2
2
40000.00
3
3
50000.00
4
4
35000.00
5
5
15000.00
6
6
45000.00

id_alat : BigInt (PK, Auto Increment)
id_barang: BigInt FK
tarif_eksternal : Decimal(12,2) (Default: 0.00
Data Detail Alat
id_detail_alat
no_seri_unit
id_alat
id_ruruangan
kondisi
status
tahun_pengadaan
sumber_dana
harga_beli
catatan
1
MLT-001
1
1
baik
tersedia
2023
DIPA Unej
750000.00
Berfungsi normal
2
MLT-002
1
4
baik
tersedia
2023
DIPA Unej
750000.00
Berfungsi normal
3
MKS-001
2
2
baik
tersedia
2022
Hibah Penelitian
3500000.00
Lensa bersih
4
OSK-001
3
3
rusak
sedang perbaikan
2021
DIPA Unej
5000000.00
Probe rusak
5
LSR-001
4
4
baik
tersedia
2024
DIPA Unej
4200000.00
Kalibrasi aktif
6
JNS-001
5
2
baik
tidak tersedia
2023
DIPA Unej
300000.00
Baterai baru

id_detail_alat : BigInt (PK, Auto Increment)
no_seri_unit: VarChar(100) (unique)
id_alat : (FK -> data_alat.id_alat)
id_ruangan: BigInt FK
kondisi : Enum ('baik', 'rusak') VarChar(30)
status : Enum ('tersedia', 'tidak tersedia', 'sedang perbaikan') VarChar(30)
tahun_pengadaan : Year / VarChar(4)
sumber_dana : VARCHAR 50 / Enum ('Hibah Penelitian', 'DIPA Unej') 
harga_beli : Decimal(12,2) (Nullable)
catatan : Text (Nullable)
Data Bahan
id_bahan
id_barang
id_ruangan
Jumlah_awal
Jumlah_saat_ini
satuan
tanggal_kadaluarasa
status
catatan
1
10
3
5000
1200
ml
27-05-2027
menipis
Sisa untuk 2 praktikum
2
11
1
50
45 
pak
Null
aman
Stok mencukupi
3
12
2
2000
1800 
gram
03-07-2027
aman
Kemasan tersegel
4
13
3
10000 
0 
ml
Null
habis
Perlu re-order
5
14
4
1000
300 
gram
31-12-2026
menipis
Kristal biru bersih

id_bahan : BigInt (PK, Auto Increment)
id_barang: BigInt FK
id_ruangan : VarChar(100) Fk
jumlah_awal : Int
jumlah_saat_ini : Int
satuan: varchar50
status : Enum ('aman', 'menipis', 'habis') VarChar(30)
tanggal_kadaluarsa: Date
catatan : Text (Nullable)
Data Mebeler
id_mebeler
id_barang
id_ruangan
no_seri_unit_mebeler
kondisi
tahun_pengadaan
sumber_dana
harga_beli
catatan
1
15
4
MBL-MJK
baik
2020
DIPA Unej
1200000.00
Tahan zat kimia
2
16
2
MBL-KRS
rusak
2020
DIPA Unej
350000.00
Roda macet
3
17
1
MBL-LMR
baik
2019
DIPA Unej
2500000.00
Kunci aman
4
18
2
MBL-PBN
baik
2021
DIPA Unej
600000.00
Bersih
5
19
3
MBL-RAK
sedang perbaikan
2018
DIPA Unej
1500000.00
Engsel las ulang
6
17
4
MBL-MJD
baik
2022
DIPA Unej
1800000.00
Sangat baik

id_mebeler : BigInt (PK, Auto Increment)
id_barang : BigInt  fk
id_ruangan : BigInt  fk
no_seri_unit_mebeler: VarChar(100) (unique)
kondisi : Enum ('baik', 'rusak', 'sedang perbaikan')VarChar(30)
tahun_pengadaan : Year / VarChar(4)
sumber_dana : VARCHAR 50 / Enum ('Hibah Penelitian', 'DIPA Unej')
harga_beli : Decimal(12,2) (Nullable)
catatan : Text (Nullable)

Data Mata Kuliah
id_matakuliah
nama_mata_kuliah
1
Fisika Dasar I
2
Optika Modern
3
Elektronika Analog
4
Simulasi Fisika
5
Praktikum Gelombang
6
Kimia Fisika

id_matakuliah:  BigInt (PK, Auto Increment)
nama_mata_kuliah : VarChar(255)
Data Jadwal Ruangan
id_jadwal_ruangan
id_ruangan
id_matakuliah
id_pengguna
hari
jam_mulai
jam_selesai
is_aktif
1
1
1
8
Senin
08:00:00
10:30:00
true
2
3
2
7
Rabu
13:00:00
15:30:00
true
3
2
3
3
Selasa
09:30:00
12:00:00
true
4
3
4
7
Kamis
08:00:00
11:00:00
true
5
1
5
8
Jumat
13:30:00
16:00:00
true
6
4
6
3
Selasa
13:00:00
15:00:00
true

id_jadwal_ruangan : BigInt (PK, Auto Increment)
id_ruangan : BigInt (FK -> data_ruangan.id_ruangan)
id_matakuliah:  BigInt
id_pengguna : BigInt FK 
hari : Enum ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')VarChar(10)
jam_mulai : Time
jam_selesai : Time
is_aktif: Boolean (Default: true)

Data Pengajuan Peminjaman
id_pengajuan_peminjaman
id_pengguna
jenis_peminjaman
total_biaya
bukti_pembayaran
status_keseluruhan
tanggal_peminjaman
1
5
internal
0.00
NULL
dikembalikan
2026-09-05
2
6
eksternal
80000.00
bukti_1.jpg
dipinjam
2026-09-05
3
10
internal
0.00
NULL
disetujui
2026-09-06
4
8
eksternal
0.00
bukti_2.jpg
menunggu
2026-09-06
5
11
eksternal
400000.00
bukti_3.jpg
disetujui
2026-09-07
6
3
internal
0.00
NULL
ditolak
2026-09-07

id_pengajuan_peminjaman : BigInt (PK, Auto Increment)
id_pengguna : BigInt (FK -> data_pengguna.id_pengguna)
jenis_peminjaman : Enum ('internal', 'eksternal') VarChar(30)
total_biaya : Decimal(12,2) (Nullable, Default: 0.00)
bukti_pembayaran : VarChar(255) (Nullable)
status_keseluruhan : Enum ('menunggu', 'disetujui', 'ditolak', 'dipinjam', 'terlambat', 'dikembalikan') VarChar(20)
tanggal_peminjaman : Datetime

Data Detail Pengajuan Peminjaman Ruangan
id_detail_pengajuan_peminjaman_ruangan
id_pengajuan_peminjaman
id_ruangan
waktu_mulai
waktu_selesai
harga_per_item
total_biaya_per_item
status_item
alasan_penolakan
1
3
1
2026-09-09 10:00
2026-09-09 14:00
0.00
0.00
menunggu
NULL
2
5
2
2026-09-10 08:00
2026-09-10 17:00
400000.00
400000.00
disetujui
NULL

id_detail_pengajuan_peminjaman_ruangan : BigInt (PK, Auto Increment)
id_pengajuan_peminjaman : BigInt (FK -> data_pengajuan_peminjaman.id_pengajuan_peminjaman)
id_ruangan : BigInt  (FK -> data_ruangan.id_ruangan, Nullable)
waktu_mulai : DateTime
waktu_selesai : DateTime
harga_per_item : Decimal(12,2) (Default: 0.00)
total_biaya_per_item : Decimal(12,2) (Default: 0.00) 
status_item : Enum ('menunggu', 'disetujui', 'ditolak', ‘selesai’) VarChar(20)
alasan_penolakan : Text (Nullable)

Data Detail Pengajuan Peminjaman Alat
id_detail_pengajuan_peminjaman_alat
id_pengajuan_peminjaman
id_alat
waktu_mulai
waktu_selesai
jumlah_item
harga_per_item
total_biaya_per_item
status_item
alasan_penolakan
1
1
1
2026-09-05 08:00
2026-09-05 16:00
2
0.00
0.00
dikembalikan
NULL
2
2
2
2026-09-06 08:00
2026-09-07 16:00
1
40000.00
80000.00
disetujui
NULL
3
4
3
2026-09-08 09:00
2026-09-08 12:00
1
80000.00
0.00
disetujui
NULL
4
5
4
2026-09-09 10:00
2026-09-09 14:00
1
80000.00
0.00
menunggu
NULL
5
6
5
2026-09-08 08:00
2026-09-08 12:00
5
0.00
0.00
ditolak
Stok tidak cukup

id_detail_pengajuan_peminjaman_alat : BigInt (PK, Auto Increment)
id_pengajuan_peminjaman : BigInt (FK -> data_pengajuan_peminjaman.id_pengajuan_peminjaman)
id_alat : BigInt  (FK -> data_ruangan.id_ruangan, Nullable)
waktu_mulai : DateTime
waktu_selesai : DateTime
jumlah_item : Int (Default: 1)
harga_per_item : Decimal(12,2) (Default: 0.00)
total_biaya_per_item : Decimal(12,2) (Default: 0.00) 
status_item : Enum ('menunggu', 'disetujui', 'ditolak', ‘dikembalikan’) VarChar(20)
alasan_penolakan : Text (Nullable)
Data Detail Unit Peminjaman Alat
id_detail_unit_peminjaman_alat
id_detail_pengajuan_peminjaman_alat
id_detail_alat
kondisi_kembali
tanggal_pengembalian
bukti_pengembalian
catatan
1
1
1
baik
2026-09-05 15:45:00
buktiPemgebalian.png
dikembalikan tepat waktu
2
1
2
baik
2026-09-05 15:45:00
buktiPemgebalian1.png
dikembalikan lebih cepat
3
2
3
NULL
NULL
NULL
NULL
4
3
4
NULL
NULL
NULL
NULL

id_detail_unit_peminjaman_alat : BigInt (PK, Auto Increment)
id_detail_pengajuan_peminjaman_alat : BigInt (FK -> data_item_pengajuan_peminjaman.id_item_pengajuan_peminjaman)
id_detail_alat : BigInt (FK -> data_detail_alat.id_detail_alat)
kondisi_kembali : Enum ('baik', 'rusak', 'hilang') (Nullable) VarChar(20)
bukti_pengembalian: Varchar(255)
tanggal_pengembalian : DateTime (Nullable)

Data Bebas Laboratorium
id_bebas_laboratorium
id_pengajuan
nomor_surat
diterbitkan_pada
1
4
SKBL/FKIP/2026/001
2026-09-05 16:00:00
2
5
SKBL/FKIP/2026/002
2026-09-05 16:30:00
3
9
SKBL/FKIP/2026/003
2026-09-06 09:15:00
4
10
SKBL/FKIP/2026/004
2026-09-06 11:20:00

id_bebas_laboratorium : BigInt (PK, Auto Increment)
id_pengajuan : BigInt (FK -> data_pengguna.id_pengguna)
nomor_surat : VarChar(100) (Unique)
diterbitkan_pada : DateTime

Data Kegiatan Laboratorium
id_kegiatan_laboratorium
id_ruangan
judul
jenis_kegiatan
deskripsi
path_berkas
waktu_kegiatan
1
1
Workshop Instrumentasi Fisika
Pelatihan
Pelatihan dasar penggunaan osiloskop bagi mhs baru
Workshop.png
2026-10-12 09:00:00
2
1
Kuliah Tamu Optika Modern
Kuliah Umum
Pematerian dari peneliti LIPI terkait laser
poster_2.png
2026-10-20 13:00:00
3
3
Sertifikasi K3 Laboratorium
Sertifikasi
Uji kompetensi K3 bagi asisten lab
panduan_3.pdf
2026-11-01 08:00:00
4
2
Maintenance Alat Bulanan
Pemeliharaan
Kalibrasi tahunan seluruh alat ukur digital
jadwal_4.pdf
2026-11-15 08:00:00
5
4
Lomba Karya Tulis Fisika
Kompetisi
Ajang kompetisi riset antar mahasiswa FKIP
juknis_5.pdf
2026-12-05 08:00:00
6
4
Inventarisasi Bahan B3
Stock Opname
Pengecekan sisa stok bahan kimia berbahaya
berkas_6.pdf
2026-12-20 09:00:00

id_kegiatan_laboratorium : BigInt (PK, Auto Increment)
id_ruangan: BigInt FK
judul : VarChar(255)
jenis_kegiatan : VarChar(100)
deskripsi : Text
path_berkas : VarChar(255)
waktu_kegiatan : DateTime

Data Maintenance Kalibrasi 
id_maintenance_kalibrasi 
jenis_tindakan
nomor_surat
tanggal_surat
path_berkas 
catatan
1
kalibrasi
045/KAL/SUF/III/2026
2026-03-01
uploads/kalibrasi/cert_045_2026.pdf
Kalibrasi alat ukur presisi tinggi (multimeter)
2
maintenance
112/SP/TEK-JBR/III/2026
2026-03-15
uploads/maintenance/srv_112_2026.pdf
Servis pembersihan dan ganti lensa mikroskop
3
kalibrasi
089/KAL/SUF/IV/2026
2026-04-05
uploads/kalibrasi/cert_089_2026.pdf
Kalibrasi tahunan osiloskop digital
4
maintenance
204/MNT/LAB-UT/IV/2026
2026-04-20
uploads/maintenance/srv_204_2026.pdf
Perbaikan Jangka Sorong Digital
5
kalibrasi
120/KAL/KMI/V/2026
2026-05-10
uploads/kalibrasi/cert_120_2026.pdf
Rekalibrasi berkala Laser He-Ne
6
maintenance
055/SP/TEK-JBR/V/2026
2026-05-25
uploads/maintenance/srv_055_2026.pdf
Pengantian komponen modul sensor yang aus

id_maintenance_kalibrasi: BigInt — Primary Key
jenis_tindakan: VARCHAR(20) – Enum: ('maintenance', 'kalibrasi')
nomor_surat: VARCHAR(100)
tanggal_surat: DATE
path_berkas: VARCHAR(255)
catatan: VARCHAR(255) (Nullable)

Pivot Detail Alat Maintenence Kalibrasi
id_pivot_kalibrasi
id_maintenance_kalibrasi
id_detail_alat
1
1
1
2
1
2
3
2
3
4
3
4
5
4
6
6
5
5

id_pivot_kalibrasi: BigInt  — Primary Key (Auto Increment)
id_maintenance_kalibrasi: BigInt  — Foreign Key data_maintenance_kalibrasi
id_detail_alat: BigInt  — Foreign Key data_detail_alat

Data SOP (Ga jadi)
id_sop
dokumen_sop
1
uploads/SOP.pdf

tabel ini nanti isinya hanya 1 baris ini aja, soalnya dokumen sop itu hanya bisa diubah (tidak ada fitur tambah dokumen sop)
id_sop: BigInt — Primary Key (Auto Increment)
dokumen_sop: Varchar 255