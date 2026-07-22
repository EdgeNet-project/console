<?php

namespace App\Jobs;

use App\Model\Node;
use App\Model\NodeMetricDaily;
use App\Model\NodeMetricWeekly;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AggregateNodeMetricsWeekly implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $lastWeekStart = now()->subWeeks(2)->startOfWeek(); // Use 2 weeks ago to be safe
        $lastWeekEnd = $lastWeekStart->copy()->endOfWeek();

        $nodes = Node::all();

        foreach ($nodes as $node) {
            $dailyMetrics = NodeMetricDaily::where('node_id', $node->id)
                ->whereBetween('day', [$lastWeekStart->toDateString(), $lastWeekEnd->toDateTimeString()]) // Use toDateTimeString for end
                ->get();

            if ($dailyMetrics->isEmpty()) {
                continue;
            }

            NodeMetricWeekly::updateOrCreate(
                [
                    'node_id' => $node->id,
                    'week_start' => $lastWeekStart->toDateString(),
                ],
                [
                    'avg_cpu_usage_percent' => $dailyMetrics->avg('avg_cpu_usage_percent'),
                    'max_cpu_usage_percent' => $dailyMetrics->max('max_cpu_usage_percent'),
                    'avg_network_rx_bytes_per_sec' => $dailyMetrics->avg('avg_network_rx_bytes_per_sec'),
                    'max_network_rx_bytes_per_sec' => $dailyMetrics->max('max_network_rx_bytes_per_sec'),
                    'avg_network_tx_bytes_per_sec' => $dailyMetrics->avg('avg_network_tx_bytes_per_sec'),
                    'max_network_tx_bytes_per_sec' => $dailyMetrics->max('max_network_tx_bytes_per_sec'),
                    'avg_disk_read_bytes_per_sec' => $dailyMetrics->avg('avg_disk_read_bytes_per_sec'),
                    'avg_disk_write_bytes_per_sec' => $dailyMetrics->avg('avg_disk_write_bytes_per_sec'),
                ]
            );
        }
    }
}
