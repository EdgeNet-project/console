<?php

namespace App\Http\Controllers\Api;

use App\CRDs\RoleRequest;
use App\CRDs\TenantRequest;
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

        $user = auth()->user();

        $tenantName = Str::slug($data['shortname']);

        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

        $tenantRequest = new TenantRequest($cluster, [
            'metadata' => [
                'name' => $tenantName
            ],
            'spec' => [
                'fullname' => $data['fullname'],
                'shortname' => $data['shortname'],
                'url' => $data['url'],
//                'address' => [
//
//                ],
                'contact' => [
//                    'firstname' => $user->firstname,
//                    'lastname' => $user->lastname,
                    'email' => $user->email,
                ]
            ],
        ]);

        try {
            $tenantRequest
//                ->setName($data['namespace'] . '-' . Str::lower(Str::random(4)))
//                ->setNamespace($data['namespace'])
                ->create();
        } catch (PhpK8sException $e) {

            // TODO: better logging
            Log::error(print_r($e->getMessage(), true));
            // status object
            /*
             [
                  'kind' => 'Status',
                  'apiVersion' => 'v1',
                  'metadata' =>
                  array (
                  ),
                  'status' => 'Failure',
                  'message' => 'tenantrequests.registration.edgenet.io "csnet" already exists',
                  'reason' => 'AlreadyExists',
                  'details' =>
                  array (
                    'name' => 'csnet',
                    'group' => 'registration.edgenet.io',
                    'kind' => 'tenantrequests',
                  ),
                  'code' => 409,
                ]
             */
            Log::info($e->getPayload());

            return response()->json($e->getPayload(), $e->getCode());
        }

        $tenant = new Tenant($data);
        $tenant->name = $tenantName;
        $tenant->save();
        $tenant->users()
            ->attach(auth()->user(), ['role' => 'owner']);


        return response()->json([
            'message' => 'tenant request created'
        ]);
    }
}
