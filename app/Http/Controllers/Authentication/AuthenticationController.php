<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Resources\UserResource;
use App\Services\EdgenetAdmin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Model\User;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{

    public function user()
    {
        $user = auth()->user();

        return response()->json(new UserResource($user));
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

        activity('auth')
            //->performedOn($this->team)
            ->causedBy($user)
            ->withProperties([
                'severity' => 'info',
                'ip' => $request->getClientIp(),
                'client' => $request->userAgent()
            ])
            ->log('User updated successfully');

        return response()->json(['message' => 'saved']);
    }

    public function login(Request $request)
    {
        validator(request()->all(), [
            'email' => ['required', 'email'],
            'password' => ['required']
        ])->validate();

        $user = User::where('email', request('email'))->first();

        if (!$user) {

            activity('auth')
                //->performedOn($this->team)
                //->causedBy($user)
                ->withProperties([
                    'severity' => 'error',
                    'ip' => $request->getClientIp(),
                    'client' => $request->userAgent(),
                    'email' => request('email'),
                ])
                ->log('Authentication failed (user)');

            return response()->json(['message' => 'authentication failed'], 401);
        }

        if (Hash::check(request('password'), $user->getAuthPassword())) {

            $token = $user->createToken('console');

            activity('auth')
                //->performedOn($this->team)
                ->causedBy($user)
                ->withProperties([
                    'severity' => 'info',
                    'ip' => $request->getClientIp(),
                    'client' => $request->userAgent()
                ])
                ->log('Authentication succeeded');

            return response()->json([
                'token' => $token->plainTextToken
            ]);
        } else {
            activity('auth')
                //->performedOn($this->team)
                ->causedBy($user)
                ->withProperties([
                    'severity' => 'error',
                    'ip' => $request->getClientIp(),
                    'client' => $request->userAgent()
                ])
                ->log('Authentication failed (password)');

            return response()->json(['message' => 'authentication failed'], 401);
        }
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'logged out']);
    }
}
