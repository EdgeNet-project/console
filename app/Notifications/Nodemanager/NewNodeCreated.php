<?php

namespace App\Notifications\Nodemanager;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Model\Node;

class NewNodeCreated extends Notification
{
    use Queueable;

    protected $node;

    /**
     * Create a new notification instance.
     */
    public function __construct(Node $node)
    {
        $this->node = $node;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New node created - ' . $this->node->name)
            ->line('A new node has been created: ' . $this->node->name)
                    ->line('Public IP: ' . $this->node->public_ip_v4)
                    ->line('Node IP: ' . $this->node->ip_v4)
                    ->lineIf(isset($this->node->location['countryCode']), 'countryCode: ' . $this->node->location['countryCode'])
                    ->lineIf(isset($this->node->location['regionName']), 'regionName: ' . $this->node->location['regionName'])
                    ->lineIf(isset($this->node->location['regionCode']), 'regionCode: ' . $this->node->location['regionCode'])
                    ->lineIf(isset($this->node->location['regionName']), 'regionName: ' . $this->node->location['regionName'])
                    ->lineIf(isset($this->node->os['arch']), 'Arch: ' . $this->node->os['arch'])
                    ->lineIf(isset($this->node->os['distro']), 'Distro: ' . $this->node->os['distro'])
                    ->lineIf(isset($this->node->os['version']), 'Version: ' . $this->node->os['version'])
                    ->lineIf(isset($this->node->os['kernel']), 'Kernel: ' . $this->node->os['kernel'])
                    ->action('PlanetLab Nodes', url('/admin/nodemanager/nodes'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
