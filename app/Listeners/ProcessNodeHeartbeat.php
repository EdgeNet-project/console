<?php

namespace App\Listeners;

use App\Events\NodeHeartbeatReceived;
use App\Events\NodeRecovered;
use App\Model\NodeStatus;
use Illuminate\Support\Facades\Log;

class ProcessNodeHeartbeat
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
    public function handle(NodeHeartbeatReceived $event): void
    {
        $node = $event->heartbeat->node;

        Log::channel('nodes')->info('[' . $node->name . '] heartbeat', [
            'status' => $node->status,
            'stage' => $node->stage,
        ]);

        // if the node was unreachable change the status
        // and dispatch a recovered event
        if ($node->status === NodeStatus::UNREACHABLE) {
            $node->update([
                'last_seen_at' => now(),
                'status' => NodeStatus::ONLINE,
            ]);

            NodeRecovered::dispatch($node);
        } else {
            $node->update([
                'last_seen_at' => now()
            ]);
        }
    }
}
