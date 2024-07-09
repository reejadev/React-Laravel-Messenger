<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);
        User::factory()->create([
          'name' => 'Jane Doe',
          'email' => 'jane@example.com',
          'password' => bcrypt('password'),
          
      ]);
        // Create regular users
        User::factory(10)->create();
        for ($i=0; $i<5; $i++){
          $group = Group::factory()->create(['owner_id'=>1,]);
          $users=User::inRandomOrder()->limit(rand(2,5))->pluck('id');
          $group->users()->attach(array_unique([1, ...$users]));
        }

        // Create groups with random users
        $groups = Group::factory()->count(5)->create();
        // foreach ($groups as $group) {
        //     $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
        //     $group->users()->attach(array_unique([1, ...$users->toArray()]));
        //}
      

        // Attempt to create messages
        
            Message::factory(10)->create();
       
    
             $messages = Message::whereNull('group_id')->orderBy('created_at')->get();
       
        $conversations = $messages->groupBy(function($message){
          return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');
        })->map(function($groupedMessages){
          return [
            'user_id1' => $groupedMessages->first()->sender_id,
            'user_id2' => $groupedMessages->first()->receiver_id,
            'last_message_id' => $groupedMessages->last()->id,
            'created_at' => new Carbon(),
            'updated_at' => new Carbon(),
          ];
        })->values();

       
        
                Conversation::insertOrIgnore($conversations->toArray());

                
            }
          
        

}