<?php

namespace App\Http\Controllers;

use App\Models\PengajuanPeminjaman;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Dashboard per peran.
 *
 * Dua bentuk dashboard yang berbeda isinya (sprint1.md §1.4):
 *
 * - **PR-12** — Admin, KaLab, PLP: agregat seluruh laboratorium, dengan
 *   statistik terpisah untuk alat dan ruangan, grafik tren, dan 10 pengajuan
 *   terbaru. Akumulasi pendapatan hanya untuk Admin.
 * - **PR-13** — Dosen, Mahasiswa, Eksternal: ringkasan milik pengguna sendiri,
 *   status peminjaman terkini, notifikasi pengembalian, dan akses cepat.
 *
 * Seluruh angka dihitung dari basis data. Tidak ada lagi data contoh: bila
 * transaksi belum ada, yang tampil adalah keadaan kosong (nol atau daftar
 * kosong), bukan angka karangan.
 */
class DashboardController extends Controller
{
    /**
     * Role yang melihat rekap seluruh lab (Product Functions §2).
     */
    private const LAB_ROLES = ['admin', 'kalab', 'plp'];

    private const PERIODE = ['harian', 'bulanan'];

    private const BULAN_SINGKAT = [1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'];

    /**
     * Status yang dianggap sebagai peminjaman masih berjalan.
     */
    private const STATUS_BERJALAN = [
        PengajuanPeminjaman::STATUS_DIPINJAM,
        PengajuanPeminjaman::STATUS_TERLAMBAT,
    ];

    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $isLab = in_array($user->role, self::LAB_ROLES, true);

        $props = [
            'role' => $user->role,
            'scope' => $isLab ? 'lab' : 'self',
            'isLab' => $isLab,
            'showRevenue' => $user->role === 'admin',
        ];

        if ($isLab) {
            // Filter periode disanitasi lembut; nilai tak dikenal jatuh ke default.
            $periode = $request->string('periode')->toString();
            $periode = in_array($periode, self::PERIODE, true) ? $periode : 'bulanan';

            $props += $this->labProps($periode);

            if ($user->role === 'admin') {
                $props['pendapatanBulanIni'] = $this->calculateIncome();
            }
        } else {
            $props += $this->personalProps($this->resolveIdPengguna($user));
        }

        return Inertia::render('dashboard', $props);
    }

    /**
     * Prop dashboard pengelola (PR-12).
     *
     * Catatan: filter unit laboratorium sengaja tidak disediakan. Basis data
     * belum memiliki referensi unit lab untuk ruangan maupun alat, sehingga
     * penyaringan per unit tidak dapat dihitung dengan benar. Lihat
     * `docs/backend-handoff-sprint-1.md` butir P2-8.
     *
     * @return array<string, mixed>
     */
    private function labProps(string $periode): array
    {
        return [
            'chartPeriode' => $periode,
            'statsAlat' => $this->statusCounts('detailAlat'),
            'statsRuangan' => $this->statusCounts('detailRuangan'),
            'chart' => $this->chartFor($periode),
            'recentPengajuan' => $this->recentPengajuan(10),
            'inventaris' => $this->inventaris(),
        ];
    }

    /**
     * Prop dashboard peminjam (PR-13).
     *
     * @return array<string, mixed>
     */
    private function personalProps(int $idPengguna): array
    {
        $scope = fn () => PengajuanPeminjaman::query()->where('id_pengguna', $idPengguna);

        return [
            'ringkasan' => [
                'total' => $scope()->count(),
                'menunggu' => $scope()->where('status_keseluruhan', PengajuanPeminjaman::STATUS_MENUNGGU)->count(),
                'disetujui' => $scope()->where('status_keseluruhan', PengajuanPeminjaman::STATUS_DISETUJUI)->count(),
                'berjalan' => $scope()->whereIn('status_keseluruhan', self::STATUS_BERJALAN)->count(),
                'selesai' => $scope()->where('status_keseluruhan', PengajuanPeminjaman::STATUS_DIKEMBALIKAN)->count(),
                'ditolak' => $scope()->whereIn('status_keseluruhan', [
                    PengajuanPeminjaman::STATUS_DITOLAK,
                    PengajuanPeminjaman::STATUS_DIBATALKAN,
                ])->count(),
            ],
            'recentPengajuan' => $this->recentPengajuan(5, $idPengguna),
            'notifikasiPengembalian' => $this->notifikasiPengembalian($idPengguna),
        ];
    }

    /**
     * Jumlah pengajuan per status, dipisah menurut jenis asetnya.
     *
     * Satu pengajuan dapat memuat alat sekaligus ruangan, jadi kedua hitungan
     * boleh tumpang tindih — itu memang perilaku yang diharapkan.
     *
     * @param  'detailAlat'|'detailRuangan'  $relasi
     * @return array<string, int>
     */
    private function statusCounts(string $relasi): array
    {
        $scope = fn () => PengajuanPeminjaman::query()->whereHas($relasi);

        return [
            'total' => $scope()->count(),
            'pending' => $scope()->where('status_keseluruhan', PengajuanPeminjaman::STATUS_MENUNGGU)->count(),
            'disetujui' => $scope()->where('status_keseluruhan', PengajuanPeminjaman::STATUS_DISETUJUI)->count(),
            'ditolak' => $scope()->where('status_keseluruhan', PengajuanPeminjaman::STATUS_DITOLAK)->count(),
            'dipinjam' => $scope()->whereIn('status_keseluruhan', self::STATUS_BERJALAN)->count(),
        ];
    }

