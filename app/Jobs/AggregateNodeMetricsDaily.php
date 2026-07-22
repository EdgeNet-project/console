<?php

namespace App\Jobs;

use App\Model\Node;
use App\Model\NodeMetricHourly;
use App\Model\NodeMetricDaily;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AggregateNodeMetricsDaily implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $yesterday = now()->subDay()->startOfDay();
        $endOfYesterday = $yesterday->copy()->endOfDay();

        $nodes = Node::all();

        foreach ($nodes as $node) {
            $hourlyMetrics = NodeMetricHourly::where('node_id', $node->id)
                ->whereBetween('hour', [$yesterday, $endOfYesterday])
                ->get();

            if ($hourlyMetrics->isEmpty()) {
                continue;
            }

            NodeMetricDaily::updateOrCreate(
                [
                    'node_id' => $node->id,
                    'day' => $yesterday->toDateString(),
                ],
                [
                    'avg_cpu_usage_percent' => $hourlyMetrics->avg('avg_cpu_usage_percent'),
                    'max_cpu_usage_percent' => $hourlyMetrics->max('max_cpu_usage_percent'),
                    'avg_network_rx_bytes_per_sec' => $hourlyMetrics->avg('avg_network_rx_bytes_per_sec'),
                    'max_network_rx_bytes_per_sec' => $hourlyMetrics->max('max_network_rx_bytes_per_sec'),
                    'avg_network_tx_bytes_per_sec' => $hourlyMetrics->avg('avg_network_tx_bytes_per_sec'),
                    'max_network_tx_bytes_per_sec' => $hourlyMetrics->max('max_network_tx_bytes_per_sec'),
                    'avg_disk_read_bytes_per_sec' => $hourlyMetrics->avg('avg_disk_read_bytes_per_sec'),
                    'avg_disk_write_bytes_per_sec' => $hourlyMetrics->avg('avg_disk_write_bytes_per_sec'),
                ]
            );
        }
    }
}
