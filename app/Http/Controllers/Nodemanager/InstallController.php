<?php

namespace App\Http\Controllers\Nodemanager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InstallController extends Controller
{
    /**
     * nodemanager install script
     *
     * @return mixed
     */
    public function shell()
    {
        return view('nodemanager.install')
            ->header('Content-Type', 'text/plain');
    }
}
