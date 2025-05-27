<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use App\Helpers\ActivityLogger;

class LogUserActivity
{
    public function handle($request, Closure $next)
    {
        if (auth()->check()) {
            ActivityLogger::log(
                'visited',
                'Visited: ' . $request->method() . ' ' . $request->path()
            );
        }

        return $next($request);
    }
}
