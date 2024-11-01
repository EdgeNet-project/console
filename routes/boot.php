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
    Route::get('/{node:auth}', 'bootstrap')
        ->name('node.bootstrap');

    Route::group([
        'middleware' => \App\Http\Middleware\AuthenticateNode::class
    ], function() {

        Route::post('/register', 'register')
            ->name('boot.register');

        Route::get('/name', 'name')
            ->name('boot.name');

        Route::get('/hostname', 'hostname')
            ->name('boot.hostname');

        Route::post('/log', 'log')
            ->name('boot.log');
    });

//    Route::patch('/', 'update');
//    Route::post('/', 'register');
//    Route::post('/installed', 'installed');
});