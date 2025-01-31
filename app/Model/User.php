<?php

namespace App\Model;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname', 'lastname', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'aup_approved_at' => 'datetime',
        'enabled' => 'boolean'
    ];

    protected $with = [];

    protected $appends = [
    ];

    public function getTeamsAttribute()
    {
        return $this->tenants();
    }
    public function tenants()
    {
        return $this->belongsToMany(Tenant::class)
            ->using(TenantUser::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function getWorkspacesAttribute()
    {
        return $this->subnamespaces();
    }
    public function sub_namespaces()
    {
        return $this->subnamespaces();
    }
    public function subnamespaces()
    {
        return $this->belongsToMany(SubNamespace::class)
            ->using(SubNamespaceUser::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function requests()
    {
        return $this->hasMany(UserRequest::class);
    }

    public function getNameAttribute()
    {
        return $this->firstname . ' ' . $this->lastname;
    }

    /*
     *
     */
    public function isOwnerOf($team)
    {
        return $this->tenants->contains(function ($value) use ($team) {
            return $value->id == $team->id && $value->pivot->role == 'owner';
        });
    }

    public function isWorkspaceOwnerOf($workspace)
    {
        return $this->subnamespaces->contains(function ($value) use ($workspace) {
            return $value->id == $workspace->id && $value->pivot->role == 'owner';
        });
    }

//    protected function getRoleAttribute() {
//        if ($this->pivot) {
//            return $this->pivot->role;
//        }
//        return null;
//    }

//    protected function getTenantAttribute() {
//        if ($this->pivot) {
//            return $this->pivot->tenant;
//        }
//        return null;
//    }

//    protected function getRolesAttribute() {
//        $roles = [];
//        foreach($this->tenants as $tenant) {
//            if ($tenant->pivot->roles) {
//                $roles = [...$roles, ...$tenant->pivot->roles];
//            }
//        }
//
//        return $roles;
//    }

}