    /**
     * Total penerimaan bulan berjalan (ADM-04).
     *
     * Hanya menghitung transaksi eksternal yang sudah lunas. Nol bila belum ada.
     */
    private function calculateIncome(): float
    {
        $startOfMonth = Carbon::now()->startOfMonth();

        return (float) PengajuanPeminjaman::query()
            ->where('jenis_peminjaman', PengajuanPeminjaman::JENIS_EKSTERNAL)
            ->whereIn('status_keseluruhan', [
                PengajuanPeminjaman::STATUS_DISETUJUI,
                PengajuanPeminjaman::STATUS_DIPINJAM,
                PengajuanPeminjaman::STATUS_TERLAMBAT,
                PengajuanPeminjaman::STATUS_DIKEMBALIKAN,
            ])
            ->where(function ($q) use ($startOfMonth) {
                $q->where('tanggal_peminjaman', '>=', $startOfMonth)
                    ->orWhere('created_at', '>=', $startOfMonth);
            })
            ->sum('total_biaya');
    }

    /**
     * Data grafik tren peminjaman (ADM-06) dari transaksi nyata.
     *
     * @return array<string, mixed>
     */
    private function chartFor(string $periode): array
    {
        $n = $periode === 'harian' ? 30 : 12;

        return [
            'labels' => $this->chartLabels($periode, $n),
            'alat' => $this->chartSeries('detailAlat', $periode, $n),
            'ruangan' => $this->chartSeries('detailRuangan', $periode, $n),
        ];
    }

    /**
     * @return list<string>
     */
    private function chartLabels(string $periode, int $n): array
    {
        if ($periode === 'bulanan') {
            return array_values(array_slice(self::BULAN_SINGKAT, 0, $n));
        }

        $labels = [];
        for ($i = 0; $i < $n; $i++) {
            /** @var Carbon $day */
            $day = today()->subDays($n - 1 - $i);
            $labels[] = $day->day.' '.self::BULAN_SINGKAT[$day->month];
        }

        return $labels;
    }

    /**
     * Frekuensi peminjaman per bulan (tahun berjalan) atau per hari (30 hari terakhir).
     *
     * @param  'detailAlat'|'detailRuangan'  $relasi
     * @return list<int>
     */
    private function chartSeries(string $relasi, string $periode, int $n): array
    {
        if ($periode === 'bulanan') {
            // CAST wajib: EXTRACT mengembalikan numerik, sehingga kuncinya
            // menjadi "9.0" dan tidak cocok dengan indeks bulan bertipe int.
            $perBulan = PengajuanPeminjaman::query()
                ->whereHas($relasi)
                ->whereYear('tanggal_peminjaman', now()->year)
                ->selectRaw('CAST(EXTRACT(MONTH FROM tanggal_peminjaman) AS INTEGER) AS bulan, COUNT(*) AS jumlah')
                ->groupBy('bulan')
                ->pluck('jumlah', 'bulan');

            return collect(range(1, $n))
                ->map(fn (int $bulan): int => (int) ($perBulan[$bulan] ?? 0))
                ->all();
        }

        $perHari = PengajuanPeminjaman::query()
            ->whereHas($relasi)
            ->whereDate('tanggal_peminjaman', '>=', today()->subDays($n - 1))
            ->selectRaw('DATE(tanggal_peminjaman) AS hari, COUNT(*) AS jumlah')
            ->groupBy('hari')
            ->pluck('jumlah', 'hari');

        $series = [];
        for ($i = 0; $i < $n; $i++) {
            $hari = today()->subDays($n - 1 - $i)->toDateString();
            $series[] = (int) ($perHari[$hari] ?? 0);
        }

        return $series;
    }

    /**
     * Agregat inventaris nyata (user story 12) untuk peran pengelola.
     *
     * @return array<string, int>
     */
    private function inventaris(): array
    {
        return [
            'totalAlat' => (int) DB::table('barang')->where('jenis', 'alat')->count(),
            'totalRuangan' => (int) DB::table('barang')->where('jenis', 'ruangan')->count(),
            'totalBahan' => (int) DB::table('barang')->where('jenis', 'bahan')->count(),
            'totalMebeler' => (int) DB::table('barang')->where('jenis', 'mebeler')->count(),
            'totalPengguna' => (int) DB::table('akun')->count(),
        ];
    }

