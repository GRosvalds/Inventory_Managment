<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\LeaseRequest;
use App\Models\User;
use Illuminate\Mail\Mailable;

class LeaseRequestNotificationMail extends Mailable
{
    public $leaseRequest;
    public $requestingUser;

    public function __construct(LeaseRequest $leaseRequest, User $requestingUser)
    {
        $this->leaseRequest = $leaseRequest;
        $this->requestingUser = $requestingUser;
    }

    public function build()
    {
        return $this->subject('New Lease Request Submitted')
            ->view('emails.lease-request-notification')
            ->with([
                'leaseRequest' => $this->leaseRequest,
                'user' => $this->requestingUser,
            ]);
    }
}
