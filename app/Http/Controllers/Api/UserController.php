<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserRequestResource;
use App\Model\Tenant;
use App\Model\UserRequest;
use App\Model\UserRequestType;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * The UserRequests the user can moderate:
     * - Tenant Owner: Join Tenant, Join and Create Workspace requests
     */
    public function requests(Request $request)
    {

        $userRequests = UserRequest::where('user_id', auth()->user()->id)->get();

        return response()->json(UserRequestResource::collection($userRequests));

    }
}
