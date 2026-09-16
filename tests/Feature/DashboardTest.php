<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard'))->assertOk();
});

test('admin sees lab scope with revenue and five status buckets', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('scope', 'lab')
            ->where('isLab', true)
            ->where('showRevenue', true)
            ->has('pendapatanBulanIni')
            ->has('stats', 5)
            ->has('stats', fn (Assert $p) => $p
                ->has('total')->has('pending')->has('disetujui')->has('ditolak')->has('dipinjam'))
            ->has('chart.labels', 12)
            ->has('recentPengajuan', 10),
        );
});

test('kalab and plp see lab scope but no revenue', function () {
    foreach (['kalab', 'plp'] as $role) {
        $this->actingAs(User::factory()->create(['role' => $role]))
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('scope', 'lab')
                ->where('showRevenue', false)
                ->missing('pendapatanBulanIni'),
            );
    }
});

test('borrower roles see personal scope without revenue', function () {
    foreach (['dosen', 'mhs', 'ekst'] as $role) {
        $this->actingAs(User::factory()->create(['role' => $role]))
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('scope', 'self')
                ->where('isLab', false)
                ->where('showRevenue', false)
                ->has('stats', 5)
                ->has('recentPengajuan', 5),
            );
    }
});

test('lab scope totals exceed personal scope totals', function () {
    $totalFor = function (string $role): int {
        $props = [];
        $this->actingAs(User::factory()->create(['role' => $role]))
            ->get(route('dashboard'))
            ->assertInertia(function (Assert $page) use (&$props) {
                $page->component('dashboard');
                $props = $page->toArray()['props'] ?? [];
            });

        return (int) ($props['stats']['total'] ?? -1);
    };

    expect($totalFor('admin'))->toBeGreaterThan($totalFor('mhs'));
});

test('chart defaults to monthly view across all labs', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('chartFilters.periode', 'bulanan')
            ->where('chartFilters.lab', 'semua')
            ->has('chart.labels', 12)
            ->has('chart.alat', 12)
            ->has('chart.ruangan', 12),
        );
});

test('daily period shows the last 30 days', function () {
    foreach (['admin', 'mhs'] as $role) {
        $this->actingAs(User::factory()->create(['role' => $role]))
            ->get(route('dashboard', ['periode' => 'harian']))
            ->assertInertia(fn (Assert $page) => $page
                ->where('chartFilters.periode', 'harian')
                ->has('chart.labels', 30)
                ->has('chart.alat', 30)
                ->has('chart.ruangan', 30),
            );
    }
});

test('lab filter changes chart values and falls back for unknown params', function () {
    $propsFor = function (string $query): array {
        $props = [];
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get(route('dashboard').$query)
            ->assertInertia(function (Assert $page) use (&$props) {
                $page->component('dashboard');
                $props = $page->toArray()['props'] ?? [];
            });

        return $props['chart'] ?? [];
    };

    $dasar = $propsFor('?lab=dasar');
    $elektronika = $propsFor('?lab=elektronika');
    $semua = $propsFor('?lab=semua');
    $fallback = $propsFor('?lab=tidakada&periode=bogus');

    expect($dasar['alat'])->not->toBe($elektronika['alat'])
        ->and($fallback['labels'] ?? [])->toHaveCount(12)
        // "semua" = penjumlahan 4 unit lab, konsisten by construction.
        ->and($semua['alat'][0])->toBe($dasar['alat'][0] + $elektronika['alat'][0]
            + $propsFor('?lab=lanjut')['alat'][0] + $propsFor('?lab=elf')['alat'][0]);
});
