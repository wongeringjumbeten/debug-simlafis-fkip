import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col justify-between bg-[#1D3557] p-10 lg:flex">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage:
                            "url('/images/lab-fisika.png')",
                    }}
                />
                <Link
                    href={home()}
                    className="relative z-10 flex items-center gap-3"
                >
                    <img
                        src="/images/logo-fkip.png"
                        alt="Logo FKIP UNEJ"
                        className="h-10 w-auto"
                    />
                    <div>
                        <p className="text-sm font-semibold text-white">
                            SIMLAFIS
                        </p>
                        <p className="text-xs text-[#A8DADC]">
                            Laboratorium Fisika FKIP UNEJ
                        </p>
                    </div>
                </Link>
                <div className="relative z-10">
                    <p className="text-lg font-semibold text-white">
                        Sistem Informasi Manajemen
                        <br />
                        Laboratorium Fisika
                    </p>
                    <p className="mt-2 text-sm text-[#A8DADC]">
                        Kelola peminjaman alat, ruangan, dan
                        inventaris laboratorium secara terpadu.
                    </p>
                </div>
            </div>
            <div className="w-full bg-[#F1FAEE] px-6 py-8 lg:p-8">
                <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2 lg:hidden"
                    >
                        <img
                            src="/images/logo-fkip.png"
                            alt="Logo FKIP UNEJ"
                            className="h-12 w-auto"
                        />
                    </Link>
                    <div className="flex flex-col items-start gap-1 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-semibold text-[#1D3557]">
                            {title}
                        </h1>
                        <p className="text-sm text-[#4A6274]">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
