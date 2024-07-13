<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Edgenet;
use App\Http\Resources\PodResource;

class PodController extends Controller
{
    function list(Request $request, Edgenet $edgenet)
    {

        $data = $request->validate([
            'namespace' => 'nullable|string',
        ]);

        $pods = $edgenet->getCluster()
            ->getAllPods($data['namespace']);

        return response()->json(
            PodResource::collection($pods)
        );

    }
}
