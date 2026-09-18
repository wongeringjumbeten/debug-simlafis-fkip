import { Head, router } from '@inertiajs/react';
import { Plus, RotateCcw, Search, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { mockAset } from '@/mock/katalog';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';
import type {
    Aset,
    CartItem,
    KategoriAset,
    Role,
    SubKategoriEksternal,
    UnitLab,
} from '@/types';
import { AddToCartDialog } from './add-to-cart-dialog';
import { AsetCard } from './aset-card';
import { CartDialog } from './cart-dialog';
import { DetailDialog } from './detail-dialog';
import { ItemFormDialog } from './item-form-dialog';
import {
    canBorrow,
    canManageKategori,
    kategoriLabels,
    tabsByRole,
    unitLabLabels,
} from './helpers';

type Props = {
    /** Role user terautentikasi (REQ-1). */
    role: Role;
    /** Sub-kategori tarif untuk role eksternal (BR-2). */
    subKategori?: SubKategoriEksternal | null;
    /** Data aset dari database; null berarti pakai mock UI-first. */
    asets?: Aset[] | null;
};

const unitLabOptions: ('semua' | UnitLab)[] = [
    'semua',
    'dasar',
    'elektronika',
    'lanjut',
    'elf',
];

export default function Katalog({
    role,
    subKategori,
    asets: asetsAwal,
}: Props) {
    const tabs = tabsByRole[role];
    const kategoriEksternal = subKategori ?? undefined;

    const [kategori, setKategori] = useState<KategoriAset>(tabs[0]);
    const [asets, setAsets] = useState<Aset[]>(asetsAwal ?? mockAset);
    const [pencarian, setPencarian] = useState('');
    const [unitLab, setUnitLab] = useState<'semua' | UnitLab>('semua');
    const [tanggalMulai, setTanggalMulai] = useState('');
    const [tanggalSelesai, setTanggalSelesai] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartTerbuka, setCartTerbuka] = useState(false);
    const [detail, setDetail] = useState<Aset | null>(null);
    const [tambahKeCart, setTambahKeCart] = useState<Aset | null>(null);
    const [formAset, setFormAset] = useState<{
        mode: 'buat' | 'ubah';
        aset?: Aset;
    } | null>(null);
    const [pengajuanTerkirim, setPengajuanTerkirim] = useState(false);

    const hasil = useMemo(() => {
        const kata = pencarian.trim().toLowerCase();
        return asets.filter(
            (a) =>
                a.kategori === kategori &&
                (unitLab === 'semua' || a.unitLab === unitLab) &&
                (kata === '' ||
                    a.nama.toLowerCase().includes(kata) ||
                    a.kode.toLowerCase().includes(kata)),
        );
    }, [asets, kategori, pencarian, unitLab]);

    const filterTanggalAktif = tanggalMulai !== '' && tanggalSelesai !== '';

    function resetFilter() {
        setPencarian('');
        setUnitLab('semua');
        setTanggalMulai('');
        setTanggalSelesai('');
    }

    function tambahItemKeCart(item: CartItem) {
        setCart((sebelumnya) => [...sebelumnya, item]);
        setTambahKeCart(null);
        setPengajuanTerkirim(false);
    }

    function hapusDariCart(index: number) {
        setCart((sebelumnya) => sebelumnya.filter((_, i) => i !== index));
    }

    function simpanAset(aset: Aset, foto?: File | null) {
        const mode = formAset?.mode ?? 'buat';
        const formData = new FormData();
        formData.append('nama', aset.nama);
        if (aset.spesifikasi) formData.append('spesifikasi', aset.spesifikasi);
        if (aset.stokTotal !== undefined)
            formData.append('stok_awal', String(aset.stokTotal));
        if (aset.stokTersedia !== undefined)
            formData.append('stok_saat_ini', String(aset.stokTersedia));
        if (aset.kondisi) formData.append('kondisi', aset.kondisi);
        if (aset.kapasitas !== undefined)
            formData.append('kapasitas', String(aset.kapasitas));
        if (aset.tarifInternalUnej !== undefined)
            formData.append('tarif_internal', String(aset.tarifInternalUnej));
        if (aset.tarifLuarUnej !== undefined)
            formData.append('tarif_luar', String(aset.tarifLuarUnej));
        if (foto) formData.append('foto', foto);

        let url = `/katalog/${aset.kategori}`;
        if (mode === 'ubah') {
            url = `/katalog/${aset.kategori}/${aset.id}`;
            formData.append('_method', 'PATCH');
        }

        router.post(url, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setAsets((sebelumnya) => {
                    const ada = sebelumnya.some((a) => a.id === aset.id);
                    return ada
                        ? sebelumnya.map((a) => (a.id === aset.id ? aset : a))
                        : [...sebelumnya, aset];
                });
                setFormAset(null);
            },
            onError: (err) => {
                console.error('Gagal menyimpan aset:', err);
                setFormAset(null);
            },
        });
    }

    function ajukanPeminjaman(data?: {
        metodePembayaran?: 'transfer' | 'cash';
        buktiPembayaran?: File | null;
    }) {
        const itemsPayload = cart.map((item) => ({
            id: item.aset.id,
            id_alat: item.aset.kategori === 'alat' ? item.aset.id : undefined,
            id_ruangan:
                item.aset.kategori === 'ruangan' ? item.aset.id : undefined,
            kategori: item.aset.kategori,
            tanggalMulai: item.tanggalMulai,
            tanggalSelesai: item.tanggalSelesai,
            jamMulai: item.jamMulai,
            jamSelesai: item.jamSelesai,
            jumlah: item.jumlah,
        }));

        router.post(
            '/peminjaman',
            {
                items: itemsPayload as any,
                metode_pembayaran: data?.metodePembayaran,
                bukti_pembayaran: data?.buktiPembayaran,
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    setCart([]);
                    setCartTerbuka(false);
                    setPengajuanTerkirim(true);
                },
            },
        );
    }

    return (
        <>
            <Head title="Katalog Laboratorium" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[28px] leading-tight font-semibold">
                            Katalog Laboratorium
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {canBorrow(role)
                                ? 'Cari alat dan ruangan, lalu masukkan ke keranjang untuk membuat pengajuan peminjaman.'
                                : 'Data alat, ruangan, bahan, dan mebeler pada empat unit laboratorium.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canManageKategori(role, kategori) && (
                            <Button
                                onClick={() => setFormAset({ mode: 'buat' })}
                            >
                                <Plus /> Tambah {kategoriLabels[kategori]}
                            </Button>
                        )}
                        {canBorrow(role) && (
                            <Button
                                variant="secondary"
                                onClick={() => setCartTerbuka(true)}
                            >
                                <ShoppingCart /> Keranjang
                                {cart.length > 0 && (
                                    <span className="bg-primary text-primary-foreground ml-1 min-w-5 rounded-full px-1.5 py-0.5 text-center text-xs">
                                        {cart.length}
                                    </span>
                                )}
                            </Button>
                        )}
                    </div>
                </header>

                {pengajuanTerkirim && (
                    <div className="border-success/30 bg-success/10 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm text-[#1E7050]">
                        <span>
                            Pengajuan peminjaman terkirim (simulasi). Status
                            akan tampil di Riwayat Peminjaman setelah integrasi
                            backend.
                        </span>
                        <button
                            onClick={() => setPengajuanTerkirim(false)}
                            className="shrink-0 font-medium hover:underline"
                        >
                            Tutup
                        </button>
                    </div>
                )}

                <div className="bg-card rounded-xl border p-4">
                    <div
                        className="flex flex-wrap gap-2"
                        role="tablist"
                        aria-label="Kategori katalog"
                    >
                        {tabs.map((t) => (
                            <button
                                key={t}
                                role="tab"
                                aria-selected={kategori === t}
                                onClick={() => setKategori(t)}
                                className={cn(
                                    'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                                    kategori === t
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )}
                            >
                                {kategoriLabels[t]}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-end gap-3">
                        <div className="relative min-w-56 flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                value={pencarian}
                                onChange={(e) => setPencarian(e.target.value)}
                                placeholder="Cari nama atau kode inventaris…"
                                aria-label="Cari katalog"
                                className="pl-9"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label
                                htmlFor="filter-unit"
                                className="text-muted-foreground text-xs font-medium"
                            >
                                Unit Lab
                            </Label>
                            <Select
                                value={unitLab}
                                onValueChange={(v) =>
                                    setUnitLab(v as 'semua' | UnitLab)
                                }
                            >
                                <SelectTrigger
                                    id="filter-unit"
                                    className="w-44"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitLabOptions.map((u) => (
                                        <SelectItem key={u} value={u}>
                                            {u === 'semua'
                                                ? 'Semua unit'
                                                : unitLabLabels[u]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <label
                                htmlFor="filter-mulai"
                                className="text-muted-foreground text-xs font-medium"
                            >
                                Tanggal Mulai
                            </label>
                            <Input
                                id="filter-mulai"
                                type="date"
                                value={tanggalMulai}
                                onChange={(e) =>
                                    setTanggalMulai(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <label
                                htmlFor="filter-selesai"
                                className="text-muted-foreground text-xs font-medium"
                            >
                                Tanggal Selesai
                            </label>
                            <Input
                                id="filter-selesai"
                                type="date"
                                value={tanggalSelesai}
                                onChange={(e) =>
                                    setTanggalSelesai(e.target.value)
                                }
                            />
                        </div>
                        <Button variant="ghost" onClick={resetFilter}>
                            <RotateCcw /> Reset
                        </Button>
                    </div>

                    <p className="text-muted-foreground mt-3 text-xs">
                        {filterTanggalAktif
                            ? `Ketersediaan diperhitungkan untuk rentang ${tanggalMulai} s.d. ${tanggalSelesai}. `
                            : 'Pilih rentang tanggal untuk melihat ketersediaan stok pada tanggal tersebut. '}
                        Kalkulasi stok dinamis mengikuti transaksi aktif — aktif
                        setelah integrasi backend (REQ-10).
                    </p>
                </div>

                {hasil.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {hasil.map((aset) => (
                            <AsetCard
                                key={aset.id}
                                aset={aset}
                                role={role}
                                subKategori={kategoriEksternal}
                                onDetail={setDetail}
                                onTambahKeCart={setTambahKeCart}
                                onUbah={(a) =>
                                    setFormAset({ mode: 'ubah', aset: a })
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                        <p className="text-muted-foreground text-sm">
                            Tidak ada {kategoriLabels[kategori].toLowerCase()}{' '}
                            yang cocok dengan pencarian.
                        </p>
                    </div>
                )}

                {canBorrow(role) && (
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <StatusBadge label="Stok dinamis" tone="neutral" />
                        <span>
                            Jumlah stok tampil berdasarkan data master;
                            pengurangan otomatis per tanggal menyusul (REQ-10).
                        </span>
                    </div>
                )}
            </div>

            <DetailDialog
                aset={detail}
                role={role}
                subKategori={kategoriEksternal}
                onOpenChange={(open) => !open && setDetail(null)}
                onTambahKeCart={(aset) => {
                    setDetail(null);
                    setTambahKeCart(aset);
                }}
            />

            <AddToCartDialog
                aset={tambahKeCart}
                role={role}
                onOpenChange={(open) => !open && setTambahKeCart(null)}
                onSimpan={tambahItemKeCart}
            />

            <CartDialog
                open={cartTerbuka}
                items={cart}
                role={role}
                subKategori={kategoriEksternal}
                onOpenChange={setCartTerbuka}
                onHapus={hapusDariCart}
                onAjukan={ajukanPeminjaman}
            />

            <ItemFormDialog
                state={formAset}
                kategori={kategori}
                onOpenChange={(open) => !open && setFormAset(null)}
                onSimpan={simpanAset}
            />
        </>
    );
}

Katalog.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Katalog',
            href: '/katalog',
        },
    ],
};
