import { Head, router } from '@inertiajs/react';
import {
    Armchair,
    Boxes,
    CalendarDays,
    Filter,
    FlaskConical,
    PackageOpen,
    Plus,
    RotateCcw,
    Search,
    ShoppingCart,
    X,
} from 'lucide-react';
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
    UnitAlat,
    UnitLab,
} from '@/types';
import { AddToCartDialog } from './add-to-cart-dialog';
import { AsetCard } from './aset-card';
import { CartDialog } from './cart-dialog';
import { DetailDialog } from './detail-dialog';
import { ItemFormDialog } from './item-form-dialog';
import { UnitFormDialog } from './unit-form-dialog';
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

/** Ikon kategori menjaga tab tetap mudah dipindai pada layar kecil. */
const kategoriIcon = {
    alat: FlaskConical,
    ruangan: CalendarDays,
    bahan: Boxes,
    mebeler: Armchair,
} satisfies Record<KategoriAset, typeof FlaskConical>;

/**
 * Cek apakah satu CartItem valid. Return null kalau valid,
 * atau string pesan error kalau tidak.
 */
function validasiCartItem(item: CartItem): string | null {
    if (!item.tanggalMulai || !item.tanggalSelesai) {
        return 'Tanggal mulai dan selesai wajib diisi.';
    }
    if (item.tanggalSelesai < item.tanggalMulai) {
        return 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
    }
    if (
        item.tanggalMulai === item.tanggalSelesai &&
        item.jamSelesai <= item.jamMulai
    ) {
        return 'Jam selesai harus setelah jam mulai pada hari yang sama.';
    }
    if (!Number.isInteger(item.jumlah) || item.jumlah < 1) {
        return 'Jumlah minimal 1.';
    }
    if (item.jumlah > item.aset.stokTersedia) {
        return `Jumlah melebihi ketersediaan (maksimal ${item.aset.stokTersedia}).`;
    }
    return null;
}

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
    /** Alat yang sedang ditambahi unit fisik (PR-18). */
    const [unitAlat, setUnitAlat] = useState<Aset | null>(null);
    const [unitError, setUnitError] = useState<string | null>(null);
    /** Status permintaan simpan — dikendalikan di sini lewat `onFinish`. */
    const [menyimpanAset, setMenyimpanAset] = useState(false);
    const [asetError, setAsetError] = useState<string | null>(null);
    const [menyimpanUnit, setMenyimpanUnit] = useState(false);
    const [mengajukan, setMengajukan] = useState(false);
    const [pengajuanTerkirim, setPengajuanTerkirim] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);

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

    /** Ringkasan kategori aktif untuk header katalog. */
    const ringkasanKategori = useMemo(() => {
        const itemKategori = asets.filter((a) => a.kategori === kategori);

        return {
            total: itemKategori.length,
            tersedia: itemKategori.reduce(
                (total, aset) => total + aset.stokTersedia,
                0,
            ),
        };
    }, [asets, kategori]);

    const IconKategoriAktif = kategoriIcon[kategori];
    const filterTanggalAktif = tanggalMulai !== '' && tanggalSelesai !== '';

    /** Ada filter apa pun yang aktif — menentukan pesan keadaan kosong. */
    const filterAktif =
        pencarian.trim() !== '' || unitLab !== 'semua' || filterTanggalAktif;

    function resetFilter() {
        setPencarian('');
        setUnitLab('semua');
        setTanggalMulai('');
        setTanggalSelesai('');
    }

    function tambahItemKeCart(item: CartItem) {
        const err = validasiCartItem(item);

        setCartError(null);

        if (err) {
            setCartError(err);
            return;
        }

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

        setAsetError(null);
        setMenyimpanAset(true);

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
                // Dialog tetap terbuka agar isian pengguna tidak hilang.
                setAsetError(
                    Object.values(err)[0] ??
                        'Data gagal disimpan. Periksa kembali isian Anda.',
                );
            },
            onFinish: () => setMenyimpanAset(false),
        });
    }

    /**
     * Registrasi satu unit fisik alat (PR-18).
     *
     * Stok pada kartu dihitung dari jumlah baris `detail_alat`, sehingga unit
     * baru selalu menambah `stokTotal`; `stokTersedia` hanya bertambah bila
     * unit itu berkondisi baik sekaligus berstatus tersedia.
     */
    function simpanUnit(unit: UnitAlat) {
        const alat = unitAlat;

        if (!alat) {
            return;
        }

        setUnitError(null);
        setMenyimpanUnit(true);

        router.post(
            `/katalog/alat/${alat.id}/unit`,
            {
                no_seri_unit: unit.noSeriUnit ?? null,
                kondisi: unit.kondisi,
                status: unit.status,
                tahun_pengadaan: unit.tahunPengadaan ?? null,
                sumber_dana: unit.sumberDana ?? null,
                harga_beli: unit.hargaBeli ?? null,
                catatan: unit.catatan ?? null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    const tersediaBaru =
                        unit.kondisi === 'baik' && unit.status === 'tersedia';

                    setAsets((sebelumnya) =>
                        sebelumnya.map((a) =>
                            a.id === alat.id
                                ? {
                                      ...a,
                                      stokTotal: a.stokTotal + 1,
                                      stokTersedia:
                                          a.stokTersedia +
                                          (tersediaBaru ? 1 : 0),
                                  }
                                : a,
                        ),
                    );
                    setUnitAlat(null);
                },
                onError: (err) => {
                    setUnitError(
                        Object.values(err)[0] ??
                            'Unit alat gagal disimpan. Periksa kembali isian Anda.',
                    );
                },
                onFinish: () => setMenyimpanUnit(false),
            },
        );
    }

    function ajukanPeminjaman(data?: {
        metodePembayaran?: 'transfer' | 'cash';
        buktiPembayaran?: File | null;
    }) {
        // ── Validasi semua item sebelum kirim ke backend ──
        const itemInvalid = cart.find((item) => validasiCartItem(item) !== null);

        if (itemInvalid) {
            setCartError(
                `Item "${itemInvalid.aset.nama}" memiliki data tidak valid. Hapus dulu dari keranjang sebelum mengajukan.`,
            );
            setCartTerbuka(false);
            return;
        }

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

        setCartError(null);
        setMengajukan(true);

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
                onError: (err) => {
                    setCartTerbuka(false);
                    setCartError(
                        Object.values(err)[0] ??
                            'Pengajuan gagal dikirim. Periksa kembali item keranjang Anda.',
                    );
                },
                onFinish: () => setMengajukan(false),
            },
        );
    }

    return (
        <>
            <Head title="Katalog Laboratorium" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden p-3 sm:gap-6 sm:p-6">
                <header className="bg-card overflow-hidden rounded-xl border">
                    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <div className="text-primary mb-3 flex items-center gap-2 text-xs font-medium">
                                <span className="bg-primary/10 flex size-7 items-center justify-center rounded-md">
                                    <IconKategoriAktif className="size-4" />
                                </span>
                                Inventaris laboratorium
                            </div>
                            <h1 className="text-2xl leading-tight font-semibold sm:text-[28px]">
                                Katalog Laboratorium
                            </h1>
                            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                                {canBorrow(role)
                                    ? 'Temukan alat dan ruangan yang tersedia, lalu ajukan peminjaman langsung dari katalog.'
                                    : 'Kelola inventaris alat, ruangan, bahan, dan mebeler pada empat unit laboratorium.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            {canManageKategori(role, kategori) && (
                                <Button
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        setAsetError(null);
                                        setFormAset({ mode: 'buat' });
                                    }}
                                >
                                    <Plus /> Tambah {kategoriLabels[kategori]}
                                </Button>
                            )}
                            {canBorrow(role) && (
                                <Button
                                    variant="secondary"
                                    className="w-full sm:w-auto"
                                    onClick={() => setCartTerbuka(true)}
                                >
                                    <ShoppingCart /> Keranjang
                                    <span className="bg-primary text-primary-foreground min-w-5 rounded-full px-1.5 py-0.5 text-center text-xs">
                                        {cart.length}
                                    </span>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="border-t bg-muted/35 px-5 py-3 sm:px-6">
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-card flex size-9 items-center justify-center rounded-lg border">
                                    <IconKategoriAktif className="text-primary size-4" />
                                </span>
                                <div>
                                    <p className="text-muted-foreground text-[11px]">
                                        Kategori aktif
                                    </p>
                                    <p className="text-sm font-medium">
                                        {kategoriLabels[kategori]}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-card flex size-9 items-center justify-center rounded-lg border font-mono text-sm text-primary">
                                    {ringkasanKategori.total}
                                </span>
                                <div>
                                    <p className="text-muted-foreground text-[11px]">
                                        Jenis terdaftar
                                    </p>
                                    <p className="text-sm font-medium">
                                        {ringkasanKategori.total} item katalog
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-card flex size-9 items-center justify-center rounded-lg border font-mono text-sm text-success">
                                    {ringkasanKategori.tersedia}
                                </span>
                                <div>
                                    <p className="text-muted-foreground text-[11px]">
                                        Unit tersedia
                                    </p>
                                    <p className="text-sm font-medium">
                                        Siap dipinjam saat ini
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {pengajuanTerkirim && (
                    <div className="border-success/30 bg-success/10 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm text-[#1E7050] dark:text-success">
                        <span>
                            Pengajuan peminjaman terkirim. Status akan tampil
                            di Riwayat Peminjaman.
                        </span>
                        <button
                            onClick={() => setPengajuanTerkirim(false)}
                            className="focus-visible:ring-ring/50 shrink-0 rounded-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
                        >
                            Tutup
                        </button>
                    </div>
                )}

                {cartError && (
                    <div
                        className="flex items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-[#A32E38] dark:text-destructive"
                        role="alert"
                    >
                        <span>{cartError}</span>
                        <button
                            onClick={() => setCartError(null)}
                            className="focus-visible:ring-ring/50 shrink-0 rounded-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
                        >
                            Tutup
                        </button>
                    </div>
                )}

                <section className="bg-card rounded-xl border" aria-label="Pencarian dan filter katalog">
                    <div
                        className="border-b px-4 pt-4 sm:px-5"
                        role="tablist"
                        aria-label="Kategori katalog"
                    >
                        <div className="-mb-px flex gap-1 overflow-x-auto pb-0.5">
                            {tabs.map((t) => {
                                const Icon = kategoriIcon[t];
                                const aktif = kategori === t;

                                return (
                                    <button
                                        key={t}
                                        role="tab"
                                        aria-selected={aktif}
                                        onClick={() => setKategori(t)}
                                        className={cn(
                                            'focus-visible:ring-ring/50 relative inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-4',
                                            aktif
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                                        )}
                                    >
                                        <Icon className="size-4" />
                                        {kategoriLabels[t]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                            <div className="relative w-full lg:flex-1">
                                <Label
                                    htmlFor="pencarian-katalog"
                                    className="text-muted-foreground mb-1.5 block text-xs font-medium"
                                >
                                    Cari inventaris
                                </Label>
                                <Search className="text-muted-foreground absolute bottom-2.5 left-3 size-4" />
                                <Input
                                    id="pencarian-katalog"
                                    value={pencarian}
                                    onChange={(e) => setPencarian(e.target.value)}
                                    placeholder="Nama alat, ruang, atau kode inventaris"
                                    className="pl-9"
                                />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3 lg:w-[610px]">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="filter-unit"
                                        className="text-muted-foreground text-xs font-medium"
                                    >
                                        Unit lab
                                    </Label>
                                    <Select
                                        value={unitLab}
                                        onValueChange={(v) =>
                                            setUnitLab(v as 'semua' | UnitLab)
                                        }
                                    >
                                        <SelectTrigger id="filter-unit" className="w-full">
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
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="filter-mulai"
                                        className="text-muted-foreground text-xs font-medium"
                                    >
                                        Mulai
                                    </Label>
                                    <Input
                                        id="filter-mulai"
                                        type="date"
                                        value={tanggalMulai}
                                        onChange={(e) =>
                                            setTanggalMulai(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="filter-selesai"
                                        className="text-muted-foreground text-xs font-medium"
                                    >
                                        Selesai
                                    </Label>
                                    <Input
                                        id="filter-selesai"
                                        type="date"
                                        value={tanggalSelesai}
                                        onChange={(e) =>
                                            setTanggalSelesai(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-start gap-2 text-xs text-muted-foreground">
                                <Filter className="mt-0.5 size-3.5 shrink-0" />
                                <span className="leading-relaxed">
                                    {filterTanggalAktif
                                        ? `Ketersediaan diperkirakan untuk ${tanggalMulai} s.d. ${tanggalSelesai}. `
                                        : 'Pilih rentang tanggal untuk mengecek ketersediaan. '}
                                    Stok dinamis aktif setelah integrasi backend.
                                </span>
                            </div>
                            {filterAktif && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 self-start sm:self-auto"
                                    onClick={resetFilter}
                                >
                                    <RotateCcw /> Reset filter
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base font-medium">
                            {kategoriLabels[kategori]}
                        </h2>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            Menampilkan {hasil.length} dari {ringkasanKategori.total} item
                        </p>
                    </div>
                    {filterAktif && (
                        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                            <span className="bg-primary size-1.5 rounded-full" />
                            Filter aktif
                        </span>
                    )}
                </div>

                {hasil.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-3.5">
                        {hasil.map((aset) => (
                            <AsetCard
                                key={aset.id}
                                aset={aset}
                                role={role}
                                subKategori={kategoriEksternal}
                                onDetail={setDetail}
                                onTambahKeCart={setTambahKeCart}
                                onUbah={(a) => {
                                    setAsetError(null);
                                    setFormAset({ mode: 'ubah', aset: a });
                                }}
                                onTambahUnit={(a) => {
                                    setUnitError(null);
                                    setUnitAlat(a);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                        <PackageOpen className="text-muted-foreground mx-auto size-7" />
                        <p className="mt-3 text-sm font-medium">
                            {filterAktif
                                ? `Tidak ada ${kategoriLabels[kategori].toLowerCase()} yang cocok`
                                : `Belum ada data ${kategoriLabels[kategori].toLowerCase()}`}
                        </p>
                        <p className="text-muted-foreground mx-auto mt-1 max-w-md text-xs leading-relaxed">
                            {filterAktif
                                ? 'Coba ubah kata kunci, unit laboratorium, atau rentang tanggal.'
                                : canManageKategori(role, kategori)
                                  ? `Mulai dengan menambahkan data lewat tombol Tambah ${kategoriLabels[kategori]} di atas.`
                                  : 'Data akan tampil setelah pengelola laboratorium menambahkannya.'}
                        </p>
                        {filterAktif && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="mt-4"
                                onClick={resetFilter}
                            >
                                <RotateCcw /> Reset filter
                            </Button>
                        )}
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
                onOpenChange={(open) => {
                    if (!open) {
                        setTambahKeCart(null);
                        setCartError(null);
                    }
                }}
                onSimpan={tambahItemKeCart}
            />

            <CartDialog
                open={cartTerbuka}
                items={cart.filter((item) => item && item.aset)}
                role={role}
                subKategori={kategoriEksternal}
                onOpenChange={setCartTerbuka}
                onHapus={hapusDariCart}
                onAjukan={ajukanPeminjaman}
                submitting={mengajukan}
            />

            <ItemFormDialog
                state={formAset}
                kategori={kategori}
                onOpenChange={(open) => {
                    if (!open) {
                        setFormAset(null);
                        setAsetError(null);
                    }
                }}
                onSimpan={simpanAset}
                submitting={menyimpanAset}
                errorBackend={asetError}
            />

            <UnitFormDialog
                alat={unitAlat}
                errorBackend={unitError}
                submitting={menyimpanUnit}
                onOpenChange={(open) => {
                    if (!open) {
                        setUnitAlat(null);
                        setUnitError(null);
                    }
                }}
                onSimpan={simpanUnit}
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
