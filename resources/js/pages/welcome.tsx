import { Head, Link, usePage } from '@inertiajs/react';
import { Beaker, Clock, Download, FileText, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sopPdf } from '@/lib/sop';
import { mockAset } from '@/mock/katalog';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';

const ringkasanKatalog = {
    totalAset: mockAset.length,
    totalAlat: mockAset.filter((aset) => aset.kategori === 'alat').length,
    totalRuangan: mockAset.filter((aset) => aset.kategori === 'ruangan').length,
    totalUnitLab: new Set(mockAset.map((aset) => aset.unitLab)).size,
};

const tarifAlat = [
    {
        nama: 'Osiloskop Digital',
        lab: 'Elektronika',
        tarif: 'Rp 25.000/jam',
    },
    {
        nama: 'Multimeter Digital',
        lab: 'Dasar',
        tarif: 'Rp 10.000/jam',
    },
    {
        nama: 'Generator Sinyal',
        lab: 'Elektronika',
        tarif: 'Rp 20.000/jam',
    },
    {
        nama: 'Spektrometer',
        lab: 'Lanjut',
        tarif: 'Rp 50.000/jam',
    },
    {
        nama: 'Power Supply DC',
        lab: 'Dasar',
        tarif: 'Rp 15.000/jam',
    },
];