    /**
     * Pengajuan terbaru; `$idPengguna` membatasi ke milik pengguna tertentu.
     *
     * @return list<array<string, mixed>>
     */
    private function recentPengajuan(int $limit, ?int $idPengguna = null): array
    {
        $query = PengajuanPeminjaman::query()
            ->with(['pengguna', 'detailAlat.alat.barang', 'detailRuangan.ruangan.barang'])
            ->latest('id_pengajuan_peminjaman')
            ->take($limit);

        if ($idPengguna !== null) {
            $query->where('id_pengguna', $idPengguna);
        }

        return $this->formatPengajuan($query->get(), $idPengguna !== null);
    }

    /**
     * Peminjaman yang masih berjalan beserta tenggat pengembaliannya (PR-13).
     *
     * @return list<array<string, mixed>>
     */
    private function notifikasiPengembalian(int $idPengguna): array
    {
        $items = PengajuanPeminjaman::query()
            ->with(['detailAlat.alat.barang', 'detailRuangan.ruangan.barang'])
            ->where('id_pengguna', $idPengguna)
            ->whereIn('status_keseluruhan', self::STATUS_BERJALAN)
            ->get();

        return $items
            ->map(function (PengajuanPeminjaman $p): array {
                $baris = $this->formatPengajuan(collect([$p]), true)[0];
                $jatuhTempo = $this->jatuhTempo($p);

                $baris['jatuhTempo'] = $jatuhTempo;
                $baris['hariTersisa'] = $jatuhTempo === null
                    ? null
                    : (int) Carbon::today()->diffInDays(Carbon::parse($jatuhTempo), false);
                $baris['terlambat'] = $p->status_keseluruhan === PengajuanPeminjaman::STATUS_TERLAMBAT;

                return $baris;
            })
            ->sortBy('hariTersisa')
            ->values()
            ->all();
    }

    /**
     * Tenggat pengembalian = `waktu_selesai` paling akhir di antara item.
     */
    private function jatuhTempo(PengajuanPeminjaman $pengajuan): ?string
    {
        $waktu = $pengajuan->detailAlat->pluck('waktu_selesai')
            ->merge($pengajuan->detailRuangan->pluck('waktu_selesai'))
            ->filter()
            ->map(fn ($w) => Carbon::parse($w))
            ->max();

        return $waktu?->toDateString();
    }

    /**
     * @param  Collection<int, PengajuanPeminjaman>  $items
     * @return list<array<string, mixed>>
     */
    private function formatPengajuan($items, bool $isSelf = false): array
    {
        return $items->map(function (PengajuanPeminjaman $p) use ($isSelf): array {
            $firstAlat = $p->detailAlat->first();
            $firstRuangan = $p->detailRuangan->first();

            $aset = 'Peminjaman Laboratorium';
            $kategori = 'Alat & Ruangan';

            if ($firstAlat && ! $firstRuangan) {
                $aset = $firstAlat->alat?->barang?->nama_barang ?? 'Alat Laboratorium';
                $kategori = 'Alat';
            } elseif ($firstRuangan && ! $firstAlat) {
                $aset = $firstRuangan->ruangan?->barang?->nama_barang ?? 'Ruang Praktikum';
                $kategori = 'Ruangan';
            } elseif ($firstAlat && $firstRuangan) {
                $aset = ($firstAlat->alat?->barang?->nama_barang ?? 'Alat').' + Ruangan';
                $kategori = 'Campuran';
            }

            $tanggal = $p->tanggal_peminjaman
                ? Carbon::parse($p->tanggal_peminjaman)->toDateString()
                : ($p->created_at?->toDateString() ?? Carbon::today()->toDateString());

            return [
                'kode' => 'TRX-'.str_pad((string) $p->id_pengajuan_peminjaman, 4, '0', STR_PAD_LEFT),
                'aset' => $aset,
                'kategori' => $kategori,
                'peminjam' => $isSelf ? 'Anda' : ($p->pengguna?->nama_lengkap ?? 'Pengguna #'.$p->id_pengguna),
                'status' => $this->statusUntukTampilan($p->status_keseluruhan),
                'statusAsli' => $p->status_keseluruhan,
                'tanggal' => $tanggal,
            ];
        })->values()->all();
    }

    /**
     * Petakan status basis data ke empat status yang dipakai antarmuka.
     */
    private function statusUntukTampilan(string $status): string
    {
        return match ($status) {
            PengajuanPeminjaman::STATUS_MENUNGGU => 'pending',
            PengajuanPeminjaman::STATUS_DISETUJUI => 'disetujui',
            PengajuanPeminjaman::STATUS_DIPINJAM, PengajuanPeminjaman::STATUS_TERLAMBAT => 'dipinjam',
            PengajuanPeminjaman::STATUS_DIKEMBALIKAN => 'selesai',
            PengajuanPeminjaman::STATUS_DITOLAK, PengajuanPeminjaman::STATUS_DIBATALKAN => 'ditolak',
            default => 'pending',
        };
    }

    /**
     * Resolusi ID Pengguna dari User (model memetakan `id_akun`).
     */
    private function resolveIdPengguna(User $user): int
    {
        $row = DB::table('akun')->where('id_akun', $user->getAuthIdentifier())->first();

        if ($row && isset($row->id_pengguna)) {
            return (int) $row->id_pengguna;
        }

        return (int) $user->getAuthIdentifier();
    }
}
