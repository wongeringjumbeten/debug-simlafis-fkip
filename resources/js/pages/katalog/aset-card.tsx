import { Pencil, ShoppingCart } from 'lucide-react';

import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Aset, Role, SubKategoriEksternal } from '@/types';
import {
    canBorrow,
    canManageKategori,
    canSeeTarif,
    formatRupiah,
    kondisiLabels,
    kondisiTone,
    tarifUntuk,
    unitLabLabels,
} from './helpers';

interface AsetCardProps {
    aset: Aset;
    role: Role;
    subKategori?: SubKategoriEksternal;
    onDetail: (aset: Aset) => void;
    onTambahKeCart: (aset: Aset) => void;
    onUbah: (aset: Aset) => void;
}

export function AsetCard({ aset, role, subKategori, onDetail, onTambahKeCart, onUbah }: AsetCardProps) {
    const habis = aset.stokTersedia === 0;
    const tampilkanTarif = canSeeTarif(role) && aset.tarifInternalUnej !== undefined;

    return (
        <Card className="gap-3 py-4">
            <div className="flex flex-col gap-3 px-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[13px] text-muted-foreground">{aset.kode}</span>
                    <StatusBadge label={kondisiLabels[aset.kondisi]} tone={kondisiTone[aset.kondisi]} />
                </div>

                <div className="space-y-1">
                    <h3 className="leading-snug font-medium">{aset.nama}</h3>
                    <p className="text-xs text-muted-foreground">
                        {unitLabLabels[aset.unitLab]}
                        {aset.kapasitas !== undefined && ` · Kapasitas ${aset.kapasitas} orang`}
                        {aset.lokasi && ` · ${aset.lokasi}`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                        label={habis ? 'Stok habis' : `Tersedia ${aset.stokTersedia} dari ${aset.stokTotal}`}
                        tone={habis ? 'destructive' : 'success'}
                    />
                </div>

                {tampilkanTarif && (
                    <p className="text-sm">
                        {role === 'ekst'
                            ? `Tarif: ${formatRupiah(tarifUntuk(aset, subKategori) ?? 0)}/hari`
                            : `Tarif Int. UNEJ: ${formatRupiah(aset.tarifInternalUnej ?? 0)}/hari${aset.tarifLuarUnej !== undefined ? ` · Luar UNEJ: ${formatRupiah(aset.tarifLuarUnej)}/hari` : ''}`}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2 px-4">
                <Button variant="secondary" size="sm" onClick={() => onDetail(aset)}>
                    Detail
                </Button>
                {canBorrow(role) && !habis && (
                    <Button size="sm" onClick={() => onTambahKeCart(aset)}>
                        <ShoppingCart /> Keranjang
                    </Button>
                )}
                {canManageKategori(role, aset.kategori) && (
                    <Button variant="ghost" size="sm" onClick={() => onUbah(aset)}>
                        <Pencil /> Ubah
                    </Button>
                )}
            </div>
        </Card>
    );
}
