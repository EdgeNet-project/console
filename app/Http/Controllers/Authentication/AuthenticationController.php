<?php

namespace App\Http\Controllers\Authentication;

use App\Services\EdgenetAdmin;
use App\Services\Edgenet;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Model\User;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{

    public function user()
    {
        $user = auth()->user();

        return response()->json($user);
    }

    /**
     * @param EdgenetAdmin $edgenet
     * @return \Illuminate\Http\JsonResponse
     *
     * TODO: Requests filtering by user should be done by the edgenet access controller
     * TODO: Requests should be filtered if user is NOT admin only own requests are returned
     */
    public function requests(EdgenetAdmin $edgenet)
    {

        $tenantRequests = $edgenet->getCluster()
            ->tenantRequest()->get();

        $roleRequests = $edgenet->getCluster()
            ->roleRequest()->get();

        return response()->json([
            'tenants' => $tenantRequests->filter(function($r) {
                return $r->getEmail() != auth()->user()->email;
            }),
            'roles' => $roleRequests
        ]);
    }

    public function updateUser(Request $request)
    {
        $data = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
        ]);
        $user = auth()->user();
        $user->firstname = $data['firstname'];
        $user->lastname = $data['lastname'];
        $user->save();

        return response()->json(['message' => 'saved']);
    }

    public function login()
    {
        validator(request()->all(), [
            'email' => ['required', 'email'],
            'password' => ['required']
        ])->validate();

        $user = User::where('email', request('email'))->first();

        if (!$user) {
            return response()->json(['message' => 'authentication failed'], 401);
        }

        if (Hash::check(request('password'), $user->getAuthPassword())) {

            $token = $user->createToken('app-admins');

            return response()->json([
                'token' => $token->plainTextToken
            ]);
        }

        return response()->json(['message' => 'authentication failed'], 401);
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'logged out']);
    }
}
