import type {
    Aset,
    KategoriAset,
    KondisiAset,
    Role,
    SubKategoriEksternal,
    UnitLab,
} from '@/types';

export const kategoriLabels: Record<KategoriAset, string> = {
    alat: 'Alat',
    ruangan: 'Ruangan',
    bahan: 'Bahan',
    mebeler: 'Mebeler',
};

export const unitLabLabels: Record<UnitLab, string> = {
    dasar: 'Lab Dasar',
    elektronika: 'Lab Elektronika',
    lanjut: 'Lab Lanjut',
    elf: 'Lab ELF',
};

export const kondisiLabels: Record<KondisiAset, string> = {
    baik: 'Kondisi Baik',
    perlu_perawatan: 'Perlu Perawatan',
    rusak: 'Rusak',
};

export const kondisiTone: Record<
    KondisiAset,
    'success' | 'warning' | 'destructive'
> = {
    baik: 'success',
    perlu_perawatan: 'warning',
    rusak: 'destructive',
};

/** Tab katalog yang terlihat per role — Bahan disembunyikan dari Dosen/Mahasiswa/Eksternal (REQ-11). */
export const tabsByRole: Record<Role, KategoriAset[]> = {
    admin: ['alat', 'ruangan', 'bahan', 'mebeler'],
    kalab: ['alat', 'ruangan', 'bahan', 'mebeler'],
    plp: ['alat', 'ruangan', 'bahan', 'mebeler'],
    dosen: ['alat', 'ruangan'],
    mhs: ['alat', 'ruangan'],
    ekst: ['alat', 'ruangan'],
};

/** Pengelolaan master data: alat & ruangan oleh Admin/PLP, bahan & mebeler hanya PLP (ADM-11..14, PLP-03..06). */
export function canManageKategori(role: Role, kategori: KategoriAset): boolean {
    if (kategori === 'alat' || kategori === 'ruangan') {
        return role === 'admin' || role === 'plp';
    }
    return role === 'plp';
}

/** Peminjam yang punya keranjang sesi: Dosen, Mahasiswa, Eksternal (REQ-13). */
export function canBorrow(role: Role): boolean {
    return role === 'dosen' || role === 'mhs' || role === 'ekst';
}

/** Harga disembunyikan dari Dosen/Mahasiswa (REQ-12). */
export function canSeeTarif(role: Role): boolean {
    return (
        role === 'admin' ||
        role === 'kalab' ||
        role === 'plp' ||
        role === 'ekst'
    );
}

/** Tarif yang relevan bagi pengguna eksternal sesuai sub-kategorinya (BR-2). */
export function tarifUntuk(
    aset: Aset,
    subKategori?: SubKategoriEksternal,
): number | undefined {
    if (aset.tarifInternalUnej === undefined) {
        return undefined;
    }
    return subKategori === 'luar_unej'
        ? aset.tarifLuarUnej
        : aset.tarifInternalUnej;
}

const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
    return rupiah.format(value);
}

export function formatTanggal(iso: string): string {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/** Jumlah hari kalender inklusif antara dua tanggal (min. 1). */
export function hitungHari(
    tanggalMulai: string,
    tanggalSelesai: string,
): number {
    const selisih =
        new Date(tanggalSelesai).getTime() - new Date(tanggalMulai).getTime();
    if (Number.isNaN(selisih)) {
        return 1;
    }
    return Math.max(1, Math.floor(selisih / 86_400_000) + 1);
}
