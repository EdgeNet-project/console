<?php

namespace App\Observers;

use App\Notifications\UserRequestApproved;
use App\Model\Tenant;

class TenantObserver
{
    /**
     * Handle the Tenant "created" event.
     *
     * @param  \App\Model\Tenant  $tenant
     * @return void
     */
    public function created(Tenant $tenant)
    {

//        if (!in_array($userRequest->type, [
//            UserRequest::TENANT, UserRequest::ROLE, UserRequest::NODE,
//        ])) {
//            throw new \Exception('Type not correct');
//        }
//        $roleRequest = new RoleRequestCRD(Edgenet::getCluster(), [
//            'metadata' => [
//                'name' => $userRequest->name,
//                'namespace' => $userRequest->namespace,
//            ],
//            'spec' => [
//                'email' => $userRequest->user->email,
//                'roleref' => [
//                    'kind' => 'ClusterRole',
//                    'name' => 'edgenet:tenant-collaborator'
//                ]
//            ],
//        ]);

//        Log::info($roleRequest->toArray());

//        try {
//            $roleRequest
//                ->create();
//        } catch (PhpK8sException $e) {
//
//            Log::error($e->getMessage());
//            Log::info($e->getPayload());
//
//            throw new \Exception('API error, role creation');
//        }
    }

    /**
     * Handle the Tenant "updated" event.
     *
     * @param  \App\Model\Tenant  $tenant
     * @return void
     */
    public function updated(Tenant $tenant)
    {
//        $userRequest->user->notify(new UserRequestApproved($userRequest));
//
//        // check if approved or denied
//        switch ($userRequest->type) {
//            case UserRequest::TENANT:
//
////                if ($userRequest->status == UserRequest::APPROVED) {
////                    $tenant = new Tenant($userRequest->data);
////                    $tenant->name = Str::slug($userRequest->data['shortname'])
////                    $tenant->save();
////                    $tenant->users()
////                        ->attach(auth()->user(), ['role' => 'owner']);
////                }
//
//                break;
//            case UserRequest::ROLE:
//                break;
//            case UserRequest::NODE:
//                break;
//        }
    }

    /**
     * Handle the Tenant "deleted" event.
     *
     * @param  \App\Model\Tenant  $tenant
     * @return void
     */
    public function deleted(Tenant $tenant)
    {
        //
    }

    /**
     * Handle the Tenant "restored" event.
     *
     * @param  \App\Model\Tenant  $tenant
     * @return void
     */
    public function restored(Tenant $tenant)
    {
        //
    }

    /**
     * Handle the Tenant "force deleted" event.
     *
     * @param  \App\Model\Tenant  $tenant
     * @return void
     */
    public function forceDeleted(Tenant $tenant)
    {
        //
    }
}
