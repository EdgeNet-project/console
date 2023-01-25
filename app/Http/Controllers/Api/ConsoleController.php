<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\User;
use Auth;
use Illuminate\Http\Request;

class ConsoleController extends Controller
{
//    public function cluster(Request $request) {
//        $contextCreate = stream_context_create([
//            'ssl' => [
//                'capture_peer_cert' => true,
//                'allow_self_signed' => false,
//                'verify_peer' => false
//            ]
//        ]);
//        $res = stream_socket_client(str_replace('https://','ssl://', config('kubernetes.api.server')),
//            $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $contextCreate);
//        $response = stream_context_get_params($res);
//
//        $certInfo = openssl_x509_parse($response["options"]["ssl"]["peer_certificate"]);
//        if (!openssl_x509_export($response["options"]["ssl"]["peer_certificate"], $certString)) {
//            // TODO: manage errors
//        }
//
//        return [
//            'server' => config('kubernetes.api.server'),
//            'ca' => base64_encode($certString),
//            'info' => $certInfo
//
//        ];
//    }

    public function user(Request $request) {
        return $request->user();
    }

    public function createUser(Request $request) {
        if (!$request->user()->clusteradmin) {
            return response()->json(['message' => 'permission denied'], 403);
        }

        $validated = $request->validate([
            'email' => 'email|required',
            'name' => 'required',
            'authority' => 'required',
            'firstname' => '',
            'lastname' => ''
        ]);

        $user = User::create(array_merge($validated, ['password' => '-']));

        return response()->json($user,200);
    }

    public function patchUser(Request $request) {

    }

    public function users($name = null) {
        if ($name) {
            $user = User::where('name', $name)->first();

            if (!$user) {
                return response('',404);
            }

            return $user;
        }

        return User::select(['email','active','id','admin','nodemanager'])->get();
    }
}