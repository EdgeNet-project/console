<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TenantController;

Route::get('/tenants', [ TenantController::class, 'list' ]);

//Route::group(['middleware' => 'auth:api'], function () {

//    Route::get('/user', 'ConsoleController@user');

//    Route::get('/users/{name?}', 'ConsoleController@users');
//    Route::post('/users', 'ConsoleController@createUser');
//    Route::patch('/users/{name}', 'ConsoleController@patchUser');

//    Route::get('/cluster', 'ConsoleController@cluster');
//});
