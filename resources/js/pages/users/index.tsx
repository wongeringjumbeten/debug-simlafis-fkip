import { Form, Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { MoreHorizontal, Plus, RotateCcw, Search } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/Users/UserController';
import InputError from '@/components/input-error';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dashboard } from '@/routes';
import users from '@/routes/users';
import type { UserListProps, UserRow, UserRole } from '@/types';
import { type AccountStatus, identitasLabels, kategoriLabels, roleLabels } from '@/types/users';
import { UserFormDialog } from './user-form-dialog';

type Props = UserListProps & { passwordRules: string };

function statusBadgeProps(status: AccountStatus) {
    switch (status) {
        case 'active':
            return { label: 'Aktif', tone: 'success' } as const;
        case 'suspended':
            return { label: 'Ditangguhkan', tone: 'warning' } as const;
        case 'blocked':
            return { label: 'Diblokir', tone: 'destructive' } as const;
    }
}

/** Decode label paginator Laravel (mis. "&laquo;" menjadi «). */
const htmlEntities: Record<string, string> = {
    '&laquo;': '«',
    '&raquo;': '»',
    '&lsaquo;': '‹',
    '&rsaquo;': '›',
};

function decodeLabel(label: string): string {
    return label.replace(/&(laquo|raquo|lsaquo|rsaquo);/g, (m) => htmlEntities[m] ?? m);
}

