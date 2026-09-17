<?php

namespace Database\Factories;

use App\Models\Alat;
use App\Models\DetailAlat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DetailAlat>
 */
class DetailAlatFactory extends Factory
{
    protected $model = DetailAlat::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'no_seri_unit' => 'SN-'.fake()->unique()->numerify('#####'),
            'id_alat' => Alat::factory(),
            'id_ruangan' => null,
            'kondisi' => DetailAlat::KONDISI_BAIK,
            'status' => DetailAlat::STATUS_TERSEDIA,
            'tahun_pengadaan' => (string) fake()->year(),
            'sumber_dana' => 'DIPA Unej',
            'harga_beli' => fake()->randomElement([500000, 1500000, 3500000, 5000000]),
            'catatan' => fake()->optional()->sentence(),
        ];
    }

    public function rusak(): static
    {
        return $this->state(fn (array $attributes) => [
            'kondisi' => DetailAlat::KONDISI_RUSAK,
            'status' => DetailAlat::STATUS_TIDAK_TERSEDIA,
        ]);
    }

    public function sedangPerbaikan(): static
    {
        return $this->state(fn (array $attributes) => [
            'kondisi' => DetailAlat::KONDISI_SEDANG_PERBAIKAN,
            'status' => DetailAlat::STATUS_SEDANG_PERBAIKAN,
        ]);
    }

    public function tidakTersedia(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DetailAlat::STATUS_TIDAK_TERSEDIA,
        ]);
    }
}
