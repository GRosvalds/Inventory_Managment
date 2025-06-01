<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\InventoryItem;
use App\Models\ItemLease;
use App\Models\User;
use Illuminate\Mail\Mailable;

class LeaseReturnedNotificationMail extends Mailable
{
    public $item;
    public $lease;
    public $user;

    public function __construct(InventoryItem $item, ItemLease $lease, User $user)
    {
        $this->item = $item;
        $this->lease = $lease;
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Lease Returned Notification')
            ->view('emails.lease-returned-notification')
            ->with([
                'item' => $this->item,
                'lease' => $this->lease,
                'user' => $this->user,
            ]);
    }
}
