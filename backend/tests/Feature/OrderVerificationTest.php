<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OrderVerificationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Clear cache before each test
        Cache::flush();
    }

    /**
     * Test initiating a pending order.
     */
    public function test_can_initiate_pending_order(): void
    {
        Http::fake([
            'https://api.emailjs.com/*' => Http::response('OK', 200),
        ]);

        $cartData = [
            [
                'id' => 1,
                'name' => 'Classic Peanut Butter',
                'selectedWeight' => '1kg',
                'quantity' => 1,
                'prices' => ['1kg' => 499]
            ]
        ];

        $response = $this->postJson('/api/orders/pending', [
            'email' => 'shivam.sh2349@gmail.com',
            'name' => 'Shivam Test',
            'cart' => $cartData,
            'total' => 499
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'orderId',
                'expires_in'
            ])
            ->assertJson([
                'success' => true,
                'expires_in' => 300
            ]);

        $orderId = $response->json('orderId');
        
        // Assert the order is cached
        $cached = Cache::get("pending_order:{$orderId}");
        $this->assertNotNull($cached);
        $this->assertEquals('shivam.sh2349@gmail.com', $cached['email']);
        $this->assertEquals('Shivam Test', $cached['name']);
        $this->assertEquals($cartData, $cached['cart']);
        $this->assertEquals(499, $cached['total']);
        $this->assertNotEmpty($cached['code']);

        // Assert EmailJS call was made with expected template params
        Http::assertSent(function ($request) use ($orderId, $cached) {
            return $request->url() === 'https://api.emailjs.com/api/v1.0/email/send' &&
                   $request['template_id'] === 'template_4z4jxzn' &&
                   $request['template_params']['order_id'] === $orderId &&
                   $request['template_params']['verification_code'] === (string)$cached['code'] &&
                   $request['template_params']['to_email'] === 'shivam.sh2349@gmail.com';
        });
    }

    /**
     * Test verification with a valid OTP.
     */
    public function test_can_verify_pending_order_with_valid_otp(): void
    {
        Http::fake([
            'https://api.emailjs.com/*' => Http::response('OK', 200),
        ]);

        $cartData = [
            [
                'id' => 1,
                'name' => 'Classic Peanut Butter',
                'selectedWeight' => '1kg',
                'quantity' => 1,
                'prices' => ['1kg' => 499]
            ]
        ];

        // Initiate
        $initResponse = $this->postJson('/api/orders/pending', [
            'email' => 'shivam.sh2349@gmail.com',
            'name' => 'Shivam Test',
            'cart' => $cartData,
            'total' => 499
        ]);

        $orderId = $initResponse->json('orderId');
        $cached = Cache::get("pending_order:{$orderId}");
        $code = $cached['code'];

        // Verify with correct code
        $verifyResponse = $this->postJson('/api/orders/verify', [
            'orderId' => $orderId,
            'code' => (string)$code
        ]);

        $verifyResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Order verified and placed successfully!',
                'order' => [
                    'orderId' => $orderId,
                    'email' => 'shivam.sh2349@gmail.com',
                    'name' => 'Shivam Test',
                    'cart' => $cartData,
                    'total' => 499,
                    'statusStep' => 0
                ]
            ]);

        // Assert Cache is cleared after successful verification
        $this->assertNull(Cache::get("pending_order:{$orderId}"));
    }

    /**
     * Test verification with invalid OTP.
     */
    public function test_cannot_verify_with_invalid_otp(): void
    {
        Http::fake([
            'https://api.emailjs.com/*' => Http::response('OK', 200),
        ]);

        $cartData = [
            [
                'id' => 1,
                'name' => 'Classic Peanut Butter',
                'selectedWeight' => '1kg',
                'quantity' => 1,
                'prices' => ['1kg' => 499]
            ]
        ];

        // Initiate
        $initResponse = $this->postJson('/api/orders/pending', [
            'email' => 'shivam.sh2349@gmail.com',
            'name' => 'Shivam Test',
            'cart' => $cartData,
            'total' => 499
        ]);

        $orderId = $initResponse->json('orderId');
        
        // Verify with incorrect code
        $verifyResponse = $this->postJson('/api/orders/verify', [
            'orderId' => $orderId,
            'code' => '999999' // wrong code
        ]);

        $verifyResponse->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid verification code. Please check your email and try again.'
            ]);

        // Assert Cache is still present
        $this->assertNotNull(Cache::get("pending_order:{$orderId}"));
    }

    /**
     * Test verification with expired/missing orderId.
     */
    public function test_cannot_verify_expired_or_invalid_order_id(): void
    {
        $verifyResponse = $this->postJson('/api/orders/verify', [
            'orderId' => 'NUV-NONEXIST',
            'code' => '123456'
        ]);

        $verifyResponse->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Order verification session expired or not found. Please re-place your order.'
            ]);
    }

    /**
     * Test getting status of order (pending, verified, and expired).
     */
    public function test_can_get_order_status_states(): void
    {
        Http::fake([
            'https://api.emailjs.com/*' => Http::response('OK', 200),
        ]);

        $cartData = [
            [
                'id' => 1,
                'name' => 'Classic Peanut Butter',
                'selectedWeight' => '1kg',
                'quantity' => 1,
                'prices' => ['1kg' => 499]
            ]
        ];

        // 1. Get status for expired / non-existent order
        $response = $this->getJson('/api/orders/status/NUV-EXPIRED');
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'status' => 'expired'
            ]);

        // 2. Initiate pending order
        $initResponse = $this->postJson('/api/orders/pending', [
            'email' => 'shivam.sh2349@gmail.com',
            'name' => 'Shivam Test',
            'cart' => $cartData,
            'total' => 499
        ]);
        $orderId = $initResponse->json('orderId');
        $cached = Cache::get("pending_order:{$orderId}");
        $code = $cached['code'];

        // Get status for pending order
        $response = $this->getJson("/api/orders/status/{$orderId}");
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'status' => 'pending'
            ]);

        // 3. Verify order
        $verifyResponse = $this->postJson('/api/orders/verify', [
            'orderId' => $orderId,
            'code' => (string)$code
        ]);
        $verifyResponse->assertStatus(200);

        // Get status for verified order
        $response = $this->getJson("/api/orders/status/{$orderId}");
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'status' => 'verified',
                'order' => [
                    'orderId' => $orderId,
                    'email' => 'shivam.sh2349@gmail.com',
                    'name' => 'Shivam Test',
                    'cart' => $cartData,
                    'total' => 499,
                    'statusStep' => 0
                ]
            ]);
    }

    /**
     * Test creating a Razorpay order.
     */
    public function test_can_create_razorpay_order(): void
    {
        Http::fake([
            'https://api.razorpay.com/v1/orders' => Http::response([
                'id' => 'order_test_123',
                'entity' => 'order',
                'amount' => 49900,
                'currency' => 'INR',
                'receipt' => 'NUV-12345'
            ], 200)
        ]);

        $response = $this->postJson('/api/payment/create-order', [
            'amount' => 499,
            'orderId' => 'NUV-12345'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'rzp_order_id' => 'order_test_123',
                'amount' => 49900,
                'currency' => 'INR',
                'razorpay_key_id' => 'rzp_test_SryYZtgZEH0DxV'
            ]);
    }

    /**
     * Test verifying a valid Razorpay signature.
     */
    public function test_can_verify_razorpay_payment_valid_signature(): void
    {
        $razorpayOrderId = 'order_test_123';
        $razorpayPaymentId = 'pay_test_456';
        $keySecret = 'qpTbpNCvbPU98fRm9EEViED1';
        $signature = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, $keySecret);

        $response = $this->postJson('/api/payment/verify-signature', [
            'razorpay_order_id' => $razorpayOrderId,
            'razorpay_payment_id' => $razorpayPaymentId,
            'razorpay_signature' => $signature,
            'orderId' => 'NUV-12345'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Payment verified successfully!',
                'orderId' => 'NUV-12345'
            ]);
    }

    /**
     * Test verifying an invalid Razorpay signature.
     */
    public function test_cannot_verify_razorpay_payment_invalid_signature(): void
    {
        $response = $this->postJson('/api/payment/verify-signature', [
            'razorpay_order_id' => 'order_test_123',
            'razorpay_payment_id' => 'pay_test_456',
            'razorpay_signature' => 'invalid_signature_here',
            'orderId' => 'NUV-12345'
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Payment verification failed: invalid signature. Your card has NOT been charged.'
            ]);
    }
}
