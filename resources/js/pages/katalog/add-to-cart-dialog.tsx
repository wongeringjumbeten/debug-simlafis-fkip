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
import type { Aset, CartItem, Role } from '@/types';
import { hitungHari } from './helpers';

interface AddToCartDialogProps {
    aset: Aset | null;
    role: Role;
    onOpenChange: (open: boolean) => void;
    onSimpan: (item: CartItem) => void;
}

const hariIni = () => new Date().toISOString().slice(0, 10);

export function AddToCartDialog({
    aset,
    role,
    onOpenChange,
    onSimpan,
}: AddToCartDialogProps) {
    const [tanggalMulai, setTanggalMulai] = useState(hariIni());
    const [tanggalSelesai, setTanggalSelesai] = useState(hariIni());
    const [jamMulai, setJamMulai] = useState('08:00');
    const [jamSelesai, setJamSelesai] = useState('16:00');
    const [jumlah, setJumlah] = useState('1');
    const [error, setError] = useState<string | null>(null);

    // Reset form setiap kali dialog dibuka untuk item berbeda
    useEffect(() => {
        if (aset) {
            setTanggalMulai(hariIni());
            setTanggalSelesai(hariIni());
            setJamMulai('08:00');
            setJamSelesai('16:00');
            setJumlah('1');
            setError(null);
        }
    }, [aset]);

    if (!aset) {
        return null;
    }

    function simpan() {
        if (!aset) {
            return;
        }
        const jumlahAngka = Number(jumlah);
        if (!tanggalMulai || !tanggalSelesai) {
            setError('Tanggal mulai dan selesai wajib diisi.');
            return;
        }
        if (tanggalSelesai < tanggalMulai) {
            setError('Tanggal selesai tidak boleh sebelum tanggal mulai.');
            return;
        }
        const durasi = hitungHari(tanggalMulai, tanggalSelesai);
        if (role === 'mhs' && durasi > 7) {
            setError(
                'Durasi peminjaman mahasiswa maksimal 7 hari kalender (REQ-15).',
            );
            return;
        }
        if (!Number.isInteger(jumlahAngka) || jumlahAngka < 1) {
            setError('Jumlah minimal 1.');
            return;
        }
        if (jumlahAngka > aset.stokTersedia) {
            setError(
                `Jumlah melebihi ketersediaan (maksimal ${aset.stokTersedia}).`,
            );
            return;
        }
        if (!jamMulai || !jamSelesai) {
            setError('Jam mulai dan selesai wajib diisi.');
            return;
        }
        onSimpan({
            aset,
            tanggalMulai,
            tanggalSelesai,
            jamMulai,
            jamSelesai,
            jumlah: jumlahAngka,
        });
    }

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah ke Keranjang</DialogTitle>
                    <DialogDescription>
                        <span className="font-mono text-[13px]">
                            {aset.kode}
                        </span>{' '}
                        — {aset.nama}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal-mulai">Tanggal Mulai</Label>
                            <Input
                                id="tanggal-mulai"
                                type="date"
                                value={tanggalMulai}
                                onChange={(e) =>
                                    setTanggalMulai(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal-selesai">
                                Tanggal Selesai
                            </Label>
                            <Input
                                id="tanggal-selesai"
                                type="date"
                                value={tanggalSelesai}
                                onChange={(e) =>
                                    setTanggalSelesai(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="jam-mulai">Jam Mulai</Label>
                            <Input
                                id="jam-mulai"
                                type="time"
                                value={jamMulai}
                                onChange={(e) => setJamMulai(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="jam-selesai">Jam Selesai</Label>
                            <Input
                                id="jam-selesai"
                                type="time"
                                value={jamSelesai}
                                onChange={(e) => setJamSelesai(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="jumlah">Jumlah</Label>
                        <Input
                            id="jumlah"
                            type="number"
                            min={1}
                            max={aset.stokTersedia}
                            value={jumlah}
                            onChange={(e) => setJumlah(e.target.value)}
                        />
                        <p className="text-muted-foreground text-xs">
                            Tersedia {aset.stokTersedia} dari {aset.stokTotal}{' '}
                            pada rentang tanggal ini.
                            {role === 'mhs' &&
                                ' Maksimal 7 hari kalender untuk mahasiswa.'}
                        </p>
                    </div>

                    {error && (
                        <p className="text-sm text-[#A32E38]" role="alert">
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button onClick={simpan}>Tambahkan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
