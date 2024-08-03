<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use App\Http\Resources\MessageResource;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

 public $message;
    public function __construct( Message $message)
    {
        $this->message = $message;
    }

    public function broadcastWith(): array
    {
        return [
            'message'=> new MessageResource($this->message),
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        $channels = [];
        if($this->message->group_id) {
            $channels[] = new PrivateChannel('message.group.' . $this->message->group_id);
        } else {
            $channels[] = new PrivateChannel('message.user.' . collect([$this->message->sender_id, $this->message->receiver_id])->sort()->implode('-'));
        }
        return $channels;
    }
}
