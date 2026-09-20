import { Head } from '@inertiajs/react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { useState } from 'react';

import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { sopPdf } from '@/lib/sop';
import { cn } from '@/lib/utils';
import { dashboard, prosedur } from '@/routes';
import type { UnitLab } from '@/types';
import { ketentuanPeminjaman, sopUnits } from './sop-content';
import type { SopNode } from './sop-content';

/**
 * Pertanyaan umum yang relevan dengan produk. Setiap jawaban merujuk aturan
 * yang benar-benar berlaku di sistem, bukan penjelasan umum.
 */
const faq = [
    {
        tanya: 'Bagaimana alur peminjaman alat dan ruangan?',
        jawab: 'Buka halaman Katalog, pilih alat atau ruangan, lalu masukkan ke keranjang. Setelah rentang tanggal dan jam diisi, ajukan peminjaman. Pengajuan diverifikasi staf laboratorium per item — sebagian item dapat disetujui sementara item lain ditolak.',
    },
    {
        tanya: 'Berapa lama batas waktu peminjaman?',
        jawab: 'Peminjaman oleh Mahasiswa dibatasi maksimal 7 hari kalender (REQ-14). Peminjaman oleh peran lain tidak dibatasi oleh sistem.',
    },
    {
        tanya: 'Mengapa saya tidak bisa mengajukan peminjaman?',
        jawab: 'Akun berstatus ditangguhkan atau diblokir tidak dapat membuat pengajuan baru (BR-3). Hubungi Administrator untuk mengaktifkan kembali akun Anda.',
    },
    {
        tanya: 'Bagaimana cara membatalkan pengajuan?',
        jawab: 'Pembatalan mandiri tersedia pada halaman Riwayat, selama alat belum diserahkan (BR-5). Setelah berstatus dipinjam, pengajuan tidak dapat dibatalkan sendiri.',
    },
    {
        tanya: 'Bagaimana bila alat rusak atau hilang?',
        jawab: 'Kerusakan atau kehilangan akibat kelalaian menjadi tanggung jawab peminjam, termasuk perbaikan atau penggantian alat sesuai ketentuan laboratorium.',
    },
    {
        tanya: 'Apakah tarif sewa ditampilkan untuk semua pengguna?',
        jawab: 'Tarif hanya ditampilkan kepada Admin, KaLab, PLP, dan pengguna eksternal. Civitas UNEJ tidak dikenakan biaya (BR-2).',
    },
];

