<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\UserRequest;
use App\Model\UserRequestType;
use Illuminate\Http\Request;

class JoinTeamRequestController extends Controller
{
    public function list(Request $request)
    {
        // only admins can view

        $joinTeamRequests = UserRequest::where([
            ['type' => UserRequestType::JoinTeam]
        ]);

        return response()->json();

    }

    public function view(Request $request)
    {

    }

    public function approve(Request $request)
    {

    }

    public function deny(Request $request)
    {

    }
}