<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\IpHelper;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::orderBy('name')->with('roles');
        $perPage = request()->query('perPage', 12);

        return response()->json($users->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|max:50',
            'department' => 'nullable|string|max:100',
        ]);

        $user = new User();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->password = Hash::make($validated['password']);
        $user->phone = $validated['phone'] ?? null;
        $user->role = $validated['role'] ?? 'user';
        $user->department = $validated['department'] ?? null;
        $user->save();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'create',
            'description' => "Created user with user: ID-$user->id and name: $user->name",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json($user, Response::HTTP_CREATED);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $originalValues = $user->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|max:50',
            'department' => 'nullable|string|max:100',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        $passwordChanged = false;
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            $passwordChanged = true;
        }

        $user->phone = $validated['phone'] ?? $user->phone;
        $user->role = $validated['role'] ?? $user->role;
        $user->department = $validated['department'] ?? $user->department;
        $user->save();

        $changes = [];
        foreach ($validated as $key => $newValue) {
            if ($key === 'password') {
                continue;
            }

            if (isset($originalValues[$key]) && $originalValues[$key] !== ($newValue ?? $originalValues[$key])) {
                $changes[] = "$key: '{$originalValues[$key]}' → '$newValue'";
            }
        }

        if ($passwordChanged) {
            $changes[] = "password: [changed]";
        }

        $changeLog = !empty($changes) ? " Changes: " . implode(", ", $changes) : "";

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'update',
            'description' => "Updated user: ID-{$user->id} {$user->name}.$changeLog",
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
        ]);

        return response()->json($user);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if (auth()->id() === $user->id) {
            return response()->json([
                'error' => 'You cannot delete your own account'
            ], Response::HTTP_BAD_REQUEST);
        }

        $user->delete();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'delete',
            'description' => "Deleted user with user: ID-{$user->id} and name: {$user->name}",
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
        ]);

        return response()->json(['success' => 'User deleted successfully']);
    }

    public function block(User $user): JsonResponse
    {
        $user->block();

        return response()->json(['success' => 'User blocked successfully']);
    }

    public function unblock(User $user): JsonResponse
    {
        $user->unblock();

        return response()->json(['success' => 'User unblocked successfully']);
    }
}
