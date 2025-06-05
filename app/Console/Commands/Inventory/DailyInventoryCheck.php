<?php

declare(strict_types=1);

namespace App\Console\Commands\Inventory;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Console\Command;
use App\Models\InventoryItem;
use App\Models\LeaseRequest;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Console\Command\Command as CommandAlias;

class DailyInventoryCheck extends Command
{
    protected $signature = 'inventory:daily-check';
    protected $description = 'Checks for inventory discrepancies and emails the manager';

    public function handle()
    {
        $now = now();

        $itemsWithDiscrepancies = InventoryItem::with(['leases.user'])->get()->filter(function ($item) use ($now) {
            $missing = $item->initial_quantity - $item->quantity;
            $leased = $item->leases
                ->filter(function ($lease) use ($now) {
                    return $lease->lease_until && $now->lessThanOrEqualTo($lease->lease_until);
                })
                ->sum('quantity');
            return $missing !== $leased;
        });

        $successApproverEmails = [];
        $allLeaseRequests = LeaseRequest::where('status_id', LeaseRequest::APPROVED)->get();
        foreach ($allLeaseRequests as $leaseRequest) {
            if ($leaseRequest->approved_by) {
                $approver = User::find($leaseRequest->approved_by);
                if ($approver && $approver->email) {
                    $successApproverEmails[] = $approver->email;
                }
            }
        }

        if ($itemsWithDiscrepancies->isEmpty()) {
            ActivityLog::create([
                'user_id' => 1,
                'action' => 'inventory_check',
                'description' => 'Inventory check completed: No discrepancies found.',
                'ip_address' => null,
                'user_agent' => null,
            ]);
            Mail::send('emails.inventory-success', [], function ($message) use ($successApproverEmails) {
                $message->to($successApproverEmails)
                    ->subject('Inventory Check Success');
            });
            $this->info('No discrepancies found.');
            return CommandAlias::SUCCESS;
        }

        $approverEmails = [];
        foreach ($itemsWithDiscrepancies as $item) {
            foreach ($item->leases as $lease) {
                $leaseRequests = LeaseRequest::where('user_id', $lease->user_id ?? null)
                    ->where('inventory_id', $item->id)
                    ->where('status_id', LeaseRequest::APPROVED)
                    ->get();

                foreach ($leaseRequests as $leaseRequest) {
                    if ($leaseRequest->approved_by) {
                        $approver = User::find($leaseRequest->approved_by);
                        if ($approver && $approver->email) {
                            $approverEmails[] = $approver->email;
                        }
                    }
                }
            }
        }
        $approverEmails = array_unique($approverEmails);

        if (empty($approverEmails)) {
            $approverEmails = ['gabriels.rosvalds@gmail.com'];
        }

        foreach ($itemsWithDiscrepancies as $item) {
            $missing = $item->initial_quantity - $item->quantity;
            $leased = $item->leases
                ->filter(function ($lease) use ($now) {
                    return $lease->lease_until && $now->lessThanOrEqualTo($lease->lease_until);
                })
                ->sum('quantity');
            $overdueLeases = $item->leases
                ->filter(function ($lease) use ($now) {
                    return $lease->lease_until && $now->greaterThan($lease->lease_until);
                });

            $leaseDetails = [];
            foreach ($overdueLeases as $lease) {
                $leaseDetails[] = sprintf(
                    "User: %s, Email: %s, Phone: %s, Qty: %d, Due: %s",
                    $lease->user->name ?? 'N/A',
                    $lease->user->email ?? 'N/A',
                    $lease->user->phone ?? 'N/A',
                    $lease->quantity,
                    $lease->lease_until
                );
            }

            ActivityLog::create([
                'user_id' => 1,
                'action' => 'inventory_check',
                'description' => sprintf(
                    "Discrepancy found for item '%s' (ID: %d): Initial Qty: %d, Current Qty: %d, Leased: %d, Missing: %d. Overdue leases: %s",
                    $item->name,
                    $item->id,
                    $item->initial_quantity,
                    $item->quantity,
                    $leased,
                    $missing,
                    $leaseDetails ? implode(' | ', $leaseDetails) : 'None'
                ),
                'ip_address' => null,
                'user_agent' => null,
            ]);
        }

        $pdf = Pdf::loadView('pdf.inventory-report', ['items' => $itemsWithDiscrepancies]);

        Mail::send('emails.inventory-alert', ['items' => $itemsWithDiscrepancies], function ($message) use ($pdf, $approverEmails) {
            $message->to($approverEmails)
                ->subject('Inventory Alert')
                ->attachData($pdf->output(), 'inventory_report.pdf');
        });

        $this->info('Discrepancies found and reported.');
        return CommandAlias::SUCCESS;
    }
}
