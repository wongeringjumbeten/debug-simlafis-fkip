<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AccountStatusService
{
    /**
     * Change a Sprint 1 account status and preserve an immutable audit row.
     */
    public function change(User $account, string $status, ?string $reason, ?User $changedBy = null): void
    {
        if (! in_array($status, User::ACCOUNT_STATUSES, true)) {
            throw ValidationException::withMessages(['status' => 'Status akun tidak dikenali.']);
        }

        if (DB::getDriverName() !== 'pgsql') {
            $account->forceFill([
                'active' => $status === 'active',
                'suspension_reason' => $status === 'active' ? null : $reason,
            ])->save();

            return;
        }

        DB::transaction(function () use ($account, $status, $reason, $changedBy): void {
            $previous = $account->status;
            $now = now();

            DB::table('akun')
                ->where('id_akun', $account->getAuthIdentifier())
                ->update([
                    'status' => $status,
                    'suspended_at' => $status === 'suspended' ? $now : null,
                    'alasan_suspended' => $status === 'active' ? null : $reason,
                    'status_changed_at' => $now,
                    'status_changed_by' => $changedBy?->getAuthIdentifier(),
                    'updated_at' => $now,
                ]);

            DB::table('riwayat_status_akun')->insert([
                'id_akun' => $account->getAuthIdentifier(),
                'status_lama' => $previous,
                'status_baru' => $status,
                'alasan' => $reason,
                'changed_by' => $changedBy?->getAuthIdentifier(),
                'created_at' => $now,
            ]);
        });
    }
}
