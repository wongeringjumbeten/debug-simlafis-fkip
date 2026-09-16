<?php

use Inertia\Testing\AssertableInertia as Assert;

test('homepage is publicly accessible', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('welcome'));
});
