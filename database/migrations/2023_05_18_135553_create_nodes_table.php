<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nodes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->boolean('installed')
                ->default(false);

            $table->boolean('enabled')
                ->default(true);

            $table->boolean('active')
                ->default(false);

            $table->macAddress('mac')
                ->unique();

            $table->ipAddress('ipv4')
                ->nullable();

            $table->ipAddress('ipv6')
                ->nullable();

            $table->ipAddress('gatewayv4')
                ->nullable();

            $table->ipAddress('public_ipv4')
                ->nullable();

            $table->string('hostname')
                ->nullable();

            $table->string('type')
                ->nullable();

            $table->string('cluster')
                ->nullable();

            $table->string('contact')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->bigInteger('tenant_id')
                ->unsigned()
                ->nullable();
            $table->foreign('tenant_id')
                ->references('id')
                ->on('tenants')
                ->onDelete('cascade');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nodes');
    }
};
