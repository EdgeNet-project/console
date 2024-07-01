<?php

namespace App\Jobs\EdgeNet;

use App\Model\SubNamespace;
use App\CRDs\SubNamespace as SubNamespaceCRD;

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
    public function handle()
    {
        Log::info('[EdgeNet] Creating workspace '. $this->workspace->name);

        activity('workspaces')
            ->performedOn($this->workspace)
            //->causedBy($user)
            ->withProperties(['severity' => 'info'])
            ->log('syncing workspace with EdgeNet API');

        $crd = new SubNamespaceCRD(K8s::getCluster(), [
            'metadata' => [
                'name' => $this->workspace->name,
                'namespace' => $this->workspace->tenant->name,
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
                        // 'sliceclaim' => 'lab-exercises',
                        // 'expiry' => "2023-09-01T09:00:00Z"
                    ],
                ],
            ]
        ]);

        try {
            $crd->create();
        } catch (PhpK8sException $e) {
            Log::error('[EdgeNet] ' . $e->getMessage());
            Log::error('[EdgeNet] ', ['payload' => $e->getPayload()]);

            activity('workspaces')
                ->performedOn($this->workspace)
                //->causedBy($user)
                ->withProperties(['severity' => 'error', 'message' => $e->getMessage()])
                ->log('Error syncing workspace with EdgeNet API');
        }
    }
}
