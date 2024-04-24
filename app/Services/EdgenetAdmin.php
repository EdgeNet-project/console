<?php

namespace App\Services;

use Illuminate\Container\Container;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\KubernetesCluster;

class EdgenetAdmin {

    protected $cluster;

    public function __construct(Container $container = null)
    {

//        dd(K8s::connection('kubeconfig')->getNodes());
        $this->cluster = K8s::getCluster();
//        $this->cluster  = KubernetesCluster::fromKubeConfigYamlFile(
//            '/Users/moray/.kube/edgenet_admin.cfg',
//            'kubernetes-admin@kubernetes');
//        $this->cluster->withoutSslChecks();

//        $this->cluster->withToken(request()->bearerToken());
    }

    public function getCluster()
    {
        return $this->cluster;
    }

}