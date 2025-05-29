<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaseExtensionRequestsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('lease_extension_requests')->insert([
            [
                'lease_request_id' => 1,
                'user_id' => 3,
                'status_id' => 1,
                'current_end_date' => now()->addDays(7),
                'requested_until' => now()->addDays(14),
                'reason' => 'Need more time',
                'admin_notes' => null,
                'approved_at' => null,
                'approved_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ],
        ]);
    }
}
