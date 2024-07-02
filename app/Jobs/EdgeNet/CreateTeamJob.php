<?php

namespace App\Jobs\EdgeNet;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use App\CRDs\Tenant as TenantCRD;
use App\Model\Tenant;

class CreateTeamJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $team;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Tenant $team)
    {
        $this->team = $team;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info('[EdgeNet] Creating team '. $this->team->name);

        activity('teams')
            ->performedOn($this->team)
            //->causedBy($user)
            ->withProperties(['severity' => 'info'])
            ->log('Syncing team with EdgeNet API');

        $crd = new TenantCRD(K8s::getCluster(), [
            'metadata' => [
                'name' => $this->team->name,
            ],
            'spec' => [
                // Full name of the tenant.
                'fullName' => $this->team->fullname,

                // Website of the tenant
                'url' => $this->team->url ?? null,

                // This is the admin username for the tenant.
                // A role binding will be created for user with this username.
                'admin' =>  $this->team->contact_email,

                // Description provides additional information about the tenant
                'description' => '',

                // Whether cluster-level network policies will be applied
                // to tenant namespaces for security purposes.
                'clusterNetworkPolicy' => false,

                // This represents the initial resource allocation for the tenant.
                // If not specified, the tenant resource quota will not be created.
                'initialRequest' => [

                ]
            ]
        ]);

        try {
            $crd->createOrUpdate();
        } catch (PhpK8sException $e) {
            $payload = $e->getPayload();
            Log::error('[EdgeNet] ' . $e->getMessage());
            Log::error('[EdgeNet] ' . $payload['message']);
            Log::error('[EdgeNet] ', ['payload' => $payload]);

            activity('teams')
                ->performedOn($this->team)
                //->causedBy($user)
                ->withProperties([
                    'severity' => 'error',
                    'message' => $e->getMessage(),
                    'payload' => $e->getPayload(),
                ])
                ->log('Error syncing team with EdgeNet API');
        }
    }
}
