<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\KubernetesCluster;

class NamespaceController extends Controller
{
    public function list(Request $request)
    {
        $cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $cluster->withoutSslChecks();
        $cluster->withToken($request->bearerToken());

//        $namespaces = $cluster
//            ->namespace()
//            ->all();


        $namespaces = $cluster
            ->tenant()
//            ->setNamespace('cslash')
            ->all();

//        $admin = K8s::getCluster();
//        $namespaces = $admin
//            ->roleBinding()
//            ->allNamespaces();

//        $namespaces = $cluster
//            ->
//            ->setNamespace('cslash')
//            ->all();

        return response()->json($namespaces);
    }
}
