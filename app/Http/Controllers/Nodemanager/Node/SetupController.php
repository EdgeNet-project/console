<?php

namespace App\Http\Controllers\Nodemanager\Node;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Illuminate\Http\Request;

class SetupController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * returns the list of users to be added to the node
     */
    public function users(Request $request)
    {
        $uuid = $request->header('NODE-UUID');
        $code = $request->header('NODE-CODE');

        if (!$uuid || !$code) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $node = Node::where('system_uuid', $uuid)
                    ->where('code', $code)
                    ->first();

        if (!$node) {
            return response()->json(['message' => 'Node not found'], 404);
        }

        if ($node->public_ip_v4 !== $request->ip()) {
            return response()->json(['message' => 'IP mismatch'], 403);
        }

        $users = config('nodemanager.setup.users', []);

        return response()->json($users);
    }
}
