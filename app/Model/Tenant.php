<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Tenant extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'enabled' => 'boolean'
    ];

    protected $with = [
        'subnamespaces'
    ];

    public function users()
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
    public function requests(): MorphOne
    {
        return $this->morphOne(UserRequest::class, 'object');
    }
}
