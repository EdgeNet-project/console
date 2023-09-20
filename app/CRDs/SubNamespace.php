<?php

namespace App\CRDs;

use RenokiCo\PhpK8s\Contracts\InteractsWithK8sCluster;
use RenokiCo\PhpK8s\Kinds\K8sResource;
use RenokiCo\PhpK8s\Traits\Resource\HasStatus;

class SubNamespace extends K8sResource implements InteractsWithK8sCluster
{
    use HasStatus;

    /**
     * The resource Kind parameter.
     *
     * @var null|string
     */
    protected static $kind = 'SubNamespace';

    /**
     * The default version for the resource.
     *
     * @var string
     */
    protected static $defaultVersion = 'core.edgenet.io/v1alpha1';

    /**
     * Wether the resource has a namespace.
     *
     * @var bool
     */
    protected static $namespaceable = true;

    public function getChildNamespace()
    {
        return $this->getAttribute('status.child');
    }

    public function isEnabled()
    {
        return $this->getAttribute('spec.enabled');
    }
}