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
        Schema::table('users', function (Blueprint $table) {
            $table->string('location')->nullable()->unique()->after('lastname');
            $table->string('blog')->nullable()->unique()->after('location');
            $table->string('bio')->nullable()->unique()->after('blog');
            $table->string('company')->nullable()->unique()->after('bio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['location', 'blog', 'bio', 'company']);
        });
    }
};
