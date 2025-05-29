<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestStatusesTableSeeder extends Seeder
{
    public function run():void
    {
        DB::table('request_statuses')->insert([
            ['name' => 'pending'],
            ['name' => 'approved'],
            ['name' => 'rejected'],
        ]);
    }
}
