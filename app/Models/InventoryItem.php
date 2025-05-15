<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'name',
        'description',
        'initial_quantity',
        'quantity',
        'category',
        'estimated_price',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'item_user')->withPivot('lease_until')->withTimestamps();
    }
}
