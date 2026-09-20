import { useEffect, useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Aset, KondisiUnit, StatusUnit, UnitAlat } from '@/types';
import { kondisiUnitLabels, statusUnitLabels } from './helpers';

interface UnitFormDialogProps {
    /** Alat yang akan ditambahi unit; null berarti dialog tertutup. */
    alat: Aset | null;
    onOpenChange: (open: boolean) => void;
    onSimpan: (unit: UnitAlat) => void;
    /** Pesan galat dari backend, mis. validasi nomor seri. */
    errorBackend?: string | null;
    /**
     * Status permintaan simpan. Dikendalikan induk lewat `onFinish` agar dialog
     * tidak tertinggal dalam keadaan "Menyimpan" ketika backend menolak.
     */
    submitting?: boolean;
}

const kondisiList: KondisiUnit[] = ['baik', 'rusak', 'sedang perbaikan'];
const statusList: StatusUnit[] = [
    'tersedia',
    'tidak tersedia',
    'sedang perbaikan',
];

/**
 * Formulir registrasi satu unit fisik alat (PR-18).
 *
 * Berbeda dari `ItemFormDialog` yang mengelola master alat, dialog ini menambah
 * baris `detail_alat` — satu unit nyata dengan nomor seri, kondisi, dan status
 * operasionalnya sendiri. Stok pada kartu katalog dihitung dari jumlah baris ini.
 */
export function UnitFormDialog({
    alat,
    onOpenChange,
    onSimpan,
    errorBackend,
    submitting = false,
}: UnitFormDialogProps) {
    const [noSeriUnit, setNoSeriUnit] = useState('');
    const [kondisi, setKondisi] = useState<KondisiUnit>('baik');
    const [status, setStatus] = useState<StatusUnit>('tersedia');
    const [tahunPengadaan, setTahunPengadaan] = useState('');
    const [sumberDana, setSumberDana] = useState('');
    const [hargaBeli, setHargaBeli] = useState('');
    const [catatan, setCatatan] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (alat) {
            setNoSeriUnit('');
            setKondisi('baik');
            setStatus('tersedia');
            setTahunPengadaan(String(new Date().getFullYear()));
            setSumberDana('');
            setHargaBeli('');
            setCatatan('');
            setError(null);
        }
    }, [alat]);

    if (!alat) {
        return null;
    }

    const pesanGalat = error ?? errorBackend ?? null;

    function simpan() {
        if (noSeriUnit.trim().length > 100) {
            setError('Nomor seri maksimal 100 karakter.');
            return;
        }
        if (hargaBeli !== '' && Number(hargaBeli) < 0) {
            setError('Harga beli tidak boleh negatif.');
            return;
        }
        if (tahunPengadaan !== '' && !/^\d{4}$/.test(tahunPengadaan)) {
            setError('Tahun pengadaan harus empat digit, mis. 2024.');
            return;
        }

        setError(null);
        onSimpan({
            noSeriUnit: noSeriUnit.trim() || undefined,
            kondisi,
            status,
            tahunPengadaan: tahunPengadaan || undefined,
            sumberDana: sumberDana.trim() || undefined,
            hargaBeli: hargaBeli === '' ? undefined : Number(hargaBeli),
            catatan: catatan.trim() || undefined,
        });
    }

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tambah Unit Alat</DialogTitle>
                    <DialogDescription>
                        {alat.nama} ·{' '}
                        <span className="font-mono">{alat.kode}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="no-seri-unit">Nomor Seri Unit</Label>
                        <Input
                            id="no-seri-unit"
                            value={noSeriUnit}
                            onChange={(e) => setNoSeriUnit(e.target.value)}
                            placeholder="OSC-2024-001"
                            className="font-mono"
                            maxLength={100}
                        />
                        <p className="text-muted-foreground text-xs">
                            Disarankan diisi — nomor seri menjadi identitas unik
                            unit ini.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="kondisi-unit">Kondisi</Label>
                            <Select
                                value={kondisi}
                                onValueChange={(v) =>
                                    setKondisi(v as KondisiUnit)
                                }
                            >
                                <SelectTrigger
                                    id="kondisi-unit"
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {kondisiList.map((k) => (
                                        <SelectItem key={k} value={k}>
                                            {kondisiUnitLabels[k]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="status-unit">Status</Label>
                            <Select
                                value={status}
                                onValueChange={(v) => setStatus(v as StatusUnit)}
                            >
                                <SelectTrigger
                                    id="status-unit"
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusList.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {statusUnitLabels[s]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <p className="text-muted-foreground bg-muted/50 rounded-md px-3 py-2 text-xs leading-relaxed">
                        <strong>Kondisi</strong> menggambarkan keadaan fisik alat.{' '}
                        <strong>Status</strong> menentukan apakah unit ini boleh
                        dipinjam. Unit hanya dihitung tersedia bila kondisinya
                        baik <em>dan</em> statusnya tersedia.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="tahun-pengadaan">
                                Tahun Pengadaan
                            </Label>
                            <Input
                                id="tahun-pengadaan"
                                inputMode="numeric"
                                maxLength={4}
                                value={tahunPengadaan}
                                onChange={(e) =>
                                    setTahunPengadaan(e.target.value)
                                }
                                placeholder="2024"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="harga-beli">
                                Harga Beli (Rp)
                            </Label>
                            <Input
                                id="harga-beli"
                                type="number"
                                min={0}
                                value={hargaBeli}
                                onChange={(e) => setHargaBeli(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="sumber-dana">Sumber Dana</Label>
                        <Input
                            id="sumber-dana"
                            value={sumberDana}
                            onChange={(e) => setSumberDana(e.target.value)}
                            placeholder="PNBP / Hibah / Dana Fakultas"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="catatan-unit">Catatan</Label>
                        <Textarea
                            id="catatan-unit"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {pesanGalat && (
                        <p className="text-sm text-[#A32E38] dark:text-destructive" role="alert">
                            {pesanGalat}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                    >
                        Batal
                    </Button>
                    <Button onClick={simpan} disabled={submitting}>
                        {submitting && <Spinner />}
                        {submitting ? 'Menyimpan...' : 'Simpan Unit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
