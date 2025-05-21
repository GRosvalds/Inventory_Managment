<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    const TABLE_NAME = 'role_user';
    const USER_ID = 'user_id';
    const ROLE_ID = 'role_id';
    const CASCADE = 'cascade';

    public function up(): void
    {
        Schema::create(self::TABLE_NAME, function (Blueprint $table) {
            $table->foreignId(self::USER_ID)->constrained()->onDelete(self::CASCADE);
            $table->foreignId(self::ROLE_ID)->constrained()->onDelete(self::CASCADE);
            $table->primary([self::USER_ID, self::ROLE_ID]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(self::TABLE_NAME);
    }
};
