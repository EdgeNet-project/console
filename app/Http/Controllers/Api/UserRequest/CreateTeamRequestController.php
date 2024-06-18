<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\UserRequest;
use App\Model\UserRequestType;
use Illuminate\Http\Request;

class CreateTeamRequestController extends Controller
{
    public function list(Request $request)
    {
        // only admins can view

        $joinTeamRequests = UserRequest::where([
            ['type' => UserRequestType::JoinTeam],
        ]);

        return response()->json($joinTeamRequests);

    }

    public function view(Request $request, UserRequest $userRequest)
    {
        if (!$userRequest->type !==1) {}

    }

    public function approve(Request $request)
    {

    }

    public function deny(Request $request)
    {

    }
}