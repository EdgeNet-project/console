<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\ClickHouseService;
use Illuminate\Http\Request;

class FlowController extends Controller
{
    public function list(Request $request, ClickHouseService $ch)
    {
        $minutes = max(1, min((int) $request->integer('minutes', 60), 1440));
        $namespace = $request->string('namespace')->toString();
        $pod = $request->string('pod')->toString();

        $where = [
            "flowStartSeconds >= now() - INTERVAL {$minutes} MINUTE",
        ];

        if ($namespace !== '') {
            $ns = addslashes($namespace);
            $where[] = "(sourcePodNamespace = '{$ns}' OR destinationPodNamespace = '{$ns}')";
        }

        if ($pod !== '') {
            $p = addslashes($pod);
            $where[] = "(sourcePodName = '{$p}' OR destinationPodName = '{$p}')";
        }

        $sql = "
            SELECT * FROM flows 
            WHERE " . implode(' AND ', $where) . "
            ORDER BY flowStartSeconds DESC
            LIMIT 200
        ";

        return response()->json($ch->select($sql));
    }

    public function topTalkers(Request $request, ClickHouseService $ch)
    {
        $minutes = max(1, min((int) $request->integer('minutes', 60), 1440));

        $sql = "
            SELECT
                sourcePodNamespace,
                sourcePodName,
                sum(octetDeltaCount) AS bytes
            FROM flows
            WHERE timeReceived >= now() - INTERVAL {$minutes} MINUTE
            GROUP BY sourcePodNamespace, sourcePodName
            ORDER BY bytes DESC
            LIMIT 20
        ";

        return response()->json($ch->select($sql));
    }
}