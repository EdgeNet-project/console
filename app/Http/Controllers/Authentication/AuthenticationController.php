<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Model\User;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{

    public function user()
    {
        return response()->json(auth()->user());
    }

    public function login()
    {
        validator(request()->all(), [
            'email' => ['required', 'email'],
            'password' => ['required']
        ])->validate();

        $user = User::where('email', request('email'))->first();

        if (Hash::check(request('password'), $user->getAuthPassword())) {

            $token = $user->createToken('app-admins');

            return response()->json([
                'token' => $token->plainTextToken
            ]);
        }

        return response()->json(['message' => 'authentication failed'], 301);
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'logged out']);
    }
}
