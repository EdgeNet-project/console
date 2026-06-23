<?php

use App\Http\Controllers\Status\NodeController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => 'api',
    'prefix' => 'status/api'
], function () {
    Route::get('/nodes', [ NodeController::class, 'list' ])
        ->name('node.list');
});

Route::view('/{any?}', 'status')
    ->where('any', '.*');