<?php

namespace App\Observers;

use App\Model\UserRequest;
use Illuminate\Support\Facades\Log;

class UserRequestObserver
{
    /**
     * Handle the TeamRequest "created" event.
     *
     * @param  \App\Model\UserRequest $teamRequest
     * @return void
     */
    public function created(UserRequest $teamRequest)
    {
        Log::info('Created Team request '. $teamRequest->id);
    }

    /**
     * Handle the TeamRequest "updated" event.
     *
     * @param  \App\Model\UserRequest $teamRequest
     * @return void
     */
    public function updated(UserRequest $teamRequest)
    {
        Log::info('Updated Team request '. $teamRequest->id);
    }

    /**
     * Handle the TeamRequest "deleted" event.
     *
     * @param  \App\Model\UserRequest $teamRequest
     * @return void
     */
    public function deleted(UserRequest $teamRequest)
    {
        //
    }

    /**
     * Handle the TeamRequest "restored" event.
     *
     * @param  \App\Model\UserRequest $teamRequest
     * @return void
     */
    public function restored(UserRequest $teamRequest)
    {
        //
    }

    /**
     * Handle the TeamRequest "force deleted" event.
     *
     * @param  \App\Model\UserRequest $teamRequest
     * @return void
     */
    public function forceDeleted(UserRequest $teamRequest)
    {
        //
    }
}
