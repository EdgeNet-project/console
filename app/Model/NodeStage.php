<?php

namespace App\Model;

enum NodeStage: string
{


    /**
     * Node has checked in and is waiting to be activated
     */
    case CHECKIN = 'checkin';

    /**
     * Networking
     */
    case NETWORKING = 'networking';

    /**
     * Provisioning (software installation)
     */
    case PROVISIONING = 'provisioning';

    /**
     * Node is Running
     */
    case RUNNING = 'running';


    public static function validateStatus(string $status): bool
    {
        return self::tryFrom($status) !== null;
    }
}