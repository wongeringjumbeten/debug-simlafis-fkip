import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

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
    const isEksternal = auth.user?.role === 'ekst';

    return (
        <>
            <Head title="Pengaturan Profil" />

            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profil"
                    description="Perbarui nama dan alamat email Anda"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
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

                            {identitas && (
                                <div className="space-y-6 border-t pt-6">
                                    <div>
                                        <h3 className="text-base font-medium">Identitas Terdaftar</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Data identitas bersifat read-only. Perubahan melalui Admin.
                                        </p>
                                    </div>

                                    {identitas.foto_profil_url && (
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={identitas.foto_profil_url}
                                                alt="Foto profil"
                                                className="h-16 w-16 rounded-full object-cover"
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

                                    <div className="grid gap-2">
                                        <Label htmlFor="foto_profil">Ganti Foto Profil (JPG/PNG, maks 2 MB)</Label>
                                        <Input id="foto_profil" type="file" name="foto_profil" accept=".jpg,.jpeg,.png" className="mt-1 block w-full" />
                                        <InputError message={errors.foto_profil} />
                                    </div>
                                </div>
                            )}

                            {isEksternal && (
                                <div className="space-y-6 border-t pt-6">
                                    <div>
                                        <h3 className="text-base font-medium">
                                            Informasi Institusi
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Data ini menentukan layanan dan tarif sewa Anda.
                                        </p>
                                    </div>

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
                                        <Label htmlFor="kategori">Kategori Pengguna</Label>
                                        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                                            {auth.user.kategori
                                                ? kategoriLabels[auth.user.kategori]
                                                : 'Belum ditetapkan'}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Menentukan tarif sewa (BR-2). Perubahan hanya dapat dilakukan Admin.
                                        </p>
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
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
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
