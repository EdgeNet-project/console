<?php

namespace App\Http\Controllers\Kubernetes;

use App\Http\Controllers\Controller;
//use App\Model\AuditEvent;
use App\Model\AuditEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuditController extends Controller
{
    public function webhook(Request $request): JsonResponse
    {
        $token = config('kubernetes.audit.token');

        if ($token && $request->bearerToken() !== $token) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 401);
        }

        if (! $request->isJson()) {
            return response()->json([
                'message' => 'Expected application/json payload.',
            ], 415);
        }

        $payload = $request->json()->all();

        $kind = data_get($payload, 'kind');
        $apiVersion = data_get($payload, 'apiVersion');

        if ($apiVersion !== 'audit.k8s.io/v1') {
            return response()->json([
                'message' => 'Unsupported apiVersion.',
            ], 400);
        }

        $events = match ($kind) {
            'Event' => [$payload],
            'EventList' => data_get($payload, 'items', []),
            default => [],
        };

        if (empty($events)) {
            return response()->json([
                'message' => 'No audit events found in payload.',
            ], 400);
        }

        $accepted = 0;

        foreach ($events as $event) {
            if (! is_array($event)) {
                continue;
            }

            $record = [
                'audit_id' => data_get($event, 'auditID'),
                'level' => data_get($event, 'level'),
                'stage' => data_get($event, 'stage'),
                'verb' => data_get($event, 'verb'),
                'request_uri' => data_get($event, 'requestURI'),

                'username' => data_get($event, 'user.username'),
                'user_uid' => data_get($event, 'user.uid'),
                'user_groups' => data_get($event, 'user.groups', []),
                'impersonated_user' => data_get($event, 'impersonatedUser'),

                'resource' => data_get($event, 'objectRef.resource'),
                'subresource' => data_get($event, 'objectRef.subresource'),
                'namespace' => data_get($event, 'objectRef.namespace'),
                'api_group' => data_get($event, 'objectRef.apiGroup'),
                'api_version' => data_get($event, 'objectRef.apiVersion'),
                'resource_name' => data_get($event, 'objectRef.name'),
                'resource_version' => data_get($event, 'objectRef.resourceVersion'),

                'source_ips' => data_get($event, 'sourceIPs', []),
                'user_agent' => data_get($event, 'userAgent'),

                'response_code' => data_get($event, 'responseStatus.code'),
                'response_reason' => data_get($event, 'responseStatus.reason'),
                'response_status' => data_get($event, 'responseStatus.status'),

                'request_received_at' => data_get($event, 'requestReceivedTimestamp'),
                'stage_at' => data_get($event, 'stageTimestamp'),

                'annotations' => data_get($event, 'annotations', []),
            ];

            Log::channel('audit-webhook')
                ->info('kubernetes.audit', $record);


            AuditEvent::create([
                ...$record,
                'raw_event' => $event,
            ]);

            $accepted++;
        }

        return response()->json([
            'message' => 'Audit events accepted.',
            'accepted' => $accepted,
        ], 200);
    }
}