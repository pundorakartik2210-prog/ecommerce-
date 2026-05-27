<?php

namespace App\Http\Controllers;

use App\Services\EmailJsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

        $success = $this->emailService->send($templateParams, config('emailjs.welcome_template_id'));

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
     * Create a pending order, generate a 6-digit OTP, cache details, and send OTP via SMS.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createPendingOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string|min:10|max:15',
            'email' => 'required|email|max:255',
            'name'  => 'required|string|max:255',
            'cart'  => 'required|array',
            'total' => 'required|numeric',
        ]);

        $phone = preg_replace('/\D/', '', $validated['phone']);
        $email = $validated['email'];
        $name  = $validated['name'];
        $cart  = $validated['cart'];
        $total = $validated['total'];

        $otp     = rand(100000, 999999);
        $orderId = 'NUV-' . rand(10000, 99999);

        $cachedData = [
            'orderId'    => $orderId,
            'otp'        => $otp,
            'phone'      => $phone,
            'email'      => $email,
            'name'       => $name,
            'cart'       => $cart,
            'total'      => $total,
            'expires_at' => now()->addMinutes(5)->timestamp,
        ];

        // Cache pending order for 5 minutes (300 seconds)
        Cache::put("pending_order:{$orderId}", $cachedData, 300);

        // Send OTP via Fast2SMS — falls back to log entry if API key not set
        $this->sendOtpSms($phone, $otp, $orderId);

        return response()->json([
            'success'    => true,
            'orderId'    => $orderId,
            'expires_in' => 300,
        ], 200);
    }

    /**
     * Send a 6-digit OTP to the given phone number via Fast2SMS.
     * Falls back to logging if FAST2SMS_API_KEY is not configured.
     *
     * @param string $phone  10-digit mobile number
     * @param int    $otp    The generated OTP
     * @param string $orderId For log traceability
     * @return bool  true if SMS was dispatched, false otherwise
     */
    private function sendOtpSms(string $phone, int $otp, string $orderId): bool
    {
        $apiKey = env('FAST2SMS_API_KEY');

        if (!$apiKey) {
            Log::info("[OTP] No FAST2SMS_API_KEY set. Order {$orderId} OTP: {$otp}");
            return false;
        }

        try {
            $response = Http::withHeaders([
                'authorization' => $apiKey,
                'Content-Type'  => 'application/json',
            ])->post('https://www.fast2sms.com/dev/bulkV2', [
                'route'            => 'otp',
                'variables_values' => (string) $otp,
                'numbers'          => $phone,
                'flash'            => 0,
            ]);

            if ($response->successful()) {
                Log::info("[OTP] SMS sent to {$phone} for order {$orderId}");
                return true;
            }

            Log::error("[OTP] Fast2SMS error for {$orderId}: " . $response->body());
            Log::info("[OTP] Fallback OTP for order {$orderId}: {$otp}");
            return false;
        } catch (\Exception $e) {
            Log::error("[OTP] Fast2SMS exception for {$orderId}: " . $e->getMessage());
            Log::info("[OTP] Fallback OTP for order {$orderId}: {$otp}");
            return false;
        }
    }

    /**
     * Verify pending order using the 6-digit OTP sent to the customer's phone.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'orderId' => 'required|string',
            'otp'     => 'required|string|size:6',
        ]);

        $orderId = $validated['orderId'];
        $otp     = $validated['otp'];

        $cached = Cache::get("pending_order:{$orderId}");

        if (!$cached) {
            return response()->json([
                'success' => false,
                'message' => 'Order session expired or not found. Please place your order again.',
            ], 400);
        }

        if ((string) $cached['otp'] !== (string) $otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP. Please check and try again.',
            ], 400);
        }

        $verifiedOrder = [
            'orderId'    => $cached['orderId'],
            'email'      => $cached['email'],
            'name'       => $cached['name'],
            'phone'      => $cached['phone'],
            'cart'       => $cached['cart'],
            'total'      => $cached['total'],
            'date'       => date('Y-m-d'),
            'statusStep' => 0,
        ];

        // Save order to the database
        \App\Models\Order::updateOrCreate(
            ['id' => $orderId],
            [
                'name'           => $cached['name'],
                'email'          => $cached['email'],
                'phone'          => $cached['phone'],
                'cart'           => $cached['cart'],
                'total'          => $cached['total'],
                'statusStep'     => 0,
                'payment_method' => 'pending',
            ]
        );

        // Clear the cached pending order
        Cache::forget("pending_order:{$orderId}");

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully!',
            'order'   => $verifiedOrder,
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

        // Check if order exists in the MySQL database
        $dbOrder = \App\Models\Order::find($orderId);
        if ($dbOrder) {
            return response()->json([
                'success' => true,
                'status' => 'verified',
                'order' => [
                    'orderId' => $dbOrder->id,
                    'email' => $dbOrder->email,
                    'name' => $dbOrder->name,
                    'cart' => $dbOrder->cart,
                    'total' => $dbOrder->total,
                    'date' => date('Y-m-d', strtotime($dbOrder->created_at)),
                    'statusStep' => $dbOrder->statusStep
                ]
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

        // Signature is valid — payment is genuine. Update database order.
        $order = \App\Models\Order::find($validated['orderId']);
        if ($order) {
            $order->update([
                'payment_method' => 'razorpay',
                'payment_id' => $validated['razorpay_payment_id']
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully!',
            'orderId' => $validated['orderId'],
        ], 200);
    }

    /**
     * Get all verified/placed orders for Admin Panel.
     */
    public function getAllOrders(): JsonResponse
    {
        $orders = \App\Models\Order::orderBy('created_at', 'desc')->get();
        return response()->json($orders, 200);
    }

    /**
     * Update the status step of an order for Admin Panel.
     */
    public function updateOrderStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'statusStep' => 'required|integer|min:0|max:4'
        ]);

        $order = \App\Models\Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.'
            ], 404);
        }

        $order->update([
            'statusStep' => $validated['statusStep']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully!',
            'order' => $order
        ], 200);
    }

    /**
     * Get all verified/placed orders for a specific user by email.
     */
    public function getUserOrders(string $email): JsonResponse
    {
        $orders = \App\Models\Order::where('email', $email)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders, 200);
    }

    /**
     * Store order after firebase OTP verification on client side.
     */
    public function verifyFirebaseOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'email' => 'required|email|max:255',
            'name'  => 'required|string|max:255',
            'cart'  => 'required|array',
            'total' => 'required|numeric',
        ]);

        $orderId = 'NUV-' . rand(10000, 99999);

        $verifiedOrder = \App\Models\Order::create([
            'id'             => $orderId,
            'name'           => $validated['name'],
            'email'          => $validated['email'],
            'phone'          => $validated['phone'],
            'cart'           => $validated['cart'],
            'total'          => $validated['total'],
            'statusStep'     => 0,
            'payment_method' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order stored successfully!',
            'order'   => [
                'orderId'    => $orderId,
                'email'      => $verifiedOrder->email,
                'name'       => $verifiedOrder->name,
                'phone'      => $verifiedOrder->phone,
                'cart'       => $verifiedOrder->cart,
                'total'      => $verifiedOrder->total,
                'date'       => date('Y-m-d'),
                'statusStep' => 0,
            ],
        ], 200);
    }
}
