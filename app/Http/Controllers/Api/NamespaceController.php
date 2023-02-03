<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
    ->roleBinding()
    ->setNamespace('cslash')
    ->all();

        return response()->json($namespaces);
    }
}
