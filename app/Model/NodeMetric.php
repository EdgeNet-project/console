<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class NodeMetric extends Model
{
    protected $fillable = [
        'node_id',
        'recorded_at',
        'cpu_usage_percent',
        'load_1',
        'load_5',
        'load_15',
        'network_rx_bytes',
        'network_tx_bytes',
        'network_rx_bytes_per_sec',
        'network_tx_bytes_per_sec',
        'disk_read_bytes_per_sec',
        'disk_write_bytes_per_sec',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
    ];

    public function node()
    {
        return $this->belongsTo(Node::class);
    }
}
