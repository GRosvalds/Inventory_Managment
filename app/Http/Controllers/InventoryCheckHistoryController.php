<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;

class InventoryCheckHistoryController extends Controller
{
    public function index(): JsonResponse
    {
        $logs = ActivityLog::where('action', 'inventory_check')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($logs);
    }
}
