<?php

namespace App\Http\Controllers\Api;

use App\Model\SubNamespace as SubNamespaceModel;
use App\CRDs\RoleRequest;
use App\CRDs\SubNamespace;
use App\Http\Controllers\Controller;
use App\Services\Edgenet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;

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


====
ROLE

[root@edgenet ~]# kubectl get rolebindings -n cslashwp-2fd00611 -o yaml
apiVersion: v1
items:
- apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    creationTimestamp: "2023-04-21T14:02:46Z"
    labels:
      edge-net.io/generated: "true"
    name: edgenet:tenant-collaborator
    namespace: cslashwp-2fd00611
    resourceVersion: "1164437661"
    uid: a2d5fb75-13d8-4c5f-b87b-62562359fa16
  roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: edgenet:tenant-collaborator
  subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: cscognamiglio@gmail.com
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: ciro.scognamiglio@cslash.com
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: berat.senel@lip6.fr
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: root@cslash.com

 */
class SubnamespaceController extends Controller
{
    public function list(Request $request, $namespace = null, $name = null)
    {
        if ($namespace && $name) {
            return response()->json(
                SubNamespaceModel::where([
                    ['namespace', $namespace], ['name', $name]
                ])->first());
        }

        if ($namespace) {
            return response()->json(
                SubNamespaceModel::where([
                    ['namespace', $namespace]
                ])->get());
        }

        return response()->json(SubNamespaceModel::all());
    }

    public function create(Request $request, Edgenet $edgenet)
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'namespace' => ['required', 'string', 'max:255'],
        ]);


        $subnamespace = new SubNamespace($edgenet->getCluster(), [
            'metadata' => [
                'name' => $data['name'],
                'namespace' => $data['namespace'],
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
                        'expiry' => "2023-09-01T09:00:00Z"
                    ],
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

    public function join(Request $request, Edgenet $edgenet)
    {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'namespace' => ['required', 'string', 'max:255'],
        ]);

        $roleRequest = new RoleRequest($edgenet->getCluster(), [
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
