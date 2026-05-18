<?php

namespace App\Http\Controllers\Node;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Stevebauman\Location\Facades\Location;
use Cslash\GeoName\Data\GeoContext;
use Cslash\GeoName\Facades\GeoName;
use function Laravel\Prompts\error;

class CheckinController extends Controller
{
    /**
     * Handle node checkin.
     * The node will be registered in the database and will be assigned a name.
     * Subsequent checkins will update the node's name and public ip if needed.
     * Will always return the node's name and public ip.
     *
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkin(Request $request)
    {
        Log::info("Node first contact", [
            'ip' => $request->ip(),
            'request' => $request->all(),
        ]);

        $validator = Validator::make($request->all(), [
            'ip' => 'required|ip',
            'uuid' => 'required|uuid',
            'code' => 'required|string|max:6|min:6|regex:/^[a-zA-Z0-9]+$/',
        ]);

        if ($validator->fails()) {

            Log:error("Node checkin error (validation): " . print_r($validator->errors(), true));

            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $localIp = $request->input('ip');
        $publicIp = $request->ip();

        try {
            // check if node already exists
            $node = Node::where('code', $request->input('code'))->first();
        } catch (\Exception $e) {
            Log::error("Node checkin error (lookup): " . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred during node lookup'
            ], 500);
        }

        if (!$node) {
            $node = new Node();
            $node->system_uuid = $request->input('uuid');
            $node->code = $request->input('code');
            $node->status = \App\Model\NodeStatus::CHECKIN->value;
            $node->enabled = false;

            Log::info("Node checkin: node is new, creating");

            // TODO: check if system_uuid is unique
        }

        // TODO: if node exists check if uuid or network is different


        // node name is dependent on location, so it is only updated
        // if node name is set and public ip changed
        if (!$node->name || $node->public_ip_v4 != $publicIp) {

            try {
                // location info of the node (use package stevebauman/location)
                $locationPosition = Location::get($publicIp);

                $location = [
                    'countryCode' => $locationPosition?->countryCode,
                    'regionName' => $locationPosition?->regionName,
                    'regionCode' => $locationPosition?->regionCode,
                    'latitude' => (float)$locationPosition?->latitude,
                    'longitude' => (float)$locationPosition?->longitude,
                ];

                // name string for the node generated in the form: FR-WEST-XX
                $context = new GeoContext(...$location);
                $baseName = Str::lower(GeoName::fromContext($context));
            } catch (\Exception $e) {
                Log::error("Node checkin error (location): " . $e->getMessage());
                return response()->json([
                    'error' => 'Failed to determine node location',
                ], 400);
            }

            // get the latest node name for the base name
            $latest = Node::where('name', 'LIKE', $baseName . '-%')
                ->selectRaw("MAX(CAST(SUBSTRING_INDEX(name, '-', -1) AS UNSIGNED)) as max_suffix")
                ->value('max_suffix');

            $node->name = sprintf('%s-%02d', $baseName, ($latest ?? 0) + 1);
            $node->location = $locationPosition;

        }

        $node->ip_v4 = $localIp;
        $node->public_ip_v4 = $publicIp;

        try {
            $node->save();
        } catch (\Exception $e) {
            Log::error("Node checkin error (save): " . $e->getMessage());
            return response()->json([
                'error' => 'Failed to save node - contact admins',
            ]);
        }

        Log::info("Node checkin", ['node' => [
            'name' => $node->name,
            'public_ip' => $node->public_ip_v4,
            'status' => $node->status,
            'enabled' => $node->enabled,
            'location' => $node->location,
        ]]);

        return response()->json([
            'name' => $node->name,
            'public_ip' => $node->public_ip_v4,
            'status' => $node->status,
            'enabled' => $node->enabled,
            'location' => $node->location,
        ]);
    }
}
