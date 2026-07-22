<?php

namespace App\Http\Controllers\Nodemanager;

use App\Http\Controllers\Controller;
use App\Model\Node;
use App\Model\NodeStatus;
use App\Services\NodeMetricService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PingController extends Controller
{
    /**
     * @var NodeMetricService
     */
    protected $metricService;

    public function __construct(NodeMetricService $metricService)
    {
        $this->metricService = $metricService;
    }

    /**
     * Handles node ping.
     * Nodes send their uuid to signal they are active.
     * Returns the node's current status and enabled state.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ping(Request $request)
    {
        Log::channel('nodes')->info("[ping] request", [
            'uuid' => $request->input('uuid'),
            'ip' => $request->ip(),
        ]);

        Log::channel('nodes')->info("[ping] request", $request->all());

        $validator = Validator::make($request->all(), [
            'uuid' => 'required|uuid',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $node = Node::where('system_uuid', $request->input('uuid'))->first();
        } catch (\Exception $e) {
            Log::channel('nodes')->error("[ping] error (lookup): " . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred during node lookup'
            ], 500);
        }

        if (!$node) {
            return response()->json([
                'error' => 'Node not found'
            ], 404);
        }

        // Update last seen
        $node->last_seen_at = now();
        $node->status = NodeStatus::READY->value;
        $node->save();

        // Process metrics if present
        if ($request->has('metrics')) {
            $this->metricService->store($node, $request->input('metrics'));
        }

        return response()->json([
            'status' => $node->status,
            'enabled' => $node->enabled,
        ]);
    }
}
