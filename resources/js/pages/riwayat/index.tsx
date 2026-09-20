import { Head, router } from '@inertiajs/react';
import { Ban, Eye } from 'lucide-react';
import { useState } from 'react';

import { StatusBadge, type StatusTone } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard, riwayat } from '@/routes';

interface ItemTransaksi {
    id: number;
    jenis: 'alat' | 'ruangan';
    nama: string;
    jumlah: number;
    waktuMulai: string;
    waktuSelesai: string;
    totalBiaya: number;
    statusItem: string;
    alasanPenolakan?: string | null;
}

interface Transaksi {
    id: number;
    kode: string;
    peminjam: string;
    jenisPeminjaman: 'internal' | 'eksternal';
    totalBiaya: number;
    metodePembayaran?: string | null;
    buktiPembayaran?: string | null;
    statusKeseluruhan: string;
    tanggalPeminjaman: string;
    isCancellable: boolean;
    items: ItemTransaksi[];
}

interface Props {
    transaksi: Transaksi[];
    role: string;
    isLab: boolean;
}

function statusProps(status: string): { label: string; tone: StatusTone } {
    switch (status) {
        case 'menunggu':
            return { label: 'Menunggu', tone: 'warning' };
        case 'disetujui':
            return { label: 'Disetujui', tone: 'success' };
        case 'dipinjam':
            return { label: 'Dipinjam', tone: 'info' };
        case 'dikembalikan':
            return { label: 'Dikembalikan', tone: 'success' };
        case 'ditolak':
            return { label: 'Ditolak', tone: 'destructive' };
        case 'dibatalkan':
            return { label: 'Dibatalkan', tone: 'neutral' };
        default:
            return { label: status, tone: 'neutral' };
    }
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function Riwayat({ transaksi, isLab }: Props) {
    const [detailTransaksi, setDetailTransaksi] = useState<Transaksi | null>(
        null,
    );
    const [batalTransaksi, setBatalTransaksi] = useState<Transaksi | null>(
        null,
    );
    const [sedangMembatalkan, setSedangMembatalkan] = useState(false);

    function handleBatal() {
        if (!batalTransaksi) return;

        setSedangMembatalkan(true);
        router.post(
            `/peminjaman/${batalTransaksi.id}/cancel`,
            {},
            {
                onFinish: () => {
                    setSedangMembatalkan(false);
                    setBatalTransaksi(null);
                },
            },
        );
    }

    return (
        <>
            <Head title="Riwayat Peminjaman" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">
                        Riwayat Peminjaman
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Pantau status transaksi peminjaman alat dan ruangan
                        beserta persetujuan per-item (BR-4, BR-5).
                    </p>
                </header>

                {transaksi.length === 0 ? (
                    <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                        <p className="text-sm font-medium">
                            Belum ada riwayat peminjaman
                        </p>
                        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-xs">
                            Pengajuan peminjaman yang Anda buat dari katalog
                            laboratorium akan tampil di halaman ini.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card overflow-x-auto rounded-xl border">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-xs font-semibold uppercase">
                                <tr>
                                    <th className="px-4 py-3">No. Transaksi</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    {isLab && (
                                        <th className="px-4 py-3">Peminjam</th>
                                    )}
                                    <th className="px-4 py-3">Jenis & Biaya</th>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {transaksi.map((t) => {
                                    const badge = statusProps(
                                        t.statusKeseluruhan,
                                    );
                                    return (
                                        <tr
                                            key={t.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-mono font-medium">
                                                {t.kode}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {t.tanggalPeminjaman}
                                            </td>
                                            {isLab && (
                                                <td className="px-4 py-3">
                                                    {t.peminjam}
                                                </td>
                                            )}
                                            <td className="px-4 py-3">
                                                <div className="font-medium capitalize">
                                                    {t.jenisPeminjaman}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {t.totalBiaya > 0
                                                        ? formatRupiah(
                                                              t.totalBiaya,
                                                          )
                                                        : 'Gratis (Internal)'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-muted-foreground text-xs">
                                                    {t.items.length} item (
                                                    {t.items
                                                        .map((i) => i.nama)
                                                        .slice(0, 2)
                                                        .join(', ')}
                                                    {t.items.length > 2
                                                        ? '...'
                                                        : ''}
                                                    )
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge
                                                    label={badge.label}
                                                    tone={badge.tone}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setDetailTransaksi(
                                                                t,
                                                            )
                                                        }
                                                        className="h-8 gap-1 px-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span>Detail</span>
                                                    </Button>
                                                    {t.isCancellable && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setBatalTransaksi(
                                                                    t,
                                                                )
                                                            }
                                                            className="border-destructive/30 text-destructive hover:bg-destructive/10 h-8 gap-1 px-2"
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                            <span>Batal</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Dialog Detail Transaksi & Persetujuan Per-Item */}
            <Dialog
                open={detailTransaksi !== null}
                onOpenChange={(open) => !open && setDetailTransaksi(null)}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Rincian Peminjaman {detailTransaksi?.kode}
                        </DialogTitle>
                        <DialogDescription>
                            Peminjam:{' '}
                            <span className="text-foreground font-medium">
                                {detailTransaksi?.peminjam}
                            </span>{' '}
                            · Tanggal: {detailTransaksi?.tanggalPeminjaman}
                        </DialogDescription>
                    </DialogHeader>

                    {detailTransaksi && (
                        <div className="space-y-4">
                            <div className="bg-muted flex flex-wrap items-center justify-between gap-2 rounded-lg p-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">
                                        Status Keseluruhan:{' '}
                                    </span>
                                    <StatusBadge
                                        label={
                                            statusProps(
                                                detailTransaksi.statusKeseluruhan,
                                            ).label
                                        }
                                        tone={
                                            statusProps(
                                                detailTransaksi.statusKeseluruhan,
                                            ).tone
                                        }
                                    />
                                </div>
                                <div>
                                    <span className="text-muted-foreground">
                                        Total Biaya:{' '}
                                    </span>
                                    <span className="font-semibold">
                                        {detailTransaksi.totalBiaya > 0
                                            ? formatRupiah(
                                                  detailTransaksi.totalBiaya,
                                              )
                                            : 'Rp 0 (Internal)'}
                                    </span>
                                </div>
                            </div>

                            {detailTransaksi.buktiPembayaran && (
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs font-semibold">
                                        Bukti Pembayaran (Transfer Bank):
                                    </p>
                                    <a
                                        href={detailTransaksi.buktiPembayaran}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary mt-1 inline-block text-xs underline"
                                    >
                                        Buka lampiran bukti transfer
                                    </a>
                                </div>
                            )}

                            <div>
                                <h3 className="mb-2 text-sm font-semibold">
                                    Daftar Item (Item-Level Status)
                                </h3>
                                <div className="space-y-2">
                                    {detailTransaksi.items.map((item) => {
                                        const itemBadge = statusProps(
                                            item.statusItem,
                                        );
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3 text-sm"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {item.nama}{' '}
                                                        <span className="text-muted-foreground text-xs capitalize">
                                                            ({item.jenis},{' '}
                                                            {item.jumlah} unit)
                                                        </span>
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        {item.waktuMulai} s.d.{' '}
                                                        {item.waktuSelesai}
                                                    </div>
                                                    {item.alasanPenolakan && (
                                                        <div className="text-destructive mt-1 text-xs">
                                                            Catatan:{' '}
                                                            {
                                                                item.alasanPenolakan
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <StatusBadge
                                                        label={itemBadge.label}
                                                        tone={itemBadge.tone}
                                                    />
                                                    {item.totalBiaya > 0 && (
                                                        <div className="text-muted-foreground mt-1 text-xs font-medium">
                                                            {formatRupiah(
                                                                item.totalBiaya,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setDetailTransaksi(null)}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Pembatalan Mandiri (BR-5) */}
            <Dialog
                open={batalTransaksi !== null}
                onOpenChange={(open) => !open && setBatalTransaksi(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Pembatalan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin membatalkan pengajuan
                            peminjaman{' '}
                            <span className="text-foreground font-semibold">
                                {batalTransaksi?.kode}
                            </span>
                            ? Seluruh alokasi alat dan ruangan pada transaksi
                            ini akan dilepaskan (BR-5).
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setBatalTransaksi(null)}
                        >
                            Kembali
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBatal}
                            disabled={sedangMembatalkan}
                        >
                            {sedangMembatalkan
                                ? 'Membatalkan...'
                                : 'Ya, Batalkan Peminjaman'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Riwayat.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Riwayat', href: riwayat() },
    ],
};
