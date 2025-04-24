<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemLease extends Model
{
    protected $table = 'item_user';

    protected $fillable = [
        'user_id',
        'inventory_item_id',
        'quantity',
        'lease_until',
        'notes'
    ];

    protected $casts = [
        'lease_until' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
