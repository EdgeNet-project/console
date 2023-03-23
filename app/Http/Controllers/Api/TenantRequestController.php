<?php

namespace App\Http\Controllers\Api;

use App\CRDs\RoleRequest;
use App\Http\Controllers\Controller;
use App\Model\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use RenokiCo\PhpK8s\KubernetesCluster;

class TenantRequestController extends Controller
{

    public function list(Request $request, $namespace = null)
    {

        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

        if ($namespace) {

            $rolerequests = $cluster
                ->tenantRequest()
                ->whereNamespace('cslash')
                ->all();
        } else {
            $rolerequests = $cluster
                ->tenantRequest()
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
            'fullname' => ['required', 'string', 'max:255'],
            'shortname' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'affiliation' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:255'],
            'joining_reason' => ['required'],
            'joining_category' => ['required', 'string', 'max:255'],
        ]);

        $tenant = new Tenant($data);
        $tenant->name = Str::slug($data['shortname']);
        $tenant->save();
        $tenant->users()->attach(auth()->user(), ['roles' => ['owner']]);

/*
        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

        $tenantRequest = new TenantRequest($cluster, [
            'spec' => [
                'fullname' => $data['fullname'],
                'shortname' => $data['shortname'],
                'url' => $data['url'],
                'address' => [

                ],
                'contact' => [

                ]
            ],
        ]);

        try {
            $tenantRequest
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

        */
        return response()->json([
            'message' => 'tenant request created'
        ]);
    }
}
