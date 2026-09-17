<?php

namespace Database\Factories;

use App\Models\Alat;
use App\Models\Barang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Alat>
 */
class AlatFactory extends Factory
{
    protected $model = Alat::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_barang' => Barang::factory()->alat(),
            'tarif_eksternal_luar_unej' => fake()->randomElement([25000, 35000, 50000, 75000]),
            'tarif_eksternal_internal_unej' => fake()->randomElement([10000, 15000, 25000, 30000]),
        ];
    }
}
