<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserRequestResource;
use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use App\Model\UserRequestType;
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

        $userRequest = UserRequest::create([
            'data' => $validatedData,
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

    public function createTeamWorkspace(Request $request, Tenant $tenant)
    {

        $validatedData = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255']

        ]);

        $userRequest = UserRequest::create([
            'data' => $validatedData,
            'type' => UserRequestType::CreateWorkspace,
            'user_id' => auth()->user()->id,
            'object_id' => $tenant->id,
            'object_type' => Tenant::class
        ]);

        return response()->json($userRequest);
    }

    public function joinWorkspace(Request $request, SubNamespace $sub_namespace)
    {

        if (!$sub_namespace) {
            return response()->json(['message' => 'Workspace not found'], 404);
        }

        // check if a request is already pending
        $userRequest = UserRequest::where([
            'type' => UserRequestType::JoinWorkspace,
            'object_id' => $sub_namespace->id,
            'object_type' => SubNamespace::class,
            'user_id' => auth()->user()->id
        ])->first();

        if ($userRequest) {
            return response()->json(['message' => 'A join request is already pending on ' . $sub_namespace->name], 409);
        }

        $userRequest = UserRequest::create([
            'data' => '',
            'type' => UserRequestType::JoinWorkspace,
            'object_id' => $sub_namespace->id,
            'object_type' => SubNamespace::class,
            'user_id' => auth()->user()->id
        ]);

        return response()->json($userRequest);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * The UserRequests the user can moderate:
     * - Tenant Owner: Join Tenant, Join and Create Workspace requests
     */
    public function list(Request $request)
    {

        $userRequests = UserRequest::whereHasMorph('object',
            [Tenant::class, SubNamespace::class], function($q1) {
                $q1->whereHas('users', function($q2) {
                    $q2->where([
                        ['user_id', auth()->user()->id],
                        ['role', 'owner']
                    ]);
                });
                return $q1;
            })
            ->whereIn('type', [
                UserRequestType::JoinTeam,
                UserRequestType::JoinWorkspace,
                UserRequestType::CreateWorkspace,
            ])
            ->get();

        $adminUserRequests = UserRequest::whereIn('type', [
                UserRequestType::CreateTeam
            ])
            ->get();

        //$joinTeamRequests = UserRequest::whereHasMorph('object', [Tenant::class])->get();
        return response()->json(
            UserRequestResource::collection([
                ...$adminUserRequests,
                ...$userRequests
            ])
        );

    }

    public function update(Request $request, UserRequest $userRequest)
    {
        if ($request->user()->cannot('update', $userRequest)) {
            abort(403);
        }

        $validatedData = $request->validate([
            'action' => 'required|string'
        ]);

        switch($validatedData['action']) {
            case 'approve':
                $userRequest->status = UserRequestStatus::Approved;
                break;
            case 'deny':
                $userRequest->status = UserRequestStatus::Denied;
                break;

        }

        $userRequest->save();

        return response()->json(new UserRequestResource($userRequest));

    }
}
