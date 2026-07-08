<?php

namespace App\Notifications\Nodemanager;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Model\Node;

class NodeStatusChanged extends Notification
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
        $mail = (new MailMessage)
            ->subject('Node status has changed to ' . $this->node->status->value . ' - ' . $this->node->name)
            ->line('Node ' . $this->node->name .' status has changed to ' . $this->node->status->value . '.');

        $table = "| Attribute | Value |\n| :--- | :--- |\n";
        $table .= "| Public IP | " . ($this->node->public_ip_v4 ?? 'N/A') . " |\n";
        $table .= "| Node IP | " . ($this->node->ip_v4 ?? 'N/A') . " |\n";
        if (isset($this->node->location['countryCode'])) $table .= "| Country Code | " . $this->node->location['countryCode'] . " |\n";
        if (isset($this->node->location['regionName'])) $table .= "| Region Name | " . $this->node->location['regionName'] . " |\n";
        if (isset($this->node->location['regionCode'])) $table .= "| Region Code | " . $this->node->location['regionCode'] . " |\n";
        if (isset($this->node->os['arch'])) $table .= "| Arch | " . $this->node->os['arch'] . " |\n";
        if (isset($this->node->os['distro'])) $table .= "| Distro | " . $this->node->os['distro'] . " |\n";
        if (isset($this->node->os['version'])) $table .= "| Version | " . $this->node->os['version'] . " |\n";
        if (isset($this->node->os['kernel'])) $table .= "| Kernel | " . $this->node->os['kernel'] . " |\n";

        return $mail->line($table)
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
