<?php

declare(strict_types=1);

namespace App\Console\Commands\Inventory;

use Illuminate\Console\Command;
use App\Models\ItemLease;
use App\Mail\LeaseDueReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendLeaseReminders extends Command
{
    protected $signature = 'leases:send-reminders';
    protected $description = 'Send reminders to users whose lease due date is approaching';

    public function handle()
    {
        $daysBefore = 3;
        $now = Carbon::now()->startOfDay();
        $endDate = Carbon::now()->addDays($daysBefore)->endOfDay();

        $leases = ItemLease::whereBetween('lease_until', [$now, $endDate])
            ->with('user', 'item')
            ->get();

        foreach ($leases as $lease) {
            if ($lease->user && $lease->user->email) {
                Mail::to($lease->user->email)->send(new LeaseDueReminderMail($lease));
                $daysLeft = Carbon::parse($lease->lease_until)->diffInDays($now);
                $daysLeft = abs($daysLeft) - 1;
                $this->info("Reminder sent to {$lease->user->email} for lease #{$lease->id} ({$daysLeft} days left)");
            }
        }

        $this->info('Lease due reminders sent.');
    }
}
