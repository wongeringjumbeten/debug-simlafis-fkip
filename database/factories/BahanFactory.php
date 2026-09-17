<?php

namespace Database\Factories;

use App\Models\Bahan;
use App\Models\Barang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bahan>
 */
class BahanFactory extends Factory
{
    protected $model = Bahan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jumlahAwal = fake()->randomElement([50, 500, 1000, 5000]);

        return [
            'id_barang' => Barang::factory()->bahan(),
            'id_ruangan' => null,
            'jumlah_awal' => $jumlahAwal,
            'jumlah_saat_ini' => fake()->numberBetween((int) ($jumlahAwal * 0.2), $jumlahAwal),
            'satuan' => fake()->randomElement(['ml', 'gram', 'pak', 'botol']),
            'tanggal_kadaluarsa' => fake()->dateTimeBetween('+1 year', '+3 years')->format('Y-m-d'),
            'status' => Bahan::STATUS_AMAN,
            'catatan' => fake()->optional()->sentence(),
        ];
    }

    public function menipis(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Bahan::STATUS_MENIPIS,
            'jumlah_saat_ini' => 10,
        ]);
    }

    public function habis(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Bahan::STATUS_HABIS,
            'jumlah_saat_ini' => 0,
        ]);
    }
}
