<?php

namespace App\Services;

use Illuminate\Container\Container;
use RenokiCo\PhpK8s\KubernetesCluster;

class Edgenet {

    protected $cluster;

    public function __construct(Container $container = null)
    {

        $this->cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.url'));

        $this->cluster->withoutSslChecks();

        $this->cluster->withToken(request()->bearerToken());
    }

    public function getCluster()
    {
        return $this->cluster;
    }
}