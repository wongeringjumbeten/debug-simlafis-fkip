import { Form, Head, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Building2,
    Camera,
    CheckCircle2,
    IdCard,
    Mail,
    Phone,
    ShieldAlert,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import { FileUpload } from '@/components/file-upload';
import InputError from '@/components/input-error';
import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import type { Auth, UserRole } from '@/types';
import { roleLabels } from '@/types/users';

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

/** Satu baris data identitas read-only. */
function BarisIdentitas({
    label,
    nilai,
    mono = false,
}: {
    label: string;
    nilai: string | null | undefined;
    mono?: boolean;
}) {
    if (!nilai) {
        return null;
    }

    return (
        <div className="min-w-0">
            <dt className="text-muted-foreground text-xs">{label}</dt>
            <dd
                className={
                    mono
                        ? 'mt-0.5 truncate font-mono text-sm'
                        : 'mt-0.5 truncate text-sm'
                }
            >
                {nilai}
            </dd>
        </div>
    );
}

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

    /**
     * Berkas foto yang dipilih pengguna.
     *
     * Sebelumnya nilai ini tidak pernah disimpan (`onChange={() => {}}`),
     * sehingga pratinjau tidak muncul dan pengguna mengira unggahan gagal.
     */
    const [fotoProfil, setFotoProfil] = useState<File | null>(null);
    const [pratinjau, setPratinjau] = useState<string | null>(null);

    useEffect(() => {
        if (!fotoProfil) {
            setPratinjau(null);
            return;
        }

        const url = URL.createObjectURL(fotoProfil);
        setPratinjau(url);

        return () => URL.revokeObjectURL(url);
    }, [fotoProfil]);

    /** Pratinjau berkas baru menang atas foto tersimpan. */
    const sumberFoto =
        pratinjau ?? identitas?.foto_profil_url ?? auth.user?.avatar ?? null;

    const labelPeran =
        roleLabels[auth.user?.role as UserRole] ?? auth.user?.role ?? '—';

    return (
        <>
            <Head title="Pengaturan Profil" />

            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                {/* Ringkasan akun */}
                <Card className="border-border/70 overflow-hidden shadow-xs">
                    <div
                        className="relative h-24 border-b border-border/40 bg-gradient-to-r from-primary/20 via-emerald-500/15 to-primary/10 sm:h-28"
                        aria-hidden="true"
                    >
                        <div className="from-primary/10 absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] via-transparent to-transparent" />
                    </div>
                    <CardContent className="-mt-12 space-y-4 pb-6 sm:-mt-14">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex min-w-0 flex-col gap-3.5 sm:flex-row sm:items-end sm:gap-4">
                                <Avatar className="border-card h-20 w-20 shrink-0 border-4 shadow-xs sm:h-24 sm:w-24">
                                    <AvatarImage
                                        src={sumberFoto ?? undefined}
                                        alt={auth.user?.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xl font-medium sm:text-2xl">
                                        {getInitials(auth.user?.name ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 pb-1">
                                    <h2 className="truncate text-lg font-semibold sm:text-xl">
                                        {auth.user?.name}
                                    </h2>
                                    <p className="text-muted-foreground truncate text-sm">
                                        {auth.user?.email}
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">
                                            {labelPeran}
                                        </Badge>
                                        {isEksternal && auth.user?.kategori && (
                                            <Badge variant="outline">
                                                {kategoriLabels[
                                                    auth.user.kategori
                                                ] ?? auth.user.kategori}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {mustVerifyEmail && (
                                <div className="shrink-0 self-start sm:self-end">
                                    {auth.user?.email_verified_at ? (
                                        <StatusBadge
                                            label="Email terverifikasi"
                                            tone="success"
                                        />
                                    ) : (
                                        <StatusBadge
                                            label="Email belum terverifikasi"
                                            tone="warning"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {status && (
                            <p
                                className="border-success/30 bg-success/10 dark:text-success rounded-lg border px-3 py-2 text-sm text-[#1E7050]"
                                role="status"
                            >
                                {status}
                            </p>
                        )}

                        {mustVerifyEmail && !auth.user?.email_verified_at && (
                            <p className="text-muted-foreground text-sm">
                                Periksa kotak masuk Anda untuk menyelesaikan
                                verifikasi email.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors, recentlySuccessful }) => (
                        <>
                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="space-y-6 lg:col-span-2">
                                    {/* Informasi akun */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <UserRound className="text-primary size-4" />
                                                Informasi akun
                                            </CardTitle>
                                            <CardDescription>
                                                Nama tampilan dan alamat email
                                                yang dipakai untuk masuk.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">
                                                    Nama lengkap
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={
                                                        auth.user.name
                                                    }
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Nama lengkap"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Alamat email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    defaultValue={
                                                        auth.user.email
                                                    }
                                                    required
                                                    autoComplete="username"
                                                    placeholder="email@contoh.com"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                                {mustVerifyEmail && (
                                                    <p className="text-muted-foreground text-xs">
                                                        Mengubah email
                                                        mengharuskan verifikasi
                                                        ulang.
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Informasi institusi — khusus eksternal */}
                                    {isEksternal && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Building2 className="text-primary size-4" />
                                                    Informasi institusi
                                                </CardTitle>
                                                <CardDescription>
                                                    Menentukan layanan dan tarif
                                                    sewa Anda. Kategori tarif
                                                    hanya dapat diubah Admin.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="instansi">
                                                        Instansi
                                                    </Label>
                                                    <Input
                                                        id="instansi"
                                                        name="instansi"
                                                        defaultValue={
                                                            auth.user
                                                                .instansi ?? ''
                                                        }
                                                        required
                                                        autoComplete="organization"
                                                        placeholder="Contoh: Universitas Jember, PT. XYZ"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.instansi
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>
                                                        Kategori pengguna
                                                    </Label>
                                                    <div>
                                                        <Badge variant="secondary">
                                                            {auth.user.kategori
                                                                ? (kategoriLabels[
                                                                      auth.user
                                                                          .kategori
                                                                  ] ??
                                                                  auth.user
                                                                      .kategori)
                                                                : 'Belum ditetapkan'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted-foreground text-xs">
                                                        Hanya Admin yang dapat
                                                        mengubah kategori ini.
                                                    </p>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="no_hp">
                                                        Nomor HP / WhatsApp
                                                    </Label>
                                                    <div className="relative">
                                                        <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                                        <Input
                                                            id="no_hp"
                                                            type="tel"
                                                            name="no_hp"
                                                            className="pl-9"
                                                            defaultValue={
                                                                auth.user
                                                                    .no_hp ?? ''
                                                            }
                                                            autoComplete="tel"
                                                            placeholder="08xxxxxxxxxx"
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={errors.no_hp}
                                                    />
                                                    <p className="text-muted-foreground text-xs">
                                                        Format 08xxxxxxxxxx
                                                        atau +628xxxxxxxxx.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Identitas terdaftar */}
                                    {identitas && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <IdCard className="text-primary size-4" />
                                                    Identitas terdaftar
                                                </CardTitle>
                                                <CardDescription>
                                                    Data ini bersifat read-only.
                                                    Perubahan dilakukan melalui
                                                    Admin.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <dl className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                                                    <BarisIdentitas
                                                        label={
                                                            identitas.jenis_identitas ??
                                                            'Nomor identitas'
                                                        }
                                                        nilai={
                                                            identitas.nomor_identitas
                                                        }
                                                        mono
                                                    />
                                                    <BarisIdentitas
                                                        label="Fakultas"
                                                        nilai={
                                                            identitas.fakultas
                                                        }
                                                    />
                                                    <BarisIdentitas
                                                        label="Program studi"
                                                        nilai={identitas.prodi}
                                                    />
                                                    <BarisIdentitas
                                                        label="Instansi"
                                                        nilai={
                                                            identitas.instansi
                                                        }
                                                    />
                                                    {identitas.alamat && (
                                                        <div className="sm:col-span-2">
                                                            <dt className="text-muted-foreground text-xs">
                                                                Alamat
                                                            </dt>
                                                            <dd className="mt-0.5 text-sm">
                                                                {
                                                                    identitas.alamat
                                                                }
                                                            </dd>
                                                        </div>
                                                    )}
                                                    {!identitas.jenis_identitas &&
                                                        !identitas.fakultas &&
                                                        !identitas.prodi &&
                                                        !identitas.instansi && (
                                                            <div className="text-muted-foreground text-sm sm:col-span-2">
                                                                Belum ada data
                                                                identitas
                                                                tambahan untuk
                                                                akun ini.
                                                            </div>
                                                        )}
                                                </dl>

                                                {identitas.foto_identitas_url && (
                                                    <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
                                                        <img
                                                            src={
                                                                identitas.foto_identitas_url
                                                            }
                                                            alt="Foto identitas terdaftar"
                                                            loading="lazy"
                                                            className="h-20 w-20 rounded-md border object-cover"
                                                        />
                                                        <div className="min-w-0 text-sm">
                                                            <p className="font-medium">
                                                                Foto identitas
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                Ditampilkan
                                                                hanya untuk Anda.
                                                                Diakses melalui
                                                                tautan
                                                                terotorisasi.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Kolom kanan */}
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Camera className="text-primary size-4" />
                                                Foto profil
                                            </CardTitle>
                                            <CardDescription>
                                                Ditampilkan pada sidebar dan
                                                riwayat peminjaman.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16 shrink-0">
                                                    <AvatarImage
                                                        src={
                                                            sumberFoto ??
                                                            undefined
                                                        }
                                                        alt="Pratinjau foto profil"
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                        {getInitials(
                                                            auth.user?.name ??
                                                                '',
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 text-sm">
                                                    {fotoProfil ? (
                                                        <>
                                                            <p className="truncate font-medium">
                                                                {
                                                                    fotoProfil.name
                                                                }
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                Foto baru siap
                                                                disimpan — klik
                                                                Simpan di bawah.
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-medium">
                                                                Foto saat ini
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                Pilih berkas
                                                                untuk
                                                                menggantinya.
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <FileUpload
                                                id="foto_profil"
                                                label="Pilih foto baru"
                                                file={fotoProfil}
                                                error={errors.foto_profil}
                                                onChange={setFotoProfil}
                                                icon={Camera}
                                                name="foto_profil"
                                                maxSizeMB={2}
                                                accept=".jpg,.jpeg,.png"
                                            />

                                            {fotoProfil && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() =>
                                                        setFotoProfil(null)
                                                    }
                                                >
                                                    Batalkan pilihan foto
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                {auth.user?.email_verified_at ? (
                                                    <ShieldCheck className="text-success size-4" />
                                                ) : (
                                                    <ShieldAlert className="text-warning size-4" />
                                                )}
                                                Status akun
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-muted-foreground inline-flex items-center gap-2">
                                                    <Mail className="size-3.5" />
                                                    Verifikasi email
                                                </span>
                                                <span className="font-medium">
                                                    {auth.user
                                                        ?.email_verified_at
                                                        ? 'Selesai'
                                                        : 'Belum'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-muted-foreground inline-flex items-center gap-2">
                                                    <BadgeCheck className="size-3.5" />
                                                    Peran
                                                </span>
                                                <span className="font-medium">
                                                    {labelPeran}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Bilah simpan responsif */}
                            <div className="border-border/80 bg-card/95 sticky bottom-3 z-20 flex flex-col gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex items-center gap-2 text-xs">
                                    {recentlySuccessful ? (
                                        <span className="text-success inline-flex items-center gap-1.5 font-medium">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Perubahan berhasil disimpan.
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Perubahan berlaku setelah disimpan.
                                        </span>
                                    )}
                                </div>
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className="w-full sm:w-auto"
                                >
                                    {processing && <Spinner />}
                                    Simpan perubahan
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
