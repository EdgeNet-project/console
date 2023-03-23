<?php

namespace App\Http\Controllers\Api;

use App\CRDs\RoleRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use RenokiCo\PhpK8s\KubernetesCluster;

class RoleRequestController extends Controller
{

    public function list(Request $request, $namespace = null)
    {

        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

        if ($namespace) {

            $rolerequests = $cluster
                ->roleRequest()
                ->whereNamespace('cslash')
                ->all();
        } else {
            $rolerequests = $cluster
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

    public function create(Request $request)
    {
        $data = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
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
