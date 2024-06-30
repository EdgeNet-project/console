<?php

namespace App\Listeners;

use App\Events\UserJoinsWorkspace;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UserJoinsWorkspaceListener
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
     * @param  \App\Events\UserJoinsWorkspace  $event
     * @return void
     */
    public function handle(UserJoinsWorkspace $event)
    {
//        Log::info('', ['o' => $event->subNamespaceUser]);
        Log::info('[Console] user '.$event->subNamespaceUser->user_id.' joined workspace '.$event->subNamespaceUser->sub_namespace_id.' with role '.$event->subNamespaceUser->role);

        // job to edgenetapi


        // send email
    }
}
