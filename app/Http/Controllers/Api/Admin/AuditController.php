<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Model\AuditEvent;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    public function list(Request $request)
    {
        $log = AuditEvent::orderBy('request_received_at', 'desc')->get();

        return response()->json(
            $log
        );
    }
}