const tarifRuangan = [
    {
        nama: 'Lab Fisika Dasar',
        kapasitas: '30 orang',
        tarif: 'Rp 150.000/sesi',
    },
    {
        nama: 'Lab Elektronika',
        kapasitas: '25 orang',
        tarif: 'Rp 200.000/sesi',
    },
    {
        nama: 'Lab Fisika Lanjut',
        kapasitas: '20 orang',
        tarif: 'Rp 250.000/sesi',
    },
    {
        nama: 'Lab ELF',
        kapasitas: '15 orang',
        tarif: 'Rp 300.000/sesi',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="SIMLAFIS" />

            <div className="min-h-screen w-full overflow-x-hidden bg-background">
                {/* Header */}
                <header className="w-full border-b border-border bg-card">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                        <Link href="/" className="flex items-center gap-3">
                            <img
                                src="/images/logo-fkip.png"
                                alt="Logo FKIP UNEJ"
                                className="h-10 w-auto"
                            />
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold text-[#1D3557] dark:text-foreground">
                                    SIMLAFIS
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Laboratorium Fisika FKIP UNEJ
                                </p>
                            </div>
                        </Link>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="text-primary"
                                    >
                                        <Link href={login()}>Masuk</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>Daftar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="w-full bg-linear-to-br from-[#1D3557] via-[#0F4C81] to-[#2A9D6F]">
                    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
                        <div className="text-white">
                            <h1 className="text-2xl leading-tight font-semibold sm:text-3xl">
                                Sistem Informasi Manajemen
                                <br />
                                Laboratorium Fisika
                            </h1>
                            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#A8DADC]">
                                Kelola peminjaman alat, ruangan, dan inventaris
                                laboratorium Pendidikan Fisika FKIP Universitas
                                Jember secara terpadu.
                            </p>
                            {!auth.user && (
                                <div className="mt-8 flex gap-3">
                                    <Button
                                        asChild
                                        className="bg-card text-[#1D3557] dark:text-foreground hover:bg-background"
                                    >
                                        <Link href={login()}>
                                            Masuk ke Sistem
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-[#A8DADC] bg-transparent text-[#A8DADC] hover:bg-[#16283F] hover:text-white"
                                    >
                                        <Link href={register()}>
                                            Daftar Akun Eksternal
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="hidden lg:block">
                            <img
                                src="/images/lab-fisika.png"
                                alt="Laboratorium Fisika FKIP UNEJ"
                                className="rounded-xl border border-[#A8DADC]/40 object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* Ringkasan katalog bersumber dari data dummy UI-first, bukan statistik operasional. */}
                <section className="border-b border-border bg-background">
                    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1D3557] dark:text-foreground">
                                    Ringkasan Katalog
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Data contoh dari katalog UI-first, akan
                                    diperbarui saat master data backend
                                    tersedia.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    label: 'Total aset',
                                    value: ringkasanKatalog.totalAset,
                                },
                                {
                                    label: 'Alat laboratorium',
                                    value: ringkasanKatalog.totalAlat,
                                },
                                {
                                    label: 'Ruangan tersedia',
                                    value: ringkasanKatalog.totalRuangan,
                                },
                                {
                                    label: 'Unit laboratorium',
                                    value: ringkasanKatalog.totalUnitLab,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    <p className="text-2xl font-semibold text-[#1D3557] dark:text-foreground">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Info singkat */}
                <section className="border-b border-border bg-card">
                    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Beaker className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#1D3557] dark:text-foreground">
                                    4 Unit Laboratorium
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    Fisika Dasar, Elektronika, Fisika Lanjut,
                                    dan ELF tersedia untuk kegiatan praktikum
                                    dan penelitian.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#1D3557] dark:text-foreground">
                                    Peminjaman Terjadwal
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    Ajukan peminjaman alat dan ruangan secara
                                    daring dengan pengecekan jadwal otomatis.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#1D3557] dark:text-foreground">
                                    FKIP Universitas Jember
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    Jl. Kalimantan No. 37, Kampus Tegalboto,
                                    Jember, Jawa Timur.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tarif Alat */}
                <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                    <h2 className="text-lg font-semibold text-[#1D3557] dark:text-foreground">
                        Tarif Layanan Alat
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Tarif berikut berlaku untuk pengguna eksternal. Civitas
                        UNEJ tidak dikenakan biaya.
                    </p>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted">
                                    <th className="px-4 py-3 font-medium text-[#1D3557] dark:text-foreground">
                                        Nama Alat
                                    </th>
                                    <th className="hidden px-4 py-3 font-medium text-[#1D3557] dark:text-foreground sm:table-cell">
                                        Laboratorium
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-[#1D3557] dark:text-foreground">
                                        Tarif Eksternal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tarifAlat.map((item, i) => (
                                    <tr
                                        key={item.nama}
                                        className={
                                            i % 2 === 1 ? 'bg-card' : ''
                                        }
                                    >
                                        <td className="px-4 py-3 text-[#0F1E30] dark:text-foreground">
                                            {item.nama}
                                        </td>
                                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                                            {item.lab}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-xs text-[#0F1E30] dark:text-foreground">
                                            {item.tarif}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Data tarif di atas adalah contoh placeholder. Tarif
                        sesungguhnya akan ditampilkan setelah data backend
                        tersedia.
                    </p>
                </section>

                {/* Tarif Ruangan */}
                <section className="border-t border-border bg-card">
                    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                        <h2 className="text-lg font-semibold text-[#1D3557] dark:text-foreground">
                            Tarif Layanan Ruangan
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ruangan laboratorium tersedia untuk kegiatan
                            praktikum, penelitian, dan pelatihan.
                        </p>
                        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted">
                                        <th className="px-4 py-3 font-medium text-[#1D3557] dark:text-foreground">
                                            Nama Ruangan
                                        </th>
                                        <th className="hidden px-4 py-3 font-medium text-[#1D3557] dark:text-foreground sm:table-cell">
                                            Kapasitas
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium text-[#1D3557] dark:text-foreground">
                                            Tarif Eksternal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tarifRuangan.map((item, i) => (
                                        <tr
                                            key={item.nama}
                                            className={
                                                i % 2 === 1
                                                    ? 'bg-card'
                                                    : ''
                                            }
                                        >
                                            <td className="px-4 py-3 text-[#0F1E30] dark:text-foreground">
                                                {item.nama}
                                            </td>
                                            <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                                                {item.kapasitas}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-xs text-[#0F1E30] dark:text-foreground">
                                                {item.tarif}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Data tarif di atas adalah contoh placeholder. Tarif
                            sesungguhnya akan ditampilkan setelah data backend
                            tersedia.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border bg-[#1D3557]">
                    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Identitas */}
                            <div className="flex items-start gap-3">
                                <img
                                    src="/images/logo-fkip.png"
                                    alt="Logo FKIP UNEJ"
                                    className="h-9 w-auto"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        SIMLAFIS
                                    </p>
                                    <p className="mt-0.5 text-xs text-[#A8DADC]">
                                        Laboratorium Pendidikan Fisika
                                    </p>
                                </div>
                            </div>

                            {/* Dokumen & Panduan */}
                            <div>
                                <h2 className="text-xs font-semibold tracking-wide text-white uppercase">
                                    Dokumen &amp; Panduan
                                </h2>
                                <a
                                    href={sopPdf.url}
                                    download={sopPdf.namaBerkas}
                                    className="group mt-3 flex items-start gap-3 rounded-lg border border-[#A8DADC]/30 bg-[#16283F] p-3 transition-colors hover:border-[#A8DADC] hover:bg-primary focus-visible:ring-2 focus-visible:ring-[#A8DADC] focus-visible:outline-none"
                                >
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary transition-colors group-hover:bg-[#A8DADC]/20">
                                        <FileText className="size-4 text-[#A8DADC]" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-medium text-white">
                                            {sopPdf.judul}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-[#A8DADC]">
                                            {sopPdf.keterangan}
                                        </span>
                                        <span className="mt-1 block text-[11px] text-[#A8DADC]/70">
                                            {sopPdf.meta}
                                        </span>
                                    </span>
                                    <Download className="size-4 shrink-0 text-[#A8DADC] transition-transform group-hover:translate-y-0.5" />
                                </a>
                            </div>

                            {/* Kontak */}
                            <div>
                                <h2 className="text-xs font-semibold tracking-wide text-white uppercase">
                                    Kontak
                                </h2>
                                <ul className="mt-3 space-y-2 text-xs text-[#A8DADC]">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 size-3.5 shrink-0" />
                                        <span>
                                            Jl. Kalimantan No. 37, Kampus
                                            Tegalboto, Jember, Jawa Timur
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Phone className="mt-0.5 size-3.5 shrink-0" />
                                        <span>FKIP Universitas Jember</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <p className="mt-8 border-t border-[#A8DADC]/20 pt-6 text-xs text-[#A8DADC]/60">
                            Capstone MBKM FKIP UNEJ
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
