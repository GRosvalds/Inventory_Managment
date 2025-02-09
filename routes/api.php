<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;

Route::get('/users', function () {
    return User::all();
});

Route::get('/inventory', [InventoryController::class, 'index']);
Route::post('/inventory', [InventoryController::class, 'store']);
Route::put('/inventory/{id}', [InventoryController::class, 'update']);
Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);
Route::post('/inventory/{id}/lease', [InventoryController::class, 'lease']);
Route::get('/user/{id}/leased-items', [InventoryController::class, 'getUserLeasedItems']);

