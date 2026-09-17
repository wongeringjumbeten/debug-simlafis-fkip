<?php

namespace App\Http\Controllers;

use App\Models\Alat;
use App\Models\Bahan;
use App\Models\Barang;
use App\Models\DetailAlat;
use App\Models\Mebeler;
use App\Models\Ruangan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class InventoryController extends Controller
{
    /**
     * Role yang berhak mengelola inventaris laboratorium.
     */
    private const INVENTORY_ROLES = ['admin', 'plp'];

    public function __construct()
    {
        // Guard check per role dilakukan di authorizeRole()
    }

    private function authorizeRole(Request $request): void
    {
        $role = $request->user()?->role;
        if (! in_array($role, self::INVENTORY_ROLES, true)) {
            abort(403, 'Hanya Admin dan PLP yang berwenang mengelola data inventaris.');
        }
    }

    /**
     * Simpan Master Alat baru beserta acuan tarif publik (ADM-11, PLP-03).
     */
    public function storeAlat(Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'tarif_internal' => ['nullable', 'numeric', 'min:0'],
            'tarif_luar' => ['nullable', 'numeric', 'min:0'],
            'stok_awal' => ['nullable', 'integer', 'min:0'],
            'kondisi' => ['nullable', 'string', Rule::in(['baik', 'rusak', 'perlu_perawatan'])],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $fotoPath = 'storage/'.$path;
            }

            $barang = Barang::create([
                'nama_barang' => $validated['nama'],
                'deskripsi_barang' => $validated['spesifikasi'] ?? null,
                'jenis' => Barang::JENIS_ALAT,
                'foto_barang' => $fotoPath,
            ]);

            $alat = Alat::create([
                'id_barang' => $barang->id_barang,
                'tarif_eksternal_internal_unej' => $validated['tarif_internal'] ?? 0.00,
                'tarif_eksternal_luar_unej' => $validated['tarif_luar'] ?? 0.00,
            ]);

            $stokAwal = (int) ($validated['stok_awal'] ?? 1);
            $kondisi = ($validated['kondisi'] ?? 'baik') === 'perlu_perawatan'
                ? DetailAlat::KONDISI_SEDANG_PERBAIKAN
                : ($validated['kondisi'] ?? DetailAlat::KONDISI_BAIK);

            for ($i = 0; $i < $stokAwal; $i++) {
                DetailAlat::create([
                    'id_alat' => $alat->id_alat,
                    'kondisi' => $kondisi,
                    'status' => DetailAlat::STATUS_TERSEDIA,
                    'tahun_pengadaan' => (string) now()->year,
                ]);
            }
        });

        return back()->with('success', 'Data alat dan layanan tarif berhasil ditambahkan.');
    }

    /**
     * Perbarui Master Alat dan acuan tarif publik (ADM-11, PLP-03).
     */
    public function updateAlat(int|string $id, Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $alat = Alat::where('id_alat', $id)->orWhere('id_barang', $id)->firstOrFail();

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'tarif_internal' => ['nullable', 'numeric', 'min:0'],
            'tarif_luar' => ['nullable', 'numeric', 'min:0'],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($alat, $request, $validated) {
            $barang = $alat->barang;

            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $barang->foto_barang = 'storage/'.$path;
            }

            $barang->nama_barang = $validated['nama'];
            $barang->deskripsi_barang = $validated['spesifikasi'] ?? null;
            $barang->save();

            $alat->update([
                'tarif_eksternal_internal_unej' => $validated['tarif_internal'] ?? $alat->tarif_eksternal_internal_unej,
                'tarif_eksternal_luar_unej' => $validated['tarif_luar'] ?? $alat->tarif_eksternal_luar_unej,
            ]);
        });

        return back()->with('success', 'Data alat dan layanan tarif telah berhasil diubah.');
    }

    /**
     * Registrasi unit fisik detail alat (PLP-03/04).
     */
    public function storeDetailAlat(int|string $id, Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $alat = Alat::where('id_alat', $id)->orWhere('id_barang', $id)->firstOrFail();

        $validated = $request->validate([
            'no_seri_unit' => ['nullable', 'string', 'max:100'],
            'kondisi' => ['required', 'string', Rule::in(['baik', 'rusak', 'sedang perbaikan'])],
            'status' => ['required', 'string', Rule::in(['tersedia', 'tidak tersedia', 'sedang perbaikan'])],
            'tahun_pengadaan' => ['nullable', 'string', 'max:10'],
            'sumber_dana' => ['nullable', 'string', 'max:255'],
            'harga_beli' => ['nullable', 'numeric', 'min:0'],
            'catatan' => ['nullable', 'string'],
        ]);

        DetailAlat::create([
            'id_alat' => $alat->id_alat,
            'no_seri_unit' => $validated['no_seri_unit'] ?? null,
            'kondisi' => $validated['kondisi'],
            'status' => $validated['status'],
            'tahun_pengadaan' => $validated['tahun_pengadaan'] ?? null,
            'sumber_dana' => $validated['sumber_dana'] ?? null,
            'harga_beli' => $validated['harga_beli'] ?? null,
            'catatan' => $validated['catatan'] ?? null,
        ]);

        return back()->with('success', 'Detail unit alat berhasil disimpan.');
    }

    /**
     * Simpan Master Ruangan dan tarif sewa (ADM-12).
     */
    public function storeRuangan(Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'kapasitas' => ['nullable', 'integer', 'min:0'],
            'tarif_internal' => ['nullable', 'numeric', 'min:0'],
            'tarif_luar' => ['nullable', 'numeric', 'min:0'],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $fotoPath = 'storage/'.$path;
            }

            $barang = Barang::create([
                'nama_barang' => $validated['nama'],
                'deskripsi_barang' => $validated['spesifikasi'] ?? null,
                'jenis' => Barang::JENIS_RUANGAN,
                'foto_barang' => $fotoPath,
            ]);

            Ruangan::create([
                'id_barang' => $barang->id_barang,
                'kapasitas' => $validated['kapasitas'] ?? 30,
                'tarif_eksternal_internal_unej' => $validated['tarif_internal'] ?? 0.00,
                'tarif_eksternal' => $validated['tarif_luar'] ?? 0.00,
                'is_aktif' => true,
            ]);
        });

        return back()->with('success', 'Data ruangan dan layanan tarif berhasil disimpan.');
    }

    /**
     * Perbarui Master Ruangan dan tarif sewa (ADM-12).
     */
    public function updateRuangan(int|string $id, Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $ruangan = Ruangan::where('id_ruangan', $id)->orWhere('id_barang', $id)->firstOrFail();

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'kapasitas' => ['nullable', 'integer', 'min:0'],
            'tarif_internal' => ['nullable', 'numeric', 'min:0'],
            'tarif_luar' => ['nullable', 'numeric', 'min:0'],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($ruangan, $request, $validated) {
            $barang = $ruangan->barang;

            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $barang->foto_barang = 'storage/'.$path;
            }

            $barang->nama_barang = $validated['nama'];
            $barang->deskripsi_barang = $validated['spesifikasi'] ?? null;
            $barang->save();

            $ruangan->update([
                'kapasitas' => $validated['kapasitas'] ?? $ruangan->kapasitas,
                'tarif_eksternal_internal_unej' => $validated['tarif_internal'] ?? $ruangan->tarif_eksternal_internal_unej,
                'tarif_eksternal' => $validated['tarif_luar'] ?? $ruangan->tarif_eksternal,
            ]);
        });

        return back()->with('success', 'Data ruangan dan layanan tarif berhasil diubah.');
    }

    /**
     * Simpan Aset Bahan Laboratorium (PLP-07).
     */
    public function storeBahan(Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'stok_awal' => ['required', 'integer', 'min:0'],
            'stok_saat_ini' => ['nullable', 'integer', 'min:0'],
            'satuan' => ['nullable', 'string', 'max:50'],
            'tanggal_kadaluarsa' => ['nullable', 'date'],
            'status' => ['nullable', 'string', Rule::in(['aman', 'menipis', 'habis'])],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $fotoPath = 'storage/'.$path;
            }

            $barang = Barang::create([
                'nama_barang' => $validated['nama'],
                'deskripsi_barang' => $validated['spesifikasi'] ?? null,
                'jenis' => Barang::JENIS_BAHAN,
                'foto_barang' => $fotoPath,
            ]);

            Bahan::create([
                'id_barang' => $barang->id_barang,
                'jumlah_awal' => $validated['stok_awal'],
                'jumlah_saat_ini' => $validated['stok_saat_ini'] ?? $validated['stok_awal'],
                'satuan' => $validated['satuan'] ?? null,
                'tanggal_kadaluarsa' => $validated['tanggal_kadaluarsa'] ?? null,
                'status' => $validated['status'] ?? Bahan::STATUS_AMAN,
                'catatan' => $validated['spesifikasi'] ?? null,
            ]);
        });

        return back()->with('success', 'Data bahan berhasil disimpan.');
    }

    /**
     * Perbarui Aset Bahan Laboratorium (PLP-08).
     */
    public function updateBahan(int|string $id, Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $bahan = Bahan::where('id_bahan', $id)->orWhere('id_barang', $id)->firstOrFail();

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'stok_awal' => ['required', 'integer', 'min:0'],
            'stok_saat_ini' => ['required', 'integer', 'min:0'],
            'satuan' => ['nullable', 'string', 'max:50'],
            'tanggal_kadaluarsa' => ['nullable', 'date'],
            'status' => ['nullable', 'string', Rule::in(['aman', 'menipis', 'habis'])],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($bahan, $request, $validated) {
            $barang = $bahan->barang;

            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $barang->foto_barang = 'storage/'.$path;
            }

            $barang->nama_barang = $validated['nama'];
            $barang->deskripsi_barang = $validated['spesifikasi'] ?? null;
            $barang->save();

            $bahan->update([
                'jumlah_awal' => $validated['stok_awal'],
                'jumlah_saat_ini' => $validated['stok_saat_ini'],
                'satuan' => $validated['satuan'] ?? $bahan->satuan,
                'tanggal_kadaluarsa' => $validated['tanggal_kadaluarsa'] ?? $bahan->tanggal_kadaluarsa,
                'status' => $validated['status'] ?? $bahan->status,
                'catatan' => $validated['spesifikasi'] ?? $bahan->catatan,
            ]);
        });

        return back()->with('success', 'Data bahan berhasil diperbarui.');
    }

    /**
     * Simpan Aset Mebeler Laboratorium (PLP-09).
     */
    public function storeMebeler(Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'kondisi' => ['required', 'string', Rule::in(['baik', 'rusak', 'sedang perbaikan'])],
            'tahun_pengadaan' => ['nullable', 'string', 'max:10'],
            'sumber_dana' => ['nullable', 'string', 'max:255'],
            'status_kepemilikan' => ['nullable', 'string', 'max:100'],
            'harga_beli' => ['nullable', 'numeric', 'min:0'],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $fotoPath = 'storage/'.$path;
            }

            $barang = Barang::create([
                'nama_barang' => $validated['nama'],
                'deskripsi_barang' => $validated['spesifikasi'] ?? null,
                'jenis' => Barang::JENIS_MEBELER,
                'foto_barang' => $fotoPath,
            ]);

            Mebeler::create([
                'id_barang' => $barang->id_barang,
                'kondisi' => $validated['kondisi'],
                'tahun_pengadaan' => $validated['tahun_pengadaan'] ?? null,
                'sumber_dana' => $validated['sumber_dana'] ?? null,
                'harga_beli' => $validated['harga_beli'] ?? null,
                'catatan' => $validated['spesifikasi'] ?? null,
            ]);
        });

        return back()->with('success', 'Data mebeler berhasil ditambahkan.');
    }

    /**
     * Perbarui Aset Mebeler Laboratorium (PLP-10).
     */
    public function updateMebeler(int|string $id, Request $request): RedirectResponse
    {
        $this->authorizeRole($request);

        $mebeler = Mebeler::where('id_mebeler', $id)->orWhere('id_barang', $id)->firstOrFail();

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'spesifikasi' => ['nullable', 'string'],
            'kondisi' => ['required', 'string', Rule::in(['baik', 'rusak', 'sedang perbaikan'])],
            'tahun_pengadaan' => ['nullable', 'string', 'max:10'],
            'sumber_dana' => ['nullable', 'string', 'max:255'],
            'status_kepemilikan' => ['nullable', 'string', 'max:100'],
            'harga_beli' => ['nullable', 'numeric', 'min:0'],
            'foto' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        DB::transaction(function () use ($mebeler, $request, $validated) {
            $barang = $mebeler->barang;

            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('barang', 'public');
                $barang->foto_barang = 'storage/'.$path;
            }

            $barang->nama_barang = $validated['nama'];
            $barang->deskripsi_barang = $validated['spesifikasi'] ?? null;
            $barang->save();

            $mebeler->update([
                'kondisi' => $validated['kondisi'],
                'tahun_pengadaan' => $validated['tahun_pengadaan'] ?? $mebeler->tahun_pengadaan,
                'sumber_dana' => $validated['sumber_dana'] ?? $mebeler->sumber_dana,
                'harga_beli' => $validated['harga_beli'] ?? $mebeler->harga_beli,
                'catatan' => $validated['spesifikasi'] ?? $mebeler->catatan,
            ]);
        });

        return back()->with('success', 'Data mebeler telah berhasil diubah.');
    }
}
