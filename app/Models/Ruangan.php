<?php

namespace App\Models;

use Database\Factories\RuanganFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id_ruangan
 * @property int $id_barang
 * @property int|null $kapasitas
 * @property string|null $tarif_eksternal
 * @property bool|null $is_aktif
 * @property string|null $tarif_eksternal_internal_unej
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Barang|null $barang
 * @property-read Collection<int, DetailAlat> $detailAlat
 * @property-read Collection<int, Bahan> $bahan
 * @property-read Collection<int, Mebeler> $mebeler
 */
class Ruangan extends Model
{
    /** @use HasFactory<RuanganFactory> */
    use HasFactory;

    protected $table = 'ruangan';

    protected $primaryKey = 'id_ruangan';

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kapasitas' => 'integer',
            'tarif_eksternal' => 'decimal:2',
            'tarif_eksternal_internal_unej' => 'decimal:2',
            'is_aktif' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }

    public function detailAlat(): HasMany
    {
        return $this->hasMany(DetailAlat::class, 'id_ruangan', 'id_ruangan');
    }

    public function bahan(): HasMany
    {
        return $this->hasMany(Bahan::class, 'id_ruangan', 'id_ruangan');
    }

    public function mebeler(): HasMany
    {
        return $this->hasMany(Mebeler::class, 'id_ruangan', 'id_ruangan');
    }
}
