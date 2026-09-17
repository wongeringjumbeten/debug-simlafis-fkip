<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $email
 * @property string|null $no_hp
 * @property string $role
 * @property string|null $kategori_eksternal
 * @property string $status
 * @property string|null $suspension_reason
 * @property string $password
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class User extends Authenticatable implements PasskeyUser
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

    protected $hidden = ['password'];

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

    public function isBlocked(): bool
    {
        return $this->status === 'blocked';
    }

    public function isSuspended(): bool
    {
        $status = $this->getRawOriginal('status');

        if ($status !== null) {
            return $status === 'suspended';
        }

        return ! (bool) $this->getRawOriginal('active');
    }

    public function getActiveAttribute(): bool
    {
        $status = $this->getRawOriginal('status');

        if ($status !== null) {
            return $status === 'active';
        }

        return (bool) $this->getRawOriginal('active');
    }

    public function getTable(): string
    {
        return config('database.default') === 'pgsql' ? 'v_auth_users' : 'users';
    }
}
