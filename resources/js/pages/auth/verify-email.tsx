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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MailCheck className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Kami telah mengirim tautan verifikasi ke email Anda. Klik tautan tersebut untuk mengaktifkan akun sebelum masuk ke SIMLAFIS.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-center text-sm font-medium text-green-600">
                        Tautan verifikasi baru telah dikirim ke email Anda.
                    </div>
                )}

                <Form {...send.form()} resetOnSuccess>
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <InputError message={errors.email} />

                            <div className="flex items-center gap-2">
                                <Button className="flex-1" disabled={processing} data-test="resend-verification-email-button">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Kirim Ulang Tautan Verifikasi
                                </Button>

                                {recentlySuccessful && (
                                    <span className="text-sm text-muted-foreground">Terkirim.</span>
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
                            <Button type="submit" variant="secondary" className="w-full" disabled={processing}>
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
