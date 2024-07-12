<?php

namespace App\Http\Controllers\Api\UserRequest;

use App\Http\Controllers\Controller;
use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\UserRequest;
use App\Model\UserRequestType;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class UserRequestWorkspaceController extends Controller
{

    /**
     * If user is owner of the Team or parent workspace allow direct creation
     *
     * @param Request $request
     * @param Tenant $tenant
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {

        $validatedData = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'name' => ['required', 'alpha_dash', 'max:32', 'unique:sub_namespaces,name'],
            'team_id' => ['required', 'integer'],
        ]);

        $user = $request->user();

        $team = Tenant::find($request->input('team_id'));
        if (!$team) {
            return response()->json([], 404);
        }

        if ($team->isOwner($user)) {
            try {
                $sub_namespace = SubNamespace::create([
                    'label' => $validatedData['label'],
                    'name' => $validatedData['name'],
                    'namespace' => '<generating>',
                    'tenant_id' => $team->id,
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
            'object_id' => $team->id,
            'object_type' => Tenant::class
        ]);

        return response()->json($userRequest);
    }

    public function join(Request $request)
    {

        $validatedData = $request->validate([
            'team_id' => ['required'],
            'name' => ['required', 'alpha_dash', 'max:32'],
        ]);

        $workspace = SubNamespace::where([
            [ 'tenant_id', $validatedData['team_id'] ],
            [ 'name', $validatedData['name'] ]
        ])->first();

        if (!$workspace) {
            return response()->json([
                'message' => 'Workspace ' . $workspace->name . ' not found'
            ], 404);
        }

        $user = $request->user();

        if ($workspace->isUser($user)) {
            return response()->json([
                'message' => 'You are already part of ' . $workspace->name
            ], 400);
        }

        // Tenant owners can join directly
        if ($workspace->tenant->isOwner($user)) {
            $workspace->users()->attach(
                $user->id, ['role' => 'owner']
            );

            return response()->json([
                'message' => 'You have joined workspace ' . $workspace->name
            ], 201);
        }

        // check if a request is already pending
        $userRequest = UserRequest::where([
            'type' => UserRequestType::JoinWorkspace,
            'object_id' => $workspace->id,
            'object_type' => SubNamespace::class,
            'user_id' => auth()->user()->id
        ])->first();

        if ($userRequest) {
            return response()->json([
                'message' => 'A join request is already pending on ' . $workspace->name
            ], 409);
        }

        $userRequest = UserRequest::create([
            'data' => '',
            'type' => UserRequestType::JoinWorkspace,
            'object_id' => $workspace->id,
            'object_type' => SubNamespace::class,
            'user_id' => auth()->user()->id
        ]);

        return response()->json($userRequest);
    }
}
