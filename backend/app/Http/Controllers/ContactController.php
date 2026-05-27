<?php

namespace App\Http\Controllers;

use App\Services\EmailJsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ContactController extends Controller
{
    protected EmailJsService $emailService;

    public function __construct(EmailJsService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Handle incoming contact form requests and dispatch via EmailJS.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendContactEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Map request inputs to the placeholders defined in your EmailJS template
        $templateParams = [
            'from_name' => $validated['name'],
            'from_email' => $validated['email'],
            'message' => $validated['message'],
        ];

        $success = $this->emailService->send($templateParams);

        if ($success) {
            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully via EmailJS!'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to send email. Please check backend logs.'
        ], 500);
    }

    /**
     * Send a welcome email to a newly signed up user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendWelcomeEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        $templateParams = [
            'to_name' => $validated['name'],
            'name' => $validated['name'],
            'to_email' => $validated['email'],
            'email' => $validated['email'],
            'message' => 'Welcome to Nuvera Naturals! We are excited to have you on board. Explore our collections and find the perfect natural remedies and self-care items.',
            'from_name' => 'Nuvera Naturals',
        ];

        $success = $this->emailService->send($templateParams);

        if ($success) {
            return response()->json([
                'success' => true,
                'message' => 'Welcome email sent successfully via EmailJS!'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to send welcome email. Please check backend logs.'
        ], 500);
    }

    /**
     * Create a pending order, generate an OTP, cache details, and send confirmation email.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createPendingOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'cart' => 'required|array',
            'total' => 'required|numeric',
        ]);

        $email = $validated['email'];
        $name = $validated['name'];
        $cart = $validated['cart'];
        $total = $validated['total'];

        $code = rand(100000, 999999);
        $orderId = 'NUV-' . rand(10000, 99999);

        $cachedData = [
            'orderId' => $orderId,
            'code' => $code,
            'email' => $email,
            'name' => $name,
            'cart' => $cart,
            'total' => $total,
            'expires_at' => now()->addMinutes(5)->timestamp
        ];

        // Cache pending order for 5 minutes (300 seconds)
        Cache::put("pending_order:{$orderId}", $cachedData, 300);

        // Format orders for the EmailJS template loop
        $orders = [];
        foreach ($cart as $item) {
            $selectedWeight = $item['selectedWeight'] ?? '1kg';
            $price = $item['prices'][$selectedWeight] ?? 0;
            $orders[] = [
                'name' => $item['name'] . ' (' . $selectedWeight . ')',
                'units' => (int)($item['quantity'] ?? 1),
                'price' => number_format($price, 2),
                'image_url' => isset($item['image']) ? config('app.frontend_url') . $item['image'] : ''
            ];
        }

        // Send Email via EmailJS service using the specified template
        $templateParams = [
            'to_name' => $name,
            'name' => $name,
            'to_email' => $email,
            'email' => $email,
            'order_id' => $orderId,
            'verification_code' => (string) $code,
            'verification_link' => config('app.frontend_url') . "/?confirm_order=1&order_id={$orderId}&code={$code}",
            'total' => '₹' . $total,
            'orders' => $orders,
            'cost' => [
                'shipping' => '0.00',
                'tax' => '0.00',
                'total' => number_format($total, 2)
            ],
            'message' => "Please click the link to confirm your order of ₹{$total} with Nuvera Naturals.",
            'from_name' => 'Nuvera Naturals Orders'
        ];

        $success = $this->emailService->send($templateParams, 'template_4z4jxzn');

        if ($success) {
            return response()->json([
                'success' => true,
                'orderId' => $orderId,
                'expires_in' => 300
            ], 200);
        }

        // If email failed to dispatch, cleanup cached record
        Cache::forget("pending_order:{$orderId}");

        return response()->json([
            'success' => false,
            'message' => 'Failed to send order verification email. Please check server logs.'
        ], 500);
    }

    /**
     * Verify pending order with code.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'orderId' => 'required|string',
            'code' => 'required|string',
        ]);

        $orderId = $validated['orderId'];
        $code = $validated['code'];

        $cached = Cache::get("pending_order:{$orderId}");

        if (!$cached) {
            // Check if it was already verified in another session/tab
            $alreadyVerified = Cache::get("verified_order:{$orderId}");
            if ($alreadyVerified) {
                return response()->json([
                    'success' => true,
                    'message' => 'Order verified and placed successfully!',
                    'order' => $alreadyVerified
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Order verification session expired or not found. Please re-place your order.'
            ], 400);
        }

        if ((string)$cached['code'] !== (string)$code) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code. Please check your email and try again.'
            ], 400);
        }

        $verifiedOrder = [
            'orderId' => $cached['orderId'],
            'email' => $cached['email'],
            'name' => $cached['name'],
            'cart' => $cached['cart'],
            'total' => $cached['total'],
            'date' => date('Y-m-d'),
            'statusStep' => 0
        ];

        // Cache the verified order details for 5 minutes so original tabs can poll and verify
        Cache::put("verified_order:{$orderId}", $verifiedOrder, 300);

        // Success: Clear the cached pending order
        Cache::forget("pending_order:{$orderId}");

        return response()->json([
            'success' => true,
            'message' => 'Order verified and placed successfully!',
            'order' => $verifiedOrder
        ], 200);
    }

    /**
     * Get the status of an order (pending, verified, or expired).
     *
     * @param string $orderId
     * @return JsonResponse
     */
    public function getOrderStatus(string $orderId): JsonResponse
    {
        $verified = Cache::get("verified_order:{$orderId}");
        if ($verified) {
            return response()->json([
                'success' => true,
                'status' => 'verified',
                'order' => $verified
            ], 200);
        }

        $pending = Cache::get("pending_order:{$orderId}");
        if ($pending) {
            return response()->json([
                'success' => true,
                'status' => 'pending'
            ], 200);
        }

        return response()->json([
            'success' => true,
            'status' => 'expired'
        ], 200);
    }
    /**
     * Create a Razorpay order via their REST API and return rzp_order_id to frontend.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createRazorpayOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount'   => 'required|numeric|min:1',
            'orderId'  => 'required|string',
        ]);

        $keyId     = env('RAZORPAY_KEY_ID');
        $keySecret = env('RAZORPAY_KEY_SECRET');
        $amountPaise = (int) round($validated['amount'] * 100); // convert ₹ → paise

        $payload = [
            'amount'   => $amountPaise,
            'currency' => 'INR',
            'receipt'  => $validated['orderId'],
        ];

        $client = \Illuminate\Support\Facades\Http::withBasicAuth($keyId, $keySecret);

        if (config('app.env') === 'local') {
            $client = $client->withoutVerifying();
        }

        $response = $client->post('https://api.razorpay.com/v1/orders', $payload);

        if (!$response->successful()) {
            \Log::error('Razorpay create-order failed', [
                'code' => $response->status(),
                'body' => $response->body()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create Razorpay order. Please try again.',
            ], 500);
        }

        $data = $response->json();

        return response()->json([
            'success'          => true,
            'rzp_order_id'     => $data['id'],
            'amount'           => $amountPaise,
            'currency'         => 'INR',
            'razorpay_key_id'  => $keyId,
        ], 200);
    }

    /**
     * Verify Razorpay payment signature after successful payment.
     * The signature is HMAC-SHA256 of "razorpay_order_id|razorpay_payment_id"
     * keyed with the Razorpay key secret.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyRazorpayPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
            'orderId'             => 'required|string',
        ]);

        $keySecret  = env('RAZORPAY_KEY_SECRET');
        $body       = $validated['razorpay_order_id'] . '|' . $validated['razorpay_payment_id'];
        $expected   = hash_hmac('sha256', $body, $keySecret);

        if (!hash_equals($expected, $validated['razorpay_signature'])) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: invalid signature. Your card has NOT been charged.',
            ], 400);
        }

        // Signature is valid — payment is genuine
        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully!',
            'orderId' => $validated['orderId'],
        ], 200);
    }
}
