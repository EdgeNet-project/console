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
        return response()
            ->view(
                'nodemanager.install.shell',
                [
                    'orchestrator_host' => config('nodemanager.orchestrator.host'),
                    'repository_host' => config('nodemanager.repository.host'),
                    'repository_name' => config('nodemanager.repository.name')
                ]
            )
            ->header('Content-Type', 'text/plain');
    }

    /**
     * nodemanager cloud-init script
     *
     * @return mixed
     */
    public function cloudInit()
    {
        return response()
            ->view(
                'nodemanager.install.cloud-init',
                [
                    'orchestrator_host' => config('nodemanager.orchestrator.host'),
                    'repository_host' => config('nodemanager.repository.host'),
                    'repository_name' => config('nodemanager.repository.name')
                ]
            )
            ->header('Content-Type', 'text/plain');
    }
}
