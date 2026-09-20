import { useEffect, useState } from 'react';
import {
    Armchair,
    Building2,
    CalendarDays,
    FileText,
    FlaskConical,
    Layers,
    MapPin,
    Receipt,
    ShoppingCart,
    Users,
    type LucideIcon,
} from 'lucide-react';

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
import { cn } from '@/lib/utils';
import type { Aset, KategoriAset, Role, SubKategoriEksternal } from '@/types';
import {
    canBorrow,
    canSeeTarif,
    formatRupiah,
    kategoriLabels,
    kondisiLabels,
    kondisiTone,
    tarifUntuk,
    unitLabLabels,
} from './helpers';

interface DetailDialogProps {
    aset: Aset | null;
    role: Role;
    subKategori?: SubKategoriEksternal;
    onOpenChange: (open: boolean) => void;
    onTambahKeCart: (aset: Aset) => void;
}

const kategoriVisual: Record<KategoriAset, { icon: LucideIcon; label: string }> = {
    alat: { icon: FlaskConical, label: 'Instrumen Laboratorium' },
    ruangan: { icon: CalendarDays, label: 'Ruang Laboratorium' },
    bahan: { icon: FlaskConical, label: 'Bahan Praktikum' },
    mebeler: { icon: Armchair, label: 'Mebeler Laboratorium' },
};

