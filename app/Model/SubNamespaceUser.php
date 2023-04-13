<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SubNamespaceUser extends Pivot
{
    use HasFactory;

    protected $casts = [
        'roles' => 'array'
    ];
}
