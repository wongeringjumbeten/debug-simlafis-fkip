export type KategoriAset = 'alat' | 'ruangan' | 'bahan' | 'mebeler';

export type UnitLab = 'dasar' | 'elektronika' | 'lanjut' | 'elf';

export type KondisiAset = 'baik' | 'perlu_perawatan' | 'rusak';

export type Role = 'admin' | 'kalab' | 'plp' | 'dosen' | 'mhs' | 'ekst';

export type SubKategoriEksternal = 'internal_unej' | 'luar_unej';

export interface Aset {
    id: number;
    /** Kode inventaris (format: FIS-OSC-014) — ditampilkan dengan IBM Plex Mono */
    kode: string;
    nama: string;
    kategori: KategoriAset;
    unitLab: UnitLab;
    lokasi?: string;
    spesifikasi?: string;
    stokTotal: number;
    stokTersedia: number;
    kondisi: KondisiAset;
    /** Kapasitas orang — khusus ruangan */
    kapasitas?: number;
    /** Tarif sewa per hari (Rupiah) — hanya alat & ruangan (BR-2) */
    tarifInternalUnej?: number;
    tarifLuarUnej?: number;
}

export interface CartItem {
    aset: Aset;
    tanggalMulai: string;
    tanggalSelesai: string;
    jamMulai: string;
    jamSelesai: string;
    jumlah: number;
}
