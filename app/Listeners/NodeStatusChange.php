<?php

namespace App\Listeners;

use App\Model\Node;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\NodeStatusEvent;
use App\Model\NodeStatus;
use Illuminate\Support\Facades\Log;

class NodeStatusChange
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
    public function handle(NodeStatusEvent $event): void
    {
        $node = $event->node();

        Log::channel('nodes')->info('[' . $node->name . '] status changed to ' . $node->status);

        match ($node->status) {
            NodeStatus::ONLINE => $this->online($event->node),
            NodeStatus::UNREACHABLE => $this->unreachable($event->node),
            NodeStatus::DISABLED => $this->disabled($event->node),
            default => null,
        };
    }

    protected function online(Node $node)
    {

    }

    protected function unreachable(Node $node)
    {

    }

    protected function disabled(Node $node)
    {

    }
}
