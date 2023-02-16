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

    public function getAddress()
    {
        return $this->getAttribute('spec.address');
    }

    public function getFulladdress()
    {
        return $this->getAttribute('spec.address.street') . ', ' .
            $this->getAttribute('spec.address.zip') . ' ' .
            $this->getAttribute('spec.address.city') . ', ' .
            ($this->hasAttribute('spec.address.region') ? $this->getAttribute('spec.address.region') . '. ' : '' ) .
            $this->getAttribute('spec.address.country');
    }

    public function getContact()
    {
        return $this->getAttribute('spec.contact');
    }

    public function getFullname()
    {
        return $this->getAttribute('spec.fullname');
    }

    public function getShortname()
    {
        return $this->getAttribute('spec.shortname');
    }

    public function getUrl()
    {
        return $this->getAttribute('spec.url');
    }
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