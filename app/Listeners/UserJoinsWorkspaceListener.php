<?php

namespace App\Listeners;

use App\Events\UserJoinsWorkspace;
use App\Model\User;
use App\Model\SubNamespace;

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
        $user = User::find($event->subNamespaceUser->user_id);
        $workspace = SubNamespace::find($event->subNamespaceUser->sub_namespace_id);
        $role = $event->subNamespaceUser->role;

        Log::info('[Console] user '.$user->id.' joined workspace '.$workspace->name.' ('.$workspace->id.') with role '.$role);

        // job to edgenetapi


        // send email
    }
}
