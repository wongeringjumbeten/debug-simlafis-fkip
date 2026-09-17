<?php

namespace Database\Factories;

use App\Models\Barang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Barang>
 */
class BarangFactory extends Factory
{
    protected $model = Barang::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_barang' => fake()->words(3, true),
            'foto_barang' => null,
            'deskripsi_barang' => fake()->sentence(),
            'jenis' => Barang::JENIS_ALAT,
        ];
    }

    public function alat(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis' => Barang::JENIS_ALAT,
        ]);
    }

    public function ruangan(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis' => Barang::JENIS_RUANGAN,
        ]);
    }

    public function bahan(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis' => Barang::JENIS_BAHAN,
        ]);
    }

    public function mebeler(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis' => Barang::JENIS_MEBELER,
        ]);
    }
}
