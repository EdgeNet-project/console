<?php

namespace App\Notifications;

use App\Model\SubNamespace;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserJoinsWorkspaceNotification extends Notification
{
    use Queueable;

    protected $workspace;
    protected $role;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(SubNamespace $workspace, string $role)
    {
        $this->workspace = $workspace;
        $this->role = $role;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('You have joined the workspace ' . $this->workspace->name . ' with the role ' . $this->role)
            ->action('View your team', url('/workspaces/' . $this->workspace->name))
            ->line('');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
