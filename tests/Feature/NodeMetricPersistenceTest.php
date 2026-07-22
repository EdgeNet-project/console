<?php

namespace Tests\Feature;

use App\Model\Node;
use App\Model\NodeStatus;
use App\Model\NodeMetric;
use App\Model\NodeMetricHourly;
use App\Model\NodeMetricDaily;
use App\Model\NodeMetricWeekly;
use App\Model\NodeMetricMonthly;
use App\Jobs\AggregateNodeMetricsHourly;
use App\Jobs\AggregateNodeMetricsDaily;
use App\Jobs\AggregateNodeMetricsWeekly;
use App\Jobs\AggregateNodeMetricsMonthly;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NodeMetricPersistenceTest extends TestCase
{
    use RefreshDatabase;

    protected $node;

    protected function setUp(): void
    {
        parent::setUp();
        $this->node = Node::create([
            'name' => 'test-node',
            'system_uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'status' => NodeStatus::READY->value,
            'enabled' => true,
            'code' => 'TESTCODE',
        ]);
    }

    public function test_ping_persists_metrics()
    {
        $payload = [
            'uuid' => $this->node->system_uuid,
            'metrics' => [
                'cpu' => [
                    'usage_percent' => 20.4,
                    'load1' => 0.5,
                    'load5' => 0.4,
                    'load15' => 0.3
                ],
                'network' => [
                    'interfaces' => [
                        [
                            'name' => 'eth0',
                            'rx_bytes' => 1000000,
                            'tx_bytes' => 500000,
                            'rx_bytes_per_sec' => 2000,
                            'tx_bytes_per_sec' => 1000
                        ],
                        [
                            'name' => 'wg0',
                            'rx_bytes' => 500000,
                            'tx_bytes' => 250000,
                            'rx_bytes_per_sec' => 500,
                            'tx_bytes_per_sec' => 250
                        ]
                    ]
                ],
                'io' => [
                    'read_bytes_per_sec' => 1200,
                    'write_bytes_per_sec' => 600
                ]
            ]
        ];

        $response = $this->postJson('/api/node/ping', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('node_metrics', [
            'node_id' => $this->node->id,
            'cpu_usage_percent' => 20.4,
            'load_1' => 0.5,
            'network_rx_bytes' => 1500000, // 1000000 + 500000
            'network_tx_bytes' => 750000,  // 500000 + 250000
            'network_rx_bytes_per_sec' => 2500, // 2000 + 500
            'network_tx_bytes_per_sec' => 1250, // 1000 + 250
            'disk_read_bytes_per_sec' => 1200,
            'disk_write_bytes_per_sec' => 600,
        ]);
    }

    public function test_ping_without_metrics_still_works()
    {
        $payload = [
            'uuid' => $this->node->system_uuid,
        ];

        $response = $this->postJson('/api/node/ping', $payload);

        $response->assertStatus(200);
        $this->assertEquals(0, NodeMetric::count());
    }

    public function test_hourly_aggregation()
    {
        $recordedAt = now()->subHour()->startOfHour()->addMinutes(30);

        NodeMetric::create([
            'node_id' => $this->node->id,
            'recorded_at' => $recordedAt,
            'cpu_usage_percent' => 10.0,
            'network_rx_bytes_per_sec' => 1000,
        ]);

        NodeMetric::create([
            'node_id' => $this->node->id,
            'recorded_at' => $recordedAt->copy()->addMinutes(5),
            'cpu_usage_percent' => 20.0,
            'network_rx_bytes_per_sec' => 2000,
        ]);

        (new AggregateNodeMetricsHourly())->handle();

        $this->assertDatabaseHas('node_metric_hourlies', [
            'node_id' => $this->node->id,
            'hour' => now()->subHour()->startOfHour()->toDateTimeString(),
            'avg_cpu_usage_percent' => 15.0,
            'max_cpu_usage_percent' => 20.0,
            'avg_network_rx_bytes_per_sec' => 1500.0,
            'max_network_rx_bytes_per_sec' => 2000.0,
        ]);
    }

    public function test_current_metrics_accessor()
    {
        $node = $this->node;

        // No metrics yet
        $this->assertNull($node->current_metrics);

        // Add a metric
        $metric1 = NodeMetric::create([
            'node_id' => $node->id,
            'recorded_at' => now()->subMinutes(10),
            'cpu_usage_percent' => 10.0,
        ]);

        // Refresh node to clear cached attributes if any (though accessors aren't usually cached like this unless explicitly done)
        $node = $node->fresh();
        $this->assertEquals(10.0, $node->current_metrics->cpu_usage_percent);

        // Add a newer metric
        $metric2 = NodeMetric::create([
            'node_id' => $node->id,
            'recorded_at' => now(),
            'cpu_usage_percent' => 20.0,
        ]);

        $node = $node->fresh();
        $this->assertEquals(20.0, $node->current_metrics->cpu_usage_percent);
        $this->assertEquals($metric2->id, $node->current_metrics->id);
    }

    public function test_aggregated_metrics_accessors()
    {
        $node = $this->node;

        // Create one of each
        NodeMetricHourly::create([
            'node_id' => $node->id,
            'hour' => now()->startOfHour(),
            'avg_cpu_usage_percent' => 15.0,
        ]);

        NodeMetricDaily::create([
            'node_id' => $node->id,
            'day' => now()->startOfDay(),
            'avg_cpu_usage_percent' => 12.0,
        ]);

        NodeMetricWeekly::create([
            'node_id' => $node->id,
            'week_start' => now()->startOfWeek(),
            'avg_cpu_usage_percent' => 10.0,
        ]);

        NodeMetricMonthly::create([
            'node_id' => $node->id,
            'month' => now()->startOfMonth(),
            'avg_cpu_usage_percent' => 8.0,
        ]);

        $node = $node->fresh();

        $this->assertEquals(15.0, $node->current_metrics_hourly->avg_cpu_usage_percent);
        $this->assertEquals(12.0, $node->current_metrics_daily->avg_cpu_usage_percent);
        $this->assertEquals(10.0, $node->current_metrics_weekly->avg_cpu_usage_percent);
        $this->assertEquals(8.0, $node->current_metrics_monthly->avg_cpu_usage_percent);
    }

    public function test_weekly_and_monthly_aggregation()
    {
        $node = $this->node;
        $twoWeeksAgo = now()->subWeeks(2)->startOfWeek();

        // Create daily metrics for two weeks ago
        for ($i = 0; $i < 7; $i++) {
            NodeMetricDaily::create([
                'node_id' => $node->id,
                'day' => $twoWeeksAgo->copy()->addDays($i)->toDateString(),
                'avg_cpu_usage_percent' => 10.0 + $i,
                'max_cpu_usage_percent' => 20.0 + $i,
            ]);
        }

        (new AggregateNodeMetricsWeekly())->handle();

        $this->assertDatabaseHas('node_metric_weeklies', [
            'node_id' => $node->id,
            'week_start' => $twoWeeksAgo->startOfDay()->toDateTimeString(),
            'avg_cpu_usage_percent' => 13.0, // (10+11+12+13+14+15+16) / 7
            'max_cpu_usage_percent' => 26.0,
        ]);

        $lastMonth = now()->subMonth()->startOfMonth();
        $daysInMonth = $lastMonth->daysInMonth;

        // Create daily metrics for last month
        for ($i = 0; $i < $daysInMonth; $i++) {
            NodeMetricDaily::create([
                'node_id' => $node->id,
                'day' => $lastMonth->copy()->addDays($i)->toDateString(),
                'avg_cpu_usage_percent' => 5.0,
                'max_cpu_usage_percent' => 10.0,
            ]);
        }

        (new AggregateNodeMetricsMonthly())->handle();

        $this->assertDatabaseHas('node_metric_monthlies', [
            'node_id' => $node->id,
            'month' => $lastMonth->startOfDay()->toDateTimeString(),
            'avg_cpu_usage_percent' => 5.0,
            'max_cpu_usage_percent' => 10.0,
        ]);
    }
}
