import { Form, Head, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type DemoAccount = { role: string; label: string; email: string };

type Props = {
    status?: string;
    canResetPassword: boolean;
    demoAccounts?: DemoAccount[];
};

const DEMO_PASSWORD = 'a123b456';

export default function Login({ status, canResetPassword, demoAccounts = [] }: Props) {
    function masukCepat(email: string) {
        router.post(store.url(), { email, password: DEMO_PASSWORD, remember: 'on' });
    }

    return (
        <>
            <Head title="Masuk" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@contoh.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Kata Sandi</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Kata sandi"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Ingat saya</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>

                        <div className="text-[#4A6274] text-center text-sm">
                            Belum punya akun?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Daftar akun eksternal
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-[#2A9D6F]">
                    {status}
                </div>
            )}

            {demoAccounts.length > 0 && (
                <div className="mt-2 rounded-lg border border-dashed bg-[#F1FAEE] p-4">
                    <p className="text-center text-xs font-medium text-[#4A6274]">
                        Akun uji (hanya environment lokal)
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {demoAccounts.map((account) => (
                            <Button
                                key={account.role}
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => masukCepat(account.email)}
                                data-test={`quick-login-${account.role}`}
                            >
                                {account.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke SIMLAFIS',
    description: 'Masukkan email dan kata sandi untuk mengakses sistem',
};