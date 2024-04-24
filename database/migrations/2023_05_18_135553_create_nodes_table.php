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

            $table->boolean('enabled')
                ->default(true);

            $table->boolean('installed')
                ->default(false);

            $table->macAddress('mac')
                ->unique();

            $table->ipAddress('ipv4')
                ->nullable();

            $table->ipAddress('ipv6')
                ->nullable();

            $table->ipAddress('gateway_v4')
                ->nullable();

            $table->ipAddress('public_ip_v4')
                ->nullable();

            $table->string('hostname')
                ->nullable();

            $table->string('type')
                ->nullable();

            $table->string('cluster')
                ->nullable();

            $table->text('notes')
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
