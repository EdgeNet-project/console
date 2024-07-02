<?php

namespace App\Notifications;

use App\Model\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserJoinsTeamNotification extends Notification
{
    use Queueable;

    protected $team;
    protected $role;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Tenant $team, string $role)
    {
        $this->team = $team;
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
                    ->line('You have joined the team ' . $this->team->fullname . ' with the role ' . $this->role)
                    ->action('View your team', url('/team/' . $this->team->name))
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
