<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    use HasFactory;

    protected $hidden = [
        'auth'
    ];

    protected $fillable = [
        'type', 'mac', 'dhcp', 'hostname',
        'ip_v4', 'gateway_ip_v4', 'public_ip_v4', 'dns1_ip_v4', 'dns2_ip_v4',
        'ip_v6', 'gateway_ip_v6', 'public_ip_v6', 'dns1_ip_v6', 'dns2_ip_v6',
        'cluster', 'notes', 'user_id'
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'installed' => 'boolean',
        'dhcp' => 'boolean',
    ];

    protected $appends = [
        'installation_url'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getInstallationUrlAttribute()
    {
        return url('/nodes/' . $this->auth);
    }
}
