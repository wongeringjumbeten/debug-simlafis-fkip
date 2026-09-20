<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB; // Tambahan Facade DB
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $no_hp
 * @property string $role
 * @property string|null $kategori_eksternal
 * @property string $status
 * @property string|null $suspension_reason
 * @property string $password
 * @property string|null $foto_profil
 * @property string|null $instansi
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /** Enam role single-role Sprint 1. */
    public const ROLES = ['admin', 'kalab', 'plp', 'dosen', 'mhs', 'ekst'];

    /** Sub-kategori tarif pengguna eksternal (BR-2). */
    public const KATEGORI_EKSTERNAL = ['internal_unej', 'luar_unej'];

    /** Role yang wajib melampirkan instansi + kategori tarif. */
    public const ROLE_EKSTERNAL = 'ekst';

    /** Account status sesuai Sprint 1. */
    public const ACCOUNT_STATUSES = ['active', 'suspended', 'blocked'];

    /** User adalah read model dari view PostgreSQL v_auth_users. */
    protected $table = 'v_auth_users';

    protected $primaryKey = 'id';

    /** View auth tidak ditulis langsung; write dilakukan lewat service transaksional. */
    public $timestamps = false;

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['active'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'suspended_at' => 'datetime',
            'status_changed_at' => 'datetime',
        ];
    }

    /**
     * OVERRIDE: Mencegah Error saat Laravel/Fortify melakukan auto-update.
     * Karena model ini menggunakan View (v_auth_users), operasi update
     * (seperti remember_token atau update password) harus diarahkan ke tabel fisik 'users'.
     */
    public function save(array $options = [])
    {
        if ($this->exists) {
            $dirty = $this->getDirty();

            // Jika ada perubahan kolom, lakukan update ke view/tabel terkait
            if (count($dirty) > 0) {
                DB::table($this->getTable())
                    ->where($this->getKeyName(), $this->getKey())
                    ->update($dirty);

                $this->syncOriginal();
            }

            return true;
        }

        // Return false karena insert baru (Register) harus ditangani via service DB Transaction, bukan via save() model ini.
        return false;
    }

    /**
     * Accessor untuk standar fitur Laravel/Fortify yang membutuhkan properti $user->name
     */
    public function getNameAttribute(): string
    {
        return $this->attributes['nama_lengkap'] ?? $this->attributes['name'] ?? 'User';
    }

    public function isBlocked(): bool
    {
        return $this->status === 'blocked';
    }

    public function getActiveAttribute(): bool
    {
        if (array_key_exists('status', $this->attributes)) {
            return $this->attributes['status'] === 'active';
        }

        return (bool) ($this->attributes['active'] ?? false);
    }

    public function isSuspended(): bool
    {
        if (array_key_exists('status', $this->attributes)) {
            return $this->attributes['status'] === 'suspended';
        }

        return ! $this->active;
    }
}
