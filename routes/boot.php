<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Boot\OdroidController;

Route::group([
    'controller' => OdroidController::class,
    'prefix' => 'odroid'
], function () {
    Route::get('/', 'boot');
    Route::patch('/', 'update');
    Route::post('/', 'register');
    Route::post('/installed', 'installed');
});