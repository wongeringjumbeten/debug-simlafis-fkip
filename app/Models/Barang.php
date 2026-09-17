<?php

namespace App\Models;

use Database\Factories\BarangFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id_barang
 * @property string $nama_barang
 * @property string|null $foto_barang
 * @property string|null $deskripsi_barang
 * @property string $jenis
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $foto_url
 * @property-read Alat|null $alat
 * @property-read Ruangan|null $ruangan
 * @property-read Bahan|null $bahan
 * @property-read Mebeler|null $mebeler
 */
class Barang extends Model
{
    /** @use HasFactory<BarangFactory> */
    use HasFactory;

    public const JENIS_ALAT = 'alat';

    public const JENIS_BAHAN = 'bahan';

    public const JENIS_RUANGAN = 'ruangan';

    public const JENIS_MEBELER = 'mebeler';

    public const JENIS_LIST = [
        self::JENIS_ALAT,
        self::JENIS_BAHAN,
        self::JENIS_RUANGAN,
        self::JENIS_MEBELER,
    ];

    protected $table = 'barang';

    protected $primaryKey = 'id_barang';

    protected $guarded = [];

    protected $appends = ['foto_url'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function getFotoUrlAttribute(): ?string
    {
        if (! $this->foto_barang) {
            return null;
        }

        return str_starts_with($this->foto_barang, '/')
            ? $this->foto_barang
            : '/'.$this->foto_barang;
    }

    public function alat(): HasOne
    {
        return $this->hasOne(Alat::class, 'id_barang', 'id_barang');
    }

    public function ruangan(): HasOne
    {
        return $this->hasOne(Ruangan::class, 'id_barang', 'id_barang');
    }

    public function bahan(): HasOne
    {
        return $this->hasOne(Bahan::class, 'id_barang', 'id_barang');
    }

    public function mebeler(): HasOne
    {
        return $this->hasOne(Mebeler::class, 'id_barang', 'id_barang');
    }
}
