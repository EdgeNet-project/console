<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Illuminate\Http\Request;
use RenokiCo\PhpK8s\KubernetesCluster;

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

    public function create(Request $request)
    {
        $input = $request->validate([
            'hostname' => 'required',
            'type' => 'required'
        ]);

        $node = Node::create([
            'type' => $input['type'],
            'hostname' => $input['hostname'],
            'user_id' => $request->user()->id
        ]);

        return response()->json($node);

    }
}
