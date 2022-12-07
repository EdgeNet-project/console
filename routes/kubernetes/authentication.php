<?php

use App\Http\Controllers\Kubernetes\AuthenticationController;

Route::post('/webhook', [ AuthenticationController::class, 'webhook' ]);
Route::get('/dashboard', [ AuthenticationController::class, 'dashboard' ]);


