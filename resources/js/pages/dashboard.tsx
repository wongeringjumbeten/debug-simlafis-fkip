import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Boxes,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Clock,
    DollarSign,
    FileText,
    History,
    Inbox,
    Package,
    PackageOpen,
    TrendingUp,
    XCircle,
} from 'lucide-react';

import { StatusBadge, type StatusTone } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardBarChart } from '@/components/dashboard-bar-chart';
import { cn } from '@/lib/utils';
import { formatRupiah, formatTanggal } from '@/pages/katalog/helpers';
import { dashboard, katalog, riwayat } from '@/routes';
import type {
    ChartPeriode,
    DashboardInventaris,
    DashboardProps,
    DashboardRow,
    RingkasanPeminjam,
    StatusCounts,
    StatusPengajuan,
} from '@/types';

const statusLabel: Record<StatusPengajuan, string> = {
    pending: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    dipinjam: 'Sedang Dipinjam',
    selesai: 'Selesai',
};

const statusTone: Record<StatusPengajuan, StatusTone> = {
    pending: 'warning',
    disetujui: 'success',
    ditolak: 'destructive',
    dipinjam: 'info',
    selesai: 'neutral',
};

/** Kartu angka ringkas. */
function StatCard({
    title,
    value,
    icon: Icon,
    hint,
    tone = 'default',
}: {
    title: string;
    value: number;
    icon: React.FC<{ className?: string }>;
    hint?: string;
    tone?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
}) {
    const toneClass = {
        default: 'text-muted-foreground',
        success: 'text-success',
        warning: 'text-warning',
        destructive: 'text-destructive',
        info: 'text-primary',
    }[tone];

    return (
        <Card className="gap-0 py-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn('h-4 w-4', toneClass)} />
            </CardHeader>
            <CardContent>
                <div className="font-mono text-2xl font-semibold">{value}</div>
                {hint && (
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        {hint}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

/** Keadaan kosong yang menjelaskan data apa yang akan tampil di sini. */
function Kosong({
    judul,
    keterangan,
    icon: Icon = Inbox,
}: {
    judul: string;
    keterangan: string;
    icon?: React.FC<{ className?: string }>;
}) {
    return (
        <div className="rounded-lg border border-dashed px-6 py-10 text-center">
            <Icon className="text-muted-foreground mx-auto size-6" />
            <p className="mt-3 text-sm font-medium">{judul}</p>
            <p className="text-muted-foreground mx-auto mt-1 max-w-md text-xs leading-relaxed">
                {keterangan}
            </p>
        </div>
    );
}

/** Tabel ringkas pengajuan. */
function DaftarPengajuan({
    items,
    tampilkanPeminjam,
}: {
    items: DashboardRow[];
    tampilkanPeminjam: boolean;
}) {
    return (
        <div className="divide-border divide-y">
            {items.map((item) => (
                <div
                    key={item.kode}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6"
                >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="text-muted-foreground shrink-0 font-mono text-[13px]">
                            {item.kode}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-medium">{item.aset}</p>
                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                {item.kategori}
                                {tampilkanPeminjam && (
                                    <span>· {item.peminjam}</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge
                            label={statusLabel[item.status]}
                            tone={statusTone[item.status]}
                        />
                        <time className="text-muted-foreground hidden font-mono text-xs sm:block">
                            {formatTanggal(item.tanggal)}
                        </time>
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Ringkasan inventaris untuk peran pengelola. */
function KartuInventaris({ inventaris }: { inventaris: DashboardInventaris }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
                title="Jenis Alat"
                value={inventaris.totalAlat}
                icon={Package}
                hint="Master alat terdaftar"
                tone="info"
            />
            <StatCard
                title="Ruangan"
                value={inventaris.totalRuangan}
                icon={CalendarClock}
                hint="Ruang laboratorium"
            />
            <StatCard
                title="Bahan"
                value={inventaris.totalBahan}
                icon={Boxes}
                hint="Jenis bahan tercatat"
            />
            <StatCard
                title="Mebeler"
                value={inventaris.totalMebeler}
                icon={FileText}
                hint="Jenis mebeler tercatat"
            />
            <StatCard
                title="Pengguna"
                value={inventaris.totalPengguna}
                icon={CheckCircle2}
                hint="Akun terdaftar"
            />
        </div>
    );
}

/** Blok statistik per status untuk satu kategori aset. */
function BlokStatistik({
    judul,
    keterangan,
    stat,
}: {
    judul: string;
    keterangan: string;
    stat: StatusCounts;
}) {
    return (
        <section className="space-y-3">
            <div>
                <h2 className="text-base font-medium">{judul}</h2>
                <p className="text-muted-foreground text-sm">{keterangan}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    title="Seluruh"
                    value={stat.total}
                    icon={ClipboardList}
                    hint="Total pengajuan"
                />
                <StatCard
                    title="Menunggu"
                    value={stat.pending}
                    icon={Clock}
                    hint="Perlu persetujuan"
                    tone="warning"
                />
                <StatCard
                    title="Disetujui"
                    value={stat.disetujui}
                    icon={CheckCircle2}
                    hint="Siap diambil"
                    tone="success"
                />
                <StatCard
                    title="Ditolak"
                    value={stat.ditolak}
                    icon={XCircle}
                    hint="Tidak disetujui"
                    tone="destructive"
                />
                <StatCard
                    title="Sedang Dipinjam"
                    value={stat.dipinjam}
                    icon={Package}
                    hint="Belum dikembalikan"
                    tone="info"
                />
            </div>
        </section>
    );
}

const STAT_NOL: StatusCounts = {
    total: 0,
    pending: 0,
    disetujui: 0,
    ditolak: 0,
    dipinjam: 0,
};

/**
 * Dashboard pengelola — Admin, KaLab, PLP (PR-12).
 *
 * Menampilkan agregat seluruh laboratorium. Akumulasi pendapatan hanya untuk
 * Admin; server tidak mengirimkannya untuk peran lain.
 */
function DashboardPengelola({
    showRevenue,
    pendapatanBulanIni = 0,
    chartPeriode = 'bulanan',
    statsAlat,
    statsRuangan,
    chart,
    inventaris,
    recentPengajuan,
}: DashboardProps) {
    const { auth } = usePage().props;

    function gantiPeriode(periode: ChartPeriode) {
        router.get(
            dashboard().url,
            { periode },
            {
                only: ['chart', 'chartPeriode'],
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    const adaDataChart = chart
        ? chart.alat.some((v) => v > 0) || chart.ruangan.some((v) => v > 0)
        : false;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
            <header>
                <h1 className="text-2xl leading-tight font-semibold sm:text-[28px]">
                    Dashboard Laboratorium
                </h1>
                <p className="text-muted-foreground text-sm">
                    Ringkasan operasional seluruh laboratorium ·{' '}
                    {auth.user?.name}
                </p>
            </header>

            {/* Akumulasi pendapatan — khusus Admin (ADM-04) */}
            {showRevenue && (
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                                <DollarSign className="text-primary h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Pendapatan Bulan Ini
                                </p>
                                <p className="font-mono text-2xl font-semibold">
                                    {formatRupiah(pendapatanBulanIni)}
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-right text-xs">
                            Transaksi sewa eksternal yang sudah lunas (ADM-04)
                        </p>
                    </div>
                </div>
            )}

            {inventaris && <KartuInventaris inventaris={inventaris} />}

            <BlokStatistik
                judul="Statistik Peminjaman Alat"
                keterangan="Seluruh pengajuan yang memuat alat laboratorium."
                stat={statsAlat ?? STAT_NOL}
            />

            <BlokStatistik
                judul="Statistik Peminjaman Ruangan"
                keterangan="Seluruh pengajuan yang memuat ruang laboratorium."
                stat={statsRuangan ?? STAT_NOL}
            />

            {/* Grafik tren (ADM-06) */}
            <div className="bg-card rounded-xl border p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="flex items-center gap-2 font-medium">
                            <TrendingUp className="text-primary size-4" />
                            Tren Peminjaman
                        </h2>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            {chartPeriode === 'harian'
                                ? 'Frekuensi harian 30 hari terakhir'
                                : 'Frekuensi bulanan tahun berjalan'}{' '}
                            · seluruh laboratorium (ADM-06)
                        </p>
                    </div>
                    <div
                        className="bg-muted inline-flex rounded-md p-0.5"
                        role="tablist"
                        aria-label="Periode grafik"
                    >
                        {(['harian', 'bulanan'] as const).map((p) => (
                            <button
                                key={p}
                                type="button"
                                role="tab"
                                aria-selected={chartPeriode === p}
                                onClick={() => gantiPeriode(p)}
                                className={cn(
                                    'focus-visible:ring-ring/50 rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                    chartPeriode === p
                                        ? 'bg-card text-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    {chart && adaDataChart ? (
                        <DashboardBarChart
                            labels={chart.labels}
                            series={[
                                {
                                    key: 'alat',
                                    label: 'Alat',
                                    data: chart.alat,
                                    barClass: 'bg-chart-1',
                                },
                                {
                                    key: 'ruangan',
                                    label: 'Ruangan',
                                    data: chart.ruangan,
                                    barClass: 'bg-chart-2',
                                },
                            ]}
                        />
                    ) : (
                        <Kosong
                            judul="Belum ada transaksi pada periode ini"
                            keterangan="Grafik akan terisi otomatis begitu pengajuan peminjaman tercatat pada rentang tanggal yang dipilih."
                            icon={TrendingUp}
                        />
                    )}
                </div>
            </div>

            {/* 10 pengajuan terbaru (ADM-07) */}
            <section className="bg-card rounded-xl border">
                <div className="border-b px-4 py-3 sm:px-6">
                    <h2 className="font-medium">Pengajuan Terbaru</h2>
                    <p className="text-muted-foreground text-xs">
                        10 transaksi terakhir seluruh laboratorium (ADM-07)
                    </p>
                </div>
                {recentPengajuan.length > 0 ? (
                    <DaftarPengajuan
                        items={recentPengajuan}
                        tampilkanPeminjam
                    />
                ) : (
                    <div className="p-4 sm:p-6">
                        <Kosong
                            judul="Belum ada pengajuan peminjaman"
                            keterangan="Daftar ini akan terisi begitu pengguna mulai mengajukan peminjaman melalui katalog."
                            icon={ClipboardList}
                        />
                    </div>
                )}
            </section>
        </div>
    );
}

const RINGKASAN_NOL: RingkasanPeminjam = {
    total: 0,
    menunggu: 0,
    disetujui: 0,
    berjalan: 0,
    selesai: 0,
    ditolak: 0,
};

/**
 * Dashboard peminjam — Dosen, Mahasiswa, Eksternal (PR-13).
 *
 * Seluruhnya bersumber dari data milik pengguna yang sedang masuk.
 */
function DashboardPeminjam({
    ringkasan,
    notifikasiPengembalian = [],
    recentPengajuan,
}: DashboardProps) {
    const { auth } = usePage().props;

    const ringkas = ringkasan ?? RINGKASAN_NOL;

    const tautan = [
        {
            label: 'Katalog Alat',
            keterangan: 'Cari dan ajukan peminjaman alat',
            href: katalog(),
            icon: Boxes,
        },
        {
            label: 'Riwayat Peminjaman',
            keterangan: 'Pantau status pengajuan Anda',
            href: riwayat(),
            icon: History,
        },
    ];

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
            <header>
                <h1 className="text-2xl leading-tight font-semibold sm:text-[28px]">
                    Dashboard Saya
                </h1>
                <p className="text-muted-foreground text-sm">
                    Ringkasan peminjaman Anda · {auth.user?.name}
                </p>
            </header>

            {/* Ringkasan aktivitas peminjaman */}
            <section className="space-y-3">
                <h2 className="text-base font-medium">
                    Ringkasan Aktivitas Peminjaman
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        title="Total Pengajuan"
                        value={ringkas.total}
                        icon={ClipboardList}
                        hint="Seluruh pengajuan Anda"
                    />
                    <StatCard
                        title="Menunggu"
                        value={ringkas.menunggu}
                        icon={Clock}
                        hint="Menunggu persetujuan"
                        tone="warning"
                    />
                    <StatCard
                        title="Disetujui"
                        value={ringkas.disetujui}
                        icon={CheckCircle2}
                        hint="Siap diambil"
                        tone="success"
                    />
                    <StatCard
                        title="Berjalan"
                        value={ringkas.berjalan}
                        icon={Package}
                        hint="Sedang Anda pinjam"
                        tone="info"
                    />
                    <StatCard
                        title="Selesai"
                        value={ringkas.selesai}
                        icon={FileText}
                        hint="Sudah dikembalikan"
                    />
                </div>
            </section>

            {/* Notifikasi pengembalian */}
            <section className="bg-card rounded-xl border">
                <div className="border-b px-4 py-3 sm:px-6">
                    <h2 className="flex items-center gap-2 font-medium">
                        <AlertTriangle className="text-warning size-4" />
                        Notifikasi Pengembalian
                    </h2>
                    <p className="text-muted-foreground text-xs">
                        {notifikasiPengembalian.length > 0
                            ? `${notifikasiPengembalian.length} peminjaman masih berjalan`
                            : 'Tidak ada peminjaman berjalan'}
                    </p>
                </div>

                {notifikasiPengembalian.length > 0 ? (
                    <div className="divide-border divide-y">
                        {notifikasiPengembalian.map((item) => {
                            const sisa = item.hariTersisa ?? null;
                            let label = 'Sedang dipinjam';
                            let tone: StatusTone = 'info';

                            if (item.terlambat || (sisa !== null && sisa < 0)) {
                                label =
                                    sisa === null
                                        ? 'Terlambat'
                                        : `Terlambat ${Math.abs(sisa)} hari`;
                                tone = 'destructive';
                            } else if (sisa === 0) {
                                label = 'Jatuh tempo hari ini';
                                tone = 'destructive';
                            } else if (sisa !== null && sisa <= 2) {
                                label = `${sisa} hari lagi`;
                                tone = 'warning';
                            } else if (sisa !== null) {
                                label = `${sisa} hari lagi`;
                                tone = 'neutral';
                            }

                            return (
                                <div
                                    key={item.kode}
                                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="text-muted-foreground shrink-0 font-mono text-[13px]">
                                            {item.kode}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {item.aset}
                                            </p>
                                            {item.jatuhTempo && (
                                                <p className="text-muted-foreground text-xs">
                                                    Tenggat{' '}
                                                    {formatTanggal(
                                                        item.jatuhTempo,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <StatusBadge label={label} tone={tone} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4 sm:p-6">
                        <Kosong
                            judul="Tidak ada alat yang sedang Anda pinjam"
                            keterangan="Peringatan tenggat pengembalian akan muncul di sini ketika Anda memiliki peminjaman berjalan."
                            icon={PackageOpen}
                        />
                    </div>
                )}
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Status peminjaman terkini */}
                <section className="bg-card rounded-xl border lg:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
                        <div>
                            <h2 className="font-medium">
                                Status Peminjaman Terkini
                            </h2>
                            <p className="text-muted-foreground text-xs">
                                5 pengajuan terakhir beserta statusnya
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={riwayat()}>
                                Lihat semua <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                    {recentPengajuan.length > 0 ? (
                        <DaftarPengajuan
                            items={recentPengajuan}
                            tampilkanPeminjam={false}
                        />
                    ) : (
                        <div className="p-4 sm:p-6">
                            <Kosong
                                judul="Belum ada pengajuan"
                                keterangan="Buat pengajuan pertama Anda dari Katalog Alat, lalu statusnya akan tampil di sini."
                                icon={ClipboardList}
                            />
                        </div>
                    )}
                </section>

                {/* Akses cepat */}
                <section className="bg-card flex flex-col rounded-xl border p-4">
                    <h2 className="font-medium">Akses Cepat</h2>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        Pintasan ke menu yang paling sering dipakai.
                    </p>
                    <div className="mt-3 flex flex-1 flex-col gap-2">
                        {tautan.map(
                            ({ label, keterangan, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="hover:bg-accent focus-visible:ring-ring/50 flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                >
                                    <Icon className="text-primary size-4 shrink-0" />
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-medium">
                                            {label}
                                        </span>
                                        <span className="text-muted-foreground block text-xs">
                                            {keterangan}
                                        </span>
                                    </span>
                                    <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                                </Link>
                            ),
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function Dashboard(props: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            {props.isLab ? (
                <DashboardPengelola {...props} />
            ) : (
                <DashboardPeminjam {...props} />
            )}
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
