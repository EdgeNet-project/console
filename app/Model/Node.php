<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Node extends Model
{
    use HasFactory, LogsActivity;

    protected $hidden = [
        'auth', 'token_id', 'token_secret'
    ];

    protected $fillable = [
        'status', 'type', 'ip_v4', 'ip_v6', 'asn', 'name',
        'notes', 'config', 'location', 'info',
        'user_id'
    ];

    protected $casts = [
        'info' => 'array',
        'location' => 'array',
        'config' => 'array'
    ];

    protected $appends = [
        'installation_url'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status']);
        // Chain fluent methods for configuration options
    }

    public function getHostnameAttribute()
    {
        return $this->name . '.' . config('edgenet.cluster.domain');
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
        return route('node.bootstrap', ['node' => $this->auth]);
    }
}
