<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class InventoryItem extends Model
{
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const INITIAL_QUANTITY = 'initial_quantity';
    const QUANTITY = 'quantity';
    const CATEGORY = 'category';
    const ESTIMATED_PRICE = 'estimated_price';
    const ITEM_USER = 'item_user';
    const LEASED_UNTIL = 'lease_until';

    protected $fillable = [
        self::NAME,
        self::DESCRIPTION,
        self::INITIAL_QUANTITY,
        self::QUANTITY,
        self::CATEGORY,
        self::ESTIMATED_PRICE,
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, self::ITEM_USER)->withPivot(self::LEASED_UNTIL)->withTimestamps();
    }
}
