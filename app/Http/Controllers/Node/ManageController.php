<?php

namespace App\Http\Controllers\Node;

use App\Http\Controllers\Controller;
use App\Model\Node;
use App\Model\NodeStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ManageController extends Controller
{

    /**
     * Node activation - performed by a user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function list(Request $request)
    {

        // Only authenticated users can activate nodes
        if (!$request->user()) {
            Log::channel('nodes')->error("Node list - unauthenticated: User is not authenticated");
            return response()->json([], 401);
        }

        if (!$request->user()->admin) {
            Log::channel('nodes')->error("Node list - unauthorized: User is not an admin");
            return response()->json([], 403);
        }

        $node = Node::all();

        return response()->json($node);
    }
}