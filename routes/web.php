<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\RegistrationController;
use App\Model\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;



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


Route::view('/{any?}', 'console')
    ->where('any', '.*');
