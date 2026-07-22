<?php

namespace App\Http\Controllers\Nodemanager;

use App\Http\Controllers\Controller;
use App\Model\Node;
use App\Model\NodeStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ManageController extends Controller
{

    /**
     * Node list - admin only
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
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

    /**
     * Node metrics - admin only
     *
     * @param Request $request
     * @param Node|null $node
     * @return JsonResponse
     */
    public function metrics(Request $request, Node $node = null)
    {
        $range = $request->query('range', 'raw');

        $metrics = match ($range) {
            'hourly' => $node->hourlyMetrics()->latest('hour')->limit(24)->get(),
            'daily' => $node->dailyMetrics()->latest('day')->limit(30)->get(),
            'weekly' => $node->weeklyMetrics()->latest('week_start')->limit(12)->get(),
            'monthly' => $node->monthlyMetrics()->latest('month')->limit(12)->get(),
            default => $node->metrics()->latest('recorded_at')->limit(60)->get(),
        };

        return response()->json($metrics);
    }

    /**
     * Node activation - admin only
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function enable(Request $request, Node $node)
    {

        // Only authenticated users can activate nodes
        if (!$request->user()) {
            Log::channel('nodes')->error("Node enable - unauthenticated: User is not authenticated");
            return response()->json([], 401);
        }

        if (!$request->user()->admin) {
            Log::channel('nodes')->error("Node enable - unauthorized: User is not an admin");
            return response()->json([], 403);
        }

        $node->enabled = $request->input('enabled', true);
        $node->save();

        return response()->json($node);
    }
}