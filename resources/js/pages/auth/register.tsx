import { Head, useForm } from '@inertiajs/react';
import { Camera, CreditCard } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';
import { FileUpload } from '@/components/file-upload';
import { login } from '@/routes';
import { store } from '@/routes/register';

type OpsiReferensi = { id: number; nama?: string; name?: string };

type Referensi = {
    fakultas: OpsiReferensi[];
    instansi: OpsiReferensi[];
    provinsi: OpsiReferensi[];
};

type Props = {
    passwordRules: string;
    referensi?: Referensi;
};

type KategoriPengguna = '' | 'mahasiswa' | 'dosen' | 'eksternal';

const KATEGORI_OPSI: { value: Exclude<KategoriPengguna, ''>; label: string; deskripsi: string }[] = [
    { value: 'mahasiswa', label: 'Mahasiswa UNEJ', deskripsi: 'Wajib NIM, fakultas, prodi, dan KTM' },
    { value: 'dosen', label: 'Dosen UNEJ', deskripsi: 'Wajib NIP/NIDN, fakultas, prodi, dan kartu pegawai' },
    { value: 'eksternal', label: 'Pengguna Umum (Non-UNEJ)', deskripsi: 'Wajib NIK, instansi, alamat, dan KTP' },
];

const namaOpsi = (o: OpsiReferensi) => o.nama ?? o.name ?? '';

