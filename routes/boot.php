<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Boot\OdroidController;

Route::group(['prefix' => 'odroid'], function () {
    Route::get('/', [OdroidController::class, 'boot']);
    Route::post('/', [OdroidController::class, 'register']);
    Route::post('/installed', [OdroidController::class, 'installed']);
});