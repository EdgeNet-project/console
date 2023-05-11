<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SubNamespaceUser extends Pivot
{
    use HasFactory;

    protected $casts = [
    ];

    public function subnamespace()
    {
        return $this->belongsTo(SubNamespace::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
