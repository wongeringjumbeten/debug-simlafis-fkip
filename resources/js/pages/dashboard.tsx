import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    Package,
    XCircle,
} from 'lucide-react';
import {
    formatRupiah,
    formatTanggal,
    unitLabLabels,
} from '@/pages/katalog/helpers';
import { StatusBadge, type StatusTone } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardBarChart } from '@/components/dashboard-bar-chart';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import type {
    ChartFilters,
    DashboardProps,
    StatusPengajuan,
    UnitLab,
} from '@/types';

const statusTone: Record<StatusPengajuan, StatusTone> = {
    pending: 'warning',
    disetujui: 'success',
    ditolak: 'destructive',
    dipinjam: 'info',
};

const statusLabel: Record<StatusPengajuan, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    dipinjam: 'Dipinjam',
};

function StatCard({
    title,
    value,
    icon: Icon,
    hint,
}: {
    title: string;
    value: number;
    icon: React.FC<{ className?: string }>;
    hint?: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {hint && (
                    <p className="text-muted-foreground text-xs">{hint}</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    scope,
    isLab,
    showRevenue,
    pendapatanBulanIni = 0,
    stats,
    chart,
    chartFilters,
    recentPengajuan,
    inventaris,
}: DashboardProps) {
    const { auth } = usePage().props;

    function applyChartFilter(next: Partial<ChartFilters>) {
        const merged = { ...chartFilters, ...next };
        router.get(dashboard().url, merged, {
            only: ['chart', 'chartFilters'],
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header>
                    <h1 className="text-[28px] leading-tight font-semibold">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {isLab
                            ? 'Ringkasan aktivitas seluruh laboratorium'
                            : `Ringkasan peminjaman Anda (${auth.user?.name})`}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {scope === 'lab'
                            ? 'Cakupan: seluruh lab'
                            : 'Cakupan: data Anda'}{' '}
                        · Pratinjau UI — seluruh angka, grafik, dan daftar
                        adalah data simulasi sampai modul transaksi tersambung
                        (REQ-13).
                    </p>
                </header>

                {/* Pendapatan — khusus Admin (ADM-04) */}
                {showRevenue && (
                    <div className="bg-card rounded-xl border p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D0E1F2]">
                                    <DollarSign className="h-6 w-6 text-[#0F4C81]" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">
                                        Pendapatan Bulan Ini
                                    </p>
                                    <p className="text-2xl font-bold text-[#1D3557]">
                                        {formatRupiah(pendapatanBulanIni)}
                                    </p>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-right text-xs">
                                Akumulasi alat & ruangan (ADM-04)
                            </p>
                        </div>
                    </div>
                )}

                {/* Inventaris nyata (user story 12) — hanya scope lab */}
                {isLab && inventaris && (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Jenis Alat"
                            value={inventaris.totalAlat}
                            icon={Package}
                            hint="Master alat terdaftar"
                        />
                        <StatCard
                            title="Ruangan"
                            value={inventaris.totalRuangan}
                            icon={FileText}
                            hint="Ruang laboratorium"
                        />
                        <StatCard
                            title="Bahan"
                            value={inventaris.totalBahan}
                            icon={Clock}
                            hint="Jenis bahan tercatat"
                        />
                        <StatCard
                            title="Pengguna"
                            value={inventaris.totalPengguna}
                            icon={CheckCircle2}
                            hint="Akun terdaftar"
                        />
                    </div>
                )}

                {/* Total per status (ADM-05) */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        title="Seluruh"
                        value={stats.total}
                        icon={FileText}
                        hint="Total pengajuan"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        icon={Clock}
                        hint="Menunggu approval"
                    />
                    <StatCard
                        title="Disetujui"
                        value={stats.disetujui}
                        icon={CheckCircle2}
                        hint="Siap dipinjam"
                    />
                    <StatCard
                        title="Ditolak"
                        value={stats.ditolak}
                        icon={XCircle}
                        hint="Perlu perbaikan"
                    />
                    <StatCard
                        title="Sedang Dipinjam"
                        value={stats.dipinjam}
                        icon={Package}
                        hint="Aktif"
                    />
                </div>

                {/* Grafik (ADM-06) — filter periode & unit laboratorium */}
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="font-medium text-[#1D3557]">
                                {chartFilters.periode === 'harian'
                                    ? 'Peminjaman alat & ruangan per hari'
                                    : 'Peminjaman alat & ruangan per bulan'}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                {chartFilters.periode === 'harian'
                                    ? '30 hari terakhir'
                                    : 'Rekap 12 bulan'}{' '}
                                ·{' '}
                                {chartFilters.lab === 'semua'
                                    ? 'Semua laboratorium'
                                    : unitLabLabels[
                                          chartFilters.lab as UnitLab
                                      ]}{' '}
                                · {isLab ? 'seluruh lab' : 'data Anda'} (ADM-06)
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
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
                                        aria-selected={
                                            chartFilters.periode === p
                                        }
                                        onClick={() =>
                                            applyChartFilter({ periode: p })
                                        }
                                        className={cn(
                                            'focus-visible:ring-ring/50 rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                            chartFilters.periode === p
                                                ? 'bg-card text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <Select
                                value={chartFilters.lab}
                                onValueChange={(v) =>
                                    applyChartFilter({
                                        lab: v as ChartFilters['lab'],
                                    })
                                }
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="w-44"
                                    aria-label="Filter laboratorium"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">
                                        Semua laboratorium
                                    </SelectItem>
                                    {(
                                        Object.keys(unitLabLabels) as UnitLab[]
                                    ).map((u) => (
                                        <SelectItem key={u} value={u}>
                                            {unitLabLabels[u]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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
                </div>

                {/* 10 pengajuan terbaru (ADM-07) */}
                <div className="bg-card rounded-xl border">
                    <div className="border-b px-4 py-3">
                        <h3 className="font-medium text-[#1D3557]">
                            Pengajuan Terbaru
                        </h3>
                        <p className="text-muted-foreground text-xs">
                            {isLab
                                ? 'Seluruh pengajuan peminjaman (ADM-07)'
                                : 'Pengajuan peminjaman Anda'}
                        </p>
                    </div>
                    {recentPengajuan.length > 0 ? (
                        <div className="divide-border divide-y">
                            {recentPengajuan.map((item) => (
                                <div
                                    key={item.kode}
                                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <span className="text-muted-foreground shrink-0 font-mono text-[13px]">
                                            {item.kode}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {item.aset}
                                            </p>
                                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                {item.kategori}
                                                {isLab && (
                                                    <span>
                                                        · {item.peminjam}
                                                    </span>
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
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <p className="text-muted-foreground text-sm">
                                Belum ada pengajuan. Buat dari menu Katalog
                                untuk memulainya.
                            </p>
                        </div>
                    )}
                </div>
            </div>
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
