<?php

namespace App\Model;

enum NodeStatus: string
{
    /**
     * Node has checked in and is waiting to be activated
     */
    case CHECKIN = 'checkin';

    /**
     * Node has been registered but not yet enabled
     */
    case REGISTERED = 'registered';

    /**
     * Node has been enabled
     */
    case ENABLED = 'enabled';

    case INSTALLING = 'installing';
    case OK = 'ok';
    case WARNING = 'warning';
    case ERROR = 'error';
    case DISABLED = 'disabled';
    case UNKNOWN = 'unknown';
    case DEBUG = 'debug';

    public static function validateStatus(string $status): bool
    {
        return self::tryFrom($status) !== null;
    }
}