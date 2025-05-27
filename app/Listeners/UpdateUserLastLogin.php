<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;

class UpdateUserLastLogin
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function handle(Login $event): void
    {
        $userId = $event->user->getAuthIdentifier();
        $user = User::findOrFail($userId);

        $user->last_login_at = now();
        $user->save();
    }
}
