<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaseRequest extends Model
{
    use HasFactory;
    use SoftDeletes;

    const USER_ID = 'user_id';
    const INVENTORY_ID = 'inventory_id';
    const STATUS_ID = 'status_id';
    const QUANTITY = 'quantity';
    const NOTES = 'notes';
    const REQUESTED_UNTIL = 'requested_until';
    const PURPOSE = 'purpose';
    const ADMIN_NOTES = 'admin_notes';
    const APPROVED_AT = 'approved_at';
    const APPROVED_BY = 'approved_by';

    const PENDING = 1;
    const APPROVED = 2;
    const REJECTED = 3;

    const DATE = 'date';
    const DATE_TIME = 'datetime';

    protected $fillable = [
        self::USER_ID,
        self::INVENTORY_ID,
        self::QUANTITY,
        self::REQUESTED_UNTIL,
        self::PURPOSE,
        self::ADMIN_NOTES,
        self::APPROVED_AT,
        self::APPROVED_BY,
        self::STATUS_ID,
    ];

    protected $casts = [
        self::REQUESTED_UNTIL => self::DATE,
        self::APPROVED_AT => self::DATE_TIME,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->where(self::STATUS_ID, self::PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where(self::STATUS_ID, self::APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where(self::STATUS_ID, self::REJECTED);
    }
}
