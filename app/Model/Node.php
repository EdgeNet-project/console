<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    use HasFactory;

    protected $hidden = [
        'auth', 'token_id', 'token_secret'
    ];

    protected $fillable = [
        'type', 'hostname', 'ip_v4', 'ip_v6',
        'cluster', 'notes', 'config', 'info', 'user_id'
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'installed' => 'boolean',
        'info' => 'array',
        'config' => 'array'
    ];

    protected $appends = [
        'installation_url'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTokenAttribute()
    {
        if (!preg_match('/[a-z0-9]{6}/', $this->token_id) ||
            !preg_match('/[a-z0-9]{16}/', $this->token_secret))  {
            return '';
        }

        return $this->token_id . '.' . $this->token_secret;
    }

    public function getInstallationUrlAttribute()
    {
        return route('boot.script', ['node' => $this->auth]);
    }
}
