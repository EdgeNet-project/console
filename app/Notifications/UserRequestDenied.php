<?php

namespace App\Notifications;

use App\Model\UserRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserRequestDenied extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(UserRequest $userRequest, $is_admin = false)
    {
        $this->userRequest = $userRequest;
        $this->is_admin = $is_admin;
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

        if ($this->is_admin) {
            return (new MailMessage)
                ->greeting('Dear ' . $notifiable->firstname . ' ' . $notifiable->lastname)
                ->line('A the request from ' . $this->userRequest->user->firstname . ' ' . $this->userRequest->user->lastname)
                ->line('for '.$this->userRequest->type->name .' has been denied.');
        }

        return (new MailMessage)
            ->greeting('Dear ' . $notifiable->firstname . ' ' . $notifiable->lastname)
            ->line('Your request for '.$this->userRequest->type->name .' has been denied.');
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
