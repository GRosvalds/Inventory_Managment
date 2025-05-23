<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Auth/TwoFactor');
    }

    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|numeric']);

        $userId = session('2fa:user:id');
        $user = User::findOrFail($userId);

        if (
            !$user->twoFactorCode ||
            $user->twoFactorCode->code !== $request->code ||
            $user->twoFactorCode->expires_at->isPast()
        ) {
            return back()->withErrors(['code' => 'Invalid or expired code.']);
        }

        session()->forget('2fa:user:id');
        $user->twoFactorCode()->delete();

        Auth::login($user);

        if ($user->hasRole('admin') || $user->hasRole('moderator')) {
            return redirect()->intended('/inventory');
        }

        return redirect()->intended('/user-inventory');
    }
}
