<?php

namespace App\Services;

use Illuminate\Container\Container;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\KubernetesCluster;

class EdgenetAdmin {

    protected $cluster;

    public function __construct(Container $container = null)
    {

        $this->cluster = K8s::getCluster();

//        $this->cluster->withoutSslChecks();

//        $this->cluster->withToken(request()->bearerToken());
    }

    public function getCluster()
    {
        return $this->cluster;
    }
}