export default function Register({ passwordRules, referensi }: Props) {
    const ref: Referensi = referensi ?? { fakultas: [], instansi: [], provinsi: [] };
    const [langkah, setLangkah] = useState(1);
    const [konfirmasiTerbuka, setKonfirmasiTerbuka] = useState(false);
    const [kabupaten, setKabupaten] = useState<OpsiReferensi[]>([]);
    const [kecamatan, setKecamatan] = useState<OpsiReferensi[]>([]);
    const [desa, setDesa] = useState<OpsiReferensi[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        kategori_pengguna: '' as KategoriPengguna,
        name: '',
        no_hp: '',
        email: '',
        nim: '',
        nip: '',
        nik: '',
        id_fakultas: '',
        prodi: '',
        kategori_tarif: '',
        instansi: '',
        id_provinsi: '',
        id_kabupaten: '',
        id_kecamatan: '',
        id_kelurahandesa: '',
        alamat_lengkap: '',
        foto_profil: null as File | null,
        foto_identitas: null as File | null,
        password: '',
        password_confirmation: '',
    });

    async function muatWilayah(url: string, set: (v: OpsiReferensi[]) => void) {
        try {
            const res = await fetch(url, { headers: { Accept: 'application/json' } });
            set(res.ok ? await res.json() : []);
        } catch {
            set([]);
        }
    }

    function langkahSatuValid() {
        return data.kategori_pengguna !== '' && data.name.trim() !== '' && data.no_hp.trim() !== '' && data.email.trim() !== '';
    }

    function langkahDuaValid() {
        // Foto identitas wajib; foto profil boleh dikosongkan.
        if (!data.foto_identitas) return false;
        if (data.password === '' || data.password !== data.password_confirmation) return false;

        if (data.kategori_pengguna === 'mahasiswa') {
            return data.nim.trim() !== '' && data.id_fakultas !== '' && data.prodi.trim() !== '';
        }
        if (data.kategori_pengguna === 'dosen') {
            return data.nip.trim() !== '' && data.id_fakultas !== '' && data.prodi.trim() !== '';
        }
        if (data.kategori_pengguna === 'eksternal') {
            return (
                data.kategori_tarif !== '' &&
                data.nik.trim() !== '' &&
                data.instansi.trim() !== '' &&
                data.id_provinsi !== '' &&
                data.id_kabupaten !== '' &&
                data.id_kecamatan !== '' &&
                data.id_kelurahandesa !== '' &&
                data.alamat_lengkap.trim() !== ''
            );
        }
        return false;
    }

    const FIELD_LANGKAH_SATU = ['kategori_pengguna', 'name', 'no_hp', 'email'];

    function lompatKeLangkahError(er: Record<string, string>) {
        const adaDiLangkahSatu = FIELD_LANGKAH_SATU.some((f) => er[f]);
        setLangkah(adaDiLangkahSatu ? 1 : 2);
    }

    function kirim(e?: React.FormEvent) {
        e?.preventDefault();
        post(store.url(), {
            forceFormData: true,
            onError: lompatKeLangkahError,
            onSuccess: () => {
                reset('password', 'password_confirmation');
                setKonfirmasiTerbuka(false);
            },
        });
    }

    return (
        <>
            <Head title="Daftar Akun SIMLAFIS" />
            <div className="flex flex-col gap-6">
                <ol className="flex items-center gap-2 text-xs" aria-label="Langkah pendaftaran">
                    {['Kategori & Data Dasar', 'Data Lengkap', 'Konfirmasi'].map((label, i) => (
                        <li key={label} className="flex items-center gap-2">
                            <span
                                className={cn(
                                    'flex h-6 w-6 items-center justify-center rounded-full font-medium',
                                    langkah >= i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                                )}
                            >
                                {i + 1}
                            </span>
                            <span className={langkah === i + 1 ? 'font-medium' : 'text-muted-foreground'}>{label}</span>
                            {i < 2 && <span className="text-muted-foreground">/</span>}
                        </li>
                    ))}
                </ol>

                {langkah === 1 && (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label>Kategori Pengguna</Label>
                            <div className="grid gap-2" role="radiogroup" aria-label="Kategori pengguna">
                                {KATEGORI_OPSI.map((o) => (
                                    <button
                                        key={o.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={data.kategori_pengguna === o.value}
                                        onClick={() => setData('kategori_pengguna', o.value)}
                                        className={cn(
                                            'rounded-lg border p-3 text-left transition-colors focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
                                            data.kategori_pengguna === o.value
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:border-muted-foreground/40',
                                        )}
                                    >
                                        <span className="block text-sm font-medium">{o.label}</span>
                                        <span className="block text-xs text-muted-foreground">{o.deskripsi}</span>
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.kategori_pengguna} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Masukkan nama lengkap" autoComplete="name" />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="no_hp">Nomor HP / WhatsApp</Label>
                            <Input id="no_hp" type="tel" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} placeholder="08xxxxxxxxxx atau +628xxxxxxxxx" autoComplete="tel" />
                            <InputError message={errors.no_hp} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="email@contoh.com" autoComplete="email" />
                            <InputError message={errors.email} />
                        </div>

                        <Button type="button" className="w-full" disabled={!langkahSatuValid()} onClick={() => setLangkah(2)}>
                            Lanjut
                        </Button>
                    </div>
                )}

                {langkah === 2 && (
                    <div className="grid gap-6">
                        {(data.kategori_pengguna === 'mahasiswa' || data.kategori_pengguna === 'dosen') && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor={data.kategori_pengguna === 'mahasiswa' ? 'nim' : 'nip'}>
                                        {data.kategori_pengguna === 'mahasiswa' ? 'NIM' : 'NIP / NIDN'}
                                    </Label>
                                    <Input
                                        id={data.kategori_pengguna === 'mahasiswa' ? 'nim' : 'nip'}
                                        value={data.kategori_pengguna === 'mahasiswa' ? data.nim : data.nip}
                                        onChange={(e) => setData(data.kategori_pengguna === 'mahasiswa' ? 'nim' : 'nip', e.target.value)}
                                        placeholder={data.kategori_pengguna === 'mahasiswa' ? 'Contoh: 241910301065' : 'Contoh: 197503152005011002'}
                                    />
                                    <InputError message={errors.nim ?? errors.nip} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="id_fakultas">Fakultas</Label>
                                    <Select value={data.id_fakultas} onValueChange={(v) => setData('id_fakultas', v)}>
                                        <SelectTrigger id="id_fakultas" className="w-full">
                                            <SelectValue placeholder="Pilih fakultas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ref.fakultas.map((f) => (
                                                <SelectItem key={f.id} value={String(f.id)}>
                                                    {namaOpsi(f)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.id_fakultas} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="prodi">Program Studi</Label>
                                    <Input id="prodi" value={data.prodi} onChange={(e) => setData('prodi', e.target.value)} placeholder="Contoh: Pendidikan Fisika" />
                                    <InputError message={errors.prodi} />
                                </div>
                            </>
                        )}

                        {data.kategori_pengguna === 'eksternal' && (
                            <>
                                <div className="grid gap-2">
                                    <Label>Kategori Tarif</Label>
                                    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Kategori tarif">
                                        {[
                                            { value: 'internal_unej', label: 'Internal UNEJ' },
                                            { value: 'luar_unej', label: 'Luar UNEJ' },
                                        ].map((o) => (
                                            <button
                                                key={o.value}
                                                type="button"
                                                role="radio"
                                                aria-checked={data.kategori_tarif === o.value}
                                                onClick={() => setData('kategori_tarif', o.value)}
                                                className={cn(
                                                    'rounded-lg border p-3 text-sm font-medium transition-colors focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
                                                    data.kategori_tarif === o.value
                                                        ? 'border-primary bg-primary/5'
                                                        : 'hover:border-muted-foreground/40',
                                                )}
                                            >
                                                {o.label}
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.kategori_tarif} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nik">NIK</Label>
                                    <Input id="nik" value={data.nik} onChange={(e) => setData('nik', e.target.value)} placeholder="16 digit NIK" inputMode="numeric" />
                                    <InputError message={errors.nik} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="instansi">Instansi</Label>
                                    <Input id="instansi" value={data.instansi} onChange={(e) => setData('instansi', e.target.value)} placeholder="Contoh: SMAN 1 Jember" list="daftar-instansi" />
                                    <datalist id="daftar-instansi">
                                        {ref.instansi.map((i) => (
                                            <option key={i.id} value={namaOpsi(i)} />
                                        ))}
                                    </datalist>
                                    <InputError message={errors.instansi} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="id_provinsi">Provinsi</Label>
                                        <Select
                                            value={data.id_provinsi}
                                            onValueChange={(v) => {
                                                setData({ ...data, id_provinsi: v, id_kabupaten: '', id_kecamatan: '', id_kelurahandesa: '' });
                                                setKecamatan([]);
                                                setDesa([]);
                                                muatWilayah(`/wilayah/kabupaten/${v}`, setKabupaten);
                                            }}
                                        >
                                            <SelectTrigger id="id_provinsi" className="w-full">
                                                <SelectValue placeholder="Pilih" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ref.provinsi.map((p) => (
                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                        {namaOpsi(p)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.id_provinsi} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="id_kabupaten">Kabupaten/Kota</Label>
                                        <Select
                                            value={data.id_kabupaten}
                                            disabled={kabupaten.length === 0}
                                            onValueChange={(v) => {
                                                setData({ ...data, id_kabupaten: v, id_kecamatan: '', id_kelurahandesa: '' });
                                                setDesa([]);
                                                muatWilayah(`/wilayah/kecamatan/${v}`, setKecamatan);
                                            }}
                                        >
                                            <SelectTrigger id="id_kabupaten" className="w-full">
                                                <SelectValue placeholder="Pilih" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {kabupaten.map((k) => (
                                                    <SelectItem key={k.id} value={String(k.id)}>
                                                        {namaOpsi(k)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.id_kabupaten} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="id_kecamatan">Kecamatan</Label>
                                        <Select
                                            value={data.id_kecamatan}
                                            disabled={kecamatan.length === 0}
                                            onValueChange={(v) => {
                                                setData({ ...data, id_kecamatan: v, id_kelurahandesa: '' });
                                                muatWilayah(`/wilayah/desa/${v}`, setDesa);
                                            }}
                                        >
                                            <SelectTrigger id="id_kecamatan" className="w-full">
                                                <SelectValue placeholder="Pilih" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {kecamatan.map((k) => (
                                                    <SelectItem key={k.id} value={String(k.id)}>
                                                        {namaOpsi(k)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.id_kecamatan} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="id_kelurahandesa">Kelurahan/Desa</Label>
                                        <Select value={data.id_kelurahandesa} disabled={desa.length === 0} onValueChange={(v) => setData('id_kelurahandesa', v)}>
                                            <SelectTrigger id="id_kelurahandesa" className="w-full">
                                                <SelectValue placeholder="Pilih" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {desa.map((d) => (
                                                    <SelectItem key={d.id} value={String(d.id)}>
                                                        {namaOpsi(d)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.id_kelurahandesa} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                                    <Input id="alamat_lengkap" value={data.alamat_lengkap} onChange={(e) => setData('alamat_lengkap', e.target.value)} placeholder="Jalan, nomor rumah, RT/RW" />
                                    <InputError message={errors.alamat_lengkap} />
                                </div>
                            </>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <FileUpload
                                id="foto_profil"
                                label="Foto Profil (Opsional)"
                                file={data.foto_profil}
                                error={errors.foto_profil}
                                onChange={(f) => setData('foto_profil', f)}
                                icon={Camera}
                            />

                            <FileUpload
                                id="foto_identitas"
                                label={data.kategori_pengguna === 'mahasiswa' ? 'Foto KTM (Wajib)' : data.kategori_pengguna === 'dosen' ? 'Foto Kartu Pegawai (Wajib)' : 'Foto KTP (Wajib)'}
                                file={data.foto_identitas}
                                error={errors.foto_identitas}
                                onChange={(f) => setData('foto_identitas', f)}
                                icon={CreditCard}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <PasswordInput id="password" autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Kata sandi" passwordrules={passwordRules} />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                            <PasswordInput id="password_confirmation" autoComplete="new-password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="Ulangi kata sandi" passwordrules={passwordRules} />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" className="flex-1" onClick={() => setLangkah(1)}>
                                Kembali
                            </Button>
                            <Button type="button" className="flex-1" disabled={!langkahDuaValid()} onClick={() => setLangkah(3)}>
                                Lanjut
                            </Button>
                        </div>
                    </div>
                )}

                {langkah === 3 && (
                    <div className="grid gap-6">
                        <div className="rounded-lg border p-4 text-sm">
                            <p className="font-medium">Ringkasan pendaftaran</p>
                            <dl className="mt-2 space-y-1 text-muted-foreground">
                                <div className="flex justify-between gap-4"><dt>Kategori</dt><dd className="font-medium text-foreground">{KATEGORI_OPSI.find((o) => o.value === data.kategori_pengguna)?.label}</dd></div>
                                <div className="flex justify-between gap-4"><dt>Nama</dt><dd className="font-medium text-foreground">{data.name}</dd></div>
                                <div className="flex justify-between gap-4"><dt>Email</dt><dd className="font-medium text-foreground">{data.email}</dd></div>
                                <div className="flex justify-between gap-4"><dt>No. HP</dt><dd className="font-medium text-foreground">{data.no_hp}</dd></div>
                            </dl>

                            {(data.foto_profil || data.foto_identitas) && (
                                <div className="mt-4 flex gap-4 border-t pt-4">
                                    {data.foto_profil && (
                                        <div className="space-y-1 text-center">
                                            <div className="mx-auto h-14 w-14 overflow-hidden rounded-full border bg-muted">
                                                <img
                                                    src={URL.createObjectURL(data.foto_profil)}
                                                    alt="Pratinjau foto profil"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Profil</p>
                                        </div>
                                    )}
                                    {data.foto_identitas && (
                                        <div className="space-y-1 text-center">
                                            <div className="mx-auto h-14 w-14 overflow-hidden rounded-lg border bg-muted">
                                                <img
                                                    src={URL.createObjectURL(data.foto_identitas)}
                                                    alt="Pratinjau foto identitas"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Identitas</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" className="flex-1" onClick={() => setLangkah(2)}>
                                Kembali
                            </Button>
                            <Button type="button" className="flex-1" disabled={processing} onClick={() => setKonfirmasiTerbuka(true)} data-test="register-user-button">
                                {processing && <Spinner />}
                                Daftar Sekarang
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-muted-foreground text-center text-sm">
                    Sudah punya akun?{' '}
                    <TextLink href={login()}>Masuk</TextLink>
                </div>
            </div>

            <Dialog open={konfirmasiTerbuka} onOpenChange={setKonfirmasiTerbuka}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Yakin ingin melakukan registrasi?</DialogTitle>
                        <DialogDescription>
                            Akun akan dibuat sesuai kategori pengguna yang dipilih, lalu tautan verifikasi dikirim ke email {data.email}. Verifikasi email diperlukan sebelum dapat masuk.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setKonfirmasiTerbuka(false)}>
                            Batal
                        </Button>
                        <Button type="button" disabled={processing} onClick={() => kirim()}>
                            {processing && <Spinner />}
                            Ya, Daftarkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Register.layout = {
    title: 'Daftar Akun SIMLAFIS',
    description: 'Pilih kategori pengguna, lengkapi data, unggah dokumen, lalu konfirmasi pendaftaran',
};
