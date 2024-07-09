<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
       
        'name',
        'description',
        'owner_id',
        'last_message_id',
      

    ];

    public function users()
    {
return $this->belongsToMany(User::class, 'group_users', 'group_id', 'user_id');
    }

    protected function messages()
    {
return $this->hasMany(Message::class);
    }

    protected function owner()
    {
return $this->belongsTo(User::class);
    }

}
