import { Form, Head, usePage } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import { FileUpload } from '@/components/file-upload';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import type { Auth, UserRole } from '@/types';
import { kategoriLabels as eksternalLabels, roleLabels } from '@/types/users';

type PageProps = { auth: Auth };

type Identitas = {
    jenis_identitas: string | null;
    nomor_identitas: string | null;
    fakultas: string | null;
    prodi: string | null;
    instansi?: string | null;
    alamat?: string | null;
    foto_profil_url: string | null;
    foto_identitas_url: string | null;
};

const kategoriLabels: Record<string, string> = {
    internal_unej: 'Internal UNEJ',
    luar_unej: 'Luar UNEJ',
};

export default function Profile({
    mustVerifyEmail,
    status,
    identitas,
    canDeleteAccount = true,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    identitas?: Identitas | null;
    canDeleteAccount?: boolean;
}) {
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();
    const isEksternal = auth.user?.role === 'ekst';

    return (
        <>
            <Head title="Pengaturan Profil" />

            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-lg text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(auth.user?.name ?? '')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold">{auth.user?.name}</h2>
                            <p className="text-sm text-muted-foreground">{auth.user?.email}</p>
                            <Badge variant="secondary">
                                {roleLabels[auth.user?.role as UserRole] ?? auth.user?.role}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Informasi Akun */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Akun</CardTitle>
                                    <CardDescription>
                                        Perbarui nama dan alamat email Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama</Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Nama lengkap"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="email@contoh.com"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.email}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Identitas Terdaftar */}
                            {identitas && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Identitas Terdaftar</CardTitle>
                                        <CardDescription>
                                            Data identitas bersifat read-only. Perubahan melalui Admin.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {identitas.foto_profil_url && (
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={identitas.foto_profil_url}
                                                    alt="Foto profil"
                                                    className="h-14 w-14 rounded-full border object-cover"
                                                />
                                                <div className="text-sm">
                                                    <p className="font-medium">{auth.user.name}</p>
                                                    <p className="text-muted-foreground">{auth.user.email}</p>
                                                </div>
                                            </div>
                                        )}

                                        <dl className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
                                            {identitas.jenis_identitas && (
                                                <div>
                                                    <dt className="text-muted-foreground text-xs">{identitas.jenis_identitas}</dt>
                                                    <dd className="font-mono">{identitas.nomor_identitas ?? '—'}</dd>
                                                </div>
                                            )}
                                            {identitas.fakultas && (
                                                <div>
                                                    <dt className="text-muted-foreground text-xs">Fakultas</dt>
                                                    <dd>{identitas.fakultas}</dd>
                                                </div>
                                            )}
                                            {identitas.prodi && (
                                                <div>
                                                    <dt className="text-muted-foreground text-xs">Program Studi</dt>
                                                    <dd>{identitas.prodi}</dd>
                                                </div>
                                            )}
                                            {identitas.instansi && (
                                                <div>
                                                    <dt className="text-muted-foreground text-xs">Instansi</dt>
                                                    <dd>{identitas.instansi}</dd>
                                                </div>
                                            )}
                                            {identitas.alamat && (
                                                <div className="sm:col-span-2">
                                                    <dt className="text-muted-foreground text-xs">Alamat</dt>
                                                    <dd>{identitas.alamat}</dd>
                                                </div>
                                            )}
                                        </dl>

                                        <FileUpload
                                            id="foto_profil"
                                            label="Ganti Foto Profil"
                                            file={null}
                                            error={errors.foto_profil}
                                            onChange={() => {}}
                                            icon={Camera}
                                            name="foto_profil"
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Informasi Institusi — khusus eksternal */}
                            {isEksternal && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Institusi</CardTitle>
                                        <CardDescription>
                                            Data ini menentukan layanan dan tarif sewa Anda. Kategori tarif hanya dapat diubah Admin (BR-2).
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="instansi">Instansi</Label>
                                            <Input
                                                id="instansi"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.instansi ?? ''}
                                                name="instansi"
                                                required
                                                autoComplete="organization"
                                                placeholder="Contoh: Universitas Jember, PT. XYZ"
                                            />
                                            <InputError message={errors.instansi} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Kategori Pengguna</Label>
                                            <div>
                                                <Badge variant="secondary" className="text-sm">
                                                    {auth.user.kategori
                                                        ? kategoriLabels[auth.user.kategori]
                                                        : 'Belum ditetapkan'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="no_hp">Nomor HP / WhatsApp</Label>
                                            <Input
                                                id="no_hp"
                                                type="tel"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.no_hp ?? ''}
                                                name="no_hp"
                                                autoComplete="tel"
                                                placeholder="08xxxxxxxxxx atau +628xxxxxxxxx"
                                            />
                                            <InputError message={errors.no_hp} />
                                            <p className="text-xs text-muted-foreground">
                                                Format: 08xxxxxxxxxx atau +628xxxxxxxxx.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tombol Simpan */}
                            <div className="flex justify-end">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className="w-full sm:w-auto"
                                >
                                    {processing && <Spinner />}
                                    Simpan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {canDeleteAccount && <DeleteUser />}
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};