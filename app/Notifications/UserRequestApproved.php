<?php

namespace App\Notifications;

use App\Model\UserRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserRequestApproved extends Notification
{
    use Queueable;

    protected $userRequest;
    protected $is_admin;

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

        $line1 = '';
        switch($this->userRequest->type->name) {
            case 'CreateTeam':
                $line1 = 'Your request for creating the Team '.$this->userRequest->data->shortname .' has been approved.';
                break;
            case 'JoinTeam':
                $line1 = 'Your request for joining the Team ' . $this->userRequest->object->shortname . ' has been approved.';
                break;
            case 'CreateWorkspace':
                $line1 = 'Your request for creating the workspace '.$this->userRequest->data->label.' (' . $this->userRequest->data->name . ') has been approved.';
                break;
            case 'JoinWorkspace':
                $line1 = 'Your request for joining the workspace ' . $this->userRequest->object->name . ' has been approved.';
                break;

        }

        return (new MailMessage)
            ->replyTo(config('edgenet.support.email'), config('edgenet.support.name'))
            ->greeting('Dear ' . $notifiable->firstname . ' ' . $notifiable->lastname)
            ->subject('Your request has been approved')
            ->line($line1)
            ->line('')
            ->line('Please don\'t hesitate to contact us by replying to this email if you have any questions.')
            ->line('Thank you !')
            ->action('PlanetLab Console', config('edgenet.console.url'))
            ->salutation(config('edgenet.support.signature'));
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
