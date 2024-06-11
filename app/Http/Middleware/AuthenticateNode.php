<?php

namespace App\Http\Middleware;

use App\Model\Node;
use Closure;
use Illuminate\Http\Request;

class AuthenticateNode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {

        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'token missing'], 401);
        }

        $node = Node::where(['auth' => $token])->first();
        if (!$node) {
            return response()->json(['message' => 'token not found'], 401);
        }

        $request->attributes->add(['node' => $node]);

        return $next($request);
    }
}
