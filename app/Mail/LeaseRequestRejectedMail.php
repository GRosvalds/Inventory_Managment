<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\LeaseRequest;
use Illuminate\Mail\Mailable;

class LeaseRequestRejectedMail extends Mailable
{
    public $leaseRequest;

    public function __construct(LeaseRequest $leaseRequest)
    {
        $this->leaseRequest = $leaseRequest;
    }

    public function build()
    {
        return $this->subject('Your Lease Request Was Rejected')
            ->view('emails.lease-request-rejected')
            ->with(['leaseRequest' => $this->leaseRequest]);
    }
}
