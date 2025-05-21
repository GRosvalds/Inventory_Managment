<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    const TABLE_NAME = 'two_factor_codes';
    const USER_ID = 'user_id';
    const CODE = 'code';
    const EXPIRES_AT = 'expires_at';
    const CASCADES = 'cascade';

    public function up(): void
    {
        Schema::create(self::TABLE_NAME, function (Blueprint $table) {
            $table->id();
            $table->foreignId(self::USER_ID)->constrained()->onDelete(self::CASCADES);
            $table->string(self::CODE);
            $table->timestamp(self::EXPIRES_AT);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(self::TABLE_NAME);
    }
};
