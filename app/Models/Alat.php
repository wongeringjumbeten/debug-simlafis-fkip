<?php

namespace App\Models;

use Database\Factories\AlatFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id_alat
 * @property int $id_barang
 * @property string|null $tarif_eksternal_luar_unej
 * @property string|null $tarif_eksternal_internal_unej
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Barang|null $barang
 * @property-read Collection<int, DetailAlat> $detailAlat
 * @property-read int|null $detail_alat_count
 */
class Alat extends Model
{
    /** @use HasFactory<AlatFactory> */
    use HasFactory;

    protected $table = 'alat';

    protected $primaryKey = 'id_alat';

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tarif_eksternal_luar_unej' => 'decimal:2',
            'tarif_eksternal_internal_unej' => 'decimal:2',
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
        return $this->hasMany(DetailAlat::class, 'id_alat', 'id_alat');
    }

    public function getStokTotalAttribute(): int
    {
        return $this->detailAlat()->count();
    }

    public function getStokTersediaAttribute(): int
    {
        return $this->detailAlat()
            ->where('kondisi', DetailAlat::KONDISI_BAIK)
            ->where('status', DetailAlat::STATUS_TERSEDIA)
            ->count();
    }
}
