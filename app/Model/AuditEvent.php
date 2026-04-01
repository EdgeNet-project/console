<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class AuditEvent extends Model
{
    protected $guarded = [];

    protected $casts = [
        'user_groups' => 'array',
        'source_ips' => 'array',
        'annotations' => 'array',
        'raw_event' => 'array',
        'request_received_at' => 'datetime',
        'stage_at' => 'datetime',
    ];
}
