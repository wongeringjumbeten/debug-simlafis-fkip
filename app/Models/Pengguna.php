<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_pengguna
 * @property string|null $nama_lengkap
 * @property string|null $foto_profil
 * @property string|null $foto_identitas
 * @property string $email
 * @property string|null $no_telepon
 */
class Pengguna extends Model
{
    use HasFactory;

    protected $table = 'pengguna';

    protected $primaryKey = 'id_pengguna';

    public $timestamps = false;

    protected $guarded = [];
}
