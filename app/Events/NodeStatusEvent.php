<?php

namespace App\Events;

use App\Model\Node;

interface NodeStatusEvent
{
    public function node(): Node;
}