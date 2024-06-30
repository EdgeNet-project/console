<?php

namespace App\Model;

use App\Events\UserJoinsWorkspace;
use App\Events\UserLeavesWorkspace;
use App\Events\UserUpdateWorkspace;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SubNamespaceUser extends Pivot
{
    use HasFactory;

    protected $dispatchesEvents = [
        'created' => UserJoinsWorkspace::class,
        'updated' => UserUpdateWorkspace::class,
        'deleted' => UserLeavesWorkspace::class
    ];

    protected $casts = [
    ];

    public function subnamespace()
    {
        return $this->belongsTo(SubNamespace::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
