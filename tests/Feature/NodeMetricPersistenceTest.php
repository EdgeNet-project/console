<?php

namespace Tests\Feature;

use App\Model\Node;
use App\Model\NodeMetric;
use App\Model\NodeMetricDaily;
use App\Model\NodeMetricHourly;
use App\Jobs\AggregateNodeMetricsHourly;
use App\Jobs\AggregateNodeMetricsDaily;
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
            'status' => 'READY',
            'enabled' => true,
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
}
