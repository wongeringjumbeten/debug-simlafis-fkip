import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ChartSeries {
    key: string;
    label: string;
    data: number[];
    /** Kelas warna Tailwind berbasis token, mis. "bg-chart-1". */
    barClass: string;
}

interface DashboardBarChartProps {
    labels: string[];
    series: ChartSeries[];
    /** Tinggi area plot dalam piksel. */
    height?: number;
    ariaLabel?: string;
}

const PLOT_HEIGHT = 220;
const TICK_TARGET = 4;

/** Langkah sumbu Y integer "indah" (kelipatan 1/2/5 x 10^n), minimal 1. */
function niceStep(max: number): number {
    const rough = Math.max(max, 1) / TICK_TARGET;
    const magnitude = 10 ** Math.floor(Math.log10(rough));
    const normalized = rough / magnitude;
    const factor =
        normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return Math.max(1, Math.round(factor * magnitude));
}

function computeScale(max: number): { niceMax: number; step: number } {
    const step = niceStep(max);
    const niceMax = Math.max(step, Math.ceil(Math.max(max, 1) / step) * step);
    return { niceMax, step };
}

export function DashboardBarChart({
    labels,
    series,
    height = PLOT_HEIGHT,
    ariaLabel,
}: DashboardBarChartProps) {
    const [hidden, setHidden] = useState<Set<string>>(() => new Set());
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const visibleSeries = series.filter((s) => !hidden.has(s.key));
    const peak = visibleSeries.reduce((m, s) => Math.max(m, ...s.data), 0);
    const { niceMax, step } = computeScale(peak);

    const ticks: number[] = [];
    for (let v = 0; v <= niceMax; v += step) {
        ticks.push(v);
    }

    function toggle(key: string) {
        setHidden((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else if (series.length - next.size > 1) {
                // sisakan minimal satu seri yang tampil
                next.add(key);
            }
            return next;
        });
    }

    const isEmpty =
        labels.length === 0 || peak === 0 || visibleSeries.length === 0;

    if (isEmpty) {
        return (
            <div
                className="text-muted-foreground flex h-40 items-center justify-center rounded-lg border border-dashed text-sm"
                role="status"
            >
                Belum ada data peminjaman untuk ditampilkan.
            </div>
        );
    }

    return (
        <div>
            {/* Legend interaktif */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                {series.map((s) => {
                    const off = hidden.has(s.key);
                    return (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => toggle(s.key)}
                            aria-pressed={!off}
                            className={cn(
                                'hover:bg-accent focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                                off && 'text-muted-foreground opacity-50',
                            )}
                        >
                            <span
                                className={cn(
                                    'h-2.5 w-2.5 rounded-sm',
                                    s.barClass,
                                    off && 'bg-muted-foreground',
                                )}
                            />
                            {s.label}
                        </button>
                    );
                })}
            </div>

            <div
                className="flex"
                role="group"
                aria-label={ariaLabel ?? 'Grafik batang peminjaman per bulan'}
            >
                {/* Sumbu Y */}
                <div
                    className="relative w-9 shrink-0"
                    style={{ height }}
                    aria-hidden="true"
                >
                    {ticks.map((t) => (
                        <span
                            key={t}
                            className="text-muted-foreground absolute right-2 translate-y-1/2 text-[10px] tabular-nums"
                            style={{ bottom: `${(t / niceMax) * 100}%` }}
                        >
                            {t}
                        </span>
                    ))}
                </div>

                {/* Area plot (scroll horizontal saat sempit; lebar mengikuti jumlah label) */}
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <div
                        style={{
                            minWidth: `${Math.max(labels.length * 34, 352)}px`,
                        }}
                    >
                        <div className="relative" style={{ height }}>
                            {/* Garis kisi */}
                            {ticks.map((t) => (
                                <div
                                    key={t}
                                    className={cn(
                                        'absolute inset-x-0 border-t',
                                        t === 0
                                            ? 'border-border'
                                            : 'border-border/60',
                                    )}
                                    style={{
                                        bottom: `${(t / niceMax) * 100}%`,
                                    }}
                                />
                            ))}

                            {/* Grup batang per bulan */}
                            <div className="absolute inset-0 flex items-end gap-2">
                                {labels.map((label, i) => (
                                    <div
                                        key={label}
                                        tabIndex={0}
                                        aria-label={`${label}: ${visibleSeries.map((s) => `${s.label} ${s.data[i] ?? 0}`).join(', ')}`}
                                        className="group focus-visible:ring-ring/50 relative flex h-full flex-1 items-end justify-center gap-1 rounded-md focus-visible:ring-2 focus-visible:outline-none"
                                    >
                                        {visibleSeries.map((s) => {
                                            const value = s.data[i] ?? 0;
                                            const pct = (value / niceMax) * 100;
                                            return (
                                                <span
                                                    key={s.key}
                                                    role="img"
                                                    aria-label={`${s.label}, ${label}: ${value}`}
                                                    className={cn(
                                                        'w-full max-w-6 rounded-t transition-[height] duration-500 ease-out motion-reduce:transition-none',
                                                        s.barClass,
                                                        value === 0 &&
                                                            'bg-muted',
                                                    )}
                                                    style={{
                                                        height: ready
                                                            ? `${pct}%`
                                                            : '0%',
                                                    }}
                                                />
                                            );
                                        })}

                                        {/* Tooltip */}
                                        <div className="pointer-events-none absolute top-1 left-1/2 z-10 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
                                            <div className="bg-popover text-popover-foreground w-max rounded-md border px-2 py-1 text-[11px] shadow-md">
                                                <span className="font-medium">
                                                    {label}
                                                </span>
                                                {visibleSeries.map((s) => (
                                                    <span
                                                        key={s.key}
                                                        className="ml-2 tabular-nums"
                                                    >
                                                        {s.label}{' '}
                                                        {s.data[i] ?? 0}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sumbu X */}
                        <div className="text-muted-foreground mt-1 flex gap-2 text-[10px]">
                            {labels.map((label) => (
                                <span
                                    key={label}
                                    className="flex-1 text-center"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
