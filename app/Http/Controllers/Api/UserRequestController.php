<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\UserRequest;
use App\Model\UserRequestType;
use Illuminate\Http\Request;

class UserRequestController extends Controller
{
    public function createTeam(Request $request)
    {
//        $validatedData = $request->validate([
//            'fullname' => ['required', 'string', 'max:255'],
//            'shortname' => ['required', 'string', 'max:255'],
//            'country' => ['required', 'string', 'max:255'],
//            'affiliation' => ['required', 'string', 'max:255'],
//            'url' => ['required', 'string', 'max:255'],
//            'joining_reason' => ['required'],
//            'joining_category' => ['required', 'string', 'max:255'],
//        ]);

        $userRequest = UserRequest::create([
            'data' => ['test'],
            'type' => UserRequestType::CreateTeam,
            'user_id' => auth()->user()->id
        ]);

        return response()->json($userRequest);

    }

    public function joinTeam(Request $request, Tenant $tenant)
    {

//        $validatedData = $request->validate([
//            'fullname' => ['required', 'string', 'max:255'],
//            'shortname' => ['required', 'string', 'max:255'],
//            'country' => ['required', 'string', 'max:255'],
//            'affiliation' => ['required', 'string', 'max:255'],
//            'url' => ['required', 'string', 'max:255'],
//            'joining_reason' => ['required'],
//            'joining_category' => ['required', 'string', 'max:255'],
//        ]);

        $userRequest = UserRequest::create([
            'data' => '',
            'type' => UserRequestType::JoinTeam,
            'user_id' => auth()->user()->id
        ]);

        $tenant->requests()->save($userRequest);

        return response()->json($userRequest);
    }

    public function createWorkspace(Request $request)
    {

        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],

        ]);

        $userRequest = UserRequest::create([
            'data' => $validatedData,
            'type' => UserRequestType::CreateWorkspace,
            'user_id' => auth()->user()->id
        ]);

        return response()->json($userRequest);
    }

    public function joinWorkspace(Request $request, SubNamespace $subnamespace)
    {

        $validatedData = $request->validate([

        ]);

        $userRequest = UserRequest::create([
            'data' => $validatedData,
            'type' => UserRequestType::JoinWorkspace,
            'object' => $subnamespace,
            'user_id' => auth()->user()->id
        ]);

        return response()->json($userRequest);
    }
}
