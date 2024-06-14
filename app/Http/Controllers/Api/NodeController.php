<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Illuminate\Http\Request;
use RenokiCo\PhpK8s\KubernetesCluster;
use Spatie\Activitylog\Models\Activity;

class NodeController extends Controller
{
    public function list(Request $request)
    {
        return response()->json(
            Node::where('user_id', $request->user()->id)->get()
        );
    }

    public function get(Request $request, Node $node)
    {
        return response()->json(
            $node
        );
    }

    public function activity(Request $request, Node $node)
    {
        return response()->json(
            $node->activities
        );
    }

    public function create(Request $request)
    {
        $input = $request->validate([
            'code' => 'string',
        ]);

        $node = Node::create([
            'user_id' => $request->user()->id
        ]);

        return response()->json($node);

    }
}
