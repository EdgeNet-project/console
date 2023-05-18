<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Node extends Model
{
    use HasFactory;

    protected $fillable = [
        'mac', 'ipv4', 'gatewayv4', 'public_ipv4'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
