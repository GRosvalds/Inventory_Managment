<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $moderatorRole = Role::where('name', 'moderator')->first();
        $userRole = Role::where('name', 'user')->first();

        $admin = User::factory()->create([
            'name' => 'Gabriels Rosvalds',
            'email' => 'gabriels.rosvalds@gmail.com',
            'phone' => '1234567890',
            'password' => bcrypt('password'),
        ]);
        $admin->roles()->attach($adminRole);

        $moderator = User::factory()->create([
            'name' => 'Mareks Ozols',
            'email' => 'gabriels.rosvalds.devs@gmail.com',
            'phone' => '0987654321',
            'password' => bcrypt('password'),
        ]);
        $moderator->roles()->attach($moderatorRole);

        $user = User::factory()->create([
            'name' => 'Armands Auzenieks',
            'email' => 'rosvalds4321@gmail.com',
            'phone' => '0987654321',
            'password' => bcrypt('password'),
        ]);
        $user->roles()->attach($userRole);
    }
}
