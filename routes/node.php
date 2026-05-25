<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Node\CheckinController;
use \App\Http\Controllers\Node\WireguardController;
use \App\Http\Controllers\Node\ActivationController;
use \App\Http\Controllers\Node\ManageController;
use App\Http\Controllers\Node\KubernetesController;

Route::post('/checkin', [CheckinController::class, 'checkin']);

Route::group(['prefix' => 'wireguard', 'controller' => WireguardController::class], function () {
    Route::post('', 'wireguard');
    Route::get('peers', 'peers');
});

Route::post('/kubernetes', [KubernetesController::class, 'kubernetes']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/activate', [ActivationController::class, 'activate']);
    Route::get('/list', [ManageController::class, 'list']);
});
