<?php

namespace Database\Factories;

use App\Models\Barang;
use App\Models\Mebeler;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mebeler>
 */
class MebelerFactory extends Factory
{
    protected $model = Mebeler::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_barang' => Barang::factory()->mebeler(),
            'id_ruangan' => null,
            'no_seri_unit_mebeler' => 'MBL-'.strtoupper(fake()->unique()->lexify('???')),
            'kondisi' => Mebeler::KONDISI_BAIK,
            'tahun_pengadaan' => (string) fake()->year(),
            'sumber_dana' => 'DIPA Unej',
            'harga_beli' => fake()->randomElement([350000, 600000, 1200000, 2500000]),
            'catatan' => fake()->optional()->sentence(),
        ];
    }

    public function rusak(): static
    {
        return $this->state(fn (array $attributes) => [
            'kondisi' => Mebeler::KONDISI_RUSAK,
        ]);
    }

    public function sedangPerbaikan(): static
    {
        return $this->state(fn (array $attributes) => [
            'kondisi' => Mebeler::KONDISI_SEDANG_PERBAIKAN,
        ]);
    }
}
