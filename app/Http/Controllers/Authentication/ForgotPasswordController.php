<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Model\User;
use App\Notifications\PasswordResetLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    /**
     * Basic functionalities for sending an email with a reset password link
     *
     * @return JsonResponse
     */
    public function sendPasswordResetLink(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        $user = User::where('email', $data['email'])->first();
        if (!$user) {
            return response()->json(['message' => 'User does not exist'], 400);
        }

        /*
         * Creates a temporary signature
         * Will last 30 minutes
         */
        $signature = Str::random(32);

        Cache::put('password.reset.' . $user->id, $signature, 1800);

        $url = url('/password/reset/' . $user->id . '/' . $signature);

//        $url = URL::temporarySignedRoute(
//            'password.reset', now()->addMinutes(30), [ 'email' => $data['email'] ]
//        );

//        $token = Str::random(64);
//
//        DB::table('password_resets')->insert([
//            'email' => $request->email,
//            'token' => $token,
//            'created_at' => Carbon::now()
//        ]);
//
//        Mail::send('email.forgetPassword', ['token' => $token], function($message) use($request){
//            $message->to($request->email);
//            $message->subject('Reset Password');
//        });

//        $message = (new MailMessage)
//            ->subject('Reset Password Notification')
//            ->line('You are receiving this email because we received a password reset request for your account.')
//            ->action('Reset Password', $url)
//            ->line('This password reset link will expire in :count minutes.', [
//                'count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')])
//            ->line('If you did not request a password reset, no further action is required.');

        $user->notify(new PasswordResetLink($url));
//        Mail::to($user)
//            ->send($message);

        return response()->json([
            'url' => $url
        ]);
    }

    /**
     * Write code on Method
     *
     * @return JsonResponse
     */
    public function resetPassword(Request $request, User $user, $signature)
    {

        $cachedSignature = Cache::get('password.reset.' . $user->id);

        if (!$cachedSignature) {
            return response()->json(['message' => 'The URL is invalid or has expired.'], 401);
        }

        if ($cachedSignature != $signature) {
            return response()->json(['message' => 'The signature is invalid.'], 401);
        }

        $request->validate([
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required'
        ]);

        $user->update([
            'password' => Hash::make($request->input('password'))
        ]);

        return response()->json([
            'message' => 'Your password has been changed!'
        ]);
    }

}
