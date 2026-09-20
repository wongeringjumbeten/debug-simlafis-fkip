import type { Role } from './katalog';

/**
 * Status pengajuan untuk tampilan.
 *
 * Dipetakan dari `status_keseluruhan` di basis data (menunggu, disetujui,
 * ditolak, dipinjam, terlambat, dikembalikan, dibatalkan) menjadi lima nilai
 * yang bermakna bagi pengguna.
 */
export type StatusPengajuan =
    | 'pending'
    | 'disetujui'
    | 'ditolak'
    | 'dipinjam'
    | 'selesai';

/** Cakupan data: rekap seluruh lab vs milik pengguna sendiri (Product Functions §2). */
export type DashboardScope = 'lab' | 'self';

/** Periode grafik tren: 30 hari terakhir atau rekap 12 bulan tahun berjalan. */
export type ChartPeriode = 'harian' | 'bulanan';

/** Hitungan pengajuan per status, dipisah untuk alat dan ruangan (PR-12). */
export interface StatusCounts {
    total: number;
    pending: number;
    disetujui: number;
    ditolak: number;
    dipinjam: number;
}

/** Ringkasan aktivitas peminjaman milik pengguna sendiri (PR-13). */
export interface RingkasanPeminjam {
    total: number;
    menunggu: number;
    disetujui: number;
    berjalan: number;
    selesai: number;
    ditolak: number;
}

export interface DashboardChart {
    labels: string[];
    alat: number[];
    ruangan: number[];
}

export interface DashboardRow {
    kode: string;
    aset: string;
    kategori: string;
    peminjam: string;
    /** Status yang sudah dipetakan untuk tampilan. */
    status: StatusPengajuan;
    /** Status apa adanya dari basis data, mis. `terlambat`. */
    statusAsli: string;
    tanggal: string;
    /** Tenggat pengembalian (ISO date) — diisi pada notifikasi pengembalian. */
    jatuhTempo?: string | null;
    /** Selisih hari menuju tenggat; negatif berarti sudah terlambat. */
    hariTersisa?: number | null;
    /** Penanda dari basis data bahwa pengajuan berstatus terlambat. */
    terlambat?: boolean;
}

export interface DashboardInventaris {
    totalAlat: number;
    totalRuangan: number;
    totalBahan: number;
    totalMebeler: number;
    totalPengguna: number;
}

/**
 * Prop halaman dashboard.
 *
 * Bentuknya berbeda menurut peran:
 * - peran pengelola (`isLab`) menerima `statsAlat`, `statsRuangan`, `chart`,
 *   `inventaris`, dan `pendapatanBulanIni` (khusus Admin);
 * - peran peminjam menerima `ringkasan` dan `notifikasiPengembalian`.
 *
 * `recentPengajuan` dikirim untuk kedua peran.
 */
export interface DashboardProps {
    role: Role;
    scope: DashboardScope;
    isLab: boolean;
    showRevenue: boolean;

    /** Khusus Admin (ADM-04). */
    pendapatanBulanIni?: number;

    /** Khusus peran pengelola (PR-12). */
    chartPeriode?: ChartPeriode;
    statsAlat?: StatusCounts;
    statsRuangan?: StatusCounts;
    chart?: DashboardChart;
    inventaris?: DashboardInventaris;

    /** Khusus peran peminjam (PR-13). */
    ringkasan?: RingkasanPeminjam;
    notifikasiPengembalian?: DashboardRow[];

    recentPengajuan: DashboardRow[];
}
