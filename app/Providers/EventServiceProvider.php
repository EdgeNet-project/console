<?php

namespace App\Providers;

use App\Model\SubNamespace;
use App\Model\UserRequest;
use App\Observers\SubNamespaceObserver;
use App\Observers\TeamObserver;
use App\Observers\UserRequestObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        SubNamespace::class => [
            SubNamespaceObserver::class
        ],
        UserRequest::class => [
            UserRequestObserver::class,
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

        //
    }
}
