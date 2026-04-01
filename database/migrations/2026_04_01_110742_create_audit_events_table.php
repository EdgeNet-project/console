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
        Schema::create('audit_events', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('audit_id')->nullable()->index();
            $table->string('level')->nullable();
            $table->string('stage')->nullable();
            $table->string('verb')->nullable()->index();
            $table->text('request_uri')->nullable();

            $table->string('username')->nullable()->index();
            $table->string('user_uid')->nullable();
            $table->json('user_groups')->nullable();
            $table->string('impersonated_user')->nullable();

            $table->string('resource')->nullable()->index();
            $table->string('subresource')->nullable();
            $table->string('namespace')->nullable()->index();
            $table->string('api_group')->nullable()->index();
            $table->string('api_version')->nullable()->index();
            $table->string('resource_name')->nullable();
            $table->string('resource_version')->nullable();

            $table->json('source_ips')->nullable();
            $table->text('user_agent')->nullable();

            $table->string('response_code')->nullable()->index();
            $table->string('response_status')->nullable();
            $table->text('response_reason')->nullable();

            $table->timestamp('request_received_at')->nullable();
            $table->timestamp('stage_at')->nullable();

            $table->json('annotations')->nullable();

            $table->json('raw_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_events');
    }
};
