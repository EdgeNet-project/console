<?php

namespace App\Services;

use Illuminate\Container\Container;
use RenokiCo\PhpK8s\KubernetesCluster;

class EdgenetAdmin {

    protected $cluster;

    public function __construct(Container $container = null)
    {
        $this->cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.api'))
            ->withCaCertificate(config('edgenet.cluster.ca'))
            ->withPrivateKey(config('edgenet.cluster.client.key'))
            ->withCertificate(config('edgenet.cluster.client.cert'));
    }

    public function getCluster()
    {
        return $this->cluster;
    }

}