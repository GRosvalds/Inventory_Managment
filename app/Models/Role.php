<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    const NAME = 'name';

    protected $fillable = [
        self::NAME,
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
