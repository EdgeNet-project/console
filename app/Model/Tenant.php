<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
            ->withPivot('roles')
            ->withTimestamps();
    }

    public function subnamespaces()
    {
        return $this->hasMany(SubNamespace::class);
    }
}
