<?php

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('online', function (User $user) {
    Log::info('Authorizing user for online channel', ['user_id' => $user->id]);
    return $user ? new UserResource($user) : null;
},);

Broadcast::channel('message.users.{userId1}-{userId2}', function (User $user, int $userId1, int $userId2) {
    Log::info('Authorizing user for message.users channel', ['user_id' => $user->id, 'userId1' => $userId1, 'userId2' => $userId2]);
    return $user->id === $userId1 || $user->id === $userId2 ? new UserResource($user) : null;
}, );

Broadcast::channel('message.group.{groupId}', function (User $user, int $groupId) {
    Log::info('Authorizing user for message.group channel', ['user_id' => $user->id, 'groupId' => $groupId]);
    return $user->groups->contains('id', $groupId) ? new UserResource($user) : null;
}, );
