<?php

use App\Model\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Http\Controllers\Authentication\SlicesAuthenticationController;
use App\Http\Controllers\Authentication\GithubAuthenticationController;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


/*
 * User email verification route
 * https://laravel.com/docs/9.x/verification
 */
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->name('verification.notice');


Route::get('/email/verify/{id}/{hash}', function (Request $request, $id) {

    $user = User::findOrFail($id);

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();

        event(new Verified($user));
    }
    return redirect('/');
})->middleware(['signed'])->name('verification.verify');

/*
 * External authentication through OAuth2 and OICD
 */
Route::group(['prefix' => 'auth'], function () {

    Route::get('/slices', [SlicesAuthenticationController::class, 'redirect'])
        ->name('auth.slices');

    Route::get('/slices/callback', [SlicesAuthenticationController::class, 'callback'])
        ->name('auth.slices.callback');

    Route::get('/github', [GithubAuthenticationController::class, 'redirect'])
        ->name('auth.github');

    Route::get('/github/callback', [GithubAuthenticationController::class, 'callback'])
        ->name('auth.github.callback');
});


Route::view('/{any?}', 'console')
    ->where('any', '.*');
