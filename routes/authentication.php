<?php

use App\Http\Controllers\Authentication\AuthenticationController;
use App\Http\Controllers\Authentication\RegistrationController;
use App\Http\Controllers\Authentication\ForgotPasswordController;
use Illuminate\Http\Request;

//Route::get('/password/reset/{token?}', function () {
//    return view('console');
//})->where('token', '.*');
//
//Auth::routes(['register' => false]);


Route::post('login', [ AuthenticationController::class, 'login' ])
    ->name('login');

Route::post('logout', [ AuthenticationController::class, 'logout' ])
    ->name('auth.logout');

Route::post('register', [ RegistrationController::class, 'register' ])
    ->name('auth.register');

Route::post('password/link', [ ForgotPasswordController::class, 'sendPasswordResetLink' ])
    ->name('password.email');

Route::post('password/reset/{user}/{signature}', [ ForgotPasswordController::class, 'resetPassword' ])
    ->name('password.reset');

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('user', [AuthenticationController::class, 'user'])
        ->name('auth.user');
    Route::patch('user', [AuthenticationController::class, 'updateUser'])
        ->name('auth.user.update');

    Route::get('user/requests', [AuthenticationController::class, 'requests'])
        ->name('auth.requests');

    // resend email verification notice
    Route::post('email/verification', [ RegistrationController::class, 'sendEmailVerificationLink' ])
        ->name('email.verification');

    // Approve AUP
    Route::post('aup/accept', [ RegistrationController::class, 'setAUPAccepted' ])
        ->name('aup.accept');

});


//Route::post('logout', 'Auth\LoginController@logout')->name('logout');
//Route::post('register', 'Kubernetes\RegisterController@register');
//Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');
//Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.update');
//Route::get('password/reset/{token}', 'ConsoleController@index')->name('password.reset');
//Route::post('password/confirm', 'Auth\ConfirmPasswordController@confirm');

//Route::post('/signup', 'Kubernetes\SignupController@signup');