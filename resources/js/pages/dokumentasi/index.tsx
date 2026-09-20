import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    FileArchive,
    FileBarChart,
    FileText,
    FolderOpen,
    HardHat,
    Upload,
    Wrench,
} from 'lucide-react';

import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { sopPdf } from '@/lib/sop';
import { dashboard, dokumentasi, prosedur } from '@/routes';

const modulDokumentasi = [
    {
        judul: 'Dokumentasi kegiatan',
        deskripsi:
            'Simpan dokumentasi praktikum, penelitian, dan kegiatan laboratorium dalam satu repositori.',
        icon: FolderOpen,
        rujukan: 'ADM-23 · REQ-22',
        kebutuhan: 'Daftar dokumen dan unggah berkas',
    },
    {
        judul: 'Maintenance & kalibrasi',
        deskripsi:
            'Catat pemeriksaan, pemeliharaan, kalibrasi, dan tindak lanjut peralatan laboratorium.',
        icon: Wrench,
        rujukan: 'PLP-11/12 · REQ-23',
        kebutuhan: 'Riwayat peralatan dan unggah laporan',
    },
    {
        judul: 'Pelaporan & ekspor',
        deskripsi:
            'Siapkan laporan kegiatan dan ringkasan keuangan dalam format yang dapat dibagikan.',
        icon: FileBarChart,
        rujukan: 'ADM-24/25 · REQ-27/28',
        kebutuhan: 'Generator laporan PDF/Excel',
    },
];

/**
 * Halaman persiapan dokumentasi Sprint 1.
 *
 * Backend repositori dan ekspor belum tersedia, jadi halaman ini sengaja tidak
 * menyediakan unggah palsu. Sebagai gantinya, pengguna melihat cakupan modul,
 * ketergantungan yang sedang disiapkan, serta dokumen SOP yang memang sudah
 * tersedia untuk diunduh.
 */
export default function Dokumentasi() {
    return (
        <>
            <Head title="Dokumentasi & Pelaporan" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[28px] leading-tight font-semibold">
                            Dokumentasi & Pelaporan
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Pusat dokumentasi kegiatan, pemeliharaan peralatan,
                            dan laporan laboratorium.
                        </p>
                    </div>
                    <StatusBadge
                        label="Modul sedang disiapkan"
                        tone="warning"
                    />
                </header>

                <section className="grid gap-4 lg:grid-cols-3">
                    {modulDokumentasi.map(
                        ({
                            judul,
                            deskripsi,
                            icon: Icon,
                            rujukan,
                            kebutuhan,
                        }) => (
                            <article
                                key={judul}
                                className="bg-card flex min-h-52 flex-col rounded-xl border p-4"
                            >
                                <span className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                                    <Icon className="text-primary size-5" />
                                </span>
                                <h2 className="mt-4 font-medium text-[#1D3557] dark:text-foreground">
                                    {judul}
                                </h2>
                                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                    {deskripsi}
                                </p>
                                <div className="mt-auto pt-4">
                                    <p className="text-muted-foreground text-xs">
                                        {kebutuhan}
                                    </p>
                                    <p className="text-muted-foreground mt-1 font-mono text-[11px]">
                                        {rujukan}
                                    </p>
                                </div>
                            </article>
                        ),
                    )}
                </section>

                <section className="grid gap-4 lg:grid-cols-5">
                    <div className="bg-card rounded-xl border p-4 lg:col-span-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                                    <Upload className="text-muted-foreground size-5" />
                                </span>
                                <div>
                                    <h2 className="font-medium text-[#1D3557] dark:text-foreground">
                                        Repositori dokumen
                                    </h2>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Unggah dokumen akan tersedia setelah
                                        repositori terhubung ke backend.
                                    </p>
                                </div>
                            </div>
                            <Button disabled aria-describedby="unggah-keterangan">
                                <Upload /> Unggah dokumen
                            </Button>
                        </div>

                        <div
                            id="unggah-keterangan"
                            className="border-muted-foreground/30 mt-5 rounded-lg border-2 border-dashed px-6 py-10 text-center"
                        >
                            <HardHat className="text-muted-foreground mx-auto size-7" />
                            <p className="mt-3 text-sm font-medium">
                                Repositori sedang disiapkan
                            </p>
                            <p className="text-muted-foreground mx-auto mt-1 max-w-lg text-xs leading-relaxed">
                                Tim backend sedang menyiapkan daftar dokumen,
                                unggah berkas, penghapusan terotorisasi, dan
                                ekspor laporan. Tidak ada file yang diunggah
                                atau disimpan dari halaman ini saat ini.
                            </p>
                        </div>
                    </div>

                    <aside className="bg-card flex flex-col rounded-xl border p-4 lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <FileArchive className="text-primary size-4" />
                            <h2 className="font-medium text-[#1D3557] dark:text-foreground">
                                Dokumen tersedia
                            </h2>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Panduan yang dapat digunakan sekarang.
                        </p>

                        <div className="mt-4 rounded-lg border p-3">
                            <div className="flex items-start gap-3">
                                <FileText className="text-primary mt-0.5 size-4 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        {sopPdf.judul}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {sopPdf.keterangan}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-[11px]">
                                        {sopPdf.meta}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-2 pt-4">
                            <Button variant="secondary" size="sm" asChild>
                                <a
                                    href={sopPdf.url}
                                    download={sopPdf.namaBerkas}
                                >
                                    <FileText /> Unduh SOP
                                </a>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={prosedur()}>
                                    Lihat panduan <ArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </aside>
                </section>

                <section className="bg-card rounded-xl border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="font-medium text-[#1D3557] dark:text-foreground">
                                Persiapan integrasi
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Komponen front-end sudah disiapkan agar dapat
                                langsung terhubung ketika kontrak backend siap.
                            </p>
                        </div>
                        <CalendarDays className="text-muted-foreground size-5" />
                    </div>
                    <ol className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                        <li className="bg-muted/40 rounded-lg p-3">
                            <span className="text-primary font-mono text-xs">
                                01
                            </span>
                            <p className="mt-1 font-medium">
                                Daftar & filter dokumen
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                                Kategori kegiatan, maintenance, kalibrasi, dan
                                keuangan.
                            </p>
                        </li>
                        <li className="bg-muted/40 rounded-lg p-3">
                            <span className="text-primary font-mono text-xs">
                                02
                            </span>
                            <p className="mt-1 font-medium">
                                Unggah & pengelolaan
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                                Validasi berkas, status unggahan, dan hak hapus
                                sesuai peran.
                            </p>
                        </li>
                        <li className="bg-muted/40 rounded-lg p-3">
                            <span className="text-primary font-mono text-xs">
                                03
                            </span>
                            <p className="mt-1 font-medium">Ekspor laporan</p>
                            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                                Laporan kegiatan dan keuangan dalam format PDF
                                atau Excel.
                            </p>
                        </li>
                    </ol>
                </section>
            </div>
        </>
    );
}

Dokumentasi.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Dokumentasi', href: dokumentasi() },
    ],
};
