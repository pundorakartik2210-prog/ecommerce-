<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/api/contact/send', [ContactController::class, 'sendContactEmail']);
Route::post('/api/welcome-email', [ContactController::class, 'sendWelcomeEmail']);
Route::post('/api/orders/pending', [ContactController::class, 'createPendingOrder']);
Route::post('/api/orders/verify', [ContactController::class, 'verifyOrder']);
Route::get('/api/orders/status/{orderId}', [ContactController::class, 'getOrderStatus']);
Route::post('/api/payment/create-order', [ContactController::class, 'createRazorpayOrder']);
Route::post('/api/payment/verify-signature', [ContactController::class, 'verifyRazorpayPayment']);
