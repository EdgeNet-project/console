<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Model\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function list(Request $request)
    {
        return response()->json(
            User::with('tenants','sub_namespaces')
                ->orderByDesc('created_at')->get()
        );
    }
}
