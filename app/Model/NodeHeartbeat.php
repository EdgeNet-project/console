<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NodeHeartbeat extends Model
{
    public $timestamps = true;

    public const UPDATED_AT = null;

    protected $fillable = [
        'info',
    ];

    protected $casts = [
        'info' => 'array',
    ];

    public function node(): BelongsTo
    {
        return $this->belongsTo(Node::class);
    }

}
