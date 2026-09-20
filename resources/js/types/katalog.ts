export type KategoriAset = 'alat' | 'ruangan' | 'bahan' | 'mebeler';

export type UnitLab = 'dasar' | 'elektronika' | 'lanjut' | 'elf';

export type KondisiAset = 'baik' | 'perlu_perawatan' | 'rusak';

/**
 * Kondisi fisik satu unit alat. Berbeda dari {@link KondisiAset} yang merupakan
 * nilai tampilan gabungan: ini nilai mentah `detail_alat.kondisi` yang dikirim
 * ke backend (lihat `App\Models\DetailAlat`).
 */
export type KondisiUnit = 'baik' | 'rusak' | 'sedang perbaikan';

/** Status operasional satu unit alat — nilai mentah `detail_alat.status`. */
export type StatusUnit = 'tersedia' | 'tidak tersedia' | 'sedang perbaikan';

/** Data satu unit fisik alat, sebagaimana diisi pada formulir PR-18. */
export interface UnitAlat {
    noSeriUnit?: string;
    kondisi: KondisiUnit;
    status: StatusUnit;
    tahunPengadaan?: string;
    sumberDana?: string;
    hargaBeli?: number;
    catatan?: string;
}

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
    /** Path foto publik relatif root, mis. /images/katalog/alat/xxx.png */
    foto?: string | null;
}

export interface CartItem {
    aset: Aset;
    tanggalMulai: string;
    tanggalSelesai: string;
    jamMulai: string;
    jamSelesai: string;
    jumlah: number;
}
