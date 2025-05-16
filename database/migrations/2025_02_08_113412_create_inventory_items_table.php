<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    const TABLE = 'inventory_items';
    const NAME = 'name';
    const DESCRIPTION = 'description';
    const QUANTITY = 'quantity';
    const CATEGORY = 'category';
    const ESTIMATED_PRICE = 'estimated_price';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    /**
     * Tiek palaista migrācija kura izveido tabulu inventory_items
     */
    public function up(): void
    {
        Schema::create(self::TABLE, function (Blueprint $table) {
            $table->id();
            $table->string(self::NAME);
            $table->text(self::DESCRIPTION);
            $table->integer(self::QUANTITY);
            $table->string(self::CATEGORY);
            $table->decimal(self::ESTIMATED_PRICE, 10, 2);
            $table->timestamp(self::CREATED_AT)->useCurrent();
            $table->timestamp(self::UPDATED_AT)->useCurrent();
        });
    }

    /**
     * Tiek palaista migrācija kura izdzēš tabulu inventory_items
     */
    public function down(): void
    {
        Schema::dropIfExists(self::TABLE);
    }
};
