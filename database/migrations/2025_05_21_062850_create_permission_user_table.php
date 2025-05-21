<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    const TABLE = 'permission_user';
    const PERMISSION_ID = 'permission_id';
    const USER_ID = 'user_id';
    const CASCADE = 'cascade';

    public function up(): void
    {
        Schema::create(self::TABLE, function (Blueprint $table) {
            $table->foreignId(self::PERMISSION_ID)->constrained()->onDelete(self::CASCADE);
            $table->foreignId(self::USER_ID)->constrained()->onDelete(self::CASCADE);
            $table->primary([self::PERMISSION_ID, self::USER_ID]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(self::TABLE);
    }
};
