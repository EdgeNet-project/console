<?php

namespace App\Services;

use Illuminate\Container\Container;
use RenokiCo\PhpK8s\KubernetesCluster;

class Edgenet {

    protected $cluster;

    public function __construct(Container $container = null)
    {
        $this->cluster = KubernetesCluster::fromUrl(config('edgenet.cluster.api'))
            ->withCaCertificate(base_path('.kube/ca.crt'))
            ->withToken(request()->bearerToken());
    }

    public function getCluster()
    {
        return $this->cluster;
    }
}