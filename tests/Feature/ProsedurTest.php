<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from the procedure page', function () {
    $this->get(route('prosedur'))->assertRedirect(route('login'));
});

test('authenticated users can open the procedure page', function () {
    foreach (['admin', 'kalab', 'plp', 'dosen', 'mhs', 'ekst'] as $role) {
        $this->actingAs(User::factory()->create(['role' => $role]))
            ->get(route('prosedur'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('prosedur/index'));
    }
});

test('the sop document is available for download', function () {
    $berkas = public_path('docs/SOP-Laboratorium-Fisika.pdf');

    expect(file_exists($berkas))->toBeTrue()
        ->and(filesize($berkas))->toBeGreaterThan(0);
});
