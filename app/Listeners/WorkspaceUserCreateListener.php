<?php

namespace App\Listeners;

use App\Events\WorkspaceUserCreate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class WorkspaceUserCreateListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\WorkspaceUserCreate  $event
     * @return void
     */
    public function handle(WorkspaceUserCreate $event)
    {
        Log::info('[Console] workspace '.$event->subNamespaceUser->subnamespace->name.' role for user id '.$event->subNamespaceUser->role.' created');

    }
}
