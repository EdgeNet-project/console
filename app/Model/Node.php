<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;

class Node extends Model
{

    public $timestamps = true;
    /**
     * @var array|mixed
     */

    protected $hidden = [
        'code'
    ];

    protected $fillable = [
        'name', 'system_uuid',
        'status', 'enabled',
        'installed_at', 'last_seen_at',

        'platform', 'role',

        'ip_v4', 'public_ip_v4', 'ip_v6', 'asn',

        'wireguard', 'os', 'hardware', 'info', 'location', 'hardware', 'code'
    ];

    protected $casts = [
        'status' => NodeStatus::class,
        'stage' => NodeStage::class,
        'enabled' => 'boolean',

        'installed_at' => 'datetime',
        'last_seen_at' => 'datetime',

        'wireguard' => 'array',
        'os' => 'array',
        'hardware' => 'array',
        'info' => 'array',
        'location' => 'array',
    ];

    protected $appends = [
        'installation_url',
        'current_metrics',
        'current_metrics_hourly',
        'current_metrics_daily',
        'current_metrics_weekly',
        'current_metrics_monthly',
    ];

    public function heartbeats(): HasMany
    {
        return $this->hasMany(NodeHeartbeat::class);
    }

    public function getInstallationUrlAttribute()
    {
        return null;
        //return route('node.bootstrap', ['node' => $this->auth]);
    }

    public function getCurrentMetricsAttribute()
    {
        return $this->metrics()->latest('recorded_at')->first();
    }

    public function getCurrentMetricsHourlyAttribute()
    {
        return $this->hourlyMetrics()->latest('hour')->first();
    }

    public function getCurrentMetricsDailyAttribute()
    {
        return $this->dailyMetrics()->latest('day')->first();
    }

    public function getCurrentMetricsWeeklyAttribute()
    {
        return $this->weeklyMetrics()->latest('week_start')->first();
    }

    public function getCurrentMetricsMonthlyAttribute()
    {
        return $this->monthlyMetrics()->latest('month')->first();
    }

    public function metrics()
    {
        return $this->hasMany(NodeMetric::class);
    }

    public function hourlyMetrics()
    {
        return $this->hasMany(NodeMetricHourly::class);
    }

    public function dailyMetrics()
    {
        return $this->hasMany(NodeMetricDaily::class);
    }

    public function weeklyMetrics()
    {
        return $this->hasMany(NodeMetricWeekly::class);
    }

    public function monthlyMetrics()
    {
        return $this->hasMany(NodeMetricMonthly::class);
    }
}
