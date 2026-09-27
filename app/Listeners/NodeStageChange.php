<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\NodeStageEvent;
use App\Model\Node;
use App\Model\NodeStage;
use Illuminate\Support\Facades\Log;

class NodeStageChange
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NodeStageEvent $event): void
    {
        $node = $event->node();

        Log::channel('nodes')->info('[' . $node->name . '] stage changed to ' . $node->stage);

        match ($node->status) {
            NodeStage::CHECKIN => $this->checkin($event->node),
            NodeStage::NETWORKING => null,
            NodeStage::PROVISIONING => null,
            NodeStage::RUNNING => null,
            default => null,
        };
    }

    protected function checkin(Node $node)
    {

    }

}
