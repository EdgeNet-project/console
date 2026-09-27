<?php

namespace App\Model;

enum NodeStatus: string
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
     * Node is Ready to be activated
     */
    case READY = 'ready';




    case ONLINE = 'online';

    case UNREACHABLE = 'unreachable';


    case ERROR = 'error';

    case WARNING = 'warning';

    case UNKNOWN = 'unknown';

    case DISABLED = 'disabled';

    case DEBUG = 'debug';

    public static function validateStatus(string $status): bool
    {
        return self::tryFrom($status) !== null;
    }
}