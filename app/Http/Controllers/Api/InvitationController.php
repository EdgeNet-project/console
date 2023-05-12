<?php

namespace App\Http\Controllers\Api;

use App\CRDs\SubNamespace;
use App\Http\Controllers\Controller;
use App\Model\User;
use App\Notifications\InvitationLink;
use App\Notifications\PasswordResetLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function create(Request $request)
    {

        $input = $request->validate([
            'emails.*' => 'required|email',
            'workspace' => 'exists:App\Model\SubNamespace,name'
        ]);

        $workspace = SubNamespace::where('name', $input['name'])->firstOrFail();

        foreach ($input['emails'] as $email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                continue;
            }

            $user = User::create([
                'email' => $email,
            ]);



            /*
             * Creates a temporary signature
             * Will last 6 days
             */
            $signature = Str::random(32);

            Cache::put('password.reset.' . $user->id, $signature, 3600 * 24 * 6);

            $url = url('/password/reset/' . $user->id . '/' . $signature);

            $user->notify(new InvitationLink($url));
        }


    }
}
