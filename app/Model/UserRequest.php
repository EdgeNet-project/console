<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRequest extends Model
{
    use HasFactory;

    protected $guarded = [];

    const ROLE = 'role';
    const TENANT = 'tenant';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
