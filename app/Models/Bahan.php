<?php

namespace App\Models;

use Database\Factories\BahanFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id_bahan
 * @property int $id_barang
 * @property int|null $id_ruangan
 * @property int|null $jumlah_awal
 * @property int|null $jumlah_saat_ini
 * @property string|null $satuan
 * @property Carbon|null $tanggal_kadaluarsa
 * @property string $status
 * @property string|null $catatan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Barang|null $barang
 * @property-read Ruangan|null $ruangan
 */
class Bahan extends Model
{
    /** @use HasFactory<BahanFactory> */
    use HasFactory;

    public const STATUS_AMAN = 'aman';

    public const STATUS_MENIPIS = 'menipis';

    public const STATUS_HABIS = 'habis';

    protected $table = 'bahan';

    protected $primaryKey = 'id_bahan';

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'jumlah_awal' => 'integer',
            'jumlah_saat_ini' => 'integer',
            'tanggal_kadaluarsa' => 'date',
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
