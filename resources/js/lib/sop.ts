/**
 * Dokumen SOP resmi Laboratorium Pendidikan Fisika FKIP UNEJ.
 *
 * Satu berkas PDF memuat empat SOP unit laboratorium sekaligus
 * (Fisika Dasar, Elektronika, Fisika Lanjut, dan ELF).
 *
 * Berkas diletakkan di `public/docs/` sehingga dapat diunduh langsung tanpa
 * autentikasi — halaman yang menautkannya memang publik (BR-7), jadi tidak
 * diperlukan route pengunduhan khusus. Berkas statis dilayani langsung oleh
 * web server, tidak melewati front controller Laravel.
 */
export const sopPdf = {
    judul: 'SOP Penggunaan Alat',
    keterangan: 'Fisika Dasar, Elektronika, Lanjut & ELF',
    meta: 'PDF · 14 halaman · 4 unit lab',
    namaBerkas: 'SOP-Laboratorium-Fisika.pdf',
    url: '/docs/SOP-Laboratorium-Fisika.pdf',
};
