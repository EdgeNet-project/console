<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TokenController;
use App\Http\Controllers\Api\ClusterController;
use App\Http\Controllers\Api\NamespaceController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\SubnamespaceController;
use App\Http\Controllers\Api\NodeController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserRequestController;
use App\Http\Controllers\Api\UserRequest\UserRequestTeamController;
use App\Http\Controllers\Api\UserRequest\UserRequestWorkspaceController;
use App\Http\Controllers\Api\PodController;

use App\Http\Controllers\Api\Admin\TeamController as AdminTeamController;
use App\Http\Controllers\Api\Admin\WorkspaceController as AdminWorkspaceController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\NodeController as AdminNodeController;
use App\Http\Controllers\Api\Admin\ActivityController as AdminActivityController;

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
        Route::get('/{sub_namespace}', [ SubnamespaceController::class, 'get' ]);
//        Route::get('/{namespace?}/{name?}', [ SubnamespaceController::class, 'list' ]);

    });

    Route::group(['prefix' => 'requests'], function () {

        Route::group([
            'prefix' => 'teams',
            'controller' => UserRequestTeamController::class
        ], function () {
            Route::post('/','create');
            Route::patch('/','join');

        });

        Route::group([
            'prefix' => 'workspaces',
            'controller' => UserRequestWorkspaceController::class
        ], function () {
            Route::post('/','create');
            Route::patch('/','join');
        });

        Route::get('/', [ UserRequestController::class, 'list' ]);
        Route::patch('/{userRequest}', [ UserRequestController::class, 'update' ]);
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

    Route::group([
        'prefix' => 'pods',
        'controller' => PodController::class
    ], function () {
        Route::get('/', 'list');
    });

    /**
     * Admin access
     */
    Route::group(['prefix' => 'admin',], function () {

        Route::group([
            'prefix' => 'teams',
            'controller' => AdminTeamController::class
        ], function () {
            Route::get('/', 'list');
        });

        Route::group([
            'prefix' => 'workspaces',
            'controller' => AdminWorkspaceController::class
        ], function () {
            Route::get('/', 'list');
        });

        Route::group([
            'prefix' => 'users',
            'controller' => AdminUserController::class
        ], function () {
            Route::get('/', 'list');
        });

        Route::group([
            'prefix' => 'nodes',
            'controller' => AdminNodeController::class
        ], function () {
            Route::get('/', 'list');
        });

        Route::group([
            'prefix' => 'activity',
            'controller' => AdminActivityController::class
        ], function () {
            Route::get('/', 'list');
        });
    });
});
