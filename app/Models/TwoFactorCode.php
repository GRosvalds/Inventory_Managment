<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TwoFactorCode extends Model
{
    const USER_ID = 'user_id';
    const CODE = 'code';
    const EXPIRES_AT = 'expires_at';

    protected $fillable = [
        self::USER_ID,
        self::CODE,
        self::EXPIRES_AT];

    protected $casts = [
        self::EXPIRES_AT => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

