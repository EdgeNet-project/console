<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class UserRequest extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'data' => 'array',
        'type' => UserRequestType::class,
        'status' => UserRequestStatus::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * This request is about this object.
     * Can be Team, Workspace...
     */
    public function object(): MorphTo
    {
        return $this->morphTo();
    }
}
