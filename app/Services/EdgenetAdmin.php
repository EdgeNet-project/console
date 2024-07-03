<?php

namespace App\Services;

use Illuminate\Container\Container;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;

class EdgenetAdmin {

    protected $cluster;

    public function __construct(Container $container = null)
    {
        $this->cluster = K8s::getCluster()
            ->withCaCertificate(config('edgenet.cluster.ca'));
    }

    public function getCluster()
    {
        return $this->cluster;
    }

}