<?php

namespace App\Providers;

use App\Model\SubNamespaceUser;
use App\Observers\SubNamespaceUserObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

use App\Model\Node;
use App\Model\SubNamespace;
use App\Model\UserRequest;
use App\Observers\NodeObserver;
use App\Observers\SubNamespaceObserver;
use App\Observers\UserRequestObserver;

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
