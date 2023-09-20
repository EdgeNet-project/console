<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class EdgenetAdmin extends Facade {

    protected static function getFacadeAccessor() {
        return 'edgenet-admin';
    }
}