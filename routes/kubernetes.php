<?php

use App\Http\Controllers\Kubernetes\AuthnController;
use App\Http\Controllers\Kubernetes\AuditController;

Route::post('/audit', [ AuditController::class, 'webhook' ])
    ->name('kubernetes.audit');
Route::post('/authn', [ AuthnController::class, 'webhook' ])
    ->name('kubernetes.authn');