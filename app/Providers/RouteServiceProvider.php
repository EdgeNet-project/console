<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * The path to the "home" route for your application.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {

        $this->mapKubernetesRoutes();

        $this->mapAuthenticationRoutes();
        $this->mapApiRoutes();

//        $this->mapEdgenetRoutes();

        $this->mapBootRoutes();

        $this->mapWebRoutes();

        //
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define the API authentication routes for the application.
     *
     * @return void
     */
    protected function mapAuthenticationRoutes()
    {
        Route::middleware('authentication')
            ->namespace($this->namespace . '\Authentication')
            ->group(base_path('routes/authentication.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace . '\Api')
            ->group(base_path('routes/api.php'));
    }

    /**
     * Define the "k8s" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapKubernetesRoutes()
    {

        Route::prefix('kubernetes')
            ->middleware('kubernetes')
            ->namespace($this->namespace . '\Kubernetes')
            ->group(base_path('routes/kubernetes/authentication.php'));

//        Route::prefix('api/v1')
//            ->middleware('kubernetes')
//            ->namespace($this->namespace . '\Kubernetes')
//            ->group(base_path('routes/kubernetes_api.php'));

    }

    /**
     * Define the "k8s" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapEdgenetRoutes()
    {
        Route::prefix(config('edgenet.api.prefix.registration'))
            ->middleware('edgenet')
            ->namespace($this->namespace . '\Edgenet')
            ->group(base_path('routes/edgenet/registration.php'));

        Route::prefix(config('edgenet.api.prefix.core'))
            ->middleware('edgenet')
            ->namespace($this->namespace . '\Edgenet')
            ->group(base_path('routes/edgenet/core.php'));
    }

    /**
     * Define the "boot" routes for the application.
     * Those are used by the NODES booting
     *
     * @return void
     */
    protected function mapBootRoutes()
    {
        Route::domain(config('edgenet.boot.server'))
            ->middleware('boot')
            ->namespace($this->namespace . '\Boot')
            ->group(base_path('routes/boot.php'));
    }
}
