import { Form, Head, router } from '@inertiajs/react';
import { ArrowLeft, KeyRound, LockKeyhole, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const [isOpen, setIsOpen] = useState(true);

    function handleCancel() {
        setIsOpen(false);
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
        } else {
            router.visit(dashboard().url);
        }
    }

    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />

            {/* Tampilan latar belakang saat diakses di dalam aplikasi */}
            <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-12">
                <div className="border-border/70 bg-card/60 mx-auto w-full max-w-md rounded-2xl border p-6 text-center shadow-xs sm:p-8">
                    <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-2xs">
                        <LockKeyhole className="h-7 w-7" />
                    </div>
                    <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
                        Konfirmasi Kata Sandi Diperlukan
                    </h2>
                    <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
                        Anda sedang mengakses area aman aplikasi. Harap masukkan kata sandi akun Anda untuk melanjutkan tindakan.
                    </p>

                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="gap-2"
                        >
                            <KeyRound className="h-4 w-4" />
                            <span>Buka Konfirmasi Kata Sandi</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Kembali</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal Popup Konfirmasi Kata Sandi */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-full max-w-[calc(100%-2rem)] gap-5 rounded-2xl p-5 sm:max-w-md sm:p-6">
                    <DialogHeader className="gap-2 text-left">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-2xs">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="text-base font-semibold sm:text-lg">
                                    Konfirmasi Kata Sandi
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                                    Ini adalah area aman aplikasi. Masukkan kata sandi sebelum melanjutkan.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form {...store.form()} resetOnSuccess={['password']}>
                        {({ processing, errors }) => (
                            <div className="space-y-4 pt-1">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Kata sandi</Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        placeholder="Masukkan kata sandi Anda"
                                        autoComplete="current-password"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="confirm-password-button"
                                        className="w-full gap-2 sm:w-auto"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <KeyRound className="h-4 w-4" />
                                        )}
                                        <span>Konfirmasi</span>
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

ConfirmPassword.layout = {
    breadcrumbs: [
        {
            title: 'Konfirmasi Kata Sandi',
            href: '/user/confirm-password',
        },
    ],
};
