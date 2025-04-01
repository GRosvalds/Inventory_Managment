<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestStatusSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('request_statuses')->insert([
            [
                'name' => 'pending',
                'description' => 'Request is waiting for admin review',
                'color' => 'yellow',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'accepted',
                'description' => 'Request has been approved',
                'color' => 'green',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'rejected',
                'description' => 'Request has been denied',
                'color' => 'red',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
