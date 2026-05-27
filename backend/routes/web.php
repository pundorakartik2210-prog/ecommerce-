<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/run-migrations', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'ProductSeeder', '--force' => true]);
        return response()->json([
            'success' => true,
            'message' => 'Migrations and seeders run successfully!',
            'output' => \Illuminate\Support\Facades\Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/api/db-status', function () {
    return response()->json([
        'default_connection' => config('database.default'),
        'mysql_config' => [
            'host' => config('database.connections.mysql.host'),
            'port' => config('database.connections.mysql.port'),
            'database' => config('database.connections.mysql.database'),
            'username' => config('database.connections.mysql.username'),
        ]
    ]);
});

Route::post('/api/contact/send', [ContactController::class, 'sendContactEmail']);
Route::post('/api/welcome-email', [ContactController::class, 'sendWelcomeEmail']);
Route::post('/api/orders/pending', [ContactController::class, 'createPendingOrder']);
Route::post('/api/orders/verify', [ContactController::class, 'verifyOrder']);
Route::get('/api/orders/status/{orderId}', [ContactController::class, 'getOrderStatus']);
Route::post('/api/payment/create-order', [ContactController::class, 'createRazorpayOrder']);
Route::post('/api/payment/verify-signature', [ContactController::class, 'verifyRazorpayPayment']);

// Auth Endpoints
Route::post('/api/auth/register', [AuthController::class, 'register']);
Route::post('/api/auth/login', [AuthController::class, 'login']);
Route::post('/api/auth/google-login', [AuthController::class, 'googleLogin']);

// Product Endpoints
Route::get('/api/products', [ProductController::class, 'index']);
Route::post('/api/products', [ProductController::class, 'store']);
Route::put('/api/products/{id}', [ProductController::class, 'update']);
Route::delete('/api/products/{id}', [ProductController::class, 'destroy']);

// Admin Order Endpoints
Route::get('/api/orders', [ContactController::class, 'getAllOrders']);
Route::put('/api/orders/{id}/status', [ContactController::class, 'updateOrderStatus']);
Route::get('/api/orders/user/{email}', [ContactController::class, 'getUserOrders']);

