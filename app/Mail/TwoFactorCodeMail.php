<?php

declare(strict_types=1);

namespace App\Mail;

use Illuminate\Mail\Mailable;

class TwoFactorCodeMail extends Mailable
{
    public $code;

    public function __construct($code)
    {
        $this->code = $code;
    }

    public function build()
    {
        return $this->subject('Your 2FA Code')
            ->view('emails.twofactor')
            ->with(['code' => $this->code]);
    }
}
