<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Node extends Model
{
    use LogsActivity;

    public $timestamps = true;
    /**
     * @var array|mixed
     */

    protected $hidden = [
        'code'
    ];

    protected $fillable = [
        'name', 'system_uuid', 'status', 'enabled',
        'installed_at', 'last_seen_at',

        'platform', 'role',

        'ip_v4', 'public_ip_v4', 'ip_v6', 'asn',

        'wireguard', 'os', 'info', 'location',
        'code'
    ];

    protected $casts = [
        'status' => NodeStatus::class,
        'enabled' => 'boolean',

        'installed_at' => 'datetime',
        'last_seen_at' => 'datetime',

        'wireguard' => 'array',
        'os' => 'array',
        'info' => 'array',
        'location' => 'array',
    ];

    protected $appends = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status']);
        // Chain fluent methods for configuration options
    }

    public function getInstallationUrlAttribute()
    {
        return route('node.bootstrap', ['node' => $this->auth]);
    }
}
