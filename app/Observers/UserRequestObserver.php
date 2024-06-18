<?php

namespace App\Observers;

use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use App\Model\UserRequestType;
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
    public function updating(UserRequest $userRequest)
    {
        Log::info('Updated Team request '. $userRequest->id);
        switch($userRequest->type) {
            case UserRequestType::CreateTeam:
                if ($userRequest->status == UserRequestStatus::Approved) {

                }
                break;
            case UserRequestType::JoinTeam:
                break;
            case UserRequestType::CreateWorkspace:
                break;
            case UserRequestType::JoinWorkspace:
                break;
        }
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
