<?php

declare(strict_types=1);

use App\Http\Controllers\ItemLeaseController;
use App\Http\Controllers\LeaseRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/user-inventory', function () {
    return Inertia::render('UserInventory');
})->middleware(['auth', 'verified'])->name('user-inventory');

Route::get('/inventory', function () {
    return Inertia::render('Inventory');
})->middleware(['auth', 'role:admin,moderator'])->name('inventory');

Route::get('/inventory-dashboard', function () {
    return Inertia::render('InventoryDashboard');
})->middleware(['auth', 'role:admin'])->name('inventory-dashboard');

Route::get('/user/{id}/leased-items', function ($id) {
    return Inertia::render('UserLeasedItems', ['userId' => $id]);
})->middleware(['auth', 'verified'])->name('user.leased-items');

Route::get('/lease-request-management', function () {
    return Inertia::render('LeaseRequestManagement');
})->middleware(['auth', 'role:admin,moderator'])->name('lease-request-management');

Route::get('/edit-profile', function () {
    return Inertia::render('Profile/Edit');
})->middleware(['auth', 'verified'])->name('edit');

Route::get('/user-management', function () {
    return Inertia::render('UserManagement');
})->middleware(['auth', 'role:admin,moderator'])->name('user-management');

Route::get('/admin/leases', function () {
    return Inertia::render('Leases/AllLeases');
})->middleware(['auth', 'role:admin,moderator']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/lease-requests/create', [LeaseRequestController::class, 'create'])->name('lease-requests.create');
    Route::get('/my-lease-requests', [LeaseRequestController::class, 'myRequests'])->name('lease-requests.my');

    Route::delete('/leases/{id}', [ItemLeaseController::class, 'returnLeasedItem']);
    Route::get('/users/{userId}/leases', [ItemLeaseController::class, 'userLeases']);
});

Route::middleware(['auth', 'role:admin,moderator'])->group(function () {
    Route::get('/lease-requests', [LeaseRequestController::class, 'index'])->name('lease-requests.index');
    Route::post('/lease-requests', [LeaseRequestController::class, 'store'])->name('lease-requests.store');
    Route::get('/lease-requests/{leaseRequest}', [LeaseRequestController::class, 'show'])->name('lease-requests.show');
    Route::post('/lease-requests/{leaseRequest}/approve', [LeaseRequestController::class, 'approve'])->name('lease-requests.approve');
    Route::post('/lease-requests/{leaseRequest}/reject', [LeaseRequestController::class, 'reject'])->name('lease-requests.reject');

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    Route::get('/leases', [ItemLeaseController::class, 'index']);
    Route::get('/leases/{id}', [ItemLeaseController::class, 'show']);
    Route::post('/leases', [ItemLeaseController::class, 'store']);
    Route::put('/leases/{id}', [ItemLeaseController::class, 'update']);
    Route::get('/items/{itemId}/leases', [ItemLeaseController::class, 'itemLeases']);
});

require __DIR__.'/auth.php';
