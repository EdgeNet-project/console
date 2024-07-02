<?php

namespace App\CRDs;

use RenokiCo\PhpK8s\Contracts\InteractsWithK8sCluster;
use RenokiCo\PhpK8s\Kinds\K8sResource;
use RenokiCo\PhpK8s\Traits\Resource\HasStatus;

class Tenant extends K8sResource implements InteractsWithK8sCluster
{
    use HasStatus;

    /**
     * The resource Kind parameter.
     *
     * @var null|string
     */
    protected static $kind = 'Tenant';

    /**
     * The default version for the resource.
     *
     * @var string
     */
    protected static $defaultVersion = 'multitenancy.edge-net.io/v1';

    /**
     * Wether the resource has a namespace.
     *
     * @var bool
     */
    protected static $namespaceable = false;

    public function getFullname()
    {
        return $this->getAttribute('spec.fullname');
    }

    public function getDescription()
    {
        return $this->getAttribute('spec.description');
    }

    public function getUrl()
    {
        return $this->getAttribute('spec.url');
    }
    public function isEnabled()
    {
        return $this->getAttribute('spec.enabled');
    }
}