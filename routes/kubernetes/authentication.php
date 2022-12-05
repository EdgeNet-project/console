<?php

use App\Http\Controllers\Kubernetes\AuthenticationController;

Route::post('/webhook', [ AuthenticationController::class => 'authenticate' ]);
Route::get('/dashboard', [ AuthenticationController::class => 'dashboard' ]);


