import type { UnitLab } from '@/types';

/**
 * Isi SOP Laboratorium Pendidikan Fisika, disalin dari dokumen resmi
 * `public/docs/SOP-Laboratorium-Fisika.pdf` (14 halaman, 4 unit lab).
 *
 * Catatan penting: dokumen sumber masih berstatus **draf**. SOP Fisika Dasar
 * dan Elektronika sudah terisi, sedangkan bagian tata tertib & mekanisme pada
 * SOP Fisika Lanjut dan ELF masih berupa instruksi pengisian
 * ("Isikan tata tertib lab fisika lanjut apa saja..."). Bagian semacam itu
 * ditandai lewat properti `draf` agar tidak tampil seolah-olah sudah final.
 */

/** Tabel dua kolom untuk langkah paralel antara peminjam dan pengelola. */
export type SopTabel = {
    kepala: [string, string];
    baris: [string, string][];
};

/** Satu simpul bagian SOP; boleh bersarang lewat `anak`. */
export type SopNode = {
    /** Judul bagian, mengikuti penomoran dokumen asli (mis. "4.2 Peminjaman"). */
    judul: string;
    /** Paragraf pengantar. */
    teks?: string;
    /** Butir bernomor. */
    butir?: string[];
    /** Tabel dua kolom. */
    tabel?: SopTabel;
    /** Diisi bila bagian ini masih placeholder pada dokumen sumber. */
    draf?: string;
    anak?: SopNode[];
};

export type SopUnit = {
    id: UnitLab;
    /** Label pendek untuk tab. */
    label: string;
    /** Nama lengkap laboratorium sesuai dokumen. */
    nama: string;
    /** Ringkasan satu baris. */
    singkat: string;
    /** `sebagian` berarti masih ada bagian berstatus draf di dokumen sumber. */
    kelengkapan: 'lengkap' | 'sebagian';
    /** Catatan bila dokumen sumber punya kekurangan yang perlu diketahui pembaca. */
    catatan?: string;
    bagian: SopNode[];
};

/**
 * Bagian 4 (mekanisme & sanksi) pada SOP Fisika Dasar dan Elektronika identik
 * kata per kata di dokumen sumber, sehingga cukup didefinisikan sekali.
 */
