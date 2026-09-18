import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { CartItem, Role, SubKategoriEksternal } from '@/types';
import { formatRupiah, formatTanggal, hitungHari, tarifUntuk } from './helpers';

interface CartSubmitData {
    metodePembayaran?: 'transfer' | 'cash';
    buktiPembayaran?: File | null;
}

interface CartDialogProps {
    open: boolean;
    items: CartItem[];
    role: Role;
    subKategori?: SubKategoriEksternal;
    onOpenChange: (open: boolean) => void;
    onHapus: (index: number) => void;
    onAjukan: (data: CartSubmitData) => void;
}

type CartTab = 'alat' | 'ruangan';

export function CartDialog({
    open,
    items,
    role,
    subKategori,
    onOpenChange,
    onHapus,
    onAjukan,
}: CartDialogProps) {
    const [tab, setTab] = useState<CartTab>('alat');
    const [metodePembayaran, setMetodePembayaran] = useState<
        'transfer' | 'cash'
    >('transfer');
    const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);

    const isEkst = role === 'ekst';
    const itemTab = items.filter((item) => item.aset.kategori === tab);
    const totalBiaya = isEkst
        ? items.reduce((total, item) => {
              const tarif = tarifUntuk(item.aset, subKategori) ?? 0;
              return (
                  total +
                  tarif *
                      item.jumlah *
                      hitungHari(item.tanggalMulai, item.tanggalSelesai)
              );
          }, 0)
        : 0;

    const tabAlat = (
        <button
            key="alat"
            onClick={() => setTab('alat')}
            aria-selected={tab === 'alat'}
            role="tab"
            className={cn(
                'flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                tab === 'alat'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
            )}
        >
            Alat ({items.filter((i) => i.aset.kategori === 'alat').length})
        </button>
    );
    const tabRuangan = (
        <button
            key="ruangan"
            onClick={() => setTab('ruangan')}
            aria-selected={tab === 'ruangan'}
            role="tab"
            className={cn(
                'flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                tab === 'ruangan'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
            )}
        >
            Ruangan ({items.filter((i) => i.aset.kategori === 'ruangan').length}
            )
        </button>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Keranjang Sesi</DialogTitle>
                    <DialogDescription>
                        Item sementara sebelum diajukan. Ajuan dibuat per item —
                        persetujuan diproses terpisah (BR-4).
                    </DialogDescription>
                </DialogHeader>

                <div
                    className="bg-muted flex gap-1 rounded-lg p-1"
                    role="tablist"
                >
                    {[tabAlat, tabRuangan]}
                </div>

                <div className="max-h-[320px] space-y-2 overflow-y-auto">
                    {itemTab.length === 0 && (
                        <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-8 text-center text-sm">
                            Belum ada item di tab ini. Pilih item dari katalog
                            lalu klik "Keranjang".
                        </p>
                    )}

                    {itemTab.map((item) => {
                        const index = items.indexOf(item);
                        const tarif = tarifUntuk(item.aset, subKategori);
                        const biaya =
                            isEkst && tarif !== undefined
                                ? tarif *
                                  item.jumlah *
                                  hitungHari(
                                      item.tanggalMulai,
                                      item.tanggalSelesai,
                                  )
                                : null;

                        return (
                            <div
                                key={`${item.aset.id}-${index}`}
                                className="flex items-start gap-3 rounded-lg border p-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-muted-foreground font-mono text-[13px]">
                                        {item.aset.kode}
                                    </p>
                                    <p className="text-sm font-medium">
                                        {item.aset.nama}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                        {formatTanggal(item.tanggalMulai)} –{' '}
                                        {formatTanggal(item.tanggalSelesai)} ·{' '}
                                        {hitungHari(
                                            item.tanggalMulai,
                                            item.tanggalSelesai,
                                        )}{' '}
                                        hari · {item.jamMulai}–{item.jamSelesai}{' '}
                                        · {item.jumlah} unit
                                    </p>
                                    {biaya !== null && (
                                        <p className="mt-0.5 text-sm">
                                            {formatRupiah(biaya)}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Hapus ${item.aset.nama}`}
                                    onClick={() => onHapus(index)}
                                >
                                    <Trash2 className="text-muted-foreground" />
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {isEkst && items.length > 0 && (
                    <div className="bg-muted/40 space-y-3 rounded-lg border p-3">
                        <p className="text-sm font-semibold">
                            Opsi Pembayaran Sewa (REQ-15)
                        </p>
                        <div className="flex gap-4 text-sm">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="metodePembayaran"
                                    value="transfer"
                                    checked={metodePembayaran === 'transfer'}
                                    onChange={() =>
                                        setMetodePembayaran('transfer')
                                    }
                                />
                                Transfer Bank
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="metodePembayaran"
                                    value="cash"
                                    checked={metodePembayaran === 'cash'}
                                    onChange={() => setMetodePembayaran('cash')}
                                />
                                Tunai / Cash via PLP
                            </label>
                        </div>
                        {metodePembayaran === 'transfer' && (
                            <div className="space-y-1">
                                <label className="text-muted-foreground text-xs">
                                    Unggah Bukti Transfer (JPG/PNG max 2MB):
                                </label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={(e) =>
                                        setBuktiPembayaran(
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="text-muted-foreground file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 block w-full text-xs file:mr-2 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold"
                                />
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="items-center sm:justify-between">
                    {isEkst ? (
                        <p className="text-sm">
                            Total:{' '}
                            <span className="font-semibold">
                                {formatRupiah(totalBiaya)}
                            </span>
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            {items.length} item di keranjang
                        </p>
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Tutup
                        </Button>
                        <Button
                            onClick={() =>
                                onAjukan({
                                    metodePembayaran: isEkst
                                        ? metodePembayaran
                                        : undefined,
                                    buktiPembayaran,
                                })
                            }
                            disabled={items.length === 0}
                        >
                            Ajukan Peminjaman
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
