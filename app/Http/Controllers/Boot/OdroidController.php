<?php

namespace App\Http\Controllers\Boot;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OdroidController extends Controller
{
    public function boot(Request $request)
    {
        Log::channel('nodes')
            ->info('script request from ' . $request->ip());

        // TODO: nodes should authenticate

        return response()
            ->view('boot/odroid', [

            ])
            ->header('Content-Type', 'text/plain');
    }

    public function register(Request $request)
    {
        Log::channel('nodes')
            ->info('register request from ' . $request->ip());

        $input = $request->validate([
            'mac' => 'required|mac_address',
            'ipv4' => 'required|ipv4',
            'gatewayv4' => 'required|ipv4',
        ]);

        $ips = [];
        if (filter_var($request->ip(), FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $ips['public_ipv4'] = $request->ip();
        }

        if (filter_var($request->ip(), FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            $ips['ipv6'] = $request->ip();
        }

        $node = Node::updateOrCreate(array_merge(
            $input, [ 'type' => Node::ODROID ], $ips
        ));

        if ($node->installed == 0) {
            Log::channel('nodes')
                ->info('[' . $node->mac . '] is installing');
        } else {
            Log::channel('nodes')
                ->info('[' . $node->mac . '] is rebooting');
        }

        return response($node->installed ? '1' : '0')
            ->header('Content-Type','text/plain');
    }

    public function update(Request $request)
    {
        return response('', 200)
            ->header('Content-Type','text/plain');
    }

    public function installed(Request $request)
    {
        $input = $request->validate([
            'mac' => 'required|mac_address'
        ]);

        $node = Node::where('mac', $input['mac'])->first();
        if (!$node->exists()) {
            return response('', 404)
                ->header('Content-Type','text/plain');
        }

        $node->installed = true;
        $node->save();

        Log::channel('nodes')
            ->info('[' . $node->mac . '] finished installation');

        return response('', 200)
            ->header('Content-Type','text/plain');

    }
}
