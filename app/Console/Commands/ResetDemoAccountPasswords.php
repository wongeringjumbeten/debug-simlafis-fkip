<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\AccountCredentialService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:reset-demo-account-passwords {--password=a123b456 : Shared password for the development accounts}')]
#[Description('Reset all PostgreSQL demo account passwords with a Laravel-compatible hash')]
class ResetDemoAccountPasswords extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (! app()->environment('local') || config('database.default') !== 'pgsql') {
            $this->error('Command ini hanya boleh dijalankan pada environment local PostgreSQL.');

            return self::FAILURE;
        }

        $password = (string) $this->option('password');

        foreach (User::query()->cursor() as $user) {
            app(AccountCredentialService::class)->updatePassword($user, $password);
        }

        $this->info('Password '.User::query()->count().' akun demo berhasil direset.');

        return self::SUCCESS;
    }
}
