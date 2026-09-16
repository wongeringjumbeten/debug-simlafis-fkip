import type { Role, UnitLab } from './katalog';

/**
 * Status pengajuan yang dihitung di kartu dashboard (ADM-05):
 * Pending / Disetujui / Ditolak / Sedang Dipinjam. "Seluruh" = total.
 */
export type StatusPengajuan = 'pending' | 'disetujui' | 'ditolak' | 'dipinjam';

/** Cakupan data: rekap seluruh lab vs milik pengguna sendiri (Product Functions §2). */
export type DashboardScope = 'lab' | 'self';

/** Periode grafik: 30 hari terakhir atau rekap 12 bulan. */
export type ChartPeriode = 'harian' | 'bulanan';

/** Filter unit laboratorium pada grafik; "semua" = gabungan 4 unit lab. */
export type ChartLab = 'semua' | UnitLab;

export interface ChartFilters {
    periode: ChartPeriode;
    lab: ChartLab;
}

export interface DashboardStats {
    total: number;
    pending: number;
    disetujui: number;
    ditolak: number;
    dipinjam: number;
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
    status: StatusPengajuan;
    tanggal: string;
}

export interface DashboardProps {
    role: Role;
    scope: DashboardScope;
    isLab: boolean;
    showRevenue: boolean;
    pendapatanBulanIni?: number;
    stats: DashboardStats;
    chart: DashboardChart;
    chartFilters: ChartFilters;
    recentPengajuan: DashboardRow[];
}
