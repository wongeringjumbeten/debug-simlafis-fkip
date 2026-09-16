import { Head } from '@inertiajs/react';
import { dashboard, riwayat } from '@/routes';

export default function Riwayat() {
    return (
        <>
            <Head title="Riwayat Peminjaman" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">Riwayat Peminjaman</h1>
                    <p className="text-sm text-muted-foreground">
                        Pantau status dan riwayat peminjaman sesuai hak akses Anda (ADM-17, DSN-07, MHS-04, EKS-06).
                    </p>
                </header>

                <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                    <p className="text-sm font-medium">Belum ada riwayat peminjaman</p>
                    <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
                        Daftar transaksi, status per item, dan aksi pembatalan mandiri (BR-5) menyusul setelah modul
                        riwayat tersambung ke backend (REQ-26).
                    </p>
                </div>
            </div>
        </>
    );
}

Riwayat.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Riwayat', href: riwayat() },
    ],
};
