<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ClusterController;
use App\Http\Controllers\Api\NamespaceController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\NodeController;

Route::get('/tenants', [ TenantController::class, 'list' ]);

Route::group(['middleware' => 'auth:sanctum'], function () {
//    Route::get('/user', 'ConsoleController@user');

//    Route::get('/users/{name?}', 'ConsoleController@users');
//    Route::post('/users', 'ConsoleController@createUser');
//    Route::patch('/users/{name}', 'ConsoleController@patchUser');

    Route::get('/cluster', [ ClusterController::class, 'get' ]);

    Route::get('/namespaces', [ NamespaceController::class, 'list' ]);
    Route::get('/nodes', [ NodeController::class, 'list' ]);
});
