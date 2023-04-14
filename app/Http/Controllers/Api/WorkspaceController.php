<?php

namespace App\Http\Controllers\Api;

use App\CRDs\SubNamespace;
use App\Http\Controllers\Controller;
use App\Model\Tenant;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    public function list()
    {

        $tenants = Tenant::where([
            ['enabled', true],
            //['name', 'lip6-lab']
        ])->orderBy('name')->get();

        return response()->json($tenants);
    }
}
