import { CheckCircle2, Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const options: {
        value: Appearance;
        icon: typeof Sun;
        title: string;
        description: string;
        variant: 'light' | 'dark' | 'system';
    }[] = [
        {
            value: 'light',
            icon: Sun,
            title: 'Mode Terang',
            description: 'Tampilan cerah standar dengan kontras bersih.',
            variant: 'light',
        },
        {
            value: 'dark',
            icon: Moon,
            title: 'Mode Gelap',
            description: 'Mengurangi kelelahan mata di ruangan redup.',
            variant: 'dark',
        },
        {
            value: 'system',
            icon: Monitor,
            title: 'Otomatis (Sistem)',
            description: 'Mengikuti preferensi tema perangkat Anda.',
            variant: 'system',
        },
    ];

    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-4 sm:grid-cols-3',
                className,
            )}
            {...props}
        >
            {options.map(({ value, icon: Icon, title, description, variant }) => {
                const isSelected = appearance === value;

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => updateAppearance(value)}
                        className={cn(
                            'group relative flex flex-col rounded-xl border p-4 text-left transition-all',
                            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                            isSelected
                                ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-2'
                                : 'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30',
                        )}
                    >
                        {/* Status Checkmark */}
                        <div className="flex items-center justify-between">
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                                    isSelected
                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                        : 'bg-muted text-muted-foreground group-hover:text-foreground',
                                )}
                            >
                                <Icon className="h-4 w-4" />
                            </div>

                            {isSelected ? (
                                <CheckCircle2 className="text-primary h-5 w-5" />
                            ) : (
                                <div className="border-border/80 h-5 w-5 rounded-full border" />
                            )}
                        </div>

                        {/* Visual Mockup Preview */}
                        <div className="mt-4 overflow-hidden rounded-lg border shadow-2xs">
                            {variant === 'light' && (
                                <div className="space-y-1.5 bg-neutral-50 p-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-rose-400" />
                                        <div className="h-2 w-2 rounded-full bg-amber-400" />
                                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="flex gap-1.5 pt-1">
                                        <div className="h-10 w-1/3 rounded bg-neutral-200" />
                                        <div className="space-y-1 flex-1">
                                            <div className="h-4 rounded bg-neutral-200" />
                                            <div className="h-5 rounded border border-neutral-200 bg-white" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {variant === 'dark' && (
                                <div className="space-y-1.5 bg-neutral-900 p-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-rose-500/80" />
                                        <div className="h-2 w-2 rounded-full bg-amber-500/80" />
                                        <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
                                    </div>
                                    <div className="flex gap-1.5 pt-1">
                                        <div className="h-10 w-1/3 rounded bg-neutral-800" />
                                        <div className="space-y-1 flex-1">
                                            <div className="h-4 rounded bg-neutral-800" />
                                            <div className="h-5 rounded border border-neutral-700 bg-neutral-800/80" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {variant === 'system' && (
                                <div className="flex">
                                    {/* Left half light */}
                                    <div className="space-y-1.5 w-1/2 border-r border-neutral-300 bg-neutral-50 p-2.5">
                                        <div className="flex items-center gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                        </div>
                                        <div className="h-8 rounded bg-neutral-200" />
                                    </div>
                                    {/* Right half dark */}
                                    <div className="space-y-1.5 w-1/2 bg-neutral-900 p-2.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                                        </div>
                                        <div className="h-8 rounded bg-neutral-800" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div className="mt-3 min-w-0">
                            <p
                                className={cn(
                                    'text-sm font-semibold',
                                    isSelected
                                        ? 'text-primary'
                                        : 'text-foreground',
                                )}
                            >
                                {title}
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
