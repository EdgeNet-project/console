<?php

namespace App\Http\Controllers\Node;

use App\Http\Controllers\Controller;
use App\Model\Node;
use App\Model\NodeStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ActivationController extends Controller
{

    /**
     * Node activation - performed by a user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function activate(Request $request)
    {
        // Only authenticated users can activate nodes
        if (!$request->user()) {
            Log::channel('nodes')->error("Node activation - unauthenticated: User is not authenticated");
            return response()->json([], 401);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:6|min:6|regex:/^[a-zA-Z0-9]+$/',
        ]);

        if ($validator->fails()) {
            Log::channel('nodes')->error("Node activation - validation: " . print_r($validator->errors(), true));
            return response()->json([], 400);
        }

        try {
            // check if node exists
            $node = Node::where('code', $request->input('code'))->first();
        } catch (\Exception $e) {
            Log::channel('nodes')->error("Node activation - lookup: " . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred during node lookup'
            ], 500);
        }

        if (!$node) {
            Log::channel('nodes')->error("Node activation - not found");
            return response()->json([
                'error' => 'This node is not in our records or an error occurred during node lookup'
            ], 404);
        }

        if ($node->status !== NodeStatus::CHECKIN) {
            Log::channel('nodes')->error("Node activation - not in checkin state");
            return response()->json([
                'error' => 'Node is not in checkin state'
            ], 403);
        }

        $node->status = NodeStatus::ENABLED;
        $node->enabled = true;
        $node->save();

        return response()->json([
            'status' => 'ok',
            'message' => 'Node activation successful'
        ], 200);
    }

}
