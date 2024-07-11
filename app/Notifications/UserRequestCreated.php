<?php

namespace App\Notifications;

use App\Model\UserRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserRequestCreated extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(UserRequest $userRequest)
    {
        $this->userRequest = $userRequest;
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

        $text = 'Your request for '.$this->userRequest->type->name .' has been created.';

        switch($this->userRequest->type->name) {
            case 'CreateTeam':
                $text = 'Thank you for your interest in creating a new team. We have received your request and will notify you shortly regarding the next steps.';
                break;
            case 'JoinTeam':
                $text = 'Thank you for your interest in joining the team '.$this->userRequest->object->fullname.'. We have received your request and will notify you shortly regarding the next steps.';
                break;
            case 'CreateWorkspace':
                $text = 'Thank you for your interest in creating the workspace '.$this->userRequest->object->name.'. We have received your request and will notify you shortly regarding the next steps.';
                break;
            case 'JoinWorkspace':
                $text = 'Thank you for your interest in joining the workspace '.$this->userRequest->object->name.'. We have received your request and will notify you shortly regarding the next steps.';
                break;

        }
        return (new MailMessage)
                    ->greeting('Dear ' . $notifiable->firstname . ' ' . $notifiable->lastname)
                    ->line($text);
                    //->line('We notified the person responsible')
                    //->action('Notification Action', url('/'))
                    //->line('Thank you !');
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
