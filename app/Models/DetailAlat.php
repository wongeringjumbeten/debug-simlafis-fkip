<?php

namespace App\Models;

use Database\Factories\DetailAlatFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id_detail_alat
 * @property string|null $no_seri_unit
 * @property int $id_alat
 * @property int|null $id_ruangan
 * @property string $kondisi
 * @property string $status
 * @property string|null $tahun_pengadaan
 * @property string|null $sumber_dana
 * @property string|null $harga_beli
 * @property string|null $catatan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Alat|null $alat
 * @property-read Ruangan|null $ruangan
 */
class DetailAlat extends Model
{
    /** @use HasFactory<DetailAlatFactory> */
    use HasFactory;

    public const KONDISI_BAIK = 'baik';

    public const KONDISI_RUSAK = 'rusak';

    public const KONDISI_SEDANG_PERBAIKAN = 'sedang perbaikan';

    public const STATUS_TERSEDIA = 'tersedia';

    public const STATUS_TIDAK_TERSEDIA = 'tidak tersedia';

    public const STATUS_SEDANG_PERBAIKAN = 'sedang perbaikan';

    protected $table = 'detail_alat';

    protected $primaryKey = 'id_detail_alat';

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'harga_beli' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function alat(): BelongsTo
    {
        return $this->belongsTo(Alat::class, 'id_alat', 'id_alat');
    }

    public function ruangan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class, 'id_ruangan', 'id_ruangan');
    }

    /**
     * @param  Builder<DetailAlat>  $query
     * @return Builder<DetailAlat>
     */
    public function scopeTersedia(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_TERSEDIA);
    }

    /**
     * @param  Builder<DetailAlat>  $query
     * @return Builder<DetailAlat>
     */
    public function scopeKondisiBaik(Builder $query): Builder
    {
        return $query->where('kondisi', self::KONDISI_BAIK);
    }
}
