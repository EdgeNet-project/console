<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('node_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('node_id')->constrained('nodes')->onDelete('cascade');
            $table->timestamp('recorded_at');
            $table->decimal('cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('load_1', 8, 2)->nullable();
            $table->decimal('load_5', 8, 2)->nullable();
            $table->decimal('load_15', 8, 2)->nullable();
            $table->unsignedBigInteger('network_rx_bytes')->nullable();
            $table->unsignedBigInteger('network_tx_bytes')->nullable();
            $table->decimal('network_rx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('network_tx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('disk_read_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('disk_write_bytes_per_sec', 20, 2)->nullable();
            $table->timestamps();

            $table->index(['node_id', 'recorded_at']);
            $table->index('recorded_at');
        });

        Schema::create('node_metric_hourlies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('node_id')->constrained('nodes')->onDelete('cascade');
            $table->timestamp('hour');
            $table->decimal('avg_cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('max_cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('avg_network_rx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('max_network_rx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_network_tx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('max_network_tx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_disk_read_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_disk_write_bytes_per_sec', 20, 2)->nullable();
            $table->timestamps();

            $table->unique(['node_id', 'hour']);
        });

        Schema::create('node_metric_dailies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('node_id')->constrained('nodes')->onDelete('cascade');
            $table->date('day');
            $table->decimal('avg_cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('max_cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('avg_network_rx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('max_network_rx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_network_tx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('max_network_tx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_disk_read_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_disk_write_bytes_per_sec', 20, 2)->nullable();
            $table->timestamps();

            $table->unique(['node_id', 'day']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('node_metric_dailies');
        Schema::dropIfExists('node_metric_hourlies');
        Schema::dropIfExists('node_metrics');
    }
};
