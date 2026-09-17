<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id_pengajuan_peminjaman
 * @property int $id_pengguna
 * @property string $jenis_peminjaman
 * @property string $total_biaya
 * @property string|null $metode_pembayaran
 * @property string|null $bukti_pembayaran
 * @property string $status_keseluruhan
 * @property string|null $catatan_penolakan
 * @property Carbon $tanggal_peminjaman
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Pengguna|null $pengguna
 * @property-read Collection<int, DetailPengajuanPeminjamanAlat> $detailAlat
 * @property-read Collection<int, DetailPengajuanPeminjamanRuangan> $detailRuangan
 */
class PengajuanPeminjaman extends Model
{
    use HasFactory;

    public const JENIS_INTERNAL = 'internal';

    public const JENIS_EKSTERNAL = 'eksternal';

    public const STATUS_MENUNGGU = 'menunggu';

    public const STATUS_DISETUJUI = 'disetujui';

    public const STATUS_DITOLAK = 'ditolak';

    public const STATUS_DIPINJAM = 'dipinjam';

    public const STATUS_TERLAMBAT = 'terlambat';

    public const STATUS_DIKEMBALIKAN = 'dikembalikan';

    public const STATUS_DIBATALKAN = 'dibatalkan';

    public const METODE_TRANSFER = 'transfer';

    public const METODE_CASH = 'cash';

    protected $table = 'pengajuan_peminjaman';

    protected $primaryKey = 'id_pengajuan_peminjaman';

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_biaya' => 'decimal:2',
            'tanggal_peminjaman' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna', 'id_pengguna');
    }

    public function detailAlat(): HasMany
    {
        return $this->hasMany(DetailPengajuanPeminjamanAlat::class, 'id_pengajuan_peminjaman', 'id_pengajuan_peminjaman');
    }

    public function detailRuangan(): HasMany
    {
        return $this->hasMany(DetailPengajuanPeminjamanRuangan::class, 'id_pengajuan_peminjaman', 'id_pengajuan_peminjaman');
    }

    /**
     * BR-5: Pembatalan mandiri dapat dilakukan selama status masih menunggu atau disetujui
     * (belum diubah menjadi dipinjam).
     */
    public function isCancellable(): bool
    {
        return in_array($this->status_keseluruhan, [
            self::STATUS_MENUNGGU,
            self::STATUS_DISETUJUI,
        ], true);
    }

    /**
     * @param  Builder<PengajuanPeminjaman>  $query
     * @return Builder<PengajuanPeminjaman>
     */
    public function scopeMenunggu(Builder $query): Builder
    {
        return $query->where('status_keseluruhan', self::STATUS_MENUNGGU);
    }

    /**
     * Update status_keseluruhan berdasarkan status item-level (BR-4).
     */
    public function refreshStatusKeseluruhan(): void
    {
        $alatStatuses = $this->detailAlat()->pluck('status_item')->all();
        $ruangStatuses = $this->detailRuangan()->pluck('status_item')->all();
        $allStatuses = array_merge($alatStatuses, $ruangStatuses);

        if (empty($allStatuses)) {
            return;
        }

        if (in_array(self::STATUS_MENUNGGU, $allStatuses, true)) {
            $this->status_keseluruhan = self::STATUS_MENUNGGU;
        } elseif (collect($allStatuses)->every(fn ($s) => $s === self::STATUS_DITOLAK)) {
            $this->status_keseluruhan = self::STATUS_DITOLAK;
        } elseif (in_array(self::STATUS_DISETUJUI, $allStatuses, true)) {
            $this->status_keseluruhan = self::STATUS_DISETUJUI;
        }

        $this->save();
    }
}
