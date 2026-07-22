<?php

namespace App\Jobs;

use App\Model\NodeMetric;
use App\Model\NodeMetricHourly;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CleanupNodeMetrics implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $rawRetentionDays = config('metrics.retention.raw_days', 30);
        $hourlyRetentionMonths = config('metrics.retention.hourly_months', 12);

        // Cleanup raw metrics
        NodeMetric::where('recorded_at', '<', now()->subDays($rawRetentionDays))
            ->delete();

        // Cleanup hourly metrics
        NodeMetricHourly::where('hour', '<', now()->subMonths($hourlyRetentionMonths))
            ->delete();
    }
}