/** Render satu bagian SOP; bersarang mengikuti struktur dokumen asli. */
function SopBagian({ node, tingkat = 0 }: { node: SopNode; tingkat?: number }) {
    return (
        <section
            className={cn(
                'space-y-3',
                tingkat > 0 && 'border-border border-l-2 pl-4',
            )}
        >
            <h3
                className={cn(
                    'font-medium',
                    tingkat === 0
                        ? 'text-[#1D3557] dark:text-foreground text-base'
                        : 'text-[#0F1E30] dark:text-foreground text-sm',
                )}
            >
                {node.judul}
            </h3>

            {node.teks && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {node.teks}
                </p>
            )}

            {node.draf && (
                <p className="border-warning/30 bg-warning/10 rounded-md border px-3 py-2 text-xs text-[#8A5A14] dark:text-warning">
                    {node.draf}
                </p>
            )}

            {node.butir && (
                <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
                    {node.butir.map((butir) => (
                        <li key={butir}>{butir}</li>
                    ))}
                </ol>
            )}

            {node.tabel && (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="px-3 py-2 font-medium">
                                    {node.tabel.kepala[0]}
                                </th>
                                <th className="px-3 py-2 font-medium">
                                    {node.tabel.kepala[1]}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {node.tabel.baris.map((baris, i) => (
                                <tr
                                    key={baris[0]}
                                    className={cn(
                                        'border-b last:border-b-0',
                                        i % 2 === 1 && 'bg-muted/25',
                                    )}
                                >
                                    <td className="px-3 py-2 align-top leading-relaxed">
                                        {baris[0]}
                                    </td>
                                    <td className="px-3 py-2 align-top leading-relaxed">
                                        {baris[1]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {node.anak && (
                <div className="space-y-5">
                    {node.anak.map((anak) => (
                        <SopBagian
                            key={anak.judul}
                            node={anak}
                            tingkat={tingkat + 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function KartuUnduh() {
    return (
        <div className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
            <div className="flex items-start gap-3">
                <span className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <FileText className="text-primary size-5" />
                </span>
                <div>
                    <p className="text-sm font-medium">{sopPdf.judul}</p>
                    <p className="text-muted-foreground text-xs">
                        {sopPdf.keterangan}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        {sopPdf.meta}
                    </p>
                </div>
            </div>
            <Button asChild>
                <a
                    href={sopPdf.url}
                    download={sopPdf.namaBerkas}
                    aria-label={`Unduh ${sopPdf.judul} (PDF)`}
                >
                    <Download /> Unduh PDF
                </a>
            </Button>
        </div>
    );
}

export default function Prosedur() {
    const [unitAktif, setUnitAktif] = useState<UnitLab>('dasar');
    const unit = sopUnits.find((u) => u.id === unitAktif) ?? sopUnits[0];
    const jumlahDraf = sopUnits.filter(
        (u) => u.kelengkapan === 'sebagian',
    ).length;

    return (
        <>
            <Head title="Prosedur & FAQ" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">
                        Prosedur & FAQ
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        SOP laboratorium, ringkasan ketentuan peminjaman, dan
                        pertanyaan umum (ADM-26, DSN-09, MHS-07, EKS-08).
                    </p>
                </header>

                <KartuUnduh />

                <section className="bg-card space-y-3 rounded-xl border p-4">
                    <h2 className="text-[#1D3557] dark:text-foreground text-base font-medium">
                        {ketentuanPeminjaman.judul}
                    </h2>
                    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                        {ketentuanPeminjaman.butir.map((butir) => (
                            <li key={butir}>{butir}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-[#1D3557] dark:text-foreground text-base font-medium">
                                SOP per unit laboratorium
                            </h2>
                            <p className="text-muted-foreground text-xs">
                                Empat unit laboratorium, masing-masing dengan
                                SOP penggunaan alatnya sendiri.
                            </p>
                        </div>
                        {jumlahDraf > 0 && (
                            <StatusBadge
                                label={`${jumlahDraf} unit masih draf`}
                                tone="warning"
                            />
                        )}
                    </div>

                    <div
                        className="flex flex-wrap gap-2"
                        role="tablist"
                        aria-label="Unit laboratorium"
                    >
                        {sopUnits.map((u) => (
                            <button
                                key={u.id}
                                role="tab"
                                aria-selected={unitAktif === u.id}
                                onClick={() => setUnitAktif(u.id)}
                                className={cn(
                                    'focus-visible:ring-ring/50 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                    unitAktif === u.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )}
                            >
                                {u.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-card space-y-6 rounded-xl border p-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-medium">
                                    {unit.nama}
                                </h2>
                                <StatusBadge
                                    label={
                                        unit.kelengkapan === 'lengkap'
                                            ? 'SOP lengkap'
                                            : 'Sebagian masih draf'
                                    }
                                    tone={
                                        unit.kelengkapan === 'lengkap'
                                            ? 'success'
                                            : 'warning'
                                    }
                                />
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {unit.singkat}
                            </p>
                            {unit.catatan && (
                                <p className="border-warning/30 bg-warning/10 rounded-md border px-3 py-2 text-xs text-[#8A5A14] dark:text-warning">
                                    {unit.catatan}
                                </p>
                            )}
                        </div>

                        <div className="space-y-6">
                            {unit.bagian.map((bagian) => (
                                <SopBagian key={bagian.judul} node={bagian} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-[#1D3557] dark:text-foreground text-base font-medium">
                        Pertanyaan umum
                    </h2>
                    <div className="bg-card divide-y rounded-xl border">
                        {faq.map((item) => (
                            <Collapsible key={item.tanya}>
                                <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium hover:underline">
                                    {item.tanya}
                                    <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="text-muted-foreground px-4 pb-4 text-sm leading-relaxed">
                                    {item.jawab}
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

Prosedur.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Prosedur', href: prosedur() },
    ],
};
