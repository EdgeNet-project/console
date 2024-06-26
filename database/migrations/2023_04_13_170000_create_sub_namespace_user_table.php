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
        Schema::create('sub_namespace_user', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->boolean('enabled')
                ->default(true);

            $table->string('role')
                ->nullable();

            $table->bigInteger('sub_namespace_id')->unsigned();
            $table->foreign('sub_namespace_id')
                ->references('id')
                ->on('sub_namespaces')
                ->onDelete('cascade');

            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->unique([
                'sub_namespace_id', 'user_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tenant_user');
    }
};
