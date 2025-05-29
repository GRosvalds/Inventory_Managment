<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with(['user.roles']);
        $perPage = $request->query('perPage', 12);

        if ($request->filled('userType')) {
            if ($request->userType === 'users') {
                $query->whereHas('user.roles', function($q) {
                    $q->where('name', 'user');
                })
                    ->whereDoesntHave('user.roles', function($q) {
                        $q->whereIn('name', ['moderator', 'admin']);
                    });
            } elseif ($request->userType === 'moderators') {
                $query->whereHas('user.roles', function($q) {
                    $q->where('name', 'moderator');
                });
            }
        }

        $query->whereDoesntHave('user.roles', function($q) {
            $q->where('name', 'admin');
        });

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhere('ip_address', 'like', "%$search%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%$search%")
                            ->orWhere('email', 'like', "%$search%");
                    });
            });
        }

        if ($request->filled('dateFilter') && $request->dateFilter !== 'all') {
            switch ($request->dateFilter) {
                case 'today':
                    $query->whereDate('created_at', Carbon::now());
                    break;
                case 'week':
                    $query->where('created_at', '>=', Carbon::now()->subDays(7));
                    break;
                case 'month':
                    $query->where('created_at', '>=', Carbon::now()->subDays(30));
                    break;
            }
        }

        if ($request->filled('actionFilter') && $request->actionFilter !== 'all') {
            $query->where('action', $request->actionFilter);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('sort')) {
            $sortDirection = $request->filled('direction') ? $request->direction : 'asc';
            $sortColumn = $request->sort;

            if ($sortColumn === 'user.name') {
                $query->join('users', 'activity_logs.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sortDirection)
                    ->select('activity_logs.*');
            } else {
                $query->orderBy($sortColumn, $sortDirection);
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return response()->json($query->paginate($perPage));
    }

    public function getActiveUsers(Request $request): JsonResponse
    {
        $timeThreshold = Carbon::now()->subMinutes(15);
        $userType = $request->query('userType', 'users');

        $query = User::with('activityLogs')
            ->whereHas('activityLogs', function ($query) use ($timeThreshold) {
                $query->where('created_at', '>=', $timeThreshold);
            });

        if ($userType === 'users') {
            $query->whereHas('roles', function($q) {
                $q->where('name', 'user');
            })
                ->whereDoesntHave('roles', function($q) {
                    $q->whereIn('name', ['moderator', 'admin']);
                });
        } elseif ($userType === 'moderators') {
            $query->whereHas('roles', function($q) {
                $q->where('name', 'moderator');
            });
        }

        $query->whereDoesntHave('roles', function($q) {
            $q->where('name', 'admin');
        });

        return response()->json($query->orderBy('name')->get());
    }
}
