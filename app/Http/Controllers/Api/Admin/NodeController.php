<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\NodeResource;
use App\Http\Resources\PodResource;
use App\Model\Node;
use App\Services\Edgenet;
use App\Services\EdgenetAdmin;
use Illuminate\Http\Request;
use RenokiCo\PhpK8s\KubernetesCluster;
use Spatie\Activitylog\Models\Activity;

class NodeController extends Controller
{
//    public function list(Request $request)
//    {
//        return response()->json(
//            Node::where('user_id', $request->user()->id)->get()
//        );
//    }

    function list(Request $request, EdgenetAdmin $edgenet)
    {

//        $data = $request->validate([
//            'namespace' => 'nullable|string',
//        ]);

        $nodes = $edgenet->getCluster()
            ->getAllNodes();

        return response()->json(
            NodeResource::collection($nodes)
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
