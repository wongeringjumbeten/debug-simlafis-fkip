<?php

namespace Database\Factories;

use App\Models\Barang;
use App\Models\Ruangan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ruangan>
 */
class RuanganFactory extends Factory
{
    protected $model = Ruangan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_barang' => Barang::factory()->ruangan(),
            'kapasitas' => fake()->numberBetween(20, 50),
            'tarif_eksternal' => fake()->randomElement([0, 150000, 350000]),
            'tarif_eksternal_internal_unej' => fake()->randomElement([0, 75000, 150000]),
            'is_aktif' => true,
        ];
    }

    public function nonAktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_aktif' => false,
        ]);
    }
}
