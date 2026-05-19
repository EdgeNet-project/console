<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Node\CheckinController;
use \App\Http\Controllers\Node\ActivationController;

Route::post('/checkin', [CheckinController::class, 'checkin']);
Route::post('/activate', [ActivationController::class, 'activate']);