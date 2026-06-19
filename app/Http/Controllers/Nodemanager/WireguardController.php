<?php

namespace App\Http\Controllers\Nodemanager;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WireguardController extends Controller
{

    /**
     * wireguard peer activation
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function wireguard(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'uuid' => 'required|uuid',
            'code' => 'required|string|max:6|min:6|regex:/^[a-zA-Z0-9]+$/',
            'public_key' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::channel('nodes')->error("[wireguard] validation: " . print_r($validator->errors(), true));
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // check if node exists
            $node = Node::where([
                'system_uuid' => $request->input('uuid'),
                'code' => $request->input('code'),
            ])->first();
        } catch (\Exception $e) {
            Log::channel('nodes')->error("[wireguard] lookup: " . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred during node lookup'
            ], 500);
        }

        if (!$node) {
            Log::channel('nodes')->error("[wireguard] not found: uuid=" . $request->input('uuid') . " code=" . $request->input('code'));
            return response()->json([
                'error' => 'This node is not in our records or an error occurred during node lookup'
            ], 404);
        }

        if (!$node->enabled) {
            Log::channel('nodes')->error("[wireguard] not enabled: node_id=" . $node->id);
            return response()->json([
                'error' => 'Node is not enabled'
            ], 403);
        }

        // calculate address
        $networkCidr = config('planetlab.wireguard.network', '10.80.0.0/16');
        list($networkIp, $mask) = explode('/', $networkCidr);
        $mask = (int) $mask;

        $assignedIp = null;

        if (isset($node->wireguard['address']) && $node->wireguard['address']) {
            $assignedIp = $node->wireguard['address'];
        } else {
            // Find all nodes with an assigned wireguard address
            $usedIps = Node::whereNotNull('wireguard->address')
                ->pluck('wireguard')
                ->pluck('address')
                ->toArray();

            $usedIpsLong = array_map('ip2long', $usedIps);
            sort($usedIpsLong);

            $networkLong = ip2long($networkIp);
            $broadcastLong = $networkLong | ((1 << (32 - $mask)) - 1);

            // Start finding from .11
            // If it's 10.80.0.0/16, .11 is 10.80.0.11
            $startIpLong = $networkLong + 11;

            Log::channel('nodes')->info("[wireguard] IP pool: " . $networkCidr . " start=" . long2ip($startIpLong) . " broadcast=" . long2ip($broadcastLong) . " used=" . count($usedIpsLong));

            for ($ipLong = $startIpLong; $ipLong < $broadcastLong; $ipLong++) {
                Log::channel('nodes')->info("[wireguard] checking: " . long2ip($ipLong));
                if (!in_array($ipLong, $usedIpsLong)) {
                    $assignedIp = long2ip($ipLong);
                    break;
                }
            }

            if (!$assignedIp) {
                Log::channel('nodes')->error("[wireguard] IP pool exhausted in " . $networkCidr);
                return response()->json(['error' => 'IP pool exhausted'], 500);
            }
        }

        $node->wireguard = [
            'public_key' => $request->input('public_key'),
            'address' => $assignedIp,
            'listen_port' => 51820,
        ];
        $node->save();

        Log::channel('nodes')->info("[wireguard] activated: node_id=" . $node->id . " wg_ip=" . $assignedIp);

        return response()->json([
            'endpoint' => config('planetlab.wireguard.endpoint_address') . ':' . config('planetlab.wireguard.endpoint_port'),
            'endpoint_key' => config('planetlab.wireguard.endpoint_key'),
            'address' => $assignedIp . '/' . $mask,
            'allowed_ips' => config('planetlab.wireguard.allowed_ips', '10.80.0.1/32'),
            'mtu' => config('planetlab.wireguard.mtu', 1420),
            'persistent_keepalive' => config('planetlab.wireguard.persistent_keepalive', 25),
        ]);
    }

    /**
     * Generate WireGuard peers configuration
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function peers(Request $request)
    {
        if ($request->ip() !== config('planetlab.wireguard.endpoint_ip')) {
            Log::channel('nodes')->warning("[wireguard-peers] unauthorized access from " . $request->ip());
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $nodes = Node::whereNotNull('wireguard->public_key')
            ->whereNotNull('wireguard->address')
            ->get();

        $peers = [];
        foreach ($nodes as $node) {
            $peers[] = [
                'public_key' => $node->wireguard['public_key'],
                'allowed_ips' => $node->wireguard['address'] . '/32',
            ];
        }

        return response()->json($peers);
    }
}
