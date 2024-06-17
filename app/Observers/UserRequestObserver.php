<?php

namespace App\Observers;

use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use Illuminate\Support\Facades\Log;

class UserRequestObserver
{
    /**
     * Handle the userRequest "creating" event.
     *
     * @param  \App\Model\UserRequest $userRequest
     * @return void
     */
    public function creating(UserRequest $userRequest)
    {
        Log::info('Creating Request '. $userRequest->type->name);

        $userRequest->status = UserRequestStatus::Pending;
    }

    /**
     * Handle the userRequest "created" event.
     *
     * @param  \App\Model\UserRequest $userRequest
     * @return void
     */
    public function created(UserRequest $userRequest)
    {
        Log::info('Created Team request '. $userRequest->type->name . ' (' . $userRequest->id . ')');
    }

    /**
     * Handle the userRequest "updated" event.
     *
     * @param  \App\Model\UserRequest $userRequest
     * @return void
     */
    public function updated(UserRequest $userRequest)
    {
        Log::info('Updated Team request '. $userRequest->id);
    }

    /**
     * Handle the userRequest "deleted" event.
     *
     * @param  \App\Model\UserRequest $userRequest
     * @return void
     */
    public function deleted(UserRequest $userRequest)
    {
        //
    }

    /**
     * Handle the userRequest "restored" event.
     *
     * @param  \App\Model\UserRequest $userRequest
     * @return void
     */
    public function restored(UserRequest $userRequest)
    {
        //
    }

    /**
     * Handle the userRequest "force deleted" event.
     *
     * @param  \App\Model\UserRequest $userRequest
     * @return void
     */
    public function forceDeleted(UserRequest $userRequest)
    {
        //
    }
}
