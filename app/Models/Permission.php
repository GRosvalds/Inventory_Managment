<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    const NAME = 'name';

    protected $fillable = [
        self::NAME,
    ];
}
