<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use RenokiCo\PhpK8s\KubernetesCluster;

class ClusterController extends Controller
{
    public function get()
    {
        $contextCreate = stream_context_create([
            'ssl' => [
                'capture_peer_cert' => true,
                'allow_self_signed' => false,
                'verify_peer' => false
            ]
        ]);
        $res = stream_socket_client(str_replace('https://','ssl://', config('edgenet.cluster.host')),
            $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $contextCreate);
        $response = stream_context_get_params($res);

        $certInfo = openssl_x509_parse($response["options"]["ssl"]["peer_certificate"]);
        if (!openssl_x509_export($response["options"]["ssl"]["peer_certificate"], $certString)) {
            // TODO: manage errors
        }

        return response()->json([
            'server' => config('edgenet.cluster.api'),
            'ca' => base64_encode($certString),
            'info' => $certInfo
        ]);
    }
}
