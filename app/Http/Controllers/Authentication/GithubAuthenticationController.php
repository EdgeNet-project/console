<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Model\User;
use Illuminate\Support\Str;

class GithubAuthenticationController extends Controller
{

    public function redirect()
    {
        return Socialite::driver('github')
            ->scopes(['read:user', 'user:email'])
            ->redirect();
    }

    public function callback(Request $request)
    {
        $githubUser = Socialite::driver('github')->user();

        // First try by provider ID
        $user = User::where('github_id', $githubUser->getId())->first();

        if (! $user && $githubUser->getEmail()) {
            // Fallback: match existing account by email
            $user = User::where('email', $githubUser->getEmail())->first();
        }

//        $locale = $user->user['locale'];
//        $email_verified = $user->user['email_verified'];


        if ($user) {
            $user->update([
                'github_id' => $githubUser->getId(),
                'avatar'    => $githubUser->getAvatar(),
                'email'     => $user->email ?: $githubUser->getEmail(),
                'location'  => $githubUser->user['location'],
                'bio'       => $githubUser->user['bio'],
                'blog'      => $githubUser->user['blog'],
                'company'   => $githubUser->user['company'],
            ]);
        } else {

            $name = $githubUser->getName() ?? $githubUser->getNickname();

            $parts = explode(' ', trim($name));

            $firstname = array_shift($parts);
            $lastname = implode(' ', $parts);

            $user = User::create([
                'github_id' => $githubUser->getId(),
                'firstname'      => $firstname,
                'lastname'      => $lastname,
                'email'     => $githubUser->getEmail(),
                'avatar'    => $githubUser->getAvatar(),
                // Random password so the column is not null if your schema requires it
                'password'  => bcrypt(Str::random(32)),
            ]);
        }

        $token = $user->createToken('console');

        activity('auth')
            ->causedBy($user)
            ->withProperties([
                'severity' => 'info',
                'ip' => $request->getClientIp(),
                'client' => $request->userAgent()
            ])
            ->log('Authentication succeeded (github)');

        return response()->view('auth.github', [
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