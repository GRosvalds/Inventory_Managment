<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemUserTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('item_user')->insert([
            [
                'user_id' => 3,
                'inventory_item_id' => 1,
                'quantity' => 1,
                'lease_until' => now()->addDays(7),
                'deleted_at' => null,
            ],
            [
                'user_id' => 3,
                'inventory_item_id' => 2,
                'quantity' => 2,
                'lease_until' => now()->addDays(14),
                'deleted_at' => null,
            ],
        ]);
    }
}
