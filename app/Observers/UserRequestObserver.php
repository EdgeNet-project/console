<?php

namespace App\Observers;

use App\Facades\Edgenet;
use App\Model\UserRequest;
use App\CRDs\RoleRequest as RoleRequestCRD;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;

class UserRequestObserver
{

    /**
     * Handle the UserRequest "created" event.
     *
     * @param  \App\Model\UserRequest  $userRequest
     *
     * @return void
     */
    public function creating(UserRequest $userRequest)
    {
        $roleRequest = new RoleRequestCRD(Edgenet::getCluster(), [
            'metadata' => [
                'name' => $userRequest->name,
                'namespace' => $userRequest->namespace,
            ],
            'spec' => [
                'email' => $userRequest->user->email,
                'roleref' => [
                    'kind' => 'ClusterRole',
                    'name' => 'edgenet:tenant-collaborator'
                ]
            ],
        ]);

        Log::info($roleRequest->toArray());

        try {
            $roleRequest
                ->create();
        } catch (PhpK8sException $e) {

            Log::error($e->getMessage());
            Log::info($e->getPayload());

            throw new \Exception('API error, role creation');
        }
    }

    /**
     * Handle the UserRequest "created" event.
     *
     * @param  \App\Model\UserRequest  $userRequest
     * @return void
     */
    public function created(UserRequest $userRequest)
    {
        //
    }

    /**
     * Handle the UserRequest "updated" event.
     *
     * @param  \App\Model\UserRequest  $userRequest
     * @return void
     */
    public function updated(UserRequest $userRequest)
    {
        //
    }

    /**
     * Handle the UserRequest "deleted" event.
     *
     * @param  \App\Model\UserRequest  $userRequest
     * @return void
     */
    public function deleted(UserRequest $userRequest)
    {
        //
    }

    /**
     * Handle the UserRequest "restored" event.
     *
     * @param  \App\Model\UserRequest  $userRequest
     * @return void
     */
    public function restored(UserRequest $userRequest)
    {
        //
    }

    /**
     * Handle the UserRequest "force deleted" event.
     *
     * @param  \App\Model\UserRequest  $userRequest
     * @return void
     */
    public function forceDeleted(UserRequest $userRequest)
    {
        //
    }
}