export function DetailDialog({
    aset,
    role,
    subKategori,
    onOpenChange,
    onTambahKeCart,
}: DetailDialogProps) {
    const [fotoError, setFotoError] = useState(false);

    useEffect(() => {
        setFotoError(false);
    }, [aset?.id, aset?.foto]);

    if (!aset) {
        return null;
    }

    const isRuangan = aset.kategori === 'ruangan';
    const tampilkanTarif =
        canSeeTarif(role) && aset.tarifInternalUnej !== undefined;
    const habis = aset.stokTersedia === 0;
    const { icon: IconKategori, label: labelKategori } =
        kategoriVisual[aset.kategori];
    const persentaseStok =
        aset.stokTotal > 0
            ? Math.min(100, Math.round((aset.stokTersedia / aset.stokTotal) * 100))
            : 0;

    return (
        <Dialog open={Boolean(aset)} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92vh] sm:max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden sm:max-w-2xl w-[95vw] border-border/80 shadow-2xl rounded-2xl">
                {/* Header */}
                <DialogHeader className="border-b bg-muted/20 px-4 py-4 sm:px-6 sm:py-5 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2 pr-6 sm:pr-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium">
                                <IconKategori className="size-3.5" />
                                {kategoriLabels[aset.kategori]}
                            </span>
                            <span className="bg-muted text-muted-foreground font-mono text-xs font-medium rounded-md border px-2 py-1">
                                {aset.kode}
                            </span>
                        </div>
                        <StatusBadge
                            label={kondisiLabels[aset.kondisi]}
                            tone={kondisiTone[aset.kondisi]}
                            className="text-xs px-2 py-0.5"
                        />
                    </div>

                    <DialogTitle className="mt-2 text-lg sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                        {aset.nama}
                    </DialogTitle>

                    <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <Building2 className="size-3.5 text-primary shrink-0" />
                            {unitLabLabels[aset.unitLab]}
                        </span>
                        {aset.lokasi && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-primary shrink-0" />
                                {aset.lokasi}
                            </span>
                        )}
                        {isRuangan && aset.kapasitas !== undefined && (
                            <span className="inline-flex items-center gap-1.5">
                                <Users className="size-3.5 text-primary shrink-0" />
                                Kapasitas {aset.kapasitas} orang
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                    {/* Visual Banner / Foto */}
                    <div className="relative overflow-hidden rounded-xl border bg-muted/40 aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center">
                        {aset.foto && !fotoError ? (
                            <img
                                src={aset.foto}
                                alt={aset.nama}
                                onError={() => setFotoError(true)}
                                className="size-full object-contain p-2 transition-transform duration-300 hover:scale-[1.02]"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2.5 p-6 text-center">
                                <div className="bg-primary/10 flex size-14 items-center justify-center rounded-2xl border border-primary/20">
                                    <IconKategori className="text-primary size-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {labelKategori}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {isRuangan
                                            ? 'Fasilitas dan sarana ruang laboratorium'
                                            : 'Pratinjau visual inventaris laboratorium'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status & Ketersediaan Card */}
                    <div className="rounded-xl border bg-card p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Layers className="size-4 text-primary" />
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {isRuangan ? 'Status Ketersediaan Ruangan' : 'Status Ketersediaan Unit'}
                                </h3>
                            </div>
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    habis
                                        ? 'border border-destructive/20 bg-destructive/10 text-destructive'
                                        : 'border border-success/20 bg-success/10 text-success',
                                )}
                            >
                                <span
                                    className={cn(
                                        'size-1.5 rounded-full',
                                        habis ? 'bg-destructive' : 'bg-success',
                                    )}
                                />
                                {habis
                                    ? isRuangan
                                        ? 'Tidak Tersedia'
                                        : 'Stok Habis'
                                    : isRuangan
                                      ? 'Siap Digunakan'
                                      : 'Tersedia'}
                            </span>
                        </div>

                        {!isRuangan && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Rasio Ketersediaan Fisik</span>
                                    <span className="font-mono font-medium text-foreground">
                                        {persentaseStok}% ({aset.stokTersedia} dari {aset.stokTotal} unit)
                                    </span>
                                </div>
                                <div
                                    className="bg-muted h-2 overflow-hidden rounded-full"
                                    role="progressbar"
                                    aria-valuenow={aset.stokTersedia}
                                    aria-valuemin={0}
                                    aria-valuemax={aset.stokTotal}
                                >
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all duration-500',
                                            habis ? 'bg-destructive' : 'bg-success',
                                        )}
                                        style={{ width: `${persentaseStok}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 border-t text-xs">
                            <div className="p-2.5 rounded-lg bg-muted/40">
                                <p className="text-muted-foreground text-[11px]">
                                    {isRuangan ? 'Kapasitas Ruang' : 'Stok Tersedia'}
                                </p>
                                <p className="mt-0.5 font-semibold text-foreground text-sm">
                                    {isRuangan
                                        ? aset.kapasitas
                                            ? `${aset.kapasitas} orang`
                                            : '-'
                                        : `${aset.stokTersedia} unit`}
                                </p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-muted/40">
                                <p className="text-muted-foreground text-[11px]">
                                    {isRuangan ? 'Status Ruangan' : 'Total Terdaftar'}
                                </p>
                                <p className="mt-0.5 font-semibold text-foreground text-sm">
                                    {isRuangan ? 'Aktif Operasional' : `${aset.stokTotal} unit`}
                                </p>
                            </div>
                            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-muted/40">
                                <p className="text-muted-foreground text-[11px]">Kondisi Aset</p>
                                <p className="mt-0.5 font-semibold text-foreground text-sm">
                                    {kondisiLabels[aset.kondisi]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi & Spesifikasi */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <FileText className="size-4 text-primary" />
                            <h3>Deskripsi & Spesifikasi</h3>
                        </div>
                        <div className="rounded-xl border bg-muted/20 p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                            {aset.spesifikasi ||
                                (isRuangan
                                    ? 'Ruang laboratorium fisika dengan sarana dan prasarana pendukung untuk kegiatan praktikum, penelitian, dan workshop sains.'
                                    : 'Instrumen laboratorium fisika terstandarisasi untuk menunjang praktikum dan pengujian eksperimental.')}
                        </div>
                    </div>

                    {/* Tarif Sewa (Jika Berlaku) */}
                    {tampilkanTarif && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <Receipt className="size-4 text-primary" />
                                <h3>Informasi Tarif Retribusi / Sewa</h3>
                            </div>

                            {role === 'ekst' ? (
                                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 sm:p-4">
                                    <p className="text-xs text-muted-foreground font-medium">
                                        Tarif Sewa Pemohon Eksternal
                                    </p>
                                    <div className="mt-1 flex items-baseline gap-1.5">
                                        <span className="text-xl sm:text-2xl font-bold text-primary">
                                            {formatRupiah(tarifUntuk(aset, subKategori) ?? 0)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            / hari kalender
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                                        Tarif berlaku resmi sesuai ketentuan BLU Universitas Jember untuk pengguna dari instansi atau pihak luar.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-3.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-foreground">
                                                Internal UNEJ
                                            </span>
                                            <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded">
                                                Civitas
                                            </span>
                                        </div>
                                        <p className="mt-1 text-base sm:text-lg font-bold text-primary">
                                            {formatRupiah(aset.tarifInternalUnej ?? 0)}
                                            <span className="text-xs font-normal text-muted-foreground"> / hari</span>
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                                            Berlaku untuk Dosen, Mahasiswa, dan Unit Internal UNEJ.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border bg-muted/30 p-3 sm:p-3.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-foreground">
                                                Luar UNEJ / Mitra
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded border">
                                                Eksternal
                                            </span>
                                        </div>
                                        <p className="mt-1 text-base sm:text-lg font-semibold text-foreground">
                                            {aset.tarifLuarUnej !== undefined
                                                ? formatRupiah(aset.tarifLuarUnej)
                                                : '-'}
                                            <span className="text-xs font-normal text-muted-foreground"> / hari</span>
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                                            Berlaku untuk peminjam instansi luar atau masyarakat umum.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="border-t bg-muted/20 px-4 py-3 sm:px-6 sm:py-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
                    <p className="text-[11px] text-muted-foreground hidden sm:block">
                        {isRuangan
                            ? 'Pastikan jadwal ruangan sesuai tanggal kebutuhan kegiatan Anda.'
                            : 'Ketersediaan dapat dicek berkala sebelum konfirmasi pengajuan.'}
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 sm:flex-initial"
                            onClick={() => onOpenChange(false)}
                        >
                            Tutup
                        </Button>
                        {canBorrow(role) && (
                            <Button
                                type="button"
                                disabled={habis}
                                className="flex-1 sm:flex-initial gap-2"
                                onClick={() => onTambahKeCart(aset)}
                            >
                                <ShoppingCart className="size-4" />
                                <span>{isRuangan ? 'Pinjam Ruangan' : 'Pinjam Alat'}</span>
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
