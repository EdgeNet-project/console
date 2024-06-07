<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Boot\OdroidController;
use \App\Http\Controllers\Boot\NodeController;

Route::group([
    'controller' => OdroidController::class,
    'prefix' => 'odroid'
], function () {
    Route::get('/', 'boot');
    Route::patch('/', 'update');
    Route::post('/', 'register');
    Route::post('/installed', 'installed');
});

Route::group([
    'controller' => NodeController::class,
    'prefix' => 'nodes'
], function () {
    Route::get('/{node:auth}', 'boot')
        ->name('boot.script');

    Route::post('/', 'register')
        ->name('boot.register');

//    Route::patch('/', 'update');
//    Route::post('/', 'register');
//    Route::post('/installed', 'installed');
});