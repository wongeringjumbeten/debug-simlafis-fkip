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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Aset, KategoriAset, KondisiAset, UnitLab } from '@/types';
import { kondisiLabels, kategoriLabels, unitLabLabels } from './helpers';

interface ItemFormDialogProps {
    state: { mode: 'buat' | 'ubah'; aset?: Aset } | null;
    kategori: KategoriAset;
    onOpenChange: (open: boolean) => void;
    onSimpan: (aset: Aset, foto?: File | null) => void;
}

const unitLabs: UnitLab[] = ['dasar', 'elektronika', 'lanjut', 'elf'];
const kondisiList: KondisiAset[] = ['baik', 'perlu_perawatan', 'rusak'];

export function ItemFormDialog({ state, kategori, onOpenChange, onSimpan }: ItemFormDialogProps) {
    const aset = state?.aset;
    const [kode, setKode] = useState('');
    const [nama, setNama] = useState('');
    const [unitLab, setUnitLab] = useState<UnitLab>('dasar');
    const [lokasi, setLokasi] = useState('');
    const [spesifikasi, setSpesifikasi] = useState('');
    const [stokTotal, setStokTotal] = useState('1');
    const [stokTersedia, setStokTersedia] = useState('1');
    const [kondisi, setKondisi] = useState<KondisiAset>('baik');
    const [kapasitas, setKapasitas] = useState('');
    const [tarifInternal, setTarifInternal] = useState('');
    const [tarifLuar, setTarifLuar] = useState('');
    const [foto, setFoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (state) {
            setKode(aset?.kode ?? '');
            setNama(aset?.nama ?? '');
            setUnitLab(aset?.unitLab ?? 'dasar');
            setLokasi(aset?.lokasi ?? '');
            setSpesifikasi(aset?.spesifikasi ?? '');
            setStokTotal(String(aset?.stokTotal ?? 1));
            setStokTersedia(String(aset?.stokTersedia ?? 1));
            setKondisi(aset?.kondisi ?? 'baik');
            setKapasitas(aset?.kapasitas !== undefined ? String(aset.kapasitas) : '');
            setTarifInternal(aset?.tarifInternalUnej !== undefined ? String(aset.tarifInternalUnej) : '');
            setTarifLuar(aset?.tarifLuarUnej !== undefined ? String(aset.tarifLuarUnej) : '');
            setFoto(null);
            setError(null);
            setSaving(false);
        }
    }, [state, aset]);

    if (!state) {
        return null;
    }

    const punyaTarif = kategori === 'alat' || kategori === 'ruangan';

    function simpan() {
        const stokTotalAngka = Number(stokTotal);
        const stokTersediaAngka = Number(stokTersedia);
        if (!kode.trim() || !nama.trim()) {
            setError('Kode dan nama wajib diisi.');
            return;
        }
        if (!Number.isInteger(stokTotalAngka) || stokTotalAngka < 0 || !Number.isInteger(stokTersediaAngka) || stokTersediaAngka < 0) {
            setError('Stok harus berupa angka bulat tidak negatif.');
            return;
        }
        if (stokTersediaAngka > stokTotalAngka) {
            setError('Stok tersedia tidak boleh melebihi stok total.');
            return;
        }
        if (punyaTarif && tarifInternal !== '' && Number(tarifInternal) < 0) {
            setError('Tarif tidak boleh negatif.');
            return;
        }
        setSaving(true);
        onSimpan({
            id: aset?.id ?? Date.now(),
            kode: kode.trim(),
            nama: nama.trim(),
            kategori,
            unitLab,
            lokasi: lokasi.trim() || undefined,
            spesifikasi: spesifikasi.trim() || undefined,
            stokTotal: stokTotalAngka,
            stokTersedia: stokTersediaAngka,
            kondisi,
            kapasitas: kategori === 'ruangan' && kapasitas !== '' ? Number(kapasitas) : undefined,
            tarifInternalUnej: punyaTarif && tarifInternal !== '' ? Number(tarifInternal) : undefined,
            tarifLuarUnej: punyaTarif && tarifLuar !== '' ? Number(tarifLuar) : undefined,
        }, foto);
    }

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {state.mode === 'buat' ? 'Tambah' : 'Ubah'} {kategoriLabels[kategori]}
                    </DialogTitle>
                    <DialogDescription>
                        Data tersimpan langsung ke basis data inventaris laboratorium SIMLAFIS.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="kode">Kode Inventaris</Label>
                            <Input id="kode" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="FIS-OSC-014" className="font-mono" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="unit-lab">Unit Laboratorium</Label>
                            <Select value={unitLab} onValueChange={(v) => setUnitLab(v as UnitLab)}>
                                <SelectTrigger id="unit-lab" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitLabs.map((u) => (
                                        <SelectItem key={u} value={u}>
                                            {unitLabLabels[u]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="nama">Nama</Label>
                        <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="foto">Foto Aset (Opsional, JPG/PNG max 2MB)</Label>
                        <Input
                            id="foto"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="lokasi">Lokasi</Label>
                            <Input id="lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="kondisi">Kondisi</Label>
                            <Select value={kondisi} onValueChange={(v) => setKondisi(v as KondisiAset)}>
                                <SelectTrigger id="kondisi" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {kondisiList.map((k) => (
                                        <SelectItem key={k} value={k}>
                                            {kondisiLabels[k]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="spesifikasi">Spesifikasi</Label>
                        <textarea
                            id="spesifikasi"
                            value={spesifikasi}
                            onChange={(e) => setSpesifikasi(e.target.value)}
                            rows={3}
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="stok-total">Stok Total</Label>
                            <Input id="stok-total" type="number" min={0} value={stokTotal} onChange={(e) => setStokTotal(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="stok-tersedia">Stok Tersedia</Label>
                            <Input id="stok-tersedia" type="number" min={0} value={stokTersedia} onChange={(e) => setStokTersedia(e.target.value)} />
                        </div>
                    </div>

                    {kategori === 'ruangan' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="kapasitas">Kapasitas (orang)</Label>
                            <Input id="kapasitas" type="number" min={1} value={kapasitas} onChange={(e) => setKapasitas(e.target.value)} />
                        </div>
                    )}

                    {punyaTarif && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="tarif-internal">Tarif Internal-UNEJ /hari</Label>
                                <Input id="tarif-internal" type="number" min={0} value={tarifInternal} onChange={(e) => setTarifInternal(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="tarif-luar">Tarif Luar-UNEJ /hari</Label>
                                <Input id="tarif-luar" type="number" min={0} value={tarifLuar} onChange={(e) => setTarifLuar(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-[#A32E38]" role="alert">
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
                        Batal
                    </Button>
                    <Button onClick={simpan} disabled={saving}>
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
