<?php

namespace App\Models;

use Database\Factories\MebelerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id_mebeler
 * @property int $id_barang
 * @property int|null $id_ruangan
 * @property string|null $no_seri_unit_mebeler
 * @property string $kondisi
 * @property string|null $tahun_pengadaan
 * @property string|null $sumber_dana
 * @property string|null $harga_beli
 * @property string|null $catatan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Barang|null $barang
 * @property-read Ruangan|null $ruangan
 */
class Mebeler extends Model
{
    /** @use HasFactory<MebelerFactory> */
    use HasFactory;

    public const KONDISI_BAIK = 'baik';

    public const KONDISI_RUSAK = 'rusak';

    public const KONDISI_SEDANG_PERBAIKAN = 'sedang perbaikan';

    protected $table = 'mebeler';

    protected $primaryKey = 'id_mebeler';

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

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }

    public function ruangan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class, 'id_ruangan', 'id_ruangan');
    }
}
