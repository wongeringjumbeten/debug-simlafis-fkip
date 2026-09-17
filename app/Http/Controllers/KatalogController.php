<?php

namespace App\Http\Controllers;

use App\Models\Alat;
use App\Models\Bahan;
use App\Models\DetailAlat;
use App\Models\Mebeler;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KatalogController extends Controller
{
    /**
     * Pemetaan sementara id_ruangan -> unit lab sampai backend menyediakan
     * referensi unit lab resmi.
     *
     * @var array<int, string>
     */
    private const RUANG_KE_LAB = [1 => 'dasar'];

    /**
     * Katalog internal (alat/ruangan/bahan/mebeler). Visibilitas tab dan
     * aksi per role ditangani frontend (REQ-11); data dibaca dari PostgreSQL
     * bila tersedia, selain itu halaman memakai mock UI-first.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('katalog/index', [
            'role' => $user->role,
            // Sub-kategori tarif hanya relevan untuk eksternal (BR-2).
            'subKategori' => $user->role === 'ekst' ? $user->kategori : null,
            'asets' => DB::getDriverName() === 'pgsql' ? $this->asets() : null,
        ]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function asets(): array
    {
        return array_merge(
            $this->alatRows(),
            $this->ruanganRows(),
            $this->bahanRows(),
            $this->mebelerRows(),
        );
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function alatRows(): array
    {
        $rows = Alat::query()
            ->with(['barang', 'detailAlat.ruangan.barang'])
            ->whereHas('barang')
            ->get();

        return $rows->map(function (Alat $alat): array {
            $barang = $alat->barang;
            $detailList = $alat->detailAlat;

            $firstWithRoom = $detailList->first(fn (DetailAlat $d) => $d->id_ruangan !== null);
            $idRuangan = $firstWithRoom?->id_ruangan;
            $unitLab = $idRuangan !== null ? (self::RUANG_KE_LAB[(int) $idRuangan] ?? 'dasar') : 'dasar';
            $lokasi = $firstWithRoom?->ruangan?->barang?->nama_barang;

            $kondisiList = $detailList->pluck('kondisi')->all();
            if (in_array(DetailAlat::KONDISI_RUSAK, $kondisiList, true)) {
                $kondisi = 'rusak';
            } elseif (in_array(DetailAlat::KONDISI_SEDANG_PERBAIKAN, $kondisiList, true)) {
                $kondisi = 'perlu_perawatan';
            } else {
                $kondisi = 'baik';
            }

            $stokTotal = $detailList->count();
            $stokTersedia = $detailList
                ->where('kondisi', DetailAlat::KONDISI_BAIK)
                ->where('status', DetailAlat::STATUS_TERSEDIA)
                ->count();

            return [
                'id' => (int) $barang->id_barang,
                'kode' => 'BRG-'.str_pad((string) $barang->id_barang, 3, '0', STR_PAD_LEFT),
                'nama' => $barang->nama_barang,
                'kategori' => 'alat',
                'unitLab' => $unitLab,
                'lokasi' => $lokasi,
                'spesifikasi' => $barang->deskripsi_barang,
                'stokTotal' => $stokTotal,
                'stokTersedia' => $stokTersedia,
                'kondisi' => $kondisi,
                'tarifInternalUnej' => $alat->tarif_eksternal_internal_unej === null ? null : (float) $alat->tarif_eksternal_internal_unej,
                'tarifLuarUnej' => $alat->tarif_eksternal_luar_unej === null ? null : (float) $alat->tarif_eksternal_luar_unej,
                'foto' => $barang->foto_url,
            ];
        })->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function ruanganRows(): array
    {
        $rows = Ruangan::query()
            ->with('barang')
            ->whereHas('barang')
            ->get();

        return $rows->map(function (Ruangan $ruangan): array {
            $barang = $ruangan->barang;

            return [
                'id' => (int) $barang->id_barang,
                'kode' => 'BRG-'.str_pad((string) $barang->id_barang, 3, '0', STR_PAD_LEFT),
                'nama' => $barang->nama_barang,
                'kategori' => 'ruangan',
                'unitLab' => self::RUANG_KE_LAB[(int) $ruangan->id_ruangan] ?? 'dasar',
                'lokasi' => $barang->nama_barang,
                'spesifikasi' => $barang->deskripsi_barang,
                'stokTotal' => 1,
                'stokTersedia' => $ruangan->is_aktif ? 1 : 0,
                'kondisi' => 'baik',
                'kapasitas' => $ruangan->kapasitas === null ? null : (int) $ruangan->kapasitas,
                'tarifInternalUnej' => $ruangan->tarif_eksternal_internal_unej === null ? null : (float) $ruangan->tarif_eksternal_internal_unej,
                'tarifLuarUnej' => $ruangan->tarif_eksternal === null ? null : (float) $ruangan->tarif_eksternal,
                'foto' => $barang->foto_url,
            ];
        })->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function bahanRows(): array
    {
        $rows = Bahan::query()
            ->with(['barang', 'ruangan.barang'])
            ->whereHas('barang')
            ->get();

        return $rows->map(function (Bahan $bahan): array {
            $barang = $bahan->barang;
            $namaRuangan = $bahan->ruangan?->barang?->nama_barang;
            $unitLab = $bahan->id_ruangan === null ? 'dasar' : (self::RUANG_KE_LAB[(int) $bahan->id_ruangan] ?? 'dasar');

            $spesifikasiParts = [];
            if ($bahan->catatan) {
                $spesifikasiParts[] = $bahan->catatan;
            }
            if ($bahan->satuan) {
                $spesifikasiParts[] = "Satuan: {$bahan->satuan}.";
            }
            if ($bahan->tanggal_kadaluarsa) {
                $spesifikasiParts[] = "Kadaluarsa: {$bahan->tanggal_kadaluarsa->format('Y-m-d')}.";
            }
            $spesifikasi = implode(' ', $spesifikasiParts) ?: null;

            return [
                'id' => (int) $barang->id_barang,
                'kode' => 'BRG-'.str_pad((string) $barang->id_barang, 3, '0', STR_PAD_LEFT),
                'nama' => $barang->nama_barang,
                'kategori' => 'bahan',
                'unitLab' => $unitLab,
                'lokasi' => $namaRuangan,
                'spesifikasi' => $spesifikasi,
                'stokTotal' => (int) ($bahan->jumlah_awal ?? 0),
                'stokTersedia' => (int) ($bahan->jumlah_saat_ini ?? 0),
                'kondisi' => $bahan->status === Bahan::STATUS_AMAN ? 'baik' : 'perlu_perawatan',
                'foto' => $barang->foto_url,
            ];
        })->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function mebelerRows(): array
    {
        $rows = Mebeler::query()
            ->with(['barang', 'ruangan.barang'])
            ->whereHas('barang')
            ->get();

        return $rows->map(function (Mebeler $mebeler): array {
            $barang = $mebeler->barang;
            $namaRuangan = $mebeler->ruangan?->barang?->nama_barang;
            $unitLab = $mebeler->id_ruangan === null ? 'dasar' : (self::RUANG_KE_LAB[(int) $mebeler->id_ruangan] ?? 'dasar');

            $spesifikasiParts = [];
            if ($mebeler->no_seri_unit_mebeler) {
                $spesifikasiParts[] = "Seri: {$mebeler->no_seri_unit_mebeler}.";
            }
            if ($mebeler->catatan) {
                $spesifikasiParts[] = $mebeler->catatan;
            }
            $spesifikasi = implode(' ', $spesifikasiParts) ?: null;

            $kondisi = match ($mebeler->kondisi) {
                Mebeler::KONDISI_BAIK => 'baik',
                Mebeler::KONDISI_RUSAK => 'rusak',
                default => 'perlu_perawatan',
            };

            return [
                'id' => (int) $barang->id_barang,
                'kode' => 'BRG-'.str_pad((string) $barang->id_barang, 3, '0', STR_PAD_LEFT),
                'nama' => $barang->nama_barang,
                'kategori' => 'mebeler',
                'unitLab' => $unitLab,
                'lokasi' => $namaRuangan,
                'spesifikasi' => $spesifikasi,
                'stokTotal' => 1,
                'stokTersedia' => $mebeler->kondisi === Mebeler::KONDISI_RUSAK ? 0 : 1,
                'kondisi' => $kondisi,
                'foto' => $barang->foto_url,
            ];
        })->all();
    }
}
