import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusTone =
    | 'success'
    | 'info'
    | 'warning'
    | 'destructive'
    | 'neutral';

const toneClasses: Record<StatusTone, string> = {
    success: 'border-success/25 bg-success/15 text-[#1E7050]',
    info: 'border-info/25 bg-info/10 text-[#0F4C81]',
    warning: 'border-warning/30 bg-warning/20 text-[#8A5A14]',
    destructive: 'border-destructive/25 bg-destructive/10 text-[#A32E38]',
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
