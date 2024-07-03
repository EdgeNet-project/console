<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserRequestResource;
use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use App\Model\UserRequestType;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserRequestController extends Controller
{
    /**
     * Create new Team - a request to the cluster admins is always created
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createTeam(Request $request)
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
            return response()->json(['message' => 'Team already exists or shortname is already in use'], 400);
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
        if (!$tenant) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        // check if a request is already pending
        $userRequest = UserRequest::where([
            'type' => UserRequestType::JoinTeam,
            'object_id' => $tenant->id,
            'object_type' => Tenant::class,
            'user_id' => auth()->user()->id
        ])->first();

        if ($userRequest) {
            return response()->json(['message' => 'A join request is already pending on ' . $tenant->name], 409);
        }

        $userRequest = UserRequest::create([
            'data' => '',
            'type' => UserRequestType::JoinTeam,
            'user_id' => auth()->user()->id,
            'object_id' => $tenant->id,
            'object_type' => Tenant::class
        ]);

        return response()->json($userRequest);
    }

    /**
     * If user is owner of the Team or parent workspace allow direct creation
     *
     * @param Request $request
     * @param Tenant $tenant
     * @return \Illuminate\Http\JsonResponse
     */
    public function createTeamWorkspace(Request $request, Tenant $tenant)
    {

        $validatedData = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'name' => ['required', 'alpha_dash', 'max:32', 'unique:sub_namespaces,name'],
        ]);

        $user = $request->user();

        if ($tenant->isOwner($user)) {
            try {
                $sub_namespace = SubNamespace::create([
                    'label' => $validatedData['label'],
                    'name' => $validatedData['name'],
                    'namespace' => '<generating>',
                    'tenant_id' => $tenant->id,
                    'parent_id' => null // TODO
//            'resourceallocation' => [
//                'cpu' => "4000m",
//                'memory' => "4Gi",
//            ],
//            'inheritance' => [
//                'rbac' => true,
//                'networkpolicy' => false,
//                'limitrange' => true,
//                'configmap' => true,
//                'sync' => false,
//                //                    'sliceclaim' => 'lab-exercises',
//                'expiry' => "2023-09-01T09:00:00Z"
//            ],
                ]);

                $sub_namespace->users()->attach(
                    $user->id, ['role' => 'owner']
                );

            } catch (QueryException) {
                return response()->json(['message' => 'Error creating the workspace'], 401);
            }

            return response()->json(['message' => 'You have created the workspace'], 201);
        }

        $userRequest = UserRequest::create([
            'data' => $validatedData,
            'type' => UserRequestType::CreateWorkspace,
            'user_id' => $user->id,
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

        $user = $request->user();

        // Tenant owners can join directly
        if ($sub_namespace->tenant->isOwner($user)) {
            $sub_namespace->users()->attach(
                $user->id, ['role' => 'owner']
            );

            return response()->json(['message' => 'You have joined a workspace'], 201);
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

        $adminUserRequests = [];
        if (auth()->user()->admin) {
            $adminUserRequests = UserRequest::whereIn('type', [
                UserRequestType::CreateTeam
            ])->get();
        }

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
