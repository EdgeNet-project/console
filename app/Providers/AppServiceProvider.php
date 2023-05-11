<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Edgenet;
use App\Services\EdgenetAdmin;

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

        $this->app->singleton('edgenet-admin', function ($app) {
            return new EdgenetAdmin($app);
        });

        $this->app->singleton('edgenet', function ($app) {
            return new Edgenet($app);
        });
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
