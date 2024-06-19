<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TokenController;
use App\Http\Controllers\Api\ClusterController;
use App\Http\Controllers\Api\NamespaceController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\SubnamespaceController;
use App\Http\Controllers\Api\RoleRequestController;
use App\Http\Controllers\Api\TenantRequestController;
use App\Http\Controllers\Api\NodeController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserRequestController;

Route::get('/tenants', [ TenantController::class, 'list' ]);

Route::group(['middleware' => 'auth:sanctum'], function () {
//    Route::get('/user', 'ConsoleController@user');

//    Route::get('/users/{name?}', 'ConsoleController@users');
//    Route::post('/users', 'ConsoleController@createUser');
//    Route::patch('/users/{name}', 'ConsoleController@patchUser');

    Route::group(['prefix' => 'user'], function () {
        Route::get('/requests', [UserController::class, 'requests']);
    });

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

            Route::group(['prefix' => 'subnamespaces'], function () {
                Route::get('/', [TenantController::class, 'subnamespaces']);
                Route::post('/', [ SubnamespaceController::class, 'create' ]);
            });
        });
    });

    Route::group(['prefix' => 'subnamespaces'], function () {
        Route::get('/', [ SubnamespaceController::class, 'list' ]);
        Route::get('/{namespace?}/{name?}', [ SubnamespaceController::class, 'list' ]);

    });

    Route::group(['prefix' => 'requests'], function () {

//        Route::get('/roles/{namespace?}', [ RoleRequestController::class, 'list' ]);
//        Route::post('/roles', [ RoleRequestController::class, 'create' ]);
//        Route::patch('/roles/{namespace}/{name}', [ RoleRequestController::class, 'update' ]);
//
//        Route::get('/tenants/{namespace?}', [ TenantRequestController::class, 'list' ]);
//        Route::post('/tenants', [ TenantRequestController::class, 'create' ]);

        Route::get('/', [ UserRequestController::class, 'list' ]);
        Route::patch('/{userRequest}', [ UserRequestController::class, 'update' ]);
        Route::post('/teams', [ UserRequestController::class, 'createTeam' ]);
        Route::post('/teams/{tenant}/join', [ UserRequestController::class, 'joinTeam' ]);
        Route::post('/workspaces', [ UserRequestController::class, 'createWorkspace' ]);
        Route::post('/workspaces/{subnamespace}/join', [ UserRequestController::class, 'joinWorkspace' ]);
    });

    Route::group(['prefix' => 'invitations'], function () {
        Route::post('/', [ InvitationController::class, 'create' ]);
    });

    Route::get('/namespaces', [ NamespaceController::class, 'list' ]);


    Route::group(['prefix' => 'nodes'], function () {
        Route::get('/', [ NodeController::class, 'list' ]);
        Route::get('/{node:id}', [ NodeController::class, 'get' ]);
        Route::get('/{node:id}/activity', [ NodeController::class, 'activity' ]);
        Route::post('/', [ NodeController::class, 'create' ]);
    });
});
