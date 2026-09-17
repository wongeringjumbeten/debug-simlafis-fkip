<?php

namespace App\Http\Controllers;

use App\Models\PengajuanPeminjaman;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Role yang melihat rekap seluruh lab (Product Functions §2).
     */
    private const LAB_ROLES = ['admin', 'kalab', 'plp'];

    private const PERIODE = ['harian', 'bulanan'];

    private const UNIT_LAB = ['dasar', 'elektronika', 'lanjut', 'elf'];

    /**
     * Offset deterministik tiap unit lab untuk data simulasi chart.
     */
    private const LAB_OFFSET = [
        'dasar' => 1,
        'elektronika' => 2,
        'lanjut' => 3,
        'elf' => 4,
    ];

    private const BULAN_SINGKAT = [1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'];

    /**
     * Dashboard per peran. Konten sama (ADM-05/06/07) tetapi SCOPE-nya berbeda:
     * Admin/KaLab/PLP melihat rekap seluruh lab; Dosen/Mhs/Eksternal hanya datanya
     * sendiri. Pendapatan (ADM-04) khusus Admin.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $isLab = in_array($user->role, self::LAB_ROLES, true);

        // Filter grafik: sanitasi lembut, nilai tak dikenal jatuh ke default.
        $periode = $request->string('periode')->toString();
        $periode = in_array($periode, self::PERIODE, true) ? $periode : 'bulanan';

        $lab = $request->string('lab')->toString();
        $lab = in_array($lab, ['semua', ...self::UNIT_LAB], true) ? $lab : 'semua';

        $idPengguna = $this->resolveIdPengguna($user);
        $metrics = $isLab ? $this->labMetrics() : $this->personalMetrics($idPengguna);

        $props = [
            'role' => $user->role,
            'scope' => $isLab ? 'lab' : 'self',
            'isLab' => $isLab,
            'showRevenue' => $user->role === 'admin',
            'chartFilters' => ['periode' => $periode, 'lab' => $lab],
            'chart' => $this->chartFor($isLab, $periode, $lab),
            // Agregat inventaris nyata (user story 12); null bila DB domain tak tersedia.
            'inventaris' => $this->inventaris($isLab),
        ] + $metrics;

        if ($user->role === 'admin') {
            $props['pendapatanBulanIni'] = $this->calculateIncome();
        }

        return Inertia::render('dashboard', $props);
    }

    /**
     * Resolusi ID Pengguna dari User (mendukung PostgreSQL view dan SQLite).
     */
    private function resolveIdPengguna(User $user): int
    {
        if (DB::getDriverName() === 'pgsql') {
            $row = DB::table('akun')->where('id_akun', $user->id)->first();
            if ($row && isset($row->id_pengguna)) {
                return (int) $row->id_pengguna;
            }
        }

        return (int) $user->id;
    }

    /**
     * Hitung total penerimaan khusus admin (ADM-04).
     */
    private function calculateIncome(): float
    {
        if (Schema::hasTable('pengajuan_peminjaman') && PengajuanPeminjaman::exists()) {
            $startOfMonth = Carbon::now()->startOfMonth();

            return (float) PengajuanPeminjaman::query()
                ->where('jenis_peminjaman', PengajuanPeminjaman::JENIS_EKSTERNAL)
                ->whereIn('status_keseluruhan', [
                    PengajuanPeminjaman::STATUS_DISETUJUI,
                    PengajuanPeminjaman::STATUS_DIPINJAM,
                    PengajuanPeminjaman::STATUS_DIKEMBALIKAN,
                ])
                ->where(function ($q) use ($startOfMonth) {
                    $q->where('tanggal_peminjaman', '>=', $startOfMonth)
                        ->orWhere('created_at', '>=', $startOfMonth);
                })
                ->sum('total_biaya');
        }

        return 4_250_000.0;
    }

    /**
     * Data grafik (ADM-06) sesuai periode (harian/bulanan) dan unit laboratorium.
     * "semua" = penjumlahan 4 unit lab, konsisten by construction.
     *
     * @return array<string, mixed>
     */
    private function chartFor(bool $isLab, string $periode, string $lab): array
    {
        $n = $periode === 'harian' ? 30 : 12;

        return [
            'labels' => $this->chartLabels($periode, $n),
            'alat' => $this->chartSeries($isLab, $periode, $lab, 'alat', $n),
            'ruangan' => $this->chartSeries($isLab, $periode, $lab, 'ruangan', $n),
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

        // Harian: 30 hari terakhir, label "1 Sep" .. "30 Sep".
        $labels = [];
        for ($i = 0; $i < $n; $i++) {
            /** @var Carbon $day */
            $day = today()->subDays($n - 1 - $i);
            $labels[] = $day->day.' '.self::BULAN_SINGKAT[$day->month];
        }

        return $labels;
    }

    /**
     * Nilai seri grafik peminjaman alat dan ruangan.
     *
     * @return list<int>
     */
    private function chartSeries(bool $isLab, string $periode, string $lab, string $kategori, int $n): array
    {
        $offsets = $lab === 'semua'
            ? array_values(self::LAB_OFFSET)
            : [self::LAB_OFFSET[$lab] ?? 1];

        $series = [];
        for ($i = 0; $i < $n; $i++) {
            $total = 0;
            foreach ($offsets as $o) {
                $total += $isLab
                    ? $this->labValue($kategori, $i, $o)
                    : $this->personalValue($kategori, $i, $o);
            }
            $series[] = $total;
        }

        return $series;
    }

    private function labValue(string $kategori, int $i, int $o): int
    {
        return $kategori === 'alat'
            ? (($i * 3 + $o * 5) % 8) + 2
            : (($i * 2 + $o * 3) % 5) + 1;
    }

    /**
     * Hitung inventaris nyata dari PostgreSQL untuk role lab.
     * Null pada driver lain agar halaman tetap memakai fallback.
     *
     * @return array<string, int>|null
     */
    private function inventaris(bool $isLab): ?array
    {
        if (! $isLab || DB::getDriverName() !== 'pgsql') {
            return null;
        }

        return [
            'totalAlat' => (int) DB::table('barang')->where('jenis', 'alat')->count(),
            'totalRuangan' => (int) DB::table('barang')->where('jenis', 'ruangan')->count(),
            'totalBahan' => (int) DB::table('barang')->where('jenis', 'bahan')->count(),
            'totalPengguna' => (int) DB::table('akun')->count(),
        ];
    }

    private function personalValue(string $kategori, int $i, int $o): int
    {
        return $kategori === 'alat'
            ? (($i + $o) % 3)
            : (($i + $o * 2) % 2);
    }

    /**
     * Rekap seluruh laboratorium (scope lab).
     *
     * @return array<string, mixed>
     */
    private function labMetrics(): array
    {
        if (Schema::hasTable('pengajuan_peminjaman') && PengajuanPeminjaman::exists()) {
            $stats = [
                'total' => PengajuanPeminjaman::count(),
                'pending' => PengajuanPeminjaman::where('status_keseluruhan', PengajuanPeminjaman::STATUS_MENUNGGU)->count(),
                'disetujui' => PengajuanPeminjaman::where('status_keseluruhan', PengajuanPeminjaman::STATUS_DISETUJUI)->count(),
                'ditolak' => PengajuanPeminjaman::where('status_keseluruhan', PengajuanPeminjaman::STATUS_DITOLAK)->count(),
                'dipinjam' => PengajuanPeminjaman::where('status_keseluruhan', PengajuanPeminjaman::STATUS_DIPINJAM)->count(),
            ];

            $recent = PengajuanPeminjaman::query()
                ->with(['pengguna', 'detailAlat.alat.barang', 'detailRuangan.ruangan.barang'])
                ->latest('id_pengajuan_peminjaman')
                ->take(10)
                ->get();

            return [
                'stats' => $stats,
                'recentPengajuan' => $this->formatRecentPengajuan($recent),
            ];
        }

        return [
            // ADM-05: Seluruh / Pending / Disetujui / Ditolak / Sedang Dipinjam.
            'stats' => [
                'total' => 156,
                'pending' => 23,
                'disetujui' => 67,
                'ditolak' => 12,
                'dipinjam' => 31,
            ],
            // ADM-07: 10 pengajuan terbaru. Peminjam = label generik per role (bukan identitas nyata).
            'recentPengajuan' => [
                $this->row('TRX-0023', 'Osiloskop Digital', 'Alat', 'Mahasiswa (contoh)', 'pending', '2026-09-12'),
                $this->row('TRX-0022', 'Ruang Praktikum Dasar', 'Ruangan', 'Dosen (contoh)', 'disetujui', '2026-09-11'),
                $this->row('TRX-0021', 'Function Generator', 'Alat', 'Eksternal (contoh)', 'ditolak', '2026-09-11'),
                $this->row('TRX-0020', 'Ruang Praktikum Elektronika', 'Ruangan', 'Mahasiswa (contoh)', 'dipinjam', '2026-09-09'),
                $this->row('TRX-0019', 'He-Ne Laser', 'Alat', 'Dosen (contoh)', 'pending', '2026-09-08'),
                $this->row('TRX-0018', 'Ruang Penelitian Lanjut', 'Ruangan', 'Eksternal (contoh)', 'disetujui', '2026-09-08'),
                $this->row('TRX-0017', 'Multimeter Digital', 'Alat', 'Mahasiswa (contoh)', 'ditolak', '2026-09-07'),
                $this->row('TRX-0016', 'Ruang Karakterisasi ELF', 'Ruangan', 'Dosen (contoh)', 'dipinjam', '2026-09-07'),
                $this->row('TRX-0015', 'Pelat Sel Surya', 'Alat', 'Mahasiswa (contoh)', 'pending', '2026-09-06'),
                $this->row('TRX-0014', 'Perangkat Karakterisasi ELF', 'Alat', 'Eksternal (contoh)', 'disetujui', '2026-09-05'),
            ],
        ];
    }

    /**
     * Rekap milik pengguna sendiri (Dosen/Mhs/Eksternal).
     *
     * @return array<string, mixed>
     */
    private function personalMetrics(int $idPengguna): array
    {
        if (Schema::hasTable('pengajuan_peminjaman') && PengajuanPeminjaman::where('id_pengguna', $idPengguna)->exists()) {
            $userQuery = PengajuanPeminjaman::where('id_pengguna', $idPengguna);

            $stats = [
                'total' => (clone $userQuery)->count(),
                'pending' => (clone $userQuery)->where('status_keseluruhan', PengajuanPeminjaman::STATUS_MENUNGGU)->count(),
                'disetujui' => (clone $userQuery)->where('status_keseluruhan', PengajuanPeminjaman::STATUS_DISETUJUI)->count(),
                'ditolak' => (clone $userQuery)->where('status_keseluruhan', PengajuanPeminjaman::STATUS_DITOLAK)->count(),
                'dipinjam' => (clone $userQuery)->where('status_keseluruhan', PengajuanPeminjaman::STATUS_DIPINJAM)->count(),
            ];

            $recent = (clone $userQuery)
                ->with(['detailAlat.alat.barang', 'detailRuangan.ruangan.barang'])
                ->latest('id_pengajuan_peminjaman')
                ->take(5)
                ->get();

            return [
                'stats' => $stats,
                'recentPengajuan' => $this->formatRecentPengajuan($recent, true),
            ];
        }

        return [
            'stats' => [
                'total' => 5,
                'pending' => 1,
                'disetujui' => 1,
                'ditolak' => 1,
                'dipinjam' => 2,
            ],
            'recentPengajuan' => [
                $this->row('TRX-0041', 'Multimeter Digital', 'Alat', 'Anda', 'pending', '2026-09-12'),
                $this->row('TRX-0038', 'Ruang Praktikum Elektronika', 'Ruangan', 'Anda', 'dipinjam', '2026-09-09'),
                $this->row('TRX-0033', 'Function Generator', 'Alat', 'Anda', 'disetujui', '2026-09-05'),
                $this->row('TRX-0030', 'Osiloskop Digital', 'Alat', 'Anda', 'dipinjam', '2026-09-02'),
                $this->row('TRX-0027', 'He-Ne Laser', 'Alat', 'Anda', 'ditolak', '2026-08-28'),
            ],
        ];
    }

    /**
     * @param  Collection<int, PengajuanPeminjaman>|\Illuminate\Database\Eloquent\Collection<int, PengajuanPeminjaman>  $items
     * @return list<array<string, string>>
     */
    private function formatRecentPengajuan($items, bool $isSelf = false): array
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

            $statusMap = [
                PengajuanPeminjaman::STATUS_MENUNGGU => 'pending',
                PengajuanPeminjaman::STATUS_DISETUJUI => 'disetujui',
                PengajuanPeminjaman::STATUS_DITOLAK => 'ditolak',
                PengajuanPeminjaman::STATUS_DIPINJAM => 'dipinjam',
                PengajuanPeminjaman::STATUS_DIKEMBALIKAN => 'disetujui',
                PengajuanPeminjaman::STATUS_DIBATALKAN => 'ditolak',
            ];

            $tanggal = $p->tanggal_peminjaman
                ? Carbon::parse($p->tanggal_peminjaman)->toDateString()
                : ($p->created_at ? $p->created_at->toDateString() : Carbon::today()->toDateString());

            $peminjam = $isSelf ? 'Anda' : ($p->pengguna?->nama_lengkap ?? 'Pengguna #'.$p->id_pengguna);

            return $this->row(
                'TRX-'.str_pad((string) $p->id_pengajuan_peminjaman, 4, '0', STR_PAD_LEFT),
                $aset,
                $kategori,
                $peminjam,
                $statusMap[$p->status_keseluruhan] ?? 'pending',
                $tanggal
            );
        })->values()->all();
    }

    /**
     * @return array<string, string>
     */
    private function row(string $kode, string $aset, string $kategori, string $peminjam, string $status, string $tanggal): array
    {
        return [
            'kode' => $kode,
            'aset' => $aset,
            'kategori' => $kategori,
            'peminjam' => $peminjam,
            'status' => $status,
            'tanggal' => $tanggal,
        ];
    }
}
