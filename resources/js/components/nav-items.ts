import {
    Boxes,
    BookOpen,
    ClipboardCheck,
    FolderOpen,
    History,
    LayoutGrid,
    Users,
} from 'lucide-react';
import { dashboard, dokumentasi, katalog, prosedur, persetujuan, riwayat } from '@/routes';
import { index as users } from '@/routes/users';
import type { NavItem, Role } from '@/types';

/**
 * Menu sidebar per peran, mengikuti matriks Product Functions.md.
 * Role single-role (BR-6); tiap peran hanya melihat modul yang memang ia akses.
 */
export function getMainNavForRole(role: Role): NavItem[] {
    const itemPersetujuan: NavItem = { title: 'Persetujuan', href: persetujuan(), icon: ClipboardCheck };
    const itemRiwayat: NavItem = { title: 'Riwayat', href: riwayat(), icon: History };
    const itemDokumentasi: NavItem = { title: 'Dokumentasi', href: dokumentasi(), icon: FolderOpen };
    const itemProsedur: NavItem = { title: 'Prosedur', href: prosedur(), icon: BookOpen };

    const items: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Katalog', href: katalog(), icon: Boxes },
    ];

    switch (role) {
        case 'admin':
            return [
                ...items,
                { title: 'Manajemen Pengguna', href: users(), icon: Users },
                itemPersetujuan,
                itemRiwayat,
                itemDokumentasi,
                itemProsedur,
            ];
        case 'kalab':
            return [...items, itemPersetujuan, itemRiwayat, itemDokumentasi, itemProsedur];
        case 'plp':
            return [...items, itemRiwayat, itemDokumentasi, itemProsedur];
        default:
            return [...items, itemRiwayat, itemProsedur];
    }
}
