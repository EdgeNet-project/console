<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Tenant extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'enabled' => 'boolean'
    ];

    protected $with = [
        'subnamespaces',
    ];

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

    public function getAdminsAttribute()
    {
        return $this->users()->wherePivot('role','admin')->get();
    }
}
