<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            PermissionSeeder::class,
            RoleUserTableSeeder::class,
            InventoryItemsTableSeeder::class,
            ItemUserTableSeeder::class,
            RequestStatusesTableSeeder::class,
            LeaseRequestsTableSeeder::class,
            LeaseExtensionRequestsTableSeeder::class,
        ]);
    }
}
