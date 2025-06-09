<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schedule;

Schedule::command('inventory:daily-check')
    ->dailyAt('17:00');

Schedule::command('leases:send-reminders')
    ->daily();
