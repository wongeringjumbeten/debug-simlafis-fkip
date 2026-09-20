<?php

use Inertia\Testing\AssertableInertia as Assert;

/**
 * Struktur dan kontrol akses dashboard per peran.
 *
 * Ketepatan angka diuji terpisah di `Dashboard/DashboardRealMetricsTest.php`.
 *
 * Catatan: test ini sebelumnya lolos karena controller mengembalikan **data
 * contoh** ketika pengguna tidak punya transaksi. Setelah data contoh dihapus,
 * assertion diperbarui mengikuti struktur prop yang sebenarnya.
 */
test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs(buatPenggunaLengkap())
        ->get(route('dashboard'))
        ->assertOk();
});

test('admin menerima scope lab, pendapatan, dan statistik terpisah', function () {
    $this->actingAs(buatPenggunaLengkap(['role' => 'admin']))
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('scope', 'lab')
            ->where('isLab', true)
            ->where('showRevenue', true)
            ->has('pendapatanBulanIni')
            ->has('statsAlat', fn (Assert $p) => $p
                ->has('total')->has('pending')->has('disetujui')->has('ditolak')->has('dipinjam'))
            ->has('statsRuangan', fn (Assert $p) => $p
                ->has('total')->has('pending')->has('disetujui')->has('ditolak')->has('dipinjam'))
            ->has('chart.labels', 12)
            ->has('chart.alat', 12)
            ->has('chart.ruangan', 12)
            ->has('inventaris')
            ->has('recentPengajuan'),
        );
});

test('kalab dan plp menerima scope lab tanpa pendapatan', function () {
    foreach (['kalab', 'plp'] as $role) {
        $this->actingAs(buatPenggunaLengkap(['role' => $role]))
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('scope', 'lab')
                ->where('isLab', true)
                ->where('showRevenue', false)
                ->missing('pendapatanBulanIni')
                ->has('statsAlat')
                ->has('statsRuangan'),
            );
    }
});

test('peran peminjam menerima scope personal tanpa komponen pengelola', function () {
    foreach (['dosen', 'mhs', 'ekst'] as $role) {
        $this->actingAs(buatPenggunaLengkap(['role' => $role]))
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('scope', 'self')
                ->where('isLab', false)
                ->where('showRevenue', false)
                ->missing('pendapatanBulanIni')
                ->has('ringkasan', fn (Assert $p) => $p
                    ->has('total')->has('menunggu')->has('disetujui')
                    ->has('berjalan')->has('selesai')->has('ditolak'))
                ->has('notifikasiPengembalian')
                ->has('recentPengajuan')
                // Komponen khusus pengelola tidak boleh ikut terkirim.
                ->missing('statsAlat')
                ->missing('statsRuangan')
                ->missing('chart')
                ->missing('inventaris'),
            );
    }
});

test('periode grafik baku bulanan dan harian memuat 30 titik', function () {
    $admin = buatPenggunaLengkap(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('chartPeriode', 'bulanan'));

    $this->actingAs($admin)
        ->get(route('dashboard', ['periode' => 'harian']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('chartPeriode', 'harian')
            ->has('chart.labels', 30)
            ->has('chart.alat', 30)
            ->has('chart.ruangan', 30),
        );
});

test('periode tak dikenal jatuh ke nilai baku', function () {
    $this->actingAs(buatPenggunaLengkap(['role' => 'admin']))
        ->get(route('dashboard', ['periode' => 'bogus']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('chartPeriode', 'bulanan')
            ->has('chart.labels', 12),
        );
});
