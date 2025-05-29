<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryItemsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('inventory_items')->insert([
            [
                'name' => 'Laptop',
                'description' => 'Dell XPS 13',
                'initial_quantity' => 10,
                'quantity' => 10,
                'category' => 'Electronics',
                'estimated_price' => 1200.00,
                'deleted_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Projector',
                'description' => 'Epson Projector',
                'initial_quantity' => 5,
                'quantity' => 5,
                'category' => 'Electronics',
                'estimated_price' => 800.00,
                'deleted_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
