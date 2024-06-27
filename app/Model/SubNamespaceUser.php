<?php

namespace App\Model;

use App\Events\WorkspaceUserCreate;
use App\Events\WorkspaceUserDelete;
use App\Events\WorkspaceUserUpdate;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SubNamespaceUser extends Pivot
{
    use HasFactory;

    protected $dispatchesEvents = [
        'created' => WorkspaceUserCreate::class,
        'updated' => WorkspaceUserUpdate::class,
        'deleted' => WorkspaceUserDelete::class
    ];

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
