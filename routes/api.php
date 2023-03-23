<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TokenController;
use App\Http\Controllers\Api\ClusterController;
use App\Http\Controllers\Api\NamespaceController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\RoleRequestController;
use App\Http\Controllers\Api\TenantRequestController;
use App\Http\Controllers\Api\NodeController;

Route::get('/tenants', [ TenantController::class, 'list' ]);

Route::group(['middleware' => 'auth:sanctum'], function () {
//    Route::get('/user', 'ConsoleController@user');

//    Route::get('/users/{name?}', 'ConsoleController@users');
//    Route::post('/users', 'ConsoleController@createUser');
//    Route::patch('/users/{name}', 'ConsoleController@patchUser');

    Route::group(['prefix' => 'tokens'], function () {
        Route::get('/', [ TokenController::class, 'list' ]);
        Route::post('/', [ TokenController::class, 'create' ]);
        Route::delete('/{name}', [ TokenController::class, 'delete' ]);
    });

    Route::get('/cluster', [ ClusterController::class, 'get' ]);

    Route::group(['prefix' => 'tenants'], function () {
        Route::get('/', [ TenantController::class, 'list' ]);

        Route::group(['prefix' => '{tenant:name}'], function () {
            Route::get('/', [ TenantController::class, 'get' ]);
            Route::get('/users', [ TenantController::class, 'users' ]);
        });
    });

    Route::group(['prefix' => 'requests'], function () {
        Route::get('/roles/{namespace?}', [ RoleRequestController::class, 'list' ]);
        Route::post('/roles', [ RoleRequestController::class, 'create' ]);

        Route::get('/tenants/{namespace?}', [ TenantRequestController::class, 'list' ]);
        Route::post('/tenants', [ TenantRequestController::class, 'create' ]);
    });


    Route::get('/namespaces', [ NamespaceController::class, 'list' ]);
    Route::get('/nodes', [ NodeController::class, 'list' ]);
});
