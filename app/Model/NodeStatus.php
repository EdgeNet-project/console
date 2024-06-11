<?php

namespace App\Model;

class NodeStatus {

    const TO_INSTALL = "to install";
    const INSTALLING = "installing";
    const OK = "ok";
    const WARNING = "warning";
    const ERROR = "error";
    const DISABLED = "disabled";
    const DEBUG = "debug";

    static function validateStatus($status)
    {
        return in_array($status, [
            NodeStatus::TO_INSTALL,
            NodeStatus::INSTALLING,
            NodeStatus::OK,
            NodeStatus::WARNING,
            NodeStatus::DISABLED,
            NodeStatus::DEBUG,
        ]);
    }
}