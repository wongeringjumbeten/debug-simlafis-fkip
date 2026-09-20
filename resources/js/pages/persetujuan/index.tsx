import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard, persetujuan } from '@/routes';

interface ItemPersetujuan {
    id: number;
    nama: string;
    jumlah?: number;
    waktuMulai: string;
    waktuSelesai: string;
    totalBiaya: number;
    statusItem: string;
    alasanPenolakan?: string | null;
}

interface PengajuanMenunggu {
    id: number;
    kode: string;
    peminjam: string;
    jenisPeminjaman: 'internal' | 'eksternal';
    totalBiaya: number;
    metodePembayaran?: string | null;
    buktiPembayaran?: string | null;
    tanggalPeminjaman: string;
    alat: ItemPersetujuan[];
    ruangan: ItemPersetujuan[];
}

interface Props {
    pengajuan: PengajuanMenunggu[];
    role: string;
}

function statusProps(status: string): { label: string; tone: StatusTone } {
    switch (status) {
        case 'menunggu':
            return { label: 'Menunggu', tone: 'warning' };
        case 'disetujui':
            return { label: 'Disetujui', tone: 'success' };
        case 'ditolak':
            return { label: 'Ditolak', tone: 'destructive' };
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

export default function Persetujuan({ pengajuan }: Props) {
    const [dialogTolak, setDialogTolak] = useState<{
        jenis: 'alat' | 'ruangan';
        id: number;
        nama: string;
    } | null>(null);
    const [alasanTolak, setAlasanTolak] = useState('');
    const [memproses, setMemproses] = useState(false);
    /**
     * Kunci item yang sedang disetujui (`alat-12` / `ruangan-3`).
     *
     * Perlu per-item, bukan sekadar boolean, agar tombol yang berputar hanya
     * pada item yang benar-benar sedang diproses.
     */
    const [menyetujui, setMenyetujui] = useState<string | null>(null);

    function handleApprove(jenis: 'alat' | 'ruangan', id: number) {
        const url =
            jenis === 'alat'
                ? `/persetujuan/alat/${id}/approve`
                : `/persetujuan/ruangan/${id}/approve`;

        setMenyetujui(`${jenis}-${id}`);

        router.patch(
            url,
            {},
            {
                preserveScroll: true,
                onFinish: () => setMenyetujui(null),
            },
        );
    }

    function handleReject() {
        if (!dialogTolak) return;

        setMemproses(true);
        const url =
            dialogTolak.jenis === 'alat'
                ? `/persetujuan/alat/${dialogTolak.id}/reject`
                : `/persetujuan/ruangan/${dialogTolak.id}/reject`;

        router.patch(
            url,
            { alasan: alasanTolak },
            {
                preserveScroll: true,
                onFinish: () => {
                    setMemproses(false);
                    setDialogTolak(null);
                    setAlasanTolak('');
                },
            },
        );
    }

    return (
        <>
            <Head title="Persetujuan Peminjaman" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">
                        Persetujuan Peminjaman
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Tinjau dan setujui atau tolak setiap item alat dan
                        ruangan secara independen (BR-4 Item-Level Approval).
                    </p>
                </header>

                {pengajuan.length === 0 ? (
                    <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                        <p className="text-sm font-medium">
                            Tidak ada pengajuan yang menunggu persetujuan
                        </p>
                        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-xs">
                            Semua permohonan peminjaman alat dan ruangan sudah
                            diproses.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pengajuan.map((p) => (
                            <div
                                key={p.id}
                                className="bg-card overflow-hidden rounded-xl border"
                            >
                                <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b p-4">
                                    <div>
                                        {/* Heading kartu agar hierarki tidak melompat h1 → h3. */}
                                        <h2 className="inline-block font-mono text-base font-bold">
                                            {p.kode}
                                        </h2>
                                        <span className="text-muted-foreground ml-3 text-sm">
                                            Pemohon:{' '}
                                            <strong className="text-foreground">
                                                {p.peminjam}
                                            </strong>{' '}
                                            · {p.tanggalPeminjaman}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-muted-foreground capitalize">
                                            Jenis:{' '}
                                            <strong className="text-foreground">
                                                {p.jenisPeminjaman}
                                            </strong>
                                        </span>
                                        {p.totalBiaya > 0 && (
                                            <span className="text-primary font-semibold">
                                                {formatRupiah(p.totalBiaya)}
                                            </span>
                                        )}
                                        {p.buktiPembayaran && (
                                            <a
                                                href={p.buktiPembayaran}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-background text-primary hover:bg-muted rounded-md border px-2.5 py-1 text-xs underline"
                                            >
                                                Bukti Transfer
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="divide-y p-4">
                                    {/* Item Alat */}
                                    {p.alat.length > 0 && (
                                        <div className="py-2">
                                            <h3 className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                                                Item Alat ({p.alat.length})
                                            </h3>
                                            <div className="space-y-2">
                                                {p.alat.map((alat) => {
                                                    const badge = statusProps(
                                                        alat.statusItem,
                                                    );
                                                    return (
                                                        <div
                                                            key={alat.id}
                                                            className="bg-background flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm"
                                                        >
                                                            <div>
                                                                <div className="font-medium">
                                                                    {alat.nama}{' '}
                                                                    (
                                                                    {
                                                                        alat.jumlah
                                                                    }{' '}
                                                                    unit)
                                                                </div>
                                                                <div className="text-muted-foreground text-xs">
                                                                    {
                                                                        alat.waktuMulai
                                                                    }{' '}
                                                                    s.d.{' '}
                                                                    {
                                                                        alat.waktuSelesai
                                                                    }
                                                                </div>
                                                                {alat.alasanPenolakan && (
                                                                    <div className="text-destructive mt-1 text-xs">
                                                                        Alasan
                                                                        tolak:{' '}
                                                                        {
                                                                            alat.alasanPenolakan
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <StatusBadge
                                                                    label={
                                                                        badge.label
                                                                    }
                                                                    tone={
                                                                        badge.tone
                                                                    }
                                                                />
                                                                {alat.statusItem ===
                                                                    'menunggu' && (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="default"
                                                                            className="bg-success text-success-foreground hover:bg-success/90 h-8 gap-1"
                                                                            disabled={
                                                                                menyetujui !==
                                                                                null
                                                                            }
                                                                            onClick={() =>
                                                                                handleApprove(
                                                                                    'alat',
                                                                                    alat.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            {menyetujui ===
                                                                            `alat-${alat.id}` ? (
                                                                                <Spinner />
                                                                            ) : (
                                                                                <Check className="h-4 w-4" />
                                                                            )}
                                                                            <span>
                                                                                Setujui
                                                                            </span>
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            className="h-8 gap-1"
                                                                            onClick={() =>
                                                                                setDialogTolak(
                                                                                    {
                                                                                        jenis: 'alat',
                                                                                        id: alat.id,
                                                                                        nama: alat.nama,
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                            <span>
                                                                                Tolak
                                                                            </span>
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Item Ruangan */}
                                    {p.ruangan.length > 0 && (
                                        <div className="py-2">
                                            <h3 className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                                                Item Ruangan ({p.ruangan.length}
                                                )
                                            </h3>
                                            <div className="space-y-2">
                                                {p.ruangan.map((ruang) => {
                                                    const badge = statusProps(
                                                        ruang.statusItem,
                                                    );
                                                    return (
                                                        <div
                                                            key={ruang.id}
                                                            className="bg-background flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm"
                                                        >
                                                            <div>
                                                                <div className="font-medium">
                                                                    {ruang.nama}
                                                                </div>
                                                                <div className="text-muted-foreground text-xs">
                                                                    {
                                                                        ruang.waktuMulai
                                                                    }{' '}
                                                                    s.d.{' '}
                                                                    {
                                                                        ruang.waktuSelesai
                                                                    }
                                                                </div>
                                                                {ruang.alasanPenolakan && (
                                                                    <div className="text-destructive mt-1 text-xs">
                                                                        Alasan
                                                                        tolak:{' '}
                                                                        {
                                                                            ruang.alasanPenolakan
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <StatusBadge
                                                                    label={
                                                                        badge.label
                                                                    }
                                                                    tone={
                                                                        badge.tone
                                                                    }
                                                                />
                                                                {ruang.statusItem ===
                                                                    'menunggu' && (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="default"
                                                                            className="bg-success text-success-foreground hover:bg-success/90 h-8 gap-1"
                                                                            disabled={
                                                                                menyetujui !==
                                                                                null
                                                                            }
                                                                            onClick={() =>
                                                                                handleApprove(
                                                                                    'ruangan',
                                                                                    ruang.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            {menyetujui ===
                                                                            `ruangan-${ruang.id}` ? (
                                                                                <Spinner />
                                                                            ) : (
                                                                                <Check className="h-4 w-4" />
                                                                            )}
                                                                            <span>
                                                                                Setujui
                                                                            </span>
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            className="h-8 gap-1"
                                                                            onClick={() =>
                                                                                setDialogTolak(
                                                                                    {
                                                                                        jenis: 'ruangan',
                                                                                        id: ruang.id,
                                                                                        nama: ruang.nama,
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                            <span>
                                                                                Tolak
                                                                            </span>
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dialog Penolakan Item dengan Alasan */}
            <Dialog
                open={dialogTolak !== null}
                onOpenChange={(open) => !open && setDialogTolak(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Tolak Item {dialogTolak?.nama}
                        </DialogTitle>
                        <DialogDescription>
                            Tuliskan alasan penolakan untuk item ini (misal:
                            bentrok jadwal, pemeliharaan, atau stok kurang).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="alasan">Alasan Penolakan</Label>
                        <Input
                            id="alasan"
                            placeholder="Contoh: Bentrok dengan praktikum wajib"
                            value={alasanTolak}
                            onChange={(e) => setAlasanTolak(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setDialogTolak(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={memproses}
                        >
                            {memproses && <Spinner />}
                            {memproses ? 'Menyimpan...' : 'Tolak Item Ini'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Persetujuan.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Persetujuan', href: persetujuan() },
    ],
};
