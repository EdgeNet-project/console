<?php

namespace App\Http\Controllers\Edgenet\old;

use App\Http\Controllers\Controller;
use Auth;
use GuzzleHttp\Client;
use Illuminate\Http\Request;


/*
 * Passthrough class (Proxy)
 */
class ResourceController extends Controller
{

    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    private function headers() {
        $headers = [
            'Content-Type' => request()->headers->get('Content-Type','application/json'),
            'Accept' => 'application/json',
        ];
        if (Auth::user()) {
            $headers += [
                'Authorization' => 'Bearer ' . Auth::user()->api_token,
            ];
        }

        return $headers;
    }

    public function get(Request $request, $any = null)
    {
        try {
            $response = $this->client->request('GET', config('edgenet.api.server') . '/' . $request->path(), [
                'headers' => $this->headers(),
                'verify' => false,
                //'debug' => true
                'query' => [],
                'exceptions' => false
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

        return response()->json(json_decode($response->getBody()), $response->getStatusCode());
    }

    public function patch(Request $request, $any)
    {

        try {
            $response = $this->client->request('PATCH', config('edgenet.api.server') . '/' . $request->path(), [
                'headers' => $this->headers(),
                'verify' => false,
                //'debug' => true
                'query' => $request->query(),
                'exceptions' => false,
                'json' => $request->all()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

        return response()->json(json_decode($response->getBody()), $response->getStatusCode());
    }
}
