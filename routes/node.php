<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Node\CheckinController;

Route::post('/checkin', [CheckinController::class, 'checkin']);