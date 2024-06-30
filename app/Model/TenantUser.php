<?php

namespace App\Model;

use App\Events\UserJoinsTeam;
use App\Events\UserLeavesTeam;
use App\Events\UserUpdateTeam;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class TenantUser extends Pivot
{
    use HasFactory;

    protected $dispatchesEvents = [
        'created' => UserJoinsTeam::class,
        'updated' => UserUpdateTeam::class,
        'deleted' => UserLeavesTeam::class
    ];

    protected $with = [
        'tenant'
    ];

    protected $appends = [
        'type'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTypeAttribute()
    {
        return 'tenant';
    }
}
