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
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('tag')->nullable();
            $table->string('type');
            $table->string('tagline');
            $table->text('description');
            $table->float('rating')->default(5.0);
            $table->integer('reviewsCount')->default(0);
            $table->string('baseWeight')->default('250g');
            $table->json('prices');
            $table->json('nutrition');
            $table->json('ingredients');
            $table->json('reviews');
            $table->string('image');
            $table->string('color');
            $table->string('bgGradient');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
