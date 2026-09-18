<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id_detail_pengajuan_peminjaman_alat
 * @property int $id_pengajuan_peminjaman
 * @property int $id_alat
 * @property Carbon $waktu_mulai
 * @property Carbon $waktu_selesai
 * @property int $jumlah_item
 * @property string $harga_per_item
 * @property string $total_biaya_per_item
 * @property string $status_item
 * @property string|null $alasan_penolakan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read PengajuanPeminjaman|null $pengajuan
 * @property-read Alat|null $alat
 */
class DetailPengajuanPeminjamanAlat extends Model
{
    use HasFactory;

    public const STATUS_MENUNGGU = 'menunggu';

    public const STATUS_DISETUJUI = 'disetujui';

    public const STATUS_DITOLAK = 'ditolak';

    public const STATUS_DIKEMBALIKAN = 'dikembalikan';

    public const STATUS_DIBATALKAN = 'dibatalkan';

    protected $table = 'detail_pengajuan_peminjaman_alat';

    protected $primaryKey = 'id_detail_pengajuan_peminjaman_alat';

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'waktu_mulai' => 'datetime',
            'waktu_selesai' => 'datetime',
            'jumlah_item' => 'integer',
            'harga_per_item' => 'decimal:2',
            'total_biaya_per_item' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(PengajuanPeminjaman::class, 'id_pengajuan_peminjaman', 'id_pengajuan_peminjaman');
    }

    public function alat(): BelongsTo
    {
        return $this->belongsTo(Alat::class, 'id_alat', 'id_alat');
    }
}
