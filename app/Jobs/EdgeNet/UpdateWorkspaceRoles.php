<?php

namespace App\Jobs\EdgeNet;

use App\Model\SubNamespace;
use App\Model\SubNamespaceUser;
use App\Model\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use RenokiCo\PhpK8s\K8s;
use RenokiCo\PhpK8s\Kinds\K8sConfigMap;
use RenokiCo\PhpK8s\Kinds\K8sDeployment;
use RenokiCo\PhpK8s\Kinds\K8sPod;

class UpdateWorkspaceRoles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $workspace;

    protected $cluster;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(SubNamespace $workspace)
    {
        $this->workspace = $workspace;
        $this->cluster = K8s::getCluster();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

//        try {
//            $user = User::find($this->subNamespaceUser->user_id);
//        } catch (\Exception $e) {
//            Log::error($e->getMessage());
//        }

//        try {
//            $workspace = SubNamespace::find($this->subNamespaceUser->sub_namespace_id);
//        } catch (\Exception $e) {
//            Log::error($e->getMessage());
//        }

        Log::info('[EdgeNet] Updating workspace roles - '. $this->workspace->name);

        activity('workspaces')
            ->performedOn($this->workspace)
            ->withProperties(['severity' => 'info'])
            ->log('Updating workspace roles');

        $rule = K8s::rule()
            ->core()
            ->addResources([
                K8sPod::class,
                K8sConfigMap::class,
                K8sDeployment::class
            ])
            //->addResourceNames(['pod-name', 'configmap-name'])
            ->addVerbs(['get', 'list', 'watch', 'create', 'update', 'delete']);

        // A collaborator can work within the namespace of the workspace
        $role = $this->cluster
            ->role()
            ->setName($this->workspace->tenant->name . ':' . $this->workspace->name . ':collaborator')
            ->setNamespace($this->workspace->name)
            ->addRules([$rule])
            ->setLabels([
                'team' => $this->workspace->tenant->name,
                'workspace' => $this->workspace->name
            ])
            ->create();

//        $subject = K8s::subject()
//            ->setApiGroup('rbac.authorization.k8s.io')
//            ->setKind('User')
//            ->setName($user->email);

        $subject = K8s::subject()
            ->setApiGroup('rbac.authorization.k8s.io')
            ->setKind('Group')
            ->setName($this->workspace->tenant->name . ':' . $this->workspace->name);

        try {

            $rb = $this->cluster
                ->roleBinding()
                ->setName($this->workspace->tenant->name . ':' . $this->workspace->name . ':collaborator')
                ->setNamespace($this->workspace->name)
                ->setRole($role, 'rbac.authorization.k8s.io')
                ->setSubjects([$subject])
                ->create();

//            $crb = $this->cluster
//                ->clusterRoleBinding()
//                ->setName('user-binding')
//                ->setRole($role, 'rbac.authorization.k8s.io')
//                ->setSubjects([$subject])
//                ->create();

        } catch (PhpK8sException $e) {
            Log::error('[EdgeNet] Updating workspace roles - ' . $e->getMessage());
            Log::error('[EdgeNet] Updating workspace roles - ', ['payload' => $e->getPayload()]);

            activity('workspaces')
                ->performedOn($this->workspace)
                ->withProperties(['severity' => 'error', 'message' => $e->getMessage()])
                ->log('Updating workspace roles - Error syncing tenant with EdgeNet API');
        }
    }
}
