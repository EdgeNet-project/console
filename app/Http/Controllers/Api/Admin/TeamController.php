<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Model\Tenant;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function list(Request $request)
    {
        return response()->json(
            Tenant::with('users', 'sub_namespaces')
                ->orderByDesc('created_at')->get()
        );
    }
}
