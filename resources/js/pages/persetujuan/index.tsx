import { Head } from '@inertiajs/react';
import { dashboard, persetujuan } from '@/routes';

export default function Persetujuan() {
    return (
        <>
            <Head title="Persetujuan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">Persetujuan Peminjaman</h1>
                    <p className="text-sm text-muted-foreground">
                        Tinjau dan setujui/tolak tiap item secara terpisah (ADM-15, ADM-16, KLB-07).
                    </p>
                </header>

                <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                    <p className="text-sm font-medium">Daftar pengajuan menunggu backend</p>
                    <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
                        Persetujuan item-level (BR-4) dan cek pembayaran ditampilkan setelah modul transaksi siap
                        (REQ-17 s.d. REQ-19).
                    </p>
                </div>
            </div>
        </>
    );
}

Persetujuan.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Persetujuan', href: persetujuan() },
    ],
};
