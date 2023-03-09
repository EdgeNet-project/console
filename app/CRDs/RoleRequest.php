<?php

namespace App\CRDs;

use RenokiCo\PhpK8s\Contracts\InteractsWithK8sCluster;
use RenokiCo\PhpK8s\Kinds\K8sResource;
use RenokiCo\PhpK8s\Traits\Resource\HasStatus;

class RoleRequest extends K8sResource implements InteractsWithK8sCluster
{
    use HasStatus;

    /**
     * The resource Kind parameter.
     *
     * @var null|string
     */
    protected static $kind = 'RoleRequest';

    /**
     * The default version for the resource.
     *
     * @var string
     */
    protected static $defaultVersion = 'registration.edgenet.io/v1alpha1';

    /**
     * Wether the resource has a namespace.
     *
     * @var bool
     */
    protected static $namespaceable = true;


    public function isApproved()
    {
        return $this->getAttribute('spec.approved');
    }

    /* status */
    public function getExpiry()
    {
        return \Carbon\Carbon::parse($this->getStatus('expiry'));
    }
    public function getMessage()
    {
        return $this->getStatus('message');
    }
    public function isNotified()
    {
        return $this->getStatus('notified');
    }
    public function getState()
    {
        return $this->getStatus('state');
    }

}