<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        \App\CRDs\TenantRequest::register();
        \App\CRDs\RoleRequest::register();
        \App\CRDs\Tenant::register();
        \App\CRDs\SubNamespace::register();
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