export default function Users({ users: list, filters, roleOptions, passwordRules, currentUserId }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<UserRow | undefined>(undefined);
    const [suspendTarget, setSuspendTarget] = useState<UserRow | null>(null);
    const [blockTarget, setBlockTarget] = useState<UserRow | null>(null);
    const [detailTarget, setDetailTarget] = useState<UserRow | null>(null);

    const { data, setData, get, processing } = useForm({
        q: filters.q,
        role: filters.role,
    });

    function openCreate() {
        setEditTarget(undefined);
        setFormOpen(true);
    }

    function openEdit(user: UserRow) {
        setEditTarget(user);
        setFormOpen(true);
    }

    function submitFilter(e: React.FormEvent) {
        e.preventDefault();
        get(users.index().url, { preserveScroll: true, only: ['users'] });
    }

    function resetFilter() {
        setData({ q: '', role: '' });
        router.get(users.index().url, { q: '', role: '' }, { preserveScroll: true, only: ['users'] });
    }

    return (
        <>
            <Head title="Manajemen Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[28px] leading-tight font-semibold">Manajemen Pengguna</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat, ubah, dan atur status hak akses akun (ADM-08 s.d. ADM-10).
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus /> Tambah Pengguna
                    </Button>
                </header>

                <form onSubmit={submitFilter} className="rounded-xl border bg-card p-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="relative min-w-56 flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={data.q}
                                onChange={(e) => setData('q', e.target.value)}
                                placeholder="Cari nama, email, atau instansi…"
                                aria-label="Cari pengguna"
                                className="pl-9"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="filter-role" className="text-xs font-medium text-muted-foreground">Role</Label>
                            <Select value={data.role || 'all'} onValueChange={(v) => setData('role', v === 'all' ? '' : v)}>
                                <SelectTrigger id="filter-role" className="w-48">
                                    <SelectValue placeholder="Semua role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua role</SelectItem>
                                    {roleOptions.map((r) => (
                                        <SelectItem key={r} value={r}>{roleLabels[r as UserRole]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" variant="secondary" disabled={processing}>
                            {processing && <Spinner />} Cari
                        </Button>
                        <Button type="button" variant="ghost" onClick={resetFilter}>
                            <RotateCcw /> Reset
                        </Button>
                    </div>
                </form>

                {list.data.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border bg-card">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="px-4 py-3 font-medium">Pengguna</th>
                                        <th className="hidden px-4 py-3 font-medium md:table-cell">Role</th>
                                        <th className="hidden px-4 py-3 font-medium lg:table-cell">Kategori</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="w-12 px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.data.map((user) => (
                                        <tr key={user.id} className="border-b last:border-0">
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-muted-foreground text-xs">{user.email}</div>
                                                {user.instansi && (
                                                    <div className="text-muted-foreground text-xs">{user.instansi}</div>
                                                )}
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">{roleLabels[user.role]}</td>
                                            <td className="hidden px-4 py-3 lg:table-cell">
                                                {user.kategori ? kategoriLabels[user.kategori] : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge {...statusBadgeProps(user.status)} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" aria-label={`Aksi untuk ${user.name}`}>
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDetailTarget(user)}>
                                                            Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEdit(user)}>
                                                            Ubah data
                                                        </DropdownMenuItem>
                                                        {user.status !== 'active' && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.patch(
                                                                        UserController.updateStatus.url(user.id),
                                                                        { status: 'active' },
                                                                        { preserveScroll: true, only: ['users'] },
                                                                    )
                                                                }
                                                            >
                                                                Aktifkan kembali
                                                            </DropdownMenuItem>
                                                        )}
                                                        {user.status === 'active' && (
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                disabled={user.id === currentUserId}
                                                                onClick={() => setSuspendTarget(user)}
                                                            >
                                                                Tangguhkan akses
                                                            </DropdownMenuItem>
                                                        )}
                                                        {user.status !== 'blocked' && (
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                disabled={user.id === currentUserId}
                                                                onClick={() => setBlockTarget(user)}
                                                            >
                                                                Blokir akun
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {list.links.length > 3 && (
                            <div className="flex flex-wrap items-center gap-1 border-t px-4 py-3">
                                {list.links.map((link, i) =>
                                    link.url === null ? (
                                        <span key={i} className="px-2 py-1 text-sm text-muted-foreground">
                                            {decodeLabel(link.label)}
                                        </span>
                                    ) : (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            only={['users']}
                                            className={
                                                'rounded-md px-2.5 py-1 text-sm ' +
                                                (link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')
                                            }
                                        >
                                            {decodeLabel(link.label)}
                                        </Link>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                        <p className="text-sm text-muted-foreground">
                            Tidak ada pengguna yang cocok. {filters.q || filters.role ? 'Coba ubah filter pencarian.' : 'Mulai dengan menambahkan pengguna.'}
                        </p>
                    </div>
                )}
            </div>

            {formOpen && (
                <UserFormDialog
                    open={formOpen}
                    user={editTarget}
                    roleOptions={roleOptions}
                    passwordRules={passwordRules}
                    onOpenChange={setFormOpen}
                />
            )}

            <SuspendDialog user={suspendTarget} onClose={() => setSuspendTarget(null)} />

            <BlockDialog user={blockTarget} onClose={() => setBlockTarget(null)} />

            <DetailDialog user={detailTarget} onClose={() => setDetailTarget(null)} />
        </>
    );
}

function BarisDetail({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 gap-2 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="col-span-2 font-medium break-words">{value ?? '—'}</dd>
        </div>
    );
}

function DetailDialog({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
    return (
        <Dialog open={user !== null} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail Pengguna</DialogTitle>
                    <DialogDescription>Informasi akun, identitas, dan dokumen terdaftar.</DialogDescription>
                </DialogHeader>
                {user && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {user.foto_profil_url ? (
                                <img src={user.foto_profil_url} alt={`Foto ${user.name}`} className="h-16 w-16 rounded-full object-cover" />
                            ) : (
                                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full text-lg font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-muted-foreground text-sm">{user.email}</p>
                                <StatusBadge {...statusBadgeProps(user.status)} />
                            </div>
                        </div>
                        <dl className="space-y-3">
                            <BarisDetail label="ID Pengguna" value={<span className="font-mono">{user.id}</span>} />
                            <BarisDetail label="No. HP" value={user.no_hp} />
                            <BarisDetail label="Role" value={roleLabels[user.role]} />
                            {user.instansi && <BarisDetail label="Instansi" value={user.instansi} />}
                            {user.kategori && <BarisDetail label="Kategori Tarif" value={kategoriLabels[user.kategori]} />}
                            {user.nomor_identitas && <BarisDetail label={identitasLabels[user.role] ?? 'No. Identitas'} value={<span className="font-mono">{user.nomor_identitas}</span>} />}
                            {user.suspension_reason && <BarisDetail label="Alasan Status" value={user.suspension_reason} />}
                            <BarisDetail label="Terdaftar" value={user.terdaftar} />
                            {user.foto_identitas_url && (
                                <div>
                                    <dt className="text-muted-foreground text-sm">Foto Identitas</dt>
                                    <dd className="mt-1">
                                        <img src={user.foto_identitas_url} alt="Foto identitas" className="max-h-48 rounded-lg border object-contain" />
                                    </dd>
                                </div>
                            )}
                        </dl>
                        <DialogFooter>
                            <Button variant="secondary" onClick={onClose}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function SuspendDialog({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
    const open = user !== null;
    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tangguhkan Akses</DialogTitle>
                    <DialogDescription>
                        {user
                            ? `Akun ${user.name} tidak dapat membuat pengajuan baru sampai diaktifkan kembali (BR-3).`
                            : ''}
                    </DialogDescription>
                </DialogHeader>
                {user && (
                    <Form
                        {...UserController.updateStatus.form(user.id)}
                        className="space-y-4"
                        options={{ preserveScroll: true }}
                        onSuccess={onClose}
                    >
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="status" value="suspended" />
                                <div className="grid gap-2">
                                    <Label htmlFor="alasan_suspend">Alasan penangguhan</Label>
                                    <textarea
                                        id="alasan_suspend"
                                        name="alasan"
                                        rows={3}
                                        required
                                        placeholder="Mis. terlambat mengembalikan alat lebih dari 7 hari"
                                        className="border-input focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none"
                                    />
                                    <InputError message={errors.alasan} />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="secondary" onClick={onClose}>
                                        Batal
                                    </Button>
                                    <Button type="submit" variant="destructive" disabled={processing}>
                                        {processing && <Spinner />}
                                        Tangguhkan
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function BlockDialog({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
    const open = user !== null;
    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Blokir Akun</DialogTitle>
                    <DialogDescription>
                        {user
                            ? `Akun ${user.name} akan diblokir. Pengguna tidak dapat login dan semua sesi aktif akan dicabut.`
                            : ''}
                    </DialogDescription>
                </DialogHeader>
                {user && (
                    <Form
                        {...UserController.updateStatus.form(user.id)}
                        className="space-y-4"
                        options={{ preserveScroll: true }}
                        onSuccess={onClose}
                    >
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="status" value="blocked" />
                                <div className="grid gap-2">
                                    <Label htmlFor="alasan_block">Alasan pemblokiran</Label>
                                    <textarea
                                        id="alasan_block"
                                        name="alasan"
                                        rows={3}
                                        required
                                        placeholder="Mis. pelanggaran berat atau penyalahgunaan fasilitas"
                                        className="border-input focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none"
                                    />
                                    <InputError message={errors.alasan} />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="secondary" onClick={onClose}>
                                        Batal
                                    </Button>
                                    <Button type="submit" variant="destructive" disabled={processing}>
                                        {processing && <Spinner />}
                                        Blokir Akun
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

Users.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Manajemen Pengguna', href: users.index() },
    ],
};
