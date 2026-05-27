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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary(); // Will store orderId (e.g. NUV-12345)
            $table->string('name');
            $table->string('email');
            $table->json('cart');
            $table->decimal('total', 10, 2);
            $table->integer('statusStep')->default(0); // 0 = Placed, 1 = Shipped, 2 = Out for Delivery, 3 = Delivered
            $table->string('payment_method')->default('cod');
            $table->string('payment_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
