<?php

use App\Http\Controllers\Nodemanager\ActivationController;
use App\Http\Controllers\Nodemanager\ManageController;
use App\Http\Controllers\Nodemanager\Node\CheckinController;
use App\Http\Controllers\Nodemanager\Node\InstallController;
use App\Http\Controllers\Nodemanager\Node\KubernetesController;
use App\Http\Controllers\Nodemanager\Node\HeartbeatController;
use App\Http\Controllers\Nodemanager\Node\SetupController;
use App\Http\Controllers\Nodemanager\Node\WireguardController;
use Illuminate\Support\Facades\Route;

Route::group(['domain' => config('nodemanager.orchestrator.host')], function () {

    Route::get('/install.sh', [InstallController::class, 'shell'])
        ->name('nodemanager.install.shell');

    Route::get('/cloud-init', [InstallController::class, 'cloudInit'])
        ->name('nodemanager.install.cloud-init');

    // simple endpoint to get the node's public IP address
    Route::get('/ip', [InstallController::class, 'ip'])
        ->name('nodemanager.install.ip');


    /**
     * Installer phase endpoints
     */
    Route::group(['prefix' => 'setup'], function () {
        // checkin
        //Route::post('/checkin', [CheckinController::class, 'checkin'])
        //        ->name('nodemanager.install.checkin');


        Route::get('users', [ SetupController::class, 'users' ])
            ->name('nodemanager.setup.users');
    });
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'api/node'
], function () {

    Route::post('/checkin', [CheckinController::class, 'checkin']);
    Route::post('/ping', [HeartbeatController::class, 'ping']);

    Route::group(['prefix' => 'wireguard', 'controller' => WireguardController::class], function () {
        Route::post('', 'wireguard');
        Route::get('peers', 'peers');
    });

    Route::group(['prefix' => 'kubernetes', 'controller' => KubernetesController::class], function () {
        Route::post('/join', 'join');
        Route::post('/ready', 'ready');
    });

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/activate', [ActivationController::class, 'activate']);
        Route::get('/list', [ManageController::class, 'list']);
        Route::get('/metrics/{node:id?}', [ ManageController::class, 'metrics' ]);

        Route::post('/enable/{node}', [ManageController::class, 'enable']);
    });
});

