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
        Schema::create('sub_namespaces', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->boolean('enabled')
                ->default(true);

            $table->string('namespace');
            $table->string('name');

            $table->string('label')->nullable();
            $table->string('description')->nullable();

            $table->json('inheritance')->nullable();
            $table->json('resourceallocation')->nullable();

            $table->bigInteger('tenant_id')->unsigned();
            $table->foreign('tenant_id')
                ->references('id')
                ->on('tenants')
                ->onDelete('cascade');

            $table->bigInteger('parent_id')->unsigned()->nullable();
            $table->foreign('parent_id')
                ->references('id')
                ->on('sub_namespaces')
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
        Schema::dropIfExists('sub_namespaces');
    }
};
