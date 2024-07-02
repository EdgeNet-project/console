<?php

namespace App\Listeners;

use App\Events\UserJoinsTeam;
use App\Model\Tenant;
use App\Model\TenantUser;
use App\Model\User;
use App\Notifications\UserJoinsTeamNotification;
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
        $user = User::find($event->tenantUser->user_id);
        $team = Tenant::find($event->tenantUser->tenant_id);
        $role = $event->tenantUser->role;

        Log::info('[Console] user '.$user->id.' joined team '.$team->name.' ('.$team->id.') with role '.$role);

        // job to edgenetapi

        // send email
        $user->notify(new UserJoinsTeamNotification($team, $role));
    }
}
