<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IdentitasController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\KatalogController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\PersetujuanController;
use App\Http\Controllers\RiwayatController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\WilayahController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Dropdown wilayah berantai untuk form registrasi (publik, read-only).
Route::get('/wilayah/kabupaten/{province}', [WilayahController::class, 'kabupaten'])->name('wilayah.kabupaten');
Route::get('/wilayah/kecamatan/{regency}', [WilayahController::class, 'kecamatan'])->name('wilayah.kecamatan');
Route::get('/wilayah/desa/{district}', [WilayahController::class, 'desa'])->name('wilayah.desa');

Route::middleware(['auth', 'account.active'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/katalog', [KatalogController::class, 'index'])->name('katalog');

    // Operasional Manajemen Inventaris Katalog (Admin & PLP)
    Route::post('/katalog/alat', [InventoryController::class, 'storeAlat'])->name('katalog.alat.store');
    Route::patch('/katalog/alat/{alat}', [InventoryController::class, 'updateAlat'])->name('katalog.alat.update');
    Route::post('/katalog/alat/{alat}/unit', [InventoryController::class, 'storeDetailAlat'])->name('katalog.alat.unit.store');

    Route::post('/katalog/ruangan', [InventoryController::class, 'storeRuangan'])->name('katalog.ruangan.store');
    Route::patch('/katalog/ruangan/{ruangan}', [InventoryController::class, 'updateRuangan'])->name('katalog.ruangan.update');

    Route::post('/katalog/bahan', [InventoryController::class, 'storeBahan'])->name('katalog.bahan.store');
    Route::patch('/katalog/bahan/{bahan}', [InventoryController::class, 'updateBahan'])->name('katalog.bahan.update');

    Route::post('/katalog/mebeler', [InventoryController::class, 'storeMebeler'])->name('katalog.mebeler.store');
    Route::patch('/katalog/mebeler/{mebeler}', [InventoryController::class, 'updateMebeler'])->name('katalog.mebeler.update');

    // Modul Transaksi Peminjaman & Riwayat
    Route::post('/peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
    Route::post('/peminjaman/{peminjaman}/cancel', [PeminjamanController::class, 'cancel'])->name('peminjaman.cancel');
    Route::get('/riwayat', [RiwayatController::class, 'index'])->name('riwayat');

    // Modul Persetujuan Item-Level (Staf Laboratorium)
    Route::get('/persetujuan', [PersetujuanController::class, 'index'])->name('persetujuan');
    Route::patch('/persetujuan/alat/{item}/approve', [PersetujuanController::class, 'approveAlat'])->name('persetujuan.alat.approve');
    Route::patch('/persetujuan/alat/{item}/reject', [PersetujuanController::class, 'rejectAlat'])->name('persetujuan.alat.reject');
    Route::patch('/persetujuan/ruangan/{item}/approve', [PersetujuanController::class, 'approveRuangan'])->name('persetujuan.ruangan.approve');
    Route::patch('/persetujuan/ruangan/{item}/reject', [PersetujuanController::class, 'rejectRuangan'])->name('persetujuan.ruangan.reject');

    Route::inertia('/dokumentasi', 'dokumentasi/index')->name('dokumentasi'); // ADM-23/24, PLP-11/12, KLB-10
    Route::inertia('/prosedur', 'prosedur/index')->name('prosedur'); // ADM-26, DSN-09, MHS-07, EKS-08

    // Dokumen identitas privat: selalu melewati authorization (bukan akses langsung ke disk).
    Route::get('/identitas/{path}', [IdentitasController::class, 'show'])
        ->name('identitas.show')
        ->where('path', '.+');
});

// Manajemen pengguna: khusus Admin (BR-1, ADM-08..10, REQ-06).
Route::middleware(['auth', 'account.active', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
});

require __DIR__.'/settings.php';
