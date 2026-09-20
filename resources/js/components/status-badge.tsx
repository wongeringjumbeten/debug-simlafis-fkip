import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusTone =
    | 'success'
    | 'info'
    | 'warning'
    | 'destructive'
    | 'neutral';

/**
 * Warna teks badge berbeda antara mode terang dan gelap.
 *
 * Di mode terang latar badge berupa tint tipis di atas putih, sehingga teks
 * perlu versi yang lebih gelap dari token agar terbaca. Di mode gelap tint-nya
 * menjadi gelap, jadi teks justru memakai token dasarnya yang sudah dicerahkan.
 */
const toneClasses: Record<StatusTone, string> = {
    success: 'border-success/25 bg-success/15 text-[#1E7050] dark:text-success',
    info: 'border-info/25 bg-info/10 text-[#0F4C81] dark:text-info',
    warning:
        'border-warning/30 bg-warning/20 text-[#8A5A14] dark:text-warning',
    destructive:
        'border-destructive/25 bg-destructive/10 text-[#A32E38] dark:text-destructive',
    neutral: 'border-border bg-muted text-muted-foreground',
};

interface StatusBadgeProps {
    label: string;
    tone: StatusTone;
    className?: string;
}

/** Badge status yang selalu menyertakan label teks, bukan hanya warna (Design.md bagian 8). */
export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
    return (
        <Badge variant="outline" className={cn(toneClasses[tone], className)}>
            {label}
        </Badge>
    );
}
