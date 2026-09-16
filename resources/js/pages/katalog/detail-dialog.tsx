import { ShoppingCart } from 'lucide-react';

import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Aset, Role, SubKategoriEksternal } from '@/types';
import { canBorrow, canSeeTarif, formatRupiah, kondisiLabels, kondisiTone, kategoriLabels, tarifUntuk, unitLabLabels } from './helpers';

interface DetailDialogProps {
    aset: Aset | null;
    role: Role;
    subKategori?: SubKategoriEksternal;
    onOpenChange: (open: boolean) => void;
    onTambahKeCart: (aset: Aset) => void;
}

function Baris({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-6 text-sm">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="text-right">{value}</span>
        </div>
    );
}

export function DetailDialog({ aset, role, subKategori, onOpenChange, onTambahKeCart }: DetailDialogProps) {
    if (!aset) {
        return null;
    }

    const tampilkanTarif = canSeeTarif(role) && aset.tarifInternalUnej !== undefined;
    const habis = aset.stokTersedia === 0;

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <span className="font-mono text-[13px] text-muted-foreground">{aset.kode}</span>
                    <DialogTitle className="text-xl">{aset.nama}</DialogTitle>
                    <DialogDescription>
                        {unitLabLabels[aset.unitLab]}
                        {aset.lokasi && ` · ${aset.lokasi}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <StatusBadge label={kondisiLabels[aset.kondisi]} tone={kondisiTone[aset.kondisi]} />
                        <StatusBadge
                            label={habis ? 'Stok habis' : `Tersedia ${aset.stokTersedia} dari ${aset.stokTotal}`}
                            tone={habis ? 'destructive' : 'success'}
                        />
                    </div>

                    {aset.spesifikasi && <p className="text-sm leading-relaxed">{aset.spesifikasi}</p>}

                    <Separator />

                    <div className="space-y-2">
                        <Baris label="Kategori" value={kategoriLabels[aset.kategori]} />
                        {aset.kapasitas !== undefined && <Baris label="Kapasitas" value={`${aset.kapasitas} orang`} />}
                        <Baris label="Stok total" value={`${aset.stokTotal}`} />
                        <Baris label="Stok tersedia" value={`${aset.stokTersedia}`} />
                        {tampilkanTarif && role === 'ekst' && (
                            <Baris label="Tarif sewa" value={`${formatRupiah(tarifUntuk(aset, subKategori) ?? 0)}/hari`} />
                        )}
                        {tampilkanTarif && role !== 'ekst' && (
                            <>
                                <Baris label="Tarif Int. UNEJ" value={`${formatRupiah(aset.tarifInternalUnej ?? 0)}/hari`} />
                                {aset.tarifLuarUnej !== undefined && (
                                    <Baris label="Tarif Luar UNEJ" value={`${formatRupiah(aset.tarifLuarUnej)}/hari`} />
                                )}
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>
                    {canBorrow(role) && !habis && (
                        <Button onClick={() => onTambahKeCart(aset)}>
                            <ShoppingCart /> Masukkan Keranjang
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
