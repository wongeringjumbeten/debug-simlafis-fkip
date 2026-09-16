import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
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
import UserController from '@/actions/App/Http/Controllers/Users/UserController';
import type { KategoriEksternal, UserRow, UserRole } from '@/types';
import { kategoriLabels, roleLabels } from '@/types/users';

interface UserFormDialogProps {
    open: boolean;
    user?: UserRow;
    roleOptions: UserRole[];
    passwordRules: string;
    onOpenChange: (open: boolean) => void;
}

const kategoriOptions: KategoriEksternal[] = ['internal_unej', 'luar_unej'];

export function UserFormDialog({ open, user, roleOptions, passwordRules, onOpenChange }: UserFormDialogProps) {
    const isEdit = Boolean(user);
    const [role, setRole] = useState<UserRole>(user?.role ?? 'mhs');
    const isEkst = role === 'ekst';

    useEffect(() => {
        if (open) {
            setRole(user?.role ?? 'mhs');
        }
    }, [open, user]);

    const formProps = isEdit ? UserController.update.form(user!.id) : UserController.store.form();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Ubah Pengguna' : 'Tambah Pengguna'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Perbarui data akun. Kosongkan kata sandi untuk mempertahankan yang sekarang.'
                            : 'Akun internal (non-eksternal) dibuat oleh Admin, bukan daftar mandiri (BR-1).'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...formProps} className="space-y-4" options={{ preserveScroll: true }}>
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="role" value={role} />

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" name="name" defaultValue={user?.name} required placeholder="Nama lengkap" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" defaultValue={user?.email} required placeholder="email@contoh.com" />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {roleLabels[r]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            {isEkst && (
                                <div className="grid gap-4 rounded-lg border p-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="instansi">Instansi</Label>
                                        <Input id="instansi" name="instansi" defaultValue={user?.instansi ?? ''} required placeholder="Contoh: SMAN 1 Jember" />
                                        <InputError message={errors.instansi} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="kategori">Kategori Tarif</Label>
                                        <select
                                            id="kategori"
                                            name="kategori"
                                            defaultValue={user?.kategori ?? ''}
                                            className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-none"
                                        >
                                            <option value="">Pilih kategori</option>
                                            {kategoriOptions.map((k) => (
                                                <option key={k} value={k}>
                                                    {kategoriLabels[k]}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.kategori} />
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="no_hp">Nomor HP / WhatsApp</Label>
                                <Input id="no_hp" type="tel" name="no_hp" defaultValue={user?.no_hp ?? ''} placeholder="08xxxxxxxxxx atau +628xxxxxxxxx" />
                                <InputError message={errors.no_hp} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    placeholder={isEdit ? 'Kosongkan bila tidak diubah' : 'Kata sandi'}
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
