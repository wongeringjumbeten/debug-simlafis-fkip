import { useState } from 'react';
import {
    Armchair,
    CalendarDays,
    ChevronRight,
    FlaskConical,
    MapPin,
    PackagePlus,
    Pencil,
    ShoppingCart,
    type LucideIcon,
} from 'lucide-react';

import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type {
    Aset,
    KategoriAset,
    Role,
    SubKategoriEksternal,
} from '@/types';
import {
    canBorrow,
    canManageKategori,
    canSeeTarif,
    formatRupiah,
    kategoriLabels,
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
    /** Registrasi unit fisik alat (PR-18) — hanya untuk Admin & PLP. */
    onTambahUnit?: (aset: Aset) => void;
}

type KategoriVisual = {
    icon: LucideIcon;
    label: string;
};

const kategoriVisual: Record<KategoriAset, KategoriVisual> = {
    alat: { icon: FlaskConical, label: 'Instrumen laboratorium' },
    ruangan: { icon: CalendarDays, label: 'Ruang laboratorium' },
    bahan: { icon: FlaskConical, label: 'Bahan praktikum' },
    mebeler: { icon: Armchair, label: 'Mebeler laboratorium' },
};

/** Kartu aset responsif dengan CTA utama yang berbeda menurut peran pengguna. */
export function AsetCard({
    aset,
    role,
    subKategori,
    onDetail,
    onTambahKeCart,
    onUbah,
    onTambahUnit,
}: AsetCardProps) {
    const habis = aset.stokTersedia === 0;
    const [fotoError, setFotoError] = useState(false);
    const tampilkanTarif =
        canSeeTarif(role) && aset.tarifInternalUnej !== undefined;
    const bisaKelola = canManageKategori(role, aset.kategori);
    const bisaPinjam = canBorrow(role) && !habis;
    const { icon: IconKategori, label: labelKategori } =
        kategoriVisual[aset.kategori];
    const persentaseStok =
        aset.stokTotal > 0
            ? Math.min(100, Math.round((aset.stokTersedia / aset.stokTotal) * 100))
            : 0;

    return (
        <Card className="group flex h-full min-w-0 flex-col gap-0 overflow-hidden py-0 transition-colors hover:border-primary/40">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden border-b bg-muted">
                {aset.foto && !fotoError ? (
                    <img
                        src={aset.foto}
                        alt={aset.nama}
                        loading="lazy"
                        onError={() => setFotoError(true)}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-muted/70">
                        <IconKategori className="text-primary/50 size-8 sm:size-12" />
                    </div>
                )}
                <span className="bg-card/90 text-muted-foreground absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 inline-flex items-center gap-1 sm:gap-1.5 rounded-md border px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-[11px] font-medium backdrop-blur-sm shadow-xs">
                    <IconKategori className="size-2.5 sm:size-3" />
                    <span className="truncate max-w-[65px] sm:max-w-none">
                        {kategoriLabels[aset.kategori]}
                    </span>
                </span>
                <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5">
                    <StatusBadge
                        label={kondisiLabels[aset.kondisi]}
                        tone={kondisiTone[aset.kondisi]}
                        className="text-[10px] px-1.5 py-0 sm:text-xs sm:px-2 sm:py-0.5 shadow-xs"
                    />
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-3 xl:p-3">
                <div className="flex min-w-0 items-start justify-between gap-1 sm:gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground font-mono text-[10px] sm:text-[11px] truncate">
                            {aset.kode}
                        </p>
                        <h2 className="mt-0.5 line-clamp-2 text-xs sm:text-sm font-semibold sm:font-medium leading-snug">
                            {aset.nama}
                        </h2>
                    </div>
                    <ChevronRight className="text-muted-foreground mt-0.5 size-3.5 sm:size-4 shrink-0 transition-transform group-hover:translate-x-0.5 hidden xs:block" />
                </div>

                <p className="text-muted-foreground mt-1 sm:mt-1.5 line-clamp-1 sm:line-clamp-2 text-[11px] sm:text-xs leading-relaxed">
                    {aset.spesifikasi || labelKategori}
                </p>

                <div className="mt-2 sm:mt-2.5 flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 gap-y-1 text-[10px] sm:text-xs text-muted-foreground">
                    <span className="inline-flex min-w-0 items-center gap-1 sm:gap-1.5">
                        <MapPin className="size-3 sm:size-3.5 shrink-0" />
                        <span className="truncate max-w-[90px] xl:max-w-[110px]">
                            {aset.lokasi || unitLabLabels[aset.unitLab]}
                        </span>
                    </span>
                    {aset.kapasitas !== undefined && (
                        <span className="inline-flex items-center gap-1">
                            <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-muted-foreground/75">CAP</span>
                            <span>{aset.kapasitas}</span>
                        </span>
                    )}
                </div>

                <div className="mt-2.5 sm:mt-3 border-t pt-2 sm:pt-2.5">
                    <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs">
                        <span className="text-muted-foreground">
                            <span className="hidden 2xl:inline">Ketersediaan unit</span>
                            <span className="2xl:hidden">Stok unit</span>
                        </span>
                        <span
                            className={
                                habis
                                    ? 'text-destructive font-medium shrink-0'
                                    : 'text-success font-medium shrink-0'
                            }
                        >
                            {habis
                                ? 'Habis'
                                : `${aset.stokTersedia}/${aset.stokTotal}`}
                        </span>
                    </div>
                    <div
                        className="bg-muted mt-1.5 h-1 sm:h-1.5 overflow-hidden rounded-full"
                        role="progressbar"
                        aria-label={`Ketersediaan ${aset.nama}`}
                        aria-valuemin={0}
                        aria-valuemax={aset.stokTotal}
                        aria-valuenow={aset.stokTersedia}
                    >
                        <div
                            className={
                                habis
                                    ? 'bg-destructive h-full rounded-full'
                                    : 'bg-success h-full rounded-full'
                            }
                            style={{ width: `${persentaseStok}%` }}
                        />
                    </div>
                </div>

                {tampilkanTarif && (
                    <div className="bg-muted/45 mt-2 sm:mt-2.5 rounded-md sm:rounded-lg p-1.5 sm:px-2.5 sm:py-2">
                        <p className="text-muted-foreground text-[10px] sm:text-[11px]">
                            Tarif sewa
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1 gap-y-0.5 text-[11px] sm:text-xs font-semibold sm:font-medium leading-tight">
                            {role === 'ekst' ? (
                                <span>{formatRupiah(tarifUntuk(aset, subKategori) ?? 0)}/hari</span>
                            ) : (
                                <>
                                    <span className="shrink-0 text-foreground">
                                        Int. {formatRupiah(aset.tarifInternalUnej ?? 0)}
                                    </span>
                                    {aset.tarifLuarUnej !== undefined && (
                                        <span className="text-muted-foreground font-normal">
                                            · Luar {formatRupiah(aset.tarifLuarUnej)}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-2.5 sm:pt-3">
                    <div className={cn('grid gap-1 sm:gap-1.5', bisaPinjam ? 'grid-cols-2' : 'grid-cols-1')}>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-7.5 sm:h-8 px-2 text-[11px] sm:text-xs font-medium"
                            onClick={() => onDetail(aset)}
                        >
                            Detail
                        </Button>
                        {bisaPinjam && (
                            <Button
                                size="sm"
                                className="h-7.5 sm:h-8 px-1.5 sm:px-2 text-[11px] sm:text-xs font-medium gap-1"
                                onClick={() => onTambahKeCart(aset)}
                            >
                                <ShoppingCart className="size-3 sm:size-3.5 shrink-0" />
                                <span>Pinjam</span>
                            </Button>
                        )}
                    </div>

                    {bisaKelola && (
                        <div className="mt-2 flex flex-wrap items-center gap-1 border-t pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-1.5 sm:px-2 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => onUbah(aset)}
                            >
                                <Pencil className="size-3 sm:size-3.5" />
                                <span>Ubah</span>
                            </Button>
                            {aset.kategori === 'alat' && onTambahUnit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-1.5 sm:px-2 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => onTambahUnit(aset)}
                                >
                                    <PackagePlus className="size-3 sm:size-3.5" />
                                    <span>Unit</span>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
