<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            /*
             * Global switch to disable user access
             */
            $table->boolean('enabled')
                ->default(true);

            /*
             * Global switch if user is cluster admin
             */
            $table->boolean('admin')
                ->default(false);

            $table->string('title')
                ->nullable();
            $table->string('firstname')
                ->nullable();
            $table->string('lastname')
                ->nullable();

            $table->string('email')
                ->unique();
            $table->timestamp('email_verified_at')
                ->nullable();

            $table->string('password')
                ->nullable();

            $table->timestamp('aup_accepted_at')
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
        Schema::dropIfExists('users');
    }
}
