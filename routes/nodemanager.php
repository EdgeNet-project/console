<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Nodemanager\CheckinController;
use App\Http\Controllers\Nodemanager\PingController;
use App\Http\Controllers\Nodemanager\WireguardController;
use App\Http\Controllers\Nodemanager\ActivationController;
use App\Http\Controllers\Nodemanager\ManageController;
use App\Http\Controllers\Nodemanager\KubernetesController;

Route::post('/checkin', [CheckinController::class, 'checkin']);
Route::post('/ping', [PingController::class, 'ping']);

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
    Route::post('/enable/{node}', [ManageController::class, 'enable']);
});
