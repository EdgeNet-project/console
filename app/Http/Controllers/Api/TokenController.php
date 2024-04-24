<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Sanctum\Sanctum;

class TokenController extends Controller
{

    protected function getTokens()
    {
        return auth()->user()->tokens->where('name', '!=', 'app-admins')->values();
    }
    public function list()
    {
        return response()->json(
            $this->getTokens()
        );
    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'overwrite' => ['boolean']
        ]);

        $user = auth()->user();

        $currentTokens = $user->tokens->where('name', $data['name']);

        if ($request->input('overwrite', false)) {
            $currentTokens->each(function($token) {
                (Sanctum::$personalAccessTokenModel)::find($token->id)->delete();
            });
        } else if ($currentTokens->count() > 0) {
            return response()->json([
                'message' => 'Token with the same name already exists'
            ], 400);
        }

        $token = $user->createToken($data['name']);

        return response()->json([
            'token' => $token
        ]);
    }

    public function delete($name)
    {
        $token = auth()->user()->tokens->where('name', $name)->first();

        (Sanctum::$personalAccessTokenModel)::find($token->id)->delete();

        return response()->json($this->getTokens());
    }
}