const mekanismeDanSanksi: SopNode = {
    judul: 'Mekanisme Pelaksanaan Praktikum',
    anak: [
        {
            judul: '4.1 Pelaksanaan Praktikum — Mahasiswa',
            anak: [
                {
                    judul: 'Sebelum praktikum',
                    butir: [
                        'Membaca dan memahami modul praktikum.',
                        'Mempelajari teori yang berkaitan dengan percobaan.',
                        'Mengikuti pre-test (jika ada).',
                        'Menggunakan pakaian yang sesuai dan APD yang diwajibkan.',
                        'Hadir tepat waktu serta mengisi daftar hadir.',
                    ],
                },
                {
                    judul: 'Saat praktikum',
                    butir: [
                        'Mengikuti briefing dari dosen atau PLP/teknisi.',
                        'Menggunakan alat dan bahan sesuai petunjuk praktikum.',
                        'Melaksanakan percobaan sesuai SOP dan modul.',
                        'Mencatat hasil pengamatan secara teliti dan jujur.',
                        'Menjaga kebersihan, ketertiban, dan keselamatan kerja.',
                        'Melaporkan kepada dosen atau PLP apabila terjadi kerusakan alat, kesalahan pengukuran, atau kecelakaan.',
                    ],
                },
                {
                    judul: 'Setelah praktikum',
                    butir: [
                        'Membersihkan meja kerja dan area praktikum.',
                        'Mengembalikan alat dan bahan ke tempat semula dalam kondisi baik.',
                        'Memastikan semua peralatan telah dimatikan atau diamankan.',
                        'Menyusun dan mengumpulkan laporan praktikum sesuai ketentuan.',
                    ],
                },
            ],
        },
        {
            judul: '4.1 Pelaksanaan Praktikum — Dosen',
            anak: [
                {
                    judul: 'Sebelum praktikum',
                    butir: [
                        'Menyiapkan Rencana Pelaksanaan Praktikum (RPP) atau panduan praktikum.',
                        'Berkoordinasi dengan PLP/teknisi mengenai kesiapan alat dan bahan.',
                        'Memastikan prosedur keselamatan kerja telah dipahami oleh mahasiswa.',
                    ],
                },
                {
                    judul: 'Saat praktikum',
                    butir: [
                        'Memberikan penjelasan mengenai tujuan, prosedur, dan keselamatan kerja.',
                        'Membimbing dan mengawasi jalannya praktikum.',
                        'Memastikan mahasiswa bekerja sesuai SOP laboratorium.',
                        'Memberikan arahan apabila terjadi kesalahan prosedur atau kondisi yang berpotensi membahayakan.',
                        'Menilai keterampilan, sikap, dan hasil praktikum mahasiswa.',
                    ],
                },
                {
                    judul: 'Setelah praktikum',
                    butir: [
                        'Mengevaluasi hasil praktikum dan laporan mahasiswa.',
                        'Berkoordinasi dengan PLP mengenai kondisi alat setelah digunakan.',
                        'Melakukan evaluasi pelaksanaan praktikum sebagai bahan perbaikan pada kegiatan berikutnya.',
                    ],
                },
            ],
        },
        {
            judul: '4.2 Peminjaman Peralatan Praktikum',
            tabel: {
                kepala: ['Mahasiswa', 'Peran PLP'],
                baris: [
                    [
                        'Mengajukan permohonan peminjaman alat sesuai prosedur laboratorium.',
                        'Menerima dan memverifikasi permohonan peminjaman alat.',
                    ],
                    [
                        'Mengisi formulir atau buku peminjaman dengan lengkap dan benar.',
                        'Menyiapkan alat yang akan dipinjam sesuai kebutuhan praktikum.',
                    ],
                    [
                        'Memeriksa kondisi dan kelengkapan alat sebelum menerima alat.',
                        'Memastikan alat dalam kondisi baik, lengkap, dan layak digunakan.',
                    ],
                    [
                        'Menggunakan alat sesuai SOP dan petunjuk penggunaan.',
                        'Memberikan penjelasan cara penggunaan alat serta aspek keselamatan kerja bila diperlukan.',
                    ],
                    [
                        'Menjaga kebersihan dan keamanan alat selama digunakan.',
                        'Mencatat data peminjaman (nama peminjam, jenis alat, jumlah, tanggal pinjam dan kembali).',
                    ],
                    [
                        'Tidak memindahtangankan alat kepada pihak lain tanpa izin.',
                        'Mengawasi penggunaan alat apabila diperlukan.',
                    ],
                    [
                        'Segera melaporkan jika alat rusak atau tidak berfungsi.',
                        'Menindaklanjuti laporan kerusakan dan mendokumentasikan kondisi alat.',
                    ],
                    [
                        'Mengembalikan alat tepat waktu dalam keadaan bersih, lengkap, dan baik.',
                        'Memeriksa kondisi dan kelengkapan alat saat dikembalikan.',
                    ],
                    [
                        'Bertanggung jawab atas kerusakan atau kehilangan akibat kelalaian.',
                        'Menyimpan kembali alat pada tempat yang sesuai serta melakukan perawatan atau kalibrasi bila diperlukan.',
                    ],
                ],
            },
        },
        {
            judul: '4.3 Pengembalian Peralatan Praktikum',
            tabel: {
                kepala: ['Mahasiswa', 'Peran PLP'],
                baris: [
                    [
                        'Mengembalikan seluruh peralatan sesuai jadwal yang telah ditentukan.',
                        'Menerima pengembalian peralatan dari mahasiswa.',
                    ],
                    [
                        'Membersihkan peralatan sebelum dikembalikan sesuai prosedur.',
                        'Memeriksa kebersihan, kondisi, dan fungsi peralatan yang dikembalikan.',
                    ],
                    [
                        'Memastikan jumlah dan kelengkapan peralatan sesuai dengan daftar peminjaman.',
                        'Memverifikasi kesesuaian jumlah dan kelengkapan alat dengan data peminjaman.',
                    ],
                    [
                        'Melaporkan apabila terdapat kerusakan, kehilangan, atau gangguan fungsi alat selama digunakan.',
                        'Mencatat kondisi alat, termasuk kerusakan atau kehilangan, dalam buku atau sistem inventaris.',
                    ],
                    [
                        'Menyerahkan alat secara langsung kepada PLP dan tidak meninggalkannya tanpa konfirmasi.',
                        'Memberikan konfirmasi bahwa pengembalian telah selesai dan mencatat tanggal pengembalian.',
                    ],
                    [
                        'Bertanggung jawab atas kerusakan atau kehilangan yang terjadi akibat kelalaian selama penggunaan sesuai ketentuan laboratorium.',
                        'Melakukan pembersihan lanjutan, perawatan ringan, atau mengusulkan perbaikan apabila ditemukan kerusakan.',
                    ],
                    [
                        'Memastikan meja praktikum dan area kerja dalam keadaan bersih dan rapi sebelum meninggalkan laboratorium.',
                        'Menyimpan kembali peralatan pada tempat penyimpanan yang sesuai sehingga siap digunakan untuk praktikum berikutnya.',
                    ],
                ],
            },
        },
        {
            judul: '4.5 Sanksi',
            teks: 'Sanksi pelanggaran proses peminjaman dan pengembalian peralatan praktikum.',
            butir: [
                'Mahasiswa yang tidak mengikuti prosedur peminjaman tidak diperkenankan meminjam atau menggunakan peralatan laboratorium.',
                'Keterlambatan pengembalian peralatan tanpa alasan yang dapat dipertanggungjawabkan dikenai teguran dan dapat dikenakan pembatasan hak peminjaman pada kegiatan berikutnya sesuai kebijakan laboratorium.',
                'Mahasiswa yang mengembalikan peralatan dalam keadaan kotor atau tidak lengkap wajib membersihkan atau melengkapi peralatan sebelum proses pengembalian dinyatakan selesai.',
                'Kerusakan peralatan akibat kelalaian atau penggunaan yang tidak sesuai SOP menjadi tanggung jawab peminjam dan wajib diselesaikan sesuai ketentuan yang berlaku, misalnya melalui perbaikan atau penggantian alat.',
                'Kehilangan peralatan akibat kelalaian menjadi tanggung jawab peminjam dan wajib mengganti peralatan dengan spesifikasi yang sama atau sesuai ketentuan laboratorium.',
                'Mahasiswa yang meminjamkan atau memindahtangankan peralatan kepada pihak lain tanpa izin dikenai teguran tertulis dan dapat dicabut hak peminjaman sementara.',
                'Pelanggaran berulang terhadap tata tertib laboratorium dapat mengakibatkan penangguhan keikutsertaan dalam praktikum hingga kewajiban peminjam diselesaikan.',
                'Apabila pelanggaran melibatkan unsur kesengajaan, penyalahgunaan fasilitas, atau menyebabkan kerugian yang besar, kasus dapat dilaporkan kepada Kepala Laboratorium dan Program Studi untuk diproses sesuai peraturan akademik yang berlaku.',
            ],
        },
    ],
};

