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
