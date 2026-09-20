import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { Palette, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

interface SettingsNavItem {
    title: string;
    description: string;
    /** Helper route wayfinder mengembalikan objek, bukan string. */
    href: NonNullable<InertiaLinkProps['href']>;
    icon: typeof UserRound;
}

const settingsNavItems: SettingsNavItem[] = [
    {
        title: 'Profil',
        description: 'Informasi akun & identitas',
        href: edit(),
        icon: UserRound,
    },
    {
        title: 'Keamanan',
        description: 'Kata sandi & proteksi',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Tampilan',
        description: 'Tema & kenyamanan visual',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">
            {/* Header Pengaturan */}
            <div className="border-border/60 bg-card/60 rounded-2xl border p-4 shadow-xs sm:p-5">
                <div className="flex items-center gap-3.5">
                    <div className="bg-primary/10 text-primary border-primary/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs">
                        <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
                            Pengaturan
                        </h1>
                        <p className="text-muted-foreground truncate text-xs sm:text-sm">
                            Kelola profil, keamanan, dan preferensi akun Anda
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigasi Mobile (< lg): Segmented Tabs Bar */}
            <div className="block lg:hidden">
                <nav
                    className="border-border/60 bg-muted/70 flex items-center gap-1.5 overflow-x-auto rounded-xl border p-1 text-xs"
                    aria-label="Navigasi Pengaturan Mobile"
                >
                    {settingsNavItems.map((item) => {
                        const active = isCurrentOrParentUrl(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={toUrl(item.href)}
                                href={item.href}
                                className={cn(
                                    'flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 font-medium transition-all',
                                    active
                                        ? 'bg-background text-foreground border-border/80 border font-semibold shadow-xs'
                                        : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'h-4 w-4 shrink-0',
                                        active
                                            ? 'text-primary'
                                            : 'text-muted-foreground',
                                    )}
                                />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Layout Konten Utama */}
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Sidebar Desktop (>= lg) */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <nav
                        className="space-y-1.5"
                        aria-label="Navigasi Pengaturan Desktop"
                    >
                        {settingsNavItems.map((item) => {
                            const active = isCurrentOrParentUrl(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={toUrl(item.href)}
                                    href={item.href}
                                    className={cn(
                                        'group flex items-start gap-3 rounded-xl border p-3 text-left transition-all',
                                        active
                                            ? 'bg-primary/10 text-primary border-primary/25 shadow-2xs font-medium'
                                            : 'border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors',
                                            active
                                                ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                                                : 'border-border bg-background text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground',
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <div
                                            className={cn(
                                                'text-sm font-semibold',
                                                active
                                                    ? 'text-primary'
                                                    : 'text-foreground',
                                            )}
                                        >
                                            {item.title}
                                        </div>
                                        <div className="text-muted-foreground truncate text-xs">
                                            {item.description}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Area Konten Sub-Halaman */}
                <main className="min-w-0 flex-1">{children}</main>
            </div>
        </div>
    );
}

