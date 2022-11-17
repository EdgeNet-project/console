<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{
    public function login()
    {
        validator(request()->all(), [
            'email' => ['required', 'email'],
            'password' => ['required']
        ])->validate();

        $user = User::where('email', request('email'))->first();

        if (Hash::check(request('password'), $user->getAuthPassword())) {
            return [
                'token' => $user->createToken('app-admins')
            ];
        }

        return response()->json(['message' => 'authentication failed'], 301);
    }

    public function user()
    {
        return auth()->user();
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'logged out']);
    }
}
