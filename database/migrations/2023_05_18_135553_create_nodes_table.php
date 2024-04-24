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

            $table->string('auth', 32)
                ->unique();

            $table->string('code', 6)
                ->unique();

            $table->boolean('enabled')
                ->default(false);

            $table->boolean('installed')
                ->default(false);

            $table->string('type')
                ->nullable();

            $table->macAddress('mac')
                ->nullable()
                ->unique();

            $table->boolean('dhcp')
                ->default(true);

            $table->ipAddress('ip_v4')
                ->nullable();

            $table->ipAddress('gateway_ip_v4')
                ->nullable();

            $table->ipAddress('dns1_ip_v4')
                ->nullable();

            $table->ipAddress('dns2_ip_v4')
                ->nullable();

            $table->ipAddress('public_ip_v4')
                ->nullable();

            $table->ipAddress('ip_v6')
                ->nullable();

            $table->ipAddress('gateway_ip_v6')
                ->nullable();

            $table->ipAddress('dns1_ip_v6')
                ->nullable();

            $table->ipAddress('dns2_ip_v6')
                ->nullable();

            $table->string('hostname')
                ->nullable();

            $table->string('cluster')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->json('info')
                ->nullable();

            $table->bigInteger('user_id')
                ->unsigned()
                ->nullable();
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');


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
