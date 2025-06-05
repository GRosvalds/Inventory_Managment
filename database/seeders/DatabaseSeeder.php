<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('roles')->count() === 0) {
            $this->call(RoleSeeder::class);
        }
        if (DB::table('users')->count() === 0) {
            $this->call(UserSeeder::class);
        }
        if (DB::table('permissions')->count() === 0) {
            $this->call(PermissionSeeder::class);
        }
        if (DB::table('role_user')->count() === 0) {
            $this->call(RoleUserTableSeeder::class);
        }
        if (DB::table('inventory_items')->count() === 0) {
            $this->call(InventoryItemsTableSeeder::class);
        }
        if (DB::table('item_user')->count() === 0) {
            $this->call(ItemUserTableSeeder::class);
        }
        if (DB::table('request_statuses')->count() === 0) {
            $this->call(RequestStatusesTableSeeder::class);
        }
        if (DB::table('lease_requests')->count() === 0) {
            $this->call(LeaseRequestsTableSeeder::class);
        }
//        if (DB::table('lease_extension_requests')->count() === 0) {
//            $this->call(LeaseExtensionRequestsTableSeeder::class);
//        }
    }
}
