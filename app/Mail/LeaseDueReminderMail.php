<?php

declare(strict_types=1);

namespace App\Mail;

use Illuminate\Mail\Mailable;
use App\Models\ItemLease;

class LeaseDueReminderMail extends Mailable
{
    public $lease;

    public function __construct(ItemLease $lease)
    {
        $this->lease = $lease;
    }

    public function build()
    {
        return $this->subject('Lease Due Date Reminder')
            ->view('emails.lease_due_reminder')
            ->with(['lease' => $this->lease]);
    }
}
