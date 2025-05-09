<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Role:Default
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

//RoleWise
Route::middleware(['auth', 'role:super-user|admin|user','verified'])->group(function () {

    // Permissions
    Route::resource('/permissions', PermissionController::class);
    Route::get('permissions/{permissionId}/delete', [PermissionController::class, 'destroy']);
    Route::post('/permissions/bulk-delete', [PermissionController::class, 'bulkDelete'])->name('permission.bulk-delete');


    // Roles
    Route::resource('/roles', RoleController::class);
    Route::get('roles/{roleId}/delete', [RoleController::class, 'destroy']);
    Route::post('/roles/bulk-delete', [RoleController::class, 'bulkDeleteRoles'])->name('roles.bulk-delete');


    Route::get('roles/{roleId}/give-permissions', [RoleController::class, 'addPermissionToRole']);
    Route::put('roles/{roleId}/give-permissions', [RoleController::class, 'givePermissionToRole']);


   //User
   Route::resource('/users', UserController::class);
   Route::get('/users/{userId}/delete', [UserController::class, 'destroy']);
   Route::post('/users/bulk-delete', [UserController::class, 'bulkDeleteUsers'])->name('users.bulk-delete');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
