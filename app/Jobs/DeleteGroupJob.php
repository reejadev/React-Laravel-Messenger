<?php

namespace App\Jobs;

use App\Events\GroupDeleted;
use App\Models\Group;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeleteGroupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Group $group)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

      

      $this->group->last_message_id = null;
      $this->group->save();

      $this->group->messages->each->delete();

      $this->group->users()->detach();

      $this->group->delete();

      dd('Group deleted', $this->group);

      GroupDeleted::dispatch($this->group);
    }
}
