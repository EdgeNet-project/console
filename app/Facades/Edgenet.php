<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Edgenet extends Facade {

    protected static function getFacadeAccessor() {
        return 'edgenet';
    }
}