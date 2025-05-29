<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaseRequestsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('lease_requests')->insert([
            [
                'user_id' => 3,
                'inventory_id' => 1,
                'status_id' => 1,
                'requested_until' => now()->addDays(7),
                'purpose' => 'For project work',
                'admin_notes' => null,
                'approved_at' => null,
                'approved_by' => null,
                'quantity' => 1,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ],
        ]);
    }
}
