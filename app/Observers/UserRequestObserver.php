<?php

namespace App\Observers;

use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\User;
use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use App\Model\UserRequestType;
use App\Notifications\UserRequestApproved;
use App\Notifications\UserRequestCreated;
use App\Notifications\UserRequestCreatedAdmin;
use App\Notifications\UserRequestDenied;
use App\Notifications\UserRequestError;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
        Log::info('[Console] Creating new request: '. $userRequest->type->name);

        /**
         * New requests have a PENDING status
         */
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
        Log::info('[Console] New request created: '. $userRequest->type->name . ' ID: ' . $userRequest->id);

        /**
         * Notify the user that createtd the request
         */
        $userRequest->user->notify(new UserRequestCreated($userRequest));

        /**
         * Notify the Team admins or EdgeNet Admins
         */
        $object = $userRequest->object;
        if ($object) {
            // Team owners/admins
            Log::info('[Console] New request created - notifying owners');
            foreach ($object->owners as $owner) {
                $owner->notify(new UserRequestCreatedAdmin($userRequest));
            }
        } else {
            // EdgeNet admins
            Log::info('[Console] New request created - notifying cluster admins');
            $admins = User::where('admin', true)->all();
            foreach ($admins as $admin) {
                $admin->notify(new UserRequestCreatedAdmin($userRequest));
            }

        }


    }

    /**
     * Handle the userRequest "updated" event.
     *
     * @param  \App\Model\UserRequest $userRequest
     * @return void
     */
    public function updating(UserRequest $userRequest)
    {
        // execute external calls if the request has been approved
        if ($userRequest->status != UserRequestStatus::Approved) {
            return;
        }

        switch($userRequest->type) {
            case UserRequestType::CreateTeam:
                $this->createTeam($userRequest);
                break;
            case UserRequestType::JoinTeam:
                $this->joinTeam($userRequest);
                break;
            case UserRequestType::CreateWorkspace:
                $this->createWorkspace($userRequest);
                break;
            case UserRequestType::JoinWorkspace:
                $this->joinWorkspace($userRequest);
                break;
        }
    }

    private function createTeam(UserRequest $userRequest)
    {
        try {
            $team = Tenant::create([
                'url' => $userRequest->data['url'],
                'country' => $userRequest->data['country'],
                'name' => Str::lower($userRequest->data['shortname']),
                'fullname' => $userRequest->data['fullname'],
                'shortname' => $userRequest->data['shortname'],
                'affiliation' => $userRequest->data['affiliation'],
                'joining_reason' => $userRequest->data['joining_reason'],
                'joining_category' => $userRequest->data['joining_category'],

                'contact_name' => $userRequest->user->name,
                'contact_email' => $userRequest->user->email
            ]);

            $team->users()->attach(
                $userRequest->user->id, ['role' => 'owner']
            );

        } catch (QueryException) {
            $userRequest->status = UserRequestStatus::Error;
        }
    }

    private function joinTeam(UserRequest $userRequest)
    {
        $team = $userRequest->object;
        if (!$team) {
            $userRequest->status = UserRequestStatus::Error;
            return false;
        }

        try {
            $team->users()->attach(
                $userRequest->user->id, ['role' => 'collaborator']
            );
        } catch (QueryException) {
            $userRequest->status = UserRequestStatus::Error;
        }
    }

    private function createWorkspace(UserRequest $userRequest)
    {

        $subnamespace = SubNamespace::where([
            ['name', $userRequest->data['name']],
            ['tenant_id', $userRequest->object->id]
        ])->first();

        if ($subnamespace) {
            $userRequest->status = UserRequestStatus::Error;
            $userRequest->message = 'Already exists';
            return;
        }

        try {
            $subnamespace = SubNamespace::create([
                'label' => $userRequest->data['label'],
                'name' => $userRequest->data['name'],
                'namespace' => '<generating>',
                'tenant_id' => $userRequest->object->id,
                'parent_id' => null // TODO
//            'resourceallocation' => [
//                'cpu' => "4000m",
//                'memory' => "4Gi",
//            ],
//            'inheritance' => [
//                'rbac' => true,
//                'networkpolicy' => false,
//                'limitrange' => true,
//                'configmap' => true,
//                'sync' => false,
//                //                    'sliceclaim' => 'lab-exercises',
//                'expiry' => "2023-09-01T09:00:00Z"
//            ],
            ]);

            $subnamespace->users()->attach(
                $userRequest->user->id, ['role' => 'owner']
            );

        } catch (QueryException) {
            $userRequest->status = UserRequestStatus::Error;
        }
    }

    private function joinWorkspace(UserRequest $userRequest)
    {
        $workspace = $userRequest->object;
        if (!$workspace) {
            $userRequest->status = UserRequestStatus::Error;
            return false;
        }

        try {
            $workspace->users()->attach(
                $userRequest->user->id, ['role' => 'collaborator']
            );
        } catch (QueryException) {
            $userRequest->status = UserRequestStatus::Error;
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
        if ($userRequest->status == UserRequestStatus::Denied) {
            Log::info('[Console] Request denied: '. $userRequest->type->name . ' ID: '. $userRequest->id);

            /**
             * Notify the user that createtd the request
             */
            $userRequest->user->notify(new UserRequestDenied($userRequest));
        }

        if ($userRequest->status == UserRequestStatus::Error) {
            Log::error('[Console] Request error: '. $userRequest->type->name . ' ID: '. $userRequest->id);

            /**
             * Notify the user that createtd the request
             */
            $userRequest->user->notify(new UserRequestError($userRequest));
        }

        if ($userRequest->status == UserRequestStatus::Approved) {
            Log::info('[Console] Request approved: '. $userRequest->type->name . ' ID: '. $userRequest->id);

            /**
             * Notify the user that created the request
             */
            $userRequest->user->notify(new UserRequestApproved($userRequest));
        }
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
