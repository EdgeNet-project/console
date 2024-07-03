<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Tenant extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'enabled' => 'boolean'
    ];

    protected $with = [
        'subnamespaces',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults();
//            ->logOnly(['status']);
        // Chain fluent methods for configuration options
    }

    public function users() : BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(TenantUser::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function subnamespaces()
    {
        return $this->hasMany(SubNamespace::class);
    }

    /**
     * Requests about Tenants (create, join...)
     */
    public function requests(): MorphMany
    {
        return $this->morphMany(UserRequest::class, 'object');
    }

    public function getOwnersAttribute()
    {
        return $this->users()->wherePivot('role','owner')->get();
    }

    public function isOwner(User $user): bool
    {
        return $this->owners->contains($user);
    }

    public function getAdminsAttribute()
    {
        return $this->users()->wherePivot('role','admin')->get();
    }

    public function isAdmin(User $user): bool
    {
        return $this->admins->contains($user);
    }
}
