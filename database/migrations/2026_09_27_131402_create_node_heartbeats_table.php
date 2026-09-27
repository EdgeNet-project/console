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
        Schema::create('node_heartbeats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('node_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamp('created_at')->index();

            // Optional information supplied by the node
            $table->json('info')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('node_heartbeats');
    }
};
