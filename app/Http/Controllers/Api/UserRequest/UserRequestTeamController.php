<?php

namespace App\Http\Controllers\Api\UserRequest;

use App\Http\Controllers\Controller;
use App\Model\Tenant;
use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use App\Model\UserRequestType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserRequestTeamController extends Controller
{
    /**
     * Create new Team - a request to the cluster admins is always created
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'fullname' => ['required', 'string', 'max:255'],
            'shortname' => ['required', 'alpha_dash', 'max:32', 'unique:tenants,shortname'],
            'country' => ['required', 'string', 'max:255'],
            'affiliation' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:255'],
            'joining_reason' => ['required', 'string'],
            'joining_category' => ['required', 'string', 'max:255'],
        ]);

        $name = Str::lower($validatedData['shortname']);

        $tenant = Tenant::where('name', $name)->first();
        if ($tenant) {
            return response()->json([
                'message' => 'Team already exists or shortname is already in use'
            ], 400);
        }

        // check if a request is already pending
        $userRequest = UserRequest::where([
            'type' => UserRequestType::CreateTeam,
            'object_id' => null,
            'object_type' => null,
            'status' => UserRequestStatus::Pending
        ])->whereJsonContains('data->shortname', $validatedData['shortname'])->first();

        if ($userRequest) {
            return response()->json([
                'message' => 'A request is already pending for ' . $validatedData['shortname']
            ], 409);
        }

        $userRequest = UserRequest::create([
            'data' => $validatedData,
            'type' => UserRequestType::CreateTeam,
            'user_id' => auth()->user()->id
        ]);

        return response()->json($userRequest);

    }

    /**
     *
     * @param Request $request
     * @param Tenant $tenant
     * @return \Illuminate\Http\JsonResponse
     */
    public function join(Request $request)
    {

        $validatedData = $request->validate([
            'team_id' => ['required'],
        ]);

        $team = Tenant::find($request->input('team_id'));
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        // check if a request is already pending
        $userRequest = UserRequest::where([
            'type' => UserRequestType::JoinTeam,
            'object_id' => $team->id,
            'object_type' => Tenant::class,
            'user_id' => auth()->user()->id,
            'status' => UserRequestStatus::Pending,
        ])->first();

        if ($userRequest) {
            return response()->json(['message' => 'A join request is already pending on ' . $team->name], 409);
        }

        $userRequest = UserRequest::create([
            'data' => '',
            'type' => UserRequestType::JoinTeam,
            'user_id' => auth()->user()->id,
            'object_id' => $team->id,
            'object_type' => Tenant::class
        ]);

        return response()->json($userRequest);
    }
}
