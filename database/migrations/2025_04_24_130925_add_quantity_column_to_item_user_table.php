<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('item_user', function (Blueprint $table) {
            $table->integer('quantity')->nullable()->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('item_user', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
};
