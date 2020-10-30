<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:api'], function () {

    Route::get('/user', 'ConsoleController@user');

    Route::get('/users/{name?}', 'ConsoleController@users');

    Route::get('/cluster', 'ConsoleController@cluster');
});
