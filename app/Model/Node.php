<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    use HasFactory;

    public const ODROID = 'odroid';

    protected $fillable = [
        'type', 'mac', 'ipv4', 'gatewayv4', 'public_ipv4', 'ipv6',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
