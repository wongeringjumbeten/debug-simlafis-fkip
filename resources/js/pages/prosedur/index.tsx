import { Head } from '@inertiajs/react';
import { dashboard, prosedur } from '@/routes';

export default function Prosedur() {
    return (
        <>
            <Head title="Prosedur & FAQ" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">Prosedur & FAQ</h1>
                    <p className="text-sm text-muted-foreground">
                        SOP laboratorium, ringkasan persyaratan peminjaman, dan FAQ (ADM-26, DSN-09, MHS-07, EKS-08).
                    </p>
                </header>

                <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                    <p className="text-sm font-medium">Konten prosedur akan dilengkapi</p>
                    <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
                        Halaman informasi statis (REQ-29) menampilkan panduan sesuai peran setelah kontennya disiapkan
                        tim. Hanya pertanyaan yang relevan dengan produk yang akan ditampilkan.
                    </p>
                </div>
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
