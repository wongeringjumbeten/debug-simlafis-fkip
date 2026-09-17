<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id_fakultas
 * @property string $nama_fakultas
 * @property-read Collection<int, Prodi> $prodi
 */
class Fakultas extends Model
{
    use HasFactory;

    protected $table = 'fakultas';

    protected $primaryKey = 'id_fakultas';

    public $timestamps = false;

    protected $guarded = [];

    public function prodi(): HasMany
    {
        return $this->hasMany(Prodi::class, 'id_fakultas', 'id_fakultas');
    }
}
