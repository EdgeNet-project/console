<?php

namespace App\Model;

use App\Services\EdgenetAdmin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class SubNamespace extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults();
//            ->logOnly(['status']);
        // Chain fluent methods for configuration options
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->using(SubNamespaceUser::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Requests about Tenants (create, join...)
     */
    public function requests(): MorphMany
    {
        return $this->morphMany(UserRequest::class, 'object');
    }

    public function getOwnersAttribute()
    {
        return $this->users()->wherePivot('role','owner')->get();
    }

}
