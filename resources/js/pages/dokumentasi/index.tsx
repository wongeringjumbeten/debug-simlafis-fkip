import { Head } from '@inertiajs/react';
import { dashboard, dokumentasi } from '@/routes';

export default function Dokumentasi() {
    return (
        <>
            <Head title="Dokumentasi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">Dokumentasi & Pelaporan</h1>
                    <p className="text-sm text-muted-foreground">
                        Dokumentasi kegiatan, laporan maintenance/kalibrasi, dan laporan keuangan (ADM-23 s.d. ADM-25,
                        PLP-11, PLP-12, KLB-10).
                    </p>
                </header>

                <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                    <p className="text-sm font-medium">Repositori dokumentasi segera tersedia</p>
                    <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
                        Unggah berkas dan ekspor laporan (PDF/Excel) menyusul setelah modul dokumentasi tersambung ke
                        backend (REQ-22, REQ-23, REQ-27, REQ-28).
                    </p>
                </div>
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
