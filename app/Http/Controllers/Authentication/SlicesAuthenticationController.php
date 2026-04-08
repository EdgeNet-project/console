<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Resources\UserResource;
use App\Model\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Log;

class SlicesAuthenticationController extends Controller
{

    public function redirect()
    {
        return Socialite::driver('oidc')->redirect();
    }

    public function callback(Request $request)
    {
        $slicesUser = Socialite::driver('oidc')->user();

        //Log::info("Slices login:", ['slicesUser' => $slicesUser]);

        $user = User::where('email', $slicesUser->getEmail())->first();
        if ($user) {
            $user->update([
                'email'     => $user->email ?: $slicesUser->getEmail(),
                'slices_info' => $slicesUser->user,

            ]);
        } else {

            $user = User::create([
                'firstname' => $slicesUser->first_name,
                'lastname' => $slicesUser->last_name,
                'email' => $slicesUser->email,
                'slices_info' => $slicesUser->user,
            ]);
        }

        $user->markEmailAsVerified();

        $token = $user->createToken('console');

        activity('auth')
            ->causedBy($user)
            ->withProperties([
                'severity' => 'info',
                'ip' => $request->getClientIp(),
                'client' => $request->userAgent()
            ])
            ->log('Authentication succeeded (slices)');

        return response()->view('auth.slices', [
            'token' => $token->plainTextToken,
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
            ],
            'origin' => config('app.url'),
        ]);
    }
}