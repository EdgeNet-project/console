<?php

namespace App\Events;

use App\Model\TenantUser;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserJoinsTeam
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $tenantUser;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(TenantUser $tenantUser)
    {
        $this->tenantUser = $tenantUser;
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