export const sopUnits: SopUnit[] = [
    {
        id: 'dasar',
        label: 'Fisika Dasar',
        nama: 'Laboratorium Fisika Dasar',
        singkat: 'Pedoman praktikum dan penelitian di laboratorium fisika dasar.',
        kelengkapan: 'lengkap',
        bagian: [
            {
                judul: '1. Tujuan SOP',
                teks: 'SOP Laboratorium Fisika bertujuan untuk memberikan pedoman pelaksanaan praktikum dan penelitian secara aman, tertib, efektif, dan efisien, menjamin keselamatan kerja, menjaga kualitas hasil praktikum, serta melindungi peralatan laboratorium dari kerusakan akibat penggunaan yang tidak sesuai prosedur.',
            },
            {
                judul: '2. Fungsi dan Tujuan Laboratorium',
                butir: [
                    'Menjamin keselamatan kerja (K3) bagi mahasiswa, dosen, laboran, dan seluruh pengguna laboratorium.',
                    'Menyeragamkan tata cara kerja sehingga setiap praktikum dan penelitian dilakukan sesuai prosedur yang benar.',
                    'Mencegah kecelakaan kerja serta mengurangi risiko kerusakan alat dan bahan laboratorium.',
                    'Menjaga kualitas hasil praktikum dan penelitian agar data yang diperoleh akurat dan dapat dipertanggungjawabkan.',
                    'Meningkatkan efisiensi penggunaan laboratorium, termasuk penggunaan alat, bahan, dan waktu.',
                    'Menjaga kebersihan, ketertiban, dan keamanan laboratorium sehingga lingkungan kerja tetap nyaman.',
                    'Menjadi pedoman bagi seluruh pengguna laboratorium dalam melaksanakan hak, kewajiban, serta tanggung jawab selama berada di laboratorium.',
                ],
            },
            {
                judul: '3. Tata Tertib Laboratorium',
                anak: [
                    {
                        judul: 'Mahasiswa',
                        butir: [
                            'Hadir tepat waktu sesuai jadwal praktikum.',
                            'Menggunakan pakaian yang rapi, sopan, dan memakai sepatu tertutup.',
                            'Memakai alat pelindung diri (APD) sesuai kebutuhan praktikum.',
                            'Membaca modul praktikum sebelum kegiatan dimulai.',
                            'Mengikuti seluruh arahan dosen dan PLP/teknisi laboratorium.',
                            'Tidak makan, minum, merokok, atau bercanda berlebihan di dalam laboratorium.',
                            'Menggunakan alat dan bahan sesuai petunjuk praktikum.',
                            'Tidak menghidupkan atau memindahkan alat tanpa izin.',
                            'Menjaga kebersihan dan kerapian meja praktikum.',
                            'Segera melaporkan kerusakan alat, kecelakaan, atau kondisi berbahaya kepada dosen atau PLP.',
                            'Mengembalikan alat dan bahan ke tempat semula setelah praktikum selesai.',
                            'Bertanggung jawab atas alat yang digunakan selama praktikum.',
                        ],
                    },
                    {
                        judul: 'Dosen',
                        butir: [
                            'Memastikan praktikum dilaksanakan sesuai SOP laboratorium.',
                            'Memberikan pengarahan mengenai prosedur kerja dan keselamatan sebelum praktikum dimulai.',
                            'Mengawasi jalannya praktikum dan memastikan mahasiswa mematuhi tata tertib.',
                            'Berkoordinasi dengan PLP/teknisi mengenai kesiapan alat dan bahan.',
                            'Menghentikan kegiatan apabila ditemukan kondisi yang membahayakan keselamatan.',
                            'Melaporkan kerusakan alat atau kejadian kecelakaan kepada pengelola laboratorium.',
                            'Memastikan seluruh kegiatan praktikum selesai dengan aman dan tertib.',
                        ],
                    },
                    {
                        judul: 'PLP/Teknisi Laboratorium',
                        butir: [
                            'Menyiapkan alat, bahan, dan ruang laboratorium sebelum praktikum dimulai.',
                            'Memastikan seluruh peralatan dalam kondisi baik dan layak digunakan.',
                            'Melakukan pemeriksaan, kalibrasi, dan pemeliharaan alat secara berkala.',
                            'Memberikan penjelasan penggunaan alat kepada dosen atau mahasiswa bila diperlukan.',
                            'Mengawasi penggunaan alat agar sesuai prosedur.',
                            'Mencatat peminjaman, penggunaan, dan pengembalian alat laboratorium.',
                            'Menangani dan melaporkan kerusakan alat serta melakukan perbaikan jika memungkinkan.',
                            'Menjaga kebersihan, keamanan, dan ketertiban laboratorium.',
                            'Menyimpan alat dan bahan sesuai standar keselamatan.',
                            'Memastikan listrik, gas, air, dan peralatan laboratorium dalam kondisi aman setelah kegiatan selesai.',
                        ],
                    },
                ],
            },
            mekanismeDanSanksi,
        ],
    },
    {
        id: 'elektronika',
        label: 'Elektronika',
        nama: 'Laboratorium Elektronika',
        singkat:
            'Pedoman penggunaan avometer, function generator, osiloskop, dan Arduino.',
        kelengkapan: 'sebagian',
        catatan:
            'Pada dokumen sumber, bagian "Tata Tertib Laboratorium" baru memuat ketentuan untuk PLP/Teknisi. Ketentuan untuk mahasiswa dan dosen belum diisi.',
        bagian: [
            {
                judul: '1. Tujuan SOP',
                teks: 'SOP Penggunaan Alat Elektronika bertujuan untuk:',
                butir: [
                    'Menjadi pedoman bagi mahasiswa, dosen, dan PLP/teknisi dalam menggunakan peralatan elektronika, seperti avometer (multimeter), Function Generator (AFG), osiloskop, dan Arduino, secara benar, aman, dan sesuai prosedur.',
                    'Menjamin keselamatan kerja (K3) selama pengoperasian peralatan elektronika dan pelaksanaan praktikum.',
                    'Mencegah kerusakan alat akibat kesalahan pemasangan, pengukuran, atau pengoperasian.',
                    'Menjamin keakuratan hasil pengukuran dan pengujian rangkaian elektronika.',
                    'Memastikan setiap alat digunakan sesuai fungsi, spesifikasi teknis, dan petunjuk operasional dari pabrikan.',
                    'Menjaga kondisi, keandalan, dan umur pakai peralatan melalui penggunaan serta penanganan yang tepat.',
                    'Meningkatkan disiplin dan tanggung jawab pengguna dalam memanfaatkan fasilitas laboratorium.',
                    'Menyeragamkan prosedur penggunaan, pemeriksaan, dan penyimpanan peralatan setelah digunakan.',
                    'Mendukung kelancaran kegiatan praktikum, penelitian, dan pengabdian kepada masyarakat yang menggunakan peralatan elektronika.',
                    'Mewujudkan pengelolaan Laboratorium Elektronika yang aman, tertib, efisien, dan sesuai dengan standar mutu laboratorium.',
                ],
            },
            {
                judul: '2. Fungsi dan Tujuan Laboratorium',
                teks: 'Laboratorium Elektronika berfungsi sebagai:',
                butir: [
                    'Sarana pembelajaran praktikum untuk mendukung mata kuliah Elektronika Dasar I (Analog) dan Elektronika Dasar II (Digital).',
                    'Tempat mahasiswa menerapkan konsep dan teori elektronika yang dipelajari di kelas ke dalam kegiatan praktikum.',
                    'Fasilitas untuk melakukan pengukuran, pengujian, perakitan, dan analisis rangkaian elektronika menggunakan berbagai instrumen, seperti multimeter (avometer), osiloskop, function generator (AFG), catu daya (power supply), dan Arduino.',
                    'Sarana pengembangan keterampilan penggunaan alat ukur dan instrumen elektronika sesuai standar laboratorium.',
                    'Tempat pelaksanaan penelitian, pengembangan, dan proyek elektronika bagi dosen dan mahasiswa.',
                    'Wadah pembentukan budaya kerja laboratorium yang mengutamakan keselamatan kerja (K3), ketelitian, disiplin, dan tanggung jawab.',
                ],
                anak: [
                    {
                        judul: 'Tujuan Laboratorium Elektronika',
                        butir: [
                            'Mendukung pencapaian capaian pembelajaran mata kuliah Elektronika Dasar I (Analog) dan Elektronika Dasar II (Digital).',
                            'Meningkatkan pemahaman mahasiswa terhadap prinsip kerja komponen dan rangkaian elektronika melalui kegiatan praktikum.',
                            'Melatih keterampilan mahasiswa dalam menggunakan alat ukur dan alat uji elektronika secara benar, aman, dan sesuai SOP.',
                            'Mengembangkan kemampuan mahasiswa dalam merancang, merakit, menguji, dan menganalisis rangkaian elektronika analog maupun digital.',
                            'Menumbuhkan kemampuan pemecahan masalah (problem solving) berdasarkan hasil pengukuran dan analisis praktikum.',
                            'Membiasakan mahasiswa bekerja secara sistematis, teliti, disiplin, dan bertanggung jawab terhadap penggunaan peralatan laboratorium.',
                            'Mendukung pelaksanaan praktikum, penelitian, tugas akhir, dan kegiatan akademik lainnya yang berkaitan dengan bidang elektronika.',
                            'Menghasilkan lulusan yang memiliki kompetensi teoritis dan keterampilan praktis di bidang elektronika analog dan digital sesuai kebutuhan pendidikan, penelitian, dan dunia kerja.',
                        ],
                    },
                ],
            },
            {
                judul: '3. Tata Tertib Laboratorium',
                anak: [
                    {
                        judul: 'PLP/Teknisi Laboratorium',
                        butir: [
                            'Menyiapkan alat, bahan, dan ruang laboratorium sebelum praktikum dimulai.',
                            'Memastikan seluruh peralatan dalam kondisi baik dan layak digunakan.',
                            'Melakukan pemeriksaan, kalibrasi, dan pemeliharaan alat secara berkala.',
                            'Memberikan penjelasan penggunaan alat kepada dosen atau mahasiswa bila diperlukan.',
                            'Mengawasi penggunaan alat agar sesuai prosedur.',
                            'Mencatat peminjaman, penggunaan, dan pengembalian alat laboratorium.',
                            'Menangani dan melaporkan kerusakan alat serta melakukan perbaikan jika memungkinkan.',
                            'Menjaga kebersihan, keamanan, dan ketertiban laboratorium.',
                            'Menyimpan alat dan bahan sesuai standar keselamatan.',
                            'Memastikan listrik, gas, air, dan peralatan laboratorium dalam kondisi aman setelah kegiatan selesai.',
                        ],
                    },
                    {
                        judul: 'Mahasiswa',
                        draf: 'Ketentuan tata tertib untuk mahasiswa belum diisi pada dokumen sumber.',
                    },
                    {
                        judul: 'Dosen',
                        draf: 'Ketentuan tata tertib untuk dosen belum diisi pada dokumen sumber.',
                    },
                ],
            },
            mekanismeDanSanksi,
        ],
    },
    {
        id: 'lanjut',
        label: 'Fisika Lanjut',
        nama: 'Laboratorium Fisika Lanjut / Fisika Modern',
        singkat:
            'Pedoman instrumen presisi: Tetes Minyak Millikan, Fabry–Perot, Cincin Newton, Spectrum Analyzer, Spektrofotometer, dan Teleskop.',
        kelengkapan: 'sebagian',
        catatan:
            'Baru bagian tujuan dan fungsi yang terisi. Tata tertib, mekanisme pelaksanaan, dan sanksi masih berupa catatan pengisian pada dokumen sumber.',
        bagian: [
            {
                judul: '1. Tujuan SOP',
                butir: [
                    'Menjadi pedoman bagi mahasiswa, dosen, dan PLP/teknisi dalam menggunakan peralatan praktikum fisika modern dan fisika lanjutan secara benar, aman, dan sesuai prosedur.',
                    'Menjamin keselamatan kerja selama pengoperasian alat-alat laboratorium.',
                    'Mencegah kerusakan peralatan akibat kesalahan penggunaan, pemasangan, atau pengoperasian.',
                    'Menjamin keakuratan dan ketelitian hasil pengamatan, pengukuran, dan analisis praktikum.',
                    'Menjaga kondisi, fungsi, dan umur pakai peralatan laboratorium agar tetap siap digunakan.',
                    'Menyeragamkan prosedur penggunaan, pemeliharaan, dan penyimpanan alat setelah praktikum selesai.',
                    'Mendukung kelancaran pelaksanaan praktikum, penelitian, dan kegiatan akademik di bidang fisika modern dan fisika lanjutan.',
                    'Meningkatkan disiplin, tanggung jawab, dan keterampilan mahasiswa dalam menggunakan instrumen ilmiah.',
                    'Mendukung pengelolaan laboratorium yang tertib, aman, efisien, dan sesuai standar mutu laboratorium.',
                ],
            },
            {
                judul: '2. Fungsi dan Tujuan Laboratorium',
                butir: [
                    'Pedoman operasional bagi mahasiswa, dosen, dan PLP/teknisi dalam menggunakan peralatan laboratorium secara benar, aman, dan sesuai prosedur.',
                    'Standar pelaksanaan praktikum agar seluruh kegiatan praktikum fisika modern dan fisika lanjutan dilaksanakan secara seragam dan sesuai dengan petunjuk penggunaan alat.',
                    'Pedoman keselamatan kerja (K3) untuk meminimalkan risiko kecelakaan, terutama pada penggunaan alat optik, elektronik, dan instrumen presisi.',
                    'Pedoman pengoperasian instrumen, seperti Milikan (Percobaan Tetes Minyak Millikan), Fabry–Perot Interferometer, Cincin Newton, Spectrum Analyzer, Spektrofotometer, Teleskop, serta alat hasil Proyek Teknik Laboratorium.',
                    'Pedoman pemeliharaan peralatan, sehingga alat tetap dalam kondisi baik, terawat, dan memiliki umur pakai yang optimal.',
                    'Pedoman pengendalian mutu praktikum, sehingga hasil pengukuran dan pengamatan memiliki ketelitian, akurasi, dan dapat dipertanggungjawabkan.',
                    'Pedoman pengelolaan administrasi laboratorium, termasuk penggunaan, pencatatan, pelaporan, serta penyimpanan peralatan setelah digunakan.',
                    'Pedoman pengembangan kompetensi mahasiswa, melalui penggunaan instrumen ilmiah sesuai standar yang berlaku di laboratorium.',
                    'Pedoman pendukung kegiatan penelitian dan tugas akhir, sehingga penggunaan instrumen laboratorium sesuai prosedur dan menghasilkan data yang valid.',
                    'Pedoman perlindungan aset laboratorium, dengan mengurangi risiko kerusakan, kehilangan, maupun penyalahgunaan peralatan laboratorium.',
                ],
            },
            {
                judul: '3. Tata Tertib Laboratorium',
                draf: 'Belum diisi pada dokumen sumber. Perlu ditetapkan ketentuan bagi mahasiswa, dosen, dan PLP/teknisi.',
            },
            {
                judul: '4. Mekanisme Pelaksanaan Praktikum',
                draf: 'Belum diisi pada dokumen sumber, mencakup pelaksanaan praktikum, peminjaman, pengembalian peralatan, dan sanksi.',
            },
        ],
    },
    {
        id: 'elf',
        label: 'ELF',
        nama: 'Laboratorium ELF',
        singkat:
            'Pedoman kegiatan praktikum, penelitian, dan pengabdian di Laboratorium ELF.',
        kelengkapan: 'sebagian',
        catatan:
            'Baru bagian tujuan yang terisi. Fungsi laboratorium, tata tertib, mekanisme, dan sanksi masih berupa catatan pengisian pada dokumen sumber.',
        bagian: [
            {
                judul: '1. Tujuan SOP',
                teks: 'SOP Laboratorium ELF disusun dengan tujuan untuk:',
                butir: [
                    'Menjadi pedoman bagi mahasiswa, dosen, PLP (Pranata Laboratorium Pendidikan), teknisi, dan pengguna laboratorium dalam melaksanakan kegiatan praktikum, penelitian, dan pengabdian kepada masyarakat secara tertib dan sesuai prosedur.',
                    'Menjamin keselamatan dan kesehatan kerja (K3) bagi seluruh pengguna laboratorium selama menggunakan peralatan dan fasilitas laboratorium.',
                    'Menyeragamkan prosedur penggunaan, peminjaman, pengoperasian, pemeliharaan, dan pengembalian peralatan laboratorium.',
                    'Menjamin penggunaan peralatan laboratorium sesuai fungsi, spesifikasi teknis, dan petunjuk operasional sehingga menghasilkan data yang akurat dan dapat dipertanggungjawabkan.',
                    'Mencegah kerusakan, kehilangan, dan penyalahgunaan peralatan laboratorium melalui penerapan prosedur yang baku.',
                    'Menjaga kebersihan, keamanan, ketertiban, dan kelayakan fasilitas laboratorium.',
                    'Meningkatkan efektivitas dan efisiensi penyelenggaraan kegiatan praktikum, penelitian, dan pengembangan di Laboratorium ELF.',
                    'Mendukung pencapaian capaian pembelajaran mata kuliah yang menggunakan Laboratorium ELF, seperti Elektronika Dasar, Fisika Dasar, Fisika Modern, Instrumentasi, dan mata kuliah praktikum lainnya.',
                    'Menjadi dasar pelaksanaan pengelolaan laboratorium yang sesuai dengan sistem penjaminan mutu di perguruan tinggi.',
                    'Mewujudkan tata kelola Laboratorium ELF yang profesional, akuntabel, dan berorientasi pada peningkatan mutu pendidikan, penelitian, dan layanan laboratorium.',
                ],
            },
            {
                judul: '2. Fungsi dan Tujuan Laboratorium',
                draf: 'Belum diisi pada dokumen sumber.',
            },
            {
                judul: '3. Tata Tertib Laboratorium',
                draf: 'Belum diisi pada dokumen sumber. Perlu ditetapkan ketentuan bagi mahasiswa, dosen, dan PLP/teknisi.',
            },
            {
                judul: '4. Mekanisme Pelaksanaan Praktikum',
                draf: 'Belum diisi pada dokumen sumber, mencakup pelaksanaan praktikum, peminjaman, pengembalian peralatan, dan sanksi.',
            },
        ],
    },
];

/** Bagian umum yang berlaku lintas unit, dikutip dari SOP Fisika Dasar. */
export const ketentuanPeminjaman = {
    judul: 'Ringkasan ketentuan peminjaman',
    butir: [
        'Peminjaman hanya dapat diajukan oleh pengguna yang akunnya aktif — akun yang ditangguhkan atau diblokir tidak dapat membuat pengajuan baru (BR-3).',
        'Peminjaman untuk Mahasiswa dibatasi maksimal 7 hari kalender (REQ-14).',
        'Ruangan tidak dapat dibooking bila jadwalnya bentrok dengan peminjaman lain pada rentang waktu yang sama (REQ-13).',
        'Pengajuan dapat dibatalkan sendiri oleh pemohon selama barang belum diserahkan (BR-5).',
        'Kerusakan atau kehilangan akibat kelalaian menjadi tanggung jawab peminjam, termasuk perbaikan atau penggantian alat.',
        'Alat tidak boleh dipindahtangankan kepada pihak lain tanpa izin laboratorium.',
    ],
};
