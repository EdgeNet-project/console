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

class CreateTeam implements ShouldQueue
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
            ->log('syncing team with EdgeNet API');

        $crd = new TenantCRD(K8s::getCluster(), [
            'metadata' => [
                'name' => $this->tenant->name,
            ],
            'spec' => [
                'name' => $this->tenant->name,
                'fullname' => $this->tenant->fullname,
                'shortname' => $this->tenant->shortname,
                'url' => $this->tenant->url,
//                'address' => $this->tenant->address,
//                'contact' => $this->tenant->contact,
            ]
        ]);

        try {
            $crd->create();
        } catch (PhpK8sException $e) {
            Log::error('[EdgeNet] ' . $e->getMessage());
            Log::error('[EdgeNet] ', ['payload' => $e->getPayload()]);

            activity('tenants')
                ->performedOn($this->tenant)
                //->causedBy($user)
                ->withProperties(['severity' => 'error', 'message' => $e->getMessage()])
                ->log('Error syncing tenant with EdgeNet API');
        }
    }
}
