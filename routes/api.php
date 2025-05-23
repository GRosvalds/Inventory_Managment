<?php

declare(strict_types=1);

use App\Http\Controllers\InventoryController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return User::all();
});

Route::get('/inventory', [InventoryController::class, 'index']);
Route::get('/user/{id}/leased-items', [InventoryController::class, 'getUserLeasedItems']);
Route::post('/inventory', [InventoryController::class, 'createItem']);
Route::put('/inventory/{id}', [InventoryController::class, 'update']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);


