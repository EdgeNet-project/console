<?php

use App\Http\Controllers\Authentication\AuthenticationController;

//Route::get('/password/reset/{token?}', function () {
//    return view('console');
//})->where('token', '.*');
//
//Auth::routes(['register' => false]);

Route::get('user', [ AuthenticationController::class, 'user' ])
    ->name('auth.user');
Route::post('login', [ AuthenticationController::class, 'login' ])
    ->name('auth.login');
Route::post('logout', [ AuthenticationController::class, 'logout' ])
    ->name('auth.logout');

//Route::post('logout', 'Auth\LoginController@logout')->name('logout');
//Route::post('register', 'Kubernetes\RegisterController@register');
//Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');
//Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.update');
//Route::get('password/reset/{token}', 'ConsoleController@index')->name('password.reset');
//Route::post('password/confirm', 'Auth\ConfirmPasswordController@confirm');

//Route::post('/signup', 'Kubernetes\SignupController@signup');