import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, MailCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { login, logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verifikasi Email" />

            <div className="space-y-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                        <MailCheck className="text-primary h-6 w-6" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Kami telah mengirim tautan verifikasi ke email Anda.
                        Klik tautan tersebut untuk mengaktifkan akun sebelum
                        masuk ke SIMLAFIS.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-center text-sm font-medium text-success">
                        Tautan verifikasi baru telah dikirim ke email Anda.
                    </div>
                )}

                <Form {...send.form()} resetOnSuccess>
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <InputError message={errors.email} />

                            <div className="flex items-center gap-2">
                                <Button
                                    className="flex-1"
                                    disabled={processing}
                                    data-test="resend-verification-email-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Kirim Ulang Tautan Verifikasi
                                </Button>

                                {recentlySuccessful && (
                                    <span className="text-muted-foreground text-sm">
                                        Terkirim.
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>Sudah terverifikasi?</span>
                    <TextLink href={login()}>Masuk</TextLink>
                </div>

                <div className="text-center">
                    <Form {...logout.form()}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full"
                                disabled={processing}
                            >
                                Keluar
                            </Button>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi Email',
    description: 'Verifikasi email Anda untuk mengaktifkan akun SIMLAFIS',
};
