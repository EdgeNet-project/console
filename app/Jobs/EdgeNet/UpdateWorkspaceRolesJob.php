<?php

namespace App\Jobs\EdgeNet;

use App\Model\SubNamespace;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Services\EdgenetAdmin;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use RenokiCo\PhpK8s\K8s;
use RenokiCo\PhpK8s\Kinds\K8sConfigMap;
use RenokiCo\PhpK8s\Kinds\K8sDeployment;
use RenokiCo\PhpK8s\Kinds\K8sPod;
use RenokiCo\PhpK8s\Kinds\K8sSecret;
use RenokiCo\PhpK8s\Kinds\K8sStatefulSet;

class UpdateWorkspaceRolesJob implements ShouldQueue
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

        Log::info('[EdgeNet] updating workspace roles: '. $this->workspace->tenant->name . ' - ' . $this->workspace->name);

        activity('workspaces')
            ->performedOn($this->workspace)
            ->withProperties(['severity' => 'info'])
            ->log('Updating workspace roles');

        $cluster = $edgenetAdmin->getCluster();


        try {

            // core api group
            $ruleCore = K8s::rule()
                ->core()
                ->addResources([
                    K8sPod::class,
                    K8sPod::class . '/log',
                    K8sPod::class . '/exec',
                    K8sConfigMap::class,
                    K8sSecret::class,
                ])
                ->addVerbs(['get', 'list', 'watch', 'create', 'update', 'delete']);

            // app api group
            $ruleApp = K8s::rule()
                ->addApiGroup("app")
                ->addResources([
                    K8sDeployment::class,
                    K8sStatefulSet::class
                ])
                ->addVerbs(['get', 'list', 'watch', 'create', 'update', 'delete']);
            
            // A collaborator can work within the namespace of the workspace
            $role = $cluster
                ->role()
                ->setName($this->workspace->tenant->name . ':' . $this->workspace->name . ':collaborator')
                ->setNamespace($this->workspace->namespace)
                ->addRules([$ruleCore, $ruleApp])
                ->setLabels([
                    'team' => $this->workspace->tenant->name,
                    'workspace' => $this->workspace->name
                ])
                ->createOrUpdate();


//        $subject = K8s::subject()
//            ->setApiGroup('rbac.authorization.k8s.io')
//            ->setKind('User')
//            ->setName($user->email);

            $subject = K8s::subject()
                ->setApiGroup('rbac.authorization.k8s.io')
                ->setKind('Group')
                ->setName($this->workspace->tenant->name . ':' . $this->workspace->name);



            $rb = $cluster
                ->roleBinding()
                ->setName($this->workspace->tenant->name . ':' . $this->workspace->name . ':collaborator')
                ->setNamespace($this->workspace->namespace)
                ->setRole($role, 'rbac.authorization.k8s.io')
                ->setSubjects([$subject])
                ->createOrUpdate();

//            $crb = $this->cluster
//                ->clusterRoleBinding()
//                ->setName('user-binding')
//                ->setRole($role, 'rbac.authorization.k8s.io')
//                ->setSubjects([$subject])
//                ->create();

        } catch (PhpK8sException $e) {
            $payload = $e->getPayload();
            Log::error('[EdgeNet] ' . $e->getMessage());
            Log::error('[EdgeNet] ' . $payload['message']);
            Log::error('[EdgeNet] ', ['payload' => $payload]);

            activity('workspaces')
                ->performedOn($this->workspace)
                ->withProperties([
                    'severity' => 'error',
                    'message' => $e->getMessage(),
                    'payload' => $e->getPayload(),
                ])
                ->log('updating workspace role bindings - error syncing tenant with EdgeNet API');
        }

    }
}
