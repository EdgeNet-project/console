<?php

namespace App\Jobs\EdgeNet;

use App\Model\SubNamespace;
use App\CRDs\SubNamespace as SubNamespaceCRD;

use App\Services\EdgenetAdmin;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;

class CreateWorkspaceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $workspace;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(SubNamespace $workspace)
    {
        $this->workspace = $workspace;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {
        Log::info('[EdgeNet] Creating workspace '. $this->workspace->name);

        activity('workspaces')
            ->performedOn($this->workspace)
            //->causedBy($user)
            ->withProperties(['severity' => 'info'])
            ->log('Syncing workspace with EdgeNet API');

        $crd = new SubNamespaceCRD($edgenetAdmin->getCluster(), [
            'metadata' => [
                'name' => $this->workspace->name,
                'namespace' => $this->workspace->tenant->name,
            ],
            'spec' => [
//                'workspace' => [
//                    'resourceallocation' => [
//                        'cpu' => "4000m",
//                        'memory' => "4Gi",
//                    ],
//                    'inheritance' => [
//                        'rbac' => true,
//                        'networkpolicy' => false,
//                        'limitrange' => true,
//                        'configmap' => true,
//                        'sync' => false,
//                    ],
//                    'sync' => false,
//                    'owner' => [
//                        'email' => 'ciro@cslash.com',
//
//                    ]
//                ],
            ]
        ]);

        try {
            $subnamespace = $crd->createOrUpdate();
        } catch (PhpK8sException $e) {
            $payload = $e->getPayload();
            Log::error('[EdgeNet] ' . $e->getMessage());
            Log::error('[EdgeNet] ' . $payload['message']);
            Log::error('[EdgeNet] ', ['payload' => $payload]);

            activity('workspaces')
                ->performedOn($this->workspace)
                //->causedBy($user)
                ->withProperties([
                    'severity' => 'error',
                    'message' => $e->getMessage(),
                    'payload' => $e->getPayload(),
                ])
                ->log('Error syncing workspace with EdgeNet API');
        }

        $subnamespace = $edgenetAdmin->getCluster()
            ->subNamespace()
            ->setName('this-is-a-wp')
            ->setNamespace('ttn')
            ->get();

        // update the namespace on the workspace model
        $this->workspace->namespace = $this->workspace->name . '-' . $subnamespace->getResourceUid();
        $this->workspace->save();

        Log::info('[EdgeNet] updating workspace namespace to '. $this->workspace->namespace);
    }
}
