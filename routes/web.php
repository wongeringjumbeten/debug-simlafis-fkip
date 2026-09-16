<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KatalogController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/katalog', [KatalogController::class, 'index'])->name('katalog');
    Route::inertia('/persetujuan', 'persetujuan/index')->name('persetujuan'); // ADM-15/16, KLB-07
    Route::inertia('/riwayat', 'riwayat/index')->name('riwayat'); // ADM-17, DSN-07, MHS-04, EKS-06
    Route::inertia('/dokumentasi', 'dokumentasi/index')->name('dokumentasi'); // ADM-23/24, PLP-11/12, KLB-10
    Route::inertia('/prosedur', 'prosedur/index')->name('prosedur'); // ADM-26, DSN-09, MHS-07, EKS-08
});

// Manajemen pengguna: khusus Admin (BR-1, ADM-08..10, REQ-06).
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
});

require __DIR__.'/settings.php';
