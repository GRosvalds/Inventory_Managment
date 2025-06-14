<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        if (Role::count() > 0) {
            return;
        }

        Role::insert([
            ['name' => 'admin'],
            ['name' => 'moderator'],
            ['name' => 'user'],
        ]);
    }
}
