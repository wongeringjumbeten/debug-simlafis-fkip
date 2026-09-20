import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, Info, KeyRound, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
};

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Pengaturan Keamanan" />

            <h1 className="sr-only">Pengaturan Keamanan</h1>

            <div className="space-y-6">
                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <ShieldCheck className="text-primary size-5" />
                            Ubah Kata Sandi
                        </CardTitle>
                        <CardDescription>
                            Pastikan akun Anda menggunakan kata sandi yang panjang dan acak demi keamanan data dan riwayat peminjaman Anda.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Panel Panduan Sandi Aman */}
                        <div className="border-border/70 bg-muted/40 rounded-xl border p-4">
                            <div className="flex items-start gap-3">
                                <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                                <div className="space-y-1.5 text-xs">
                                    <p className="text-foreground font-semibold">
                                        Rekomendasi Keamanan Kata Sandi
                                    </p>
                                    <ul className="text-muted-foreground list-inside list-disc space-y-0.5">
                                        <li>Minimal 8 karakter.</li>
                                        <li>Kombinasikan huruf kapital, huruf kecil, dan angka.</li>
                                        <li>Hindari penggunaan nama lengkap atau tanggal lahir.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Form
                            {...SecurityController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-5"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="current_password">
                                            Kata sandi saat ini
                                        </Label>

                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className="mt-1 block w-full"
                                            autoComplete="current-password"
                                            placeholder="Masukkan kata sandi saat ini"
                                        />

                                        <InputError
                                            message={errors.current_password}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Kata sandi baru
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder="Masukkan kata sandi baru"
                                            passwordrules={props.passwordRules}
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Konfirmasi kata sandi baru
                                        </Label>

                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder="Ulangi kata sandi baru"
                                            passwordrules={props.passwordRules}
                                        />

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                        {recentlySuccessful && (
                                            <div className="text-success flex items-center gap-1.5 text-xs font-medium">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>
                                                    Kata sandi berhasil diperbarui.
                                                </span>
                                            </div>
                                        )}

                                        <Button
                                            disabled={processing}
                                            data-test="update-password-button"
                                            className="w-full sm:w-auto"
                                        >
                                            {processing ? (
                                                <Spinner />
                                            ) : (
                                                <KeyRound className="h-4 w-4" />
                                            )}
                                            <span>Simpan Kata Sandi</span>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Keamanan',
            href: edit(),
        },
    ],
};
