<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityController extends Controller
{
    public function list(Request $request)
    {
        return response()->json(
            Activity::with('causer', 'subject')
                ->orderByDesc('created_at')->get()
        );
    }
}
