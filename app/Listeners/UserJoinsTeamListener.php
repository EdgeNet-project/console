<?php

namespace App\Listeners;

use App\Events\UserJoinsTeam;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UserJoinsTeamListener
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
     * @param  \App\Events\UserJoinsTeam  $event
     * @return void
     */
    public function handle(UserJoinsTeam $event)
    {
//        Log::info('', ['o' => $event->subNamespaceUser]);
        Log::info('[Console] user '.$event->tenantUser->user_id.' joined team '.$event->tenantUser->tenant_id.' with role '.$event->subNamespaceUser->role);

        // job to edgenetapi


        // send email
    }
}
