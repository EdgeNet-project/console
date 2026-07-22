<?php

namespace App\Services;

use App\Model\Node;
use App\Model\NodeMetric;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NodeMetricService
{
    /**
     * Store node metrics from heartbeat payload.
     *
     * @param Node $node
     * @param array $metrics
     * @return NodeMetric|null
     */
    public function store(Node $node, array $metrics): ?NodeMetric
    {
        try {
            if (empty($metrics)) {
                return null;
            }

            $validatedData = $this->validateAndTransform($metrics);
            
            if (empty($validatedData)) {
                return null;
            }

            $validatedData['node_id'] = $node->id;
            $validatedData['recorded_at'] = now();

            return NodeMetric::create($validatedData);
        } catch (\Exception $e) {
            Log::channel('nodes')->error("[NodeMetricService] Error storing metrics: " . $e->getMessage(), [
                'node_id' => $node->id,
                'metrics' => $metrics
            ]);
            return null;
        }
    }

    /**
     * Validate and transform the metrics payload.
     *
     * @param array $metrics
     * @return array
     */
    protected function validateAndTransform(array $metrics): array
    {
        $data = [];

        // CPU & Load
        if (isset($metrics['cpu'])) {
            $cpu = $metrics['cpu'];
            $data['cpu_usage_percent'] = $cpu['usage_percent'] ?? null;
            $data['load_1'] = $cpu['load1'] ?? null;
            $data['load_5'] = $cpu['load5'] ?? null;
            $data['load_15'] = $cpu['load15'] ?? null;
        }

        // Network
        if (isset($metrics['network']['interfaces']) && is_array($metrics['network']['interfaces'])) {
            $rx_bytes = 0;
            $tx_bytes = 0;
            $rx_bytes_sec = 0;
            $tx_bytes_sec = 0;

            foreach ($metrics['network']['interfaces'] as $interface) {
                $rx_bytes += $interface['rx_bytes'] ?? 0;
                $tx_bytes += $interface['tx_bytes'] ?? 0;
                $rx_bytes_sec += $interface['rx_bytes_per_sec'] ?? 0;
                $tx_bytes_sec += $interface['tx_bytes_per_sec'] ?? 0;
            }

            $data['network_rx_bytes'] = $rx_bytes;
            $data['network_tx_bytes'] = $tx_bytes;
            $data['network_rx_bytes_per_sec'] = $rx_bytes_sec;
            $data['network_tx_bytes_per_sec'] = $tx_bytes_sec;
        }

        // IO
        if (isset($metrics['io'])) {
            $io = $metrics['io'];
            $data['disk_read_bytes_per_sec'] = $io['read_bytes_per_sec'] ?? null;
            $data['disk_write_bytes_per_sec'] = $io['write_bytes_per_sec'] ?? null;
        }

        return array_filter($data, fn($value) => $value !== null);
    }
}
