<?php

namespace App\Events;

use App\Model\Node;

interface NodeStageEvent
{
    public function node(): Node;
}