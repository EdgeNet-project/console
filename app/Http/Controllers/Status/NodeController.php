<?php

namespace App\Http\Controllers\Status;

use App\Http\Controllers\Controller;
use App\Http\Resources\Status\NodeResource;
use App\Model\Node;
use Illuminate\Http\Request;

class NodeController extends Controller
{
    /**
     * Node list - admin only
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function list(Request $request)
    {
        $node = Node::orderBy('name')->get();

        return response()->json(NodeResource::collection($node));
    }
}
