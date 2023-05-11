<?php

namespace App\Http\Controllers\Api;

use App\CRDs\RoleRequest;
use App\Http\Controllers\Controller;
use App\Model\TenantUser;
use App\Services\Edgenet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use RenokiCo\PhpK8s\KubernetesCluster;

class RoleRequestController extends Controller
{

    public function list(Request $request, Edgenet $edgenet, $namespace = null)
    {

        if ($namespace) {

            $rolerequests = $edgenet->getCluster()
                ->roleRequest()
                ->whereNamespace($namespace)
                ->all();
        } else {
            $rolerequests = $edgenet->getCluster()
                ->roleRequest()
                ->allNamespaces();
        }

//        $output = [];
//        foreach ($rolerequests as $r) {
////            $contact = $t->getContact();
////            $address = $t->getAddress();
//
//            $output[] = [
//                'name' => $r->getName(),
////                'fullname' => $t->getFullname(),
////                'shortname' => $t->getShortname(),
////                'url' => $t->getUrl(),
////                'address' => $address,
////                'contact' => $contact,
//
//                'enabled' => $r->isEnabled(),
//
//
//                'expiry' => $r->getStatus('expiry'),
//                'state' => $r->getStatus('state'),
//                'message' => $r->getStatus('message'),
//
//            ];
//
//        }

        return response()->json($rolerequests);
    }

    public function create(Request $request, Edgenet $edgenet)
    {
        $data = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'namespace' => ['required', 'string', 'max:255'],
        ]);

        $roleRequest = new RoleRequest($edgenet->getCluster(), [
            'metadata' => [
                'name' => $data['namespace'] . '-' . Str::lower(Str::random(4)),
                'namespace' => $data['namespace'],
            ],
            'spec' => [
//                'firstname' => $data['firstname'],
//                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'roleref' => [
                    'kind' => 'ClusterRole',
                    'name' => 'edgenet:tenant-collaborator'
                ]
            ],
        ]);

        Log::info($roleRequest->toArray());

        try {
            $roleRequest
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

    public function update(Request $request, Edgenet $edgenet, $namespace, $name)
    {
        $data = $request->validate([
            'approved' => ['required', 'boolean'],
        ]);


        try {

            $roleRequest = $edgenet->getCluster()
                ->roleRequest()
                ->whereNamespace($namespace)
                ->getByName($name);

        } catch (KubernetesAPIException $e) {

            return response()->json([
                'message' => $e->getMessage()
            ], 400);

        }

        try {
            $roleRequest->setAttribute('spec.approved', $data['approved']);
            $roleRequest->update();
        } catch (KubernetesAPIException $e) {

            return response()->json([
                'message' => $e->getMessage()
            ], 400);

        }

        $requestTenant = Tenant::where('name', $roleRequest->getAttribute('metadata.namespace'));
        $requestUser = User::where('email', $roleRequest->getAttribute('spec.email'));

        $roles = [
            'collaborator'
        ];

        TenantUser::updateOrCreate(
            ['user_id' => $requestUser->id, 'tenant_id' => $requestTenant->id],
            ['roles' => $roles]
        );

        return response()->json([
            'message' => 'ok'
        ]);


    }
}
