<?php

namespace App\Providers;


use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

use App\Model\UserRequest;
use App\Model\Tenant;
use App\Model\SubNamespace;
use App\Model\Node;

use App\Observers\UserRequestObserver;
use App\Observers\TenantObserver;
use App\Observers\SubNamespaceObserver;
use App\Observers\NodeObserver;

class EventServiceProvider extends ServiceProvider
{

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        UserRequest::class => [
            UserRequestObserver::class,
        ],

        Tenant::class => [
            TenantObserver::class
        ],

        SubNamespace::class => [
            SubNamespaceObserver::class
        ],

        Node::class => [
            NodeObserver::class
        ]
    ];

    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return true;
    }
}
