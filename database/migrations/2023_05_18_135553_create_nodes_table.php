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

            $table->timestamp('installed_at')
                ->nullable();
            $table->timestamp('last_seen_at')
                ->nullable();

            $table->boolean('enabled')
                ->default(false);

            /**
             * Node identity
             */
            $table->uuid('system_uuid')
                ->unique();
            $table->string('code', 6)
                ->unique();

            /**
             * Node information
             */
            $table->string('name')
                ->unique();

            $table->string('platform')
                ->nullable(); // "kubernetes", "docker", "baremetal", etc.
            $table->string('role')
                ->nullable(); // "worker", "master"...

            $table->string('status')
                ->nullable(); // "online", "offline", "maintenance"...

            /**
             * Network
             */
            $table->ipAddress('ip_v4')
                ->nullable();
            $table->ipAddress('public_ip_v4')
                ->nullable();
            $table->ipAddress('ip_v6')
                ->nullable();
            $table->string('asn')
                ->nullable();

            /**
             * Wireguard
             */
            $table->json('wireguard')
                ->nullable();

            /**
             * Location
             */
            $table->json('location')
                ->nullable();

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
