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

            $table->string('auth', 6)
                ->unique();

            $table->string('token_id', 6)
                ->unique();
            $table->string('token_secret', 16)
                ->unique();

            $table->string('status')
                ->nullable();

            $table->string('type')
                ->nullable();

            $table->ipAddress('ip_v4')
                ->nullable();

            $table->ipAddress('ip_v6')
                ->nullable();

            $table->string('asn')
                ->nullable();

            $table->string('country')
                ->nullable();

            $table->string('name')
                ->nullable();

            $table->string('hostname')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->json('config')
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
