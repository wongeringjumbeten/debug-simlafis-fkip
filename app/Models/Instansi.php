<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_instansi
 * @property string $nama_instansi
 */
class Instansi extends Model
{
    use HasFactory;

    protected $table = 'instansi';

    protected $primaryKey = 'id_instansi';

    public $timestamps = false;

    protected $guarded = [];
}
