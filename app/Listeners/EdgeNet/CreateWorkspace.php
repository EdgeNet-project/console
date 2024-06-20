<?php

namespace App\Listeners\EdgeNet;

use App\CRDs\SubNamespace as SubNamespaceCRD;
use App\Events\SubNamespaceCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;

class CreateWorkspace
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
     * @param  object  $event
     * @return void
     */
    public function handle(SubNamespaceCreated $event)
    {
        Log::info('[Edgenet] Attemting to create subnamespace '. $event->subNamespace->name);

        $crd = new SubNamespaceCRD(K8s::getCluster(), [
            'metadata' => [
                'name' => $event->subNamespace->name,
                'namespace' => $event->subNamespace->namespace,
            ],
            'spec' => [
                'workspace' => [
                    'resourceallocation' => [
                        'cpu' => "4000m",
                        'memory' => "4Gi",
                    ],
                    'inheritance' => [
                        'rbac' => true,
                        'networkpolicy' => false,
                        'limitrange' => true,
                        'configmap' => true,
                        'sync' => false,
                        //                    'sliceclaim' => 'lab-exercises',
//                        'expiry' => "2023-09-01T09:00:00Z"
                    ],
                ],
            ]
        ]);

        try {
            $crd->create();
        } catch (PhpK8sException $e) {

            Log::error($e->getMessage());
            Log::info($e->getPayload());
        }
    }
}
