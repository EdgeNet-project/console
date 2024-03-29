<?php

namespace App\Http\Controllers\Authentication;

use App\CRDs\RoleRequest;
use App\Http\Controllers\Controller;
use App\Model\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegistrationController extends Controller
{

    public function register(Request $request)
    {
        $data = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);


        try {
            $user = User::create([
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }


        event(new Registered($user));

        return response()->json([
            'message' => 'user created'
        ]);
    }

    public function sendEmailVerificationLink()
    {
        event(new Registered(auth()->user()));

        return response()->json([
            'message' => 'notification sent'
        ]);
    }

    public function setAUPAccepted()
    {
        $user = auth()->user();
        $user->aup_accepted_at = now();
        $user->save();

        return response()->json([
            'message' => 'AUP accepted'
        ]);

    }




}
