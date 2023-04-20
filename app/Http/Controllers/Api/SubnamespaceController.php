<?php

namespace App\Http\Controllers\Api;

use App\CRDs\RoleRequest;
use App\CRDs\SubNamespace;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use RenokiCo\PhpK8s\KubernetesCluster;

/*
- apiVersion: core.edgenet.io/v1alpha1
  kind: SubNamespace
  metadata:
    creationTimestamp: "2022-10-20T13:34:05Z"
    generation: 4
    name: pod-migration
    namespace: lip6-lab
    resourceVersion: "1149540086"
    uid: e78cdf7d-03fa-43ea-b567-2161f9d732a2
  spec:
    workspace:
      inheritance:
        configmap: false
        limitrange: false
        networkpolicy: false
        rbac: true
        secret: false
        serviceaccount: false
      resourceallocation:
        cpu: 6000m
        memory: 8Gi
      scope: local
      sync: false
  status:
    message: Subsidiary namespace formed successfully
    state: Established
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""

 */
class SubnamespaceController extends Controller
{
    public function list()
    {

    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'namespace' => ['required', 'string', 'max:255'],
        ]);

        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

        $subnamespace = new SubNamespace($cluster, [
            'metadata' => [
                'name' => $data['name'],
                'namespace' => $data['namespace'],
            ],
            'spec' => [
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
                    'sliceclaim' => 'lab-exercises',
                    'expiry' => "2023-09-01T09:00:00Z"
                ],
            ]
        ]);

        Log::info($subnamespace->toArray());

        try {
            $subnamespace
                ->create();
        } catch (PhpK8sException $e) {

            Log::error($e->getMessage());
            Log::info($e->getPayload());

            return response()->json([
                'errors' => [
                    'name' => 'Name already exists or not authorized',
                    'message' => $e->getMessage()
                ]
            ], 400);
        }

        return response()->json([
            'message' => 'subnamespace created'
        ]);
    }

    public function join(Request $request)
    {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'namespace' => ['required', 'string', 'max:255'],
        ]);

        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

        $roleRequest = new RoleRequest($cluster, [
            'spec' => [
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'roleref' => [
                    'kind' => 'ClusterRole',
                    'name' => 'edgenet:tenant-collaborator'
                ]
            ],
        ]);

        try {
            $roleRequest
                ->setName($data['namespace'] . '-' . Str::lower(Str::random(4)))
                ->setNamespace($data['namespace'])
                ->create();
        } catch (PhpK8sException $e) {

            Log::error($e->getMessage());
            Log::info($e->getPayload());

            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }

        return response()->json([
            'message' => 'role request created'
        ]);
    }
}
