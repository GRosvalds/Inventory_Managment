<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    const PHOTO_URL = 'photo_url';

    protected $fillable = [
        self::NAME,
        self::DESCRIPTION,
        self::INITIAL_QUANTITY,
        self::QUANTITY,
        self::CATEGORY,
        self::ESTIMATED_PRICE,
        self::PHOTO_URL,
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, self::ITEM_USER)->withPivot(self::LEASED_UNTIL)->withTimestamps();
    }

    public function leases(): HasMany
    {
        return $this->hasMany(ItemLease::class, 'inventory_item_id');
    }

}
