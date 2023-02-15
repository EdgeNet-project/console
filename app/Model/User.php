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
        'email_verified_at' => 'datetime'
    ];

    protected $with = [
        'tenants'
    ];

    public function tenants()
    {
        return $this->belongsToMany(Tenant::class)
            ->withPivot('roles')
            ->withTimestamps();
    }

//    protected function roles(): Attribute
//    {
//        return Attribute::make(
//            get: fn () => $this->pivot->roles,
//            set: fn (array $roles) => $this->tenants()->updateExistingPivot($tenantId, [ 'roles' => $roles])
//        );
//    }
}
