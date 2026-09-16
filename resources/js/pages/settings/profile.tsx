import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';

type PageProps = {
    auth: Auth;
};

const kategoriLabels: Record<string, string> = {
    internal_unej: 'Internal UNEJ',
    luar_unej: 'Luar UNEJ',
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
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

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="text-muted-foreground -mt-4 text-sm">
                                            Alamat email Anda belum diverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Klik di sini untuk mengirim ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                                            </div>
                                        )}
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

            <DeleteUser />
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
