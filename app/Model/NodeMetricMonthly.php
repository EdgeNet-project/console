<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NodeMetricMonthly extends Model
{
    protected $fillable = [
        'node_id',
        'month',
        'avg_cpu_usage_percent',
        'max_cpu_usage_percent',
        'avg_network_rx_bytes_per_sec',
        'max_network_rx_bytes_per_sec',
        'avg_network_tx_bytes_per_sec',
        'max_network_tx_bytes_per_sec',
        'avg_disk_read_bytes_per_sec',
        'avg_disk_write_bytes_per_sec',
    ];

    protected $casts = [
        'month' => 'date',
    ];

    public function node()
    {
        return $this->belongsTo(Node::class);
    }
}
