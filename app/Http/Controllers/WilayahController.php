<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class WilayahController extends Controller
{
    /**
     * Daftar kabupaten dalam satu provinsi (untuk dropdown berantai registrasi).
     */
    public function kabupaten(int $province): JsonResponse
    {
        if (DB::getDriverName() !== 'pgsql') {
            return response()->json([]);
        }

        return response()->json(
            DB::table('regencies')
                ->where('province_id', $province)
                ->orderBy('name')
                ->get(['id', 'name'])
        );
    }

    /**
     * Daftar kecamatan dalam satu kabupaten.
     */
    public function kecamatan(int $regency): JsonResponse
    {
        if (DB::getDriverName() !== 'pgsql') {
            return response()->json([]);
        }

        return response()->json(
            DB::table('districts')
                ->where('regency_id', $regency)
                ->orderBy('name')
                ->get(['id', 'name'])
        );
    }

    /**
     * Daftar desa dalam satu kecamatan.
     */
    public function desa(int $district): JsonResponse
    {
        if (DB::getDriverName() !== 'pgsql') {
            return response()->json([]);
        }

        return response()->json(
            DB::table('villages')
                ->where('district_id', $district)
                ->orderBy('name')
                ->get(['id', 'name'])
        );
    }
}
