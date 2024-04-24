<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRequest extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'data' => 'array'
    ];

    /* TYPES */
    const TEAM = 'team';


    /* ACTIONS */
    const CREATE = 'create';
    const JOIN = 'join';

    /* STATUS */
    const PENDING = 'pending';
    const APPROVED = 'approved';
    const DENIED = 'denied';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
