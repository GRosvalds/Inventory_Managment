<?php

declare(strict_types=1);

namespace App\Console\Commands\Inventory;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Console\Command;
use App\Models\InventoryItem;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Console\Command\Command as CommandAlias;

class DailyInventoryCheck extends Command
{
    protected $signature = 'inventory:daily-check';
    protected $description = 'Checks for inventory discrepancies and emails the manager';

    public function handle()
    {
        $now = now();

        $itemsWithDiscrepancies = InventoryItem::with('leases')->get()->filter(function ($item) use ($now) {
            $missing = $item->initial_quantity - $item->quantity;

            $leased = $item->leases
                ->filter(function ($lease) use ($now) {
                    return $lease->lease_until && $now->lessThanOrEqualTo($lease->lease_until);
                })
                ->sum('quantity');

            return $missing !== $leased;
        });

        if ($itemsWithDiscrepancies->isEmpty()) {
            return CommandAlias::SUCCESS;
        }

        $pdf = PDF::loadView('pdf.inventory-report', ['items' => $itemsWithDiscrepancies]);

        Mail::send('emails.inventory-alert', ['items' => $itemsWithDiscrepancies], function ($message) use ($pdf) {
            $message->to('gabriels.rosvalds@gmail.com')
                ->subject('Inventory Alert')
                ->attachData($pdf->output(), 'inventory_report.pdf');
        });

        return CommandAlias::SUCCESS;
    }
}
