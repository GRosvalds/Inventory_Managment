<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'view_users',
            'edit_users',
            'delete_users',
            'delete_profile',
            'view_lease_requests',
            'manage_lease_requests',
            'view_leases',
            'create_leases',
            'update_leases',
            'view_inventory',
            'edit_inventory',
        ];

        $permissionModels = collect($permissions)->mapWithKeys(function ($permName) {
            return [$permName => Permission::firstOrCreate(['name' => $permName])];
        });

        $adminUser = User::where('email', 'admin@example.com')->first();
        $moderatorUser = User::where('email', 'moderator@example.com')->first();
        $basicUser = User::where('email', 'user@example.com')->first();

        if ($adminUser) {
            $adminUser->permissions()->sync($permissionModels->pluck('id')->toArray());
        }

        if ($moderatorUser) {
            $moderatorUser->permissions()->sync([
                $permissionModels['view_users']->id,
                $permissionModels['view_inventory']->id,
            ]);
        }

        if ($basicUser) {
            $basicUser->permissions()->sync([
                $permissionModels['delete_profile']->id,
            ]);
        }
    }
}
