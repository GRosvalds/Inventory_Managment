<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lease_requests', function (Blueprint $table) {
            $table->unsignedInteger('quantity')->default(1)->after('inventory_id');
        });
    }

    public function down(): void
    {
        Schema::table('lease_requests', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
};
