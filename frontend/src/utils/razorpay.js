import { API_URL } from '../config.js';

const BACKEND = API_URL;


/**
 * Dynamically injects the Razorpay checkout script.
 * Returns true when ready, false if the network is unavailable.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Full payment flow:
 *  1. Inject Razorpay SDK (idempotent).
 *  2. POST /api/payment/create-order  →  get rzp_order_id.
 *  3. Open Razorpay modal.
 *  4. On success  →  POST /api/payment/verify-signature on backend.
 *  5. Resolve with verified data  OR  reject with a descriptive Error.
 *
 * @param {{ orderId: string, amount: number, name: string, email: string }} params
 * @returns {Promise<{ success: boolean, orderId: string }>}
 */
export async function initiateRazorpayPayment({ orderId, amount, name, email }) {
  // 1. Load SDK
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error(
      'Razorpay SDK could not be loaded. Please check your internet connection and try again.'
    );
  }

  // 2. Create server-side order
  const createRes = await fetch(`${BACKEND}/api/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ amount, orderId }),
  });
  const createData = await createRes.json();

  if (!createData.success) {
    throw new Error(createData.message || 'Failed to create payment order. Please try again.');
  }

  // 3. Open Razorpay modal — returns a Promise
  return new Promise((resolve, reject) => {
    const options = {
      key: createData.razorpay_key_id,
      amount: createData.amount,       // already in paise
      currency: createData.currency,
      name: 'nuvera natural',
      description: `Order ${orderId}`,
      image: '',                      // brand logo URL if you have one
      order_id: createData.rzp_order_id,
      prefill: { name, email, contact: '' },
      notes: { order_ref: orderId },
      theme: { color: '#458500' },    // Nuvera brand green

      handler: async function (response) {
        // 4. Verify signature on backend
        try {
          const verifyRes = await fetch(`${BACKEND}/api/payment/verify-signature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            resolve(verifyData);
          } else {
            reject(new Error(verifyData.message || 'Payment signature verification failed.'));
          }
        } catch {
          reject(new Error('Network error while verifying payment. Please contact support.'));
        }
      },

      modal: {
        ondismiss() {
          reject(new Error('Payment was cancelled. Your order has NOT been placed.'));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      reject(
        new Error(
          response.error?.description ||
          'Payment failed. Please try a different payment method.'
        )
      );
    });

    rzp.open();
  });
}
