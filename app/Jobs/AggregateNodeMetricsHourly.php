<?php

namespace App\Jobs;

use App\Model\Node;
use App\Model\NodeMetric;
use App\Model\NodeMetricHourly;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class AggregateNodeMetricsHourly implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $startOfPreviousHour = now()->subHour()->startOfHour();
        $endOfPreviousHour = $startOfPreviousHour->copy()->endOfHour();

        $nodes = Node::all();

        foreach ($nodes as $node) {
            $metrics = NodeMetric::where('node_id', $node->id)
                ->whereBetween('recorded_at', [$startOfPreviousHour, $endOfPreviousHour])
                ->get();

            if ($metrics->isEmpty()) {
                continue;
            }

            NodeMetricHourly::updateOrCreate(
                [
                    'node_id' => $node->id,
                    'hour' => $startOfPreviousHour,
                ],
                [
                    'avg_cpu_usage_percent' => $metrics->avg('cpu_usage_percent'),
                    'max_cpu_usage_percent' => $metrics->max('cpu_usage_percent'),
                    'avg_network_rx_bytes_per_sec' => $metrics->avg('network_rx_bytes_per_sec'),
                    'max_network_rx_bytes_per_sec' => $metrics->max('network_rx_bytes_per_sec'),
                    'avg_network_tx_bytes_per_sec' => $metrics->avg('network_tx_bytes_per_sec'),
                    'max_network_tx_bytes_per_sec' => $metrics->max('network_tx_bytes_per_sec'),
                    'avg_disk_read_bytes_per_sec' => $metrics->avg('disk_read_bytes_per_sec'),
                    'avg_disk_write_bytes_per_sec' => $metrics->avg('disk_write_bytes_per_sec'),
                ]
            );
        }
    }
}
