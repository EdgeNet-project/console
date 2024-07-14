<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Model\SubNamespace;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    public function list(Request $request)
    {
        return response()->json(
            SubNamespace::with('tenant')
                ->orderByDesc('created_at')->get()
        );
    }
}
