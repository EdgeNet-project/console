<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\KubernetesCluster;

class RoleRequestController extends Controller
{

    public function list(Request $request)
    {

        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

        $rolerequests = $cluster->rolerequest()->all();

        $output = [];
        foreach ($rolerequests as $r) {
//            $contact = $t->getContact();
//            $address = $t->getAddress();

            $output[] = [
                'name' => $r->getName(),
//                'fullname' => $t->getFullname(),
//                'shortname' => $t->getShortname(),
//                'url' => $t->getUrl(),
//                'address' => $address,
//                'contact' => $contact,

                'enabled' => $r->isEnabled(),
                'state' => $r->getStatus('state'),
                'message' => $r->getStatus('message'),

            ];



        }
        return response()->json($rolerequests);
    }
}
