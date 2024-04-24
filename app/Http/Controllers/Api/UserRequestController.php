<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\UserRequest;
use Illuminate\Http\Request;

class UserRequestController extends Controller
{
    public function createTeam(Request $request)
    {
        $validatedData = $request->validate([
            'fullname' => ['required', 'string', 'max:255'],
            'shortname' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'affiliation' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:255'],
            'joining_reason' => ['required'],
            'joining_category' => ['required', 'string', 'max:255'],
        ]);

        $teamRequest = UserRequest::create([
            'data' => $validatedData,
            'type' => UserRequest::TEAM,
            'action' => UserRequest::CREATE,
            'status' => UserRequest::PENDING,
            'user_id' => auth()->user()->id
        ]);

        return response()->json($teamRequest);

    }
}
