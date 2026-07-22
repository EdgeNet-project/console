<?php

namespace App\Jobs;

use App\Model\NodeMetric;
use App\Model\NodeMetricHourly;
use App\Model\NodeMetricDaily;
use App\Model\NodeMetricWeekly;
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
        $dailyRetentionYears = config('metrics.retention.daily_years', 5);
        $weeklyRetentionYears = config('metrics.retention.weekly_years', 10);

        // Cleanup raw metrics
        NodeMetric::where('recorded_at', '<', now()->subDays($rawRetentionDays))
            ->delete();

        // Cleanup hourly metrics
        NodeMetricHourly::where('hour', '<', now()->subMonths($hourlyRetentionMonths))
            ->delete();

        // Cleanup daily metrics
        NodeMetricDaily::where('day', '<', now()->subYears($dailyRetentionYears))
            ->delete();

        // Cleanup weekly metrics
        NodeMetricWeekly::where('week_start', '<', now()->subYears($weeklyRetentionYears))
            ->delete();

        // Monthly metrics are retained indefinitely by default
    }
}
