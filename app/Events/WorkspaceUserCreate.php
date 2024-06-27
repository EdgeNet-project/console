<?php

namespace App\Events;

use App\Model\SubNamespaceUser;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkspaceUserCreate
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $subNamespaceUser;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(SubNamespaceUser $subNamespaceUser)
    {
        $this->subNamespaceUser = $subNamespaceUser;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
