import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
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
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar Akun Eksternal" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="instansi">Instansi</Label>
                                <Input
                                    id="instansi"
                                    type="text"
                                    tabIndex={2}
                                    autoComplete="organization"
                                    name="instansi"
                                    placeholder="Contoh: Universitas Jember, PT. XYZ, SMA Negeri 1"
                                />
                                <InputError message={errors.instansi} />
                                <p className="text-xs text-muted-foreground">
                                    Wajib diisi jika memilih kategori pengguna.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kategori">Kategori Pengguna</Label>
                                <Select name="kategori" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="internal_unej">Internal UNEJ</SelectItem>
                                        <SelectItem value="luar_unej">Luar UNEJ</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kategori} />
                                <p className="text-xs text-muted-foreground">
                                    Wajib diisi jika mengisi instansi. Menentukan tarif sewa (BR-2).
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@contoh.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="no_hp">Nomor HP / WhatsApp</Label>
                                <Input
                                    id="no_hp"
                                    type="tel"
                                    tabIndex={5}
                                    autoComplete="tel"
                                    name="no_hp"
                                    placeholder="08xx-xxxx-xxxx atau +628xxxxxxxxx"
                                />
                                <InputError message={errors.no_hp} />
                                <p className="text-xs text-muted-foreground">
                                    Format: 08xxxxxxxxxx atau +628xxxxxxxxx
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Kata sandi"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={7}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Konfirmasi kata sandi"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={8}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Daftar Akun Eksternal
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Sudah punya akun?{' '}
                            <TextLink href={login()} tabIndex={9}>
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Daftar Akun Eksternal',
    description: 'Isi formulir di bawah untuk membuat akun pengguna eksternal SIMLAFIS',
};