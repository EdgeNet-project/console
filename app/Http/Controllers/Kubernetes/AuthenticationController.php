<?php

namespace App\Http\Controllers\Kubernetes;

use App\Http\Controllers\Controller;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Class AuthenticationController
 * @package App\Http\Controllers\Kubernetes
 *
 * This controller will be used by the kubernetes API server to verify user tokens
 */
class AuthenticationController extends Controller
{
    public function webhook(Request $request)
    {
        Log::channel('auth-webhook')
            ->debug(var_export($request->all(), true));

        $failed = [
            'apiVersion' => 'authentication.k8s.io/v1',
            'kind' => 'TokenReview',
            'status' => [ 'authenticated' => false ]
        ];

        if ($request->input('kind') != 'TokenReview') {
            Log::channel('auth-webhook')
                ->error('Wrong Kind subject');
            return response()->json($failed, 400);
        }

        if (!$request->has('spec.token')) {
            Log::channel('auth-webhook')
                ->error('No token specified');
            return response()->json($failed, 401);
        }

        $token = PersonalAccessToken::findToken($request->input('spec.token'));
        Log::channel('auth-webhook')
            ->debug('Token:', [ $token ]);

        if (!$token) {
            /*
             * We don't have this token, return 401, Kubernetes will then
             * try other authentication methods.
             * Note: logging is in debug only mode to avoid polluting the logs.
             */
            Log::channel('auth-webhook')
                ->debug('Invalid token, User not authenticated');

            return response()->json($failed, 401);
        }

        $user = $token->tokenable;
        if (!$user) {
            /*
             * For some reason the user does not exist, we keep this as a file safe
             * but it should not happen.
             */
            Log::channel('auth-webhook')
                ->error('Invalid user, User not authenticated');

            return response()->json($failed, 401);
        }

        // TODO: check user is active and user permissions

        // Teams
        $teams = [];
        if ($user->tenants) {
            $teams = $user->tenants->map(function ($team) { return $team->name; });
        }
        //
        $workspaces = [];
        if ($user->sub_namespaces) {
            $workspaces = $user->sub_namespaces->map(function ($workspace) {
                return $workspace->tenant->name . ':' . $workspace->name;
            });
        }

        $groups = [
            'edgenet:user',
            ...$teams,
            ...$workspaces,
        ];

        $response = [
            'apiVersion' => 'authentication.k8s.io/v1',
            'kind' => 'TokenReview',
            'status' => [
                'authenticated' => true,
                'user' => [
                    'username' => $user->email,
                    // we don't use uid ATM
                    // 'uid' => 123,
                    'groups' => $groups,
                    // Optional additional information provided by the authenticator.
                    // This should not contain confidential data, as it can be recorded in logs
                    // or API objects, and is made available to admission webhooks.
//                    'extra' => [
//                        'extrafield1' => [
//                            'extravalue1',
//                            'extravalue2'
//                        ]
//                    ]
                ]
            ]
        ];

        Log::channel('auth-webhook')
            ->debug(print_r($response, true));

        Log::channel('auth-webhook')
            ->info('User ' . $user->email . ' authenticated - groups: ' . join(', ', $groups));

        return response()->json($response);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     *
     * TODO: kubernetes dashboard authentication
     * https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/README.md#authorization-header
     */
    function dashboard(Request $request)
    {
        //$credentials = $request->only('email', 'password');

        Log::channel('kubernetes')->info(var_export($request, true));

        return response('', 200);

        $this->middleware('auth:api');

        if (!$request->user()) {
            //Auth:attempt
        }
        Log::channel('kubernetes')->info(var_export($request->user(), true));
//        if () {
            // Authentication passed...
            //return redirect()->intended('dashboard');
//        }

        //return view('auth.login');
        // login

    }
}
