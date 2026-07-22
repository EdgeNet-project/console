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
        Schema::create('node_metric_monthlies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('node_id')->constrained('nodes')->onDelete('cascade');
            $table->date('month');
            $table->decimal('avg_cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('max_cpu_usage_percent', 5, 2)->nullable();
            $table->decimal('avg_network_rx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('max_network_rx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_network_tx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('max_network_tx_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_disk_read_bytes_per_sec', 20, 2)->nullable();
            $table->decimal('avg_disk_write_bytes_per_sec', 20, 2)->nullable();
            $table->timestamps();

            $table->unique(['node_id', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('node_metric_monthlies');
    }
};
