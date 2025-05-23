<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->intended('/user-inventory')->with('error', 'You must be logged in.');
        }

        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        if ($user->hasRole('moderator')) {
            return redirect()->intended('/inventory')->with('error', 'You do not have access to that page.');
        }

        return redirect()->intended('/user-inventory')->with('error', 'You do not have access to that page.');
    }
}
