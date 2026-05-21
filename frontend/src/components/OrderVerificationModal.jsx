import React, { useState, useEffect, useRef } from 'react';
import { initiateRazorpayPayment } from '../utils/razorpay';

export default function OrderVerificationModal({
  isOpen,
  orderId,
  name,
  email,
  total,
  onClose,
  onVerificationSuccess,
}) {
  const [timeLeft, setTimeLeft]         = useState(300); // 5 minutes
  const [errorMsg, setErrorMsg]         = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus]   = useState(''); // '' | 'processing' | 'success' | 'failed'
  const paymentTriggered = useRef(false);   // prevent double-trigger

  // Reset state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setErrorMsg('');
      setPaymentLoading(false);
      setPaymentStatus('');
      paymentTriggered.current = false;
    }
  }, [isOpen, orderId]);

  // Ticking Timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // ─── Razorpay payment launcher ───────────────────────────────────────────
  const launchPayment = async (verifiedOrder) => {
    if (paymentTriggered.current) return;
    paymentTriggered.current = true;

    setPaymentStatus('processing');
    setPaymentLoading(true);
    setErrorMsg('');

    try {
      await initiateRazorpayPayment({
        orderId: verifiedOrder.orderId,
        amount:  verifiedOrder.total,
        name:    verifiedOrder.name || name,
        email:   verifiedOrder.email || email,
      });

      // Payment succeeded
      setPaymentStatus('success');
      setPaymentLoading(false);
      setTimeout(() => onVerificationSuccess(verifiedOrder), 1200);
    } catch (err) {
      // Payment failed or was cancelled
      setPaymentStatus('failed');
      setPaymentLoading(false);
      setErrorMsg(err.message || 'Payment could not be completed. Your order has NOT been placed.');
      paymentTriggered.current = false; // allow retry
    }
  };

  // ─── Polling: detect email-link verification ──────────────────────────────
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || paymentStatus !== '') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/orders/status/${orderId}`
        );
        if (!response.ok) return;
        const data = await response.json();

        if (data.success) {
          if (data.status === 'verified') {
            clearInterval(pollInterval);
            launchPayment(data.order);
          } else if (data.status === 'expired') {
            clearInterval(pollInterval);
            setErrorMsg('Verification session expired. Please re-place your order.');
          }
        }
      } catch (err) {
        console.error('Error polling order status:', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orderId, timeLeft, paymentStatus]);

  if (!isOpen) return null;

  // Format Time: MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired   = timeLeft <= 0;
  const showSpamHint = timeLeft <= 240; // 1 minute passed

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 1100 }}>
      <div
        className="modal-body"
        style={{
          maxWidth: '460px',
          width: '100%',
          borderTop: '5px solid var(--brand-accent)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-white)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          padding: '40px 32px 32px',
          margin: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close verification modal"
          style={{ top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
          disabled={paymentLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* ── Payment Processing State ── */}
        {paymentStatus === 'processing' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(69,133,0,0.08)', border: '2px dashed var(--brand-accent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              animation: 'spin 2s linear infinite', marginBottom: '20px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand-accent)" strokeWidth="2.2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--brand-primary)', margin: '0 0 8px 0' }}>
              Processing Payment
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Please complete the payment in the Razorpay window. Do <strong>not</strong> close this tab.
            </p>
          </div>
        )}

        {/* ── Payment Success State ── */}
        {paymentStatus === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(40,167,69,0.1)', border: '2px solid rgba(40,167,69,0.3)',
              color: 'var(--success)', display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--brand-primary)', margin: '0 0 8px 0' }}>
              Payment Successful!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Your order is confirmed. Redirecting to tracking...
            </p>
          </div>
        )}

        {/* ── Awaiting Verification State (default) ── */}
        {paymentStatus === '' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {!isExpired ? (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                  <div style={{
                    position: 'absolute', width: '68px', height: '68px', top: '-4px', left: '-4px',
                    borderRadius: '50%', border: '2px solid var(--brand-accent)',
                    animation: 'spin 3s linear infinite', opacity: 0.4,
                  }}></div>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'rgba(226, 149, 67, 0.08)', border: '2px dashed var(--brand-accent)',
                    color: 'var(--brand-accent)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', animation: 'spin 12s linear infinite',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: 'rgba(234, 67, 53, 0.1)', border: '2px solid rgba(234, 67, 53, 0.3)',
                  color: 'var(--error)', display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '16px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              )}

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '800', color: 'var(--brand-primary)', margin: '0 0 10px' }}>
                {isExpired ? 'Verification Expired' : 'Awaiting Email Confirmation'}
              </h3>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '360px' }}>
                We've sent a secure order confirmation link to your email:
                <strong style={{ display: 'block', color: 'var(--brand-primary)', marginTop: '4px', wordBreak: 'break-all' }}>{email}</strong>
              </p>

              <div style={{
                background: 'var(--bg-cream)', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                fontSize: '13.5px', color: 'var(--brand-secondary)', fontWeight: '600', lineHeight: '1.4',
                border: '1px solid var(--border-color)', display: 'inline-block', maxWidth: '360px',
              }}>
                ✉️ Open your inbox and click <strong>"Confirm &amp; Place Order"</strong> in the email.
                <br/>After confirming, Razorpay payment will open automatically.
              </div>
            </div>

            {/* Countdown Timer */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 18px', borderRadius: 'var(--radius-full)',
                background: isExpired ? 'var(--error-light)' : 'rgba(226, 149, 67, 0.08)',
                border: isExpired ? '1px solid var(--error)' : '1px solid rgba(226, 149, 67, 0.25)',
              }}>
                <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: isExpired ? 'var(--error)' : 'var(--brand-secondary)' }}>
                  {isExpired ? 'Time Expired' : 'Expires In'}
                </span>
                <span style={{ fontSize: '15px', fontWeight: '900', fontFamily: 'monospace', color: isExpired ? 'var(--error)' : 'var(--brand-primary)' }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── Error Message (payment failed or expired) ── */}
        {(errorMsg || paymentStatus === 'failed') && (
          <div style={{
            background: 'var(--error-light)', color: 'var(--error)', fontSize: '13px',
            fontWeight: '700', padding: '12px 16px', borderRadius: 'var(--radius-md)',
            marginTop: '16px', borderLeft: '4px solid var(--error)',
          }}>
            ⚠️ {errorMsg || 'Payment could not be completed.'}
          </div>
        )}

        {/* Spam / Retry hint */}
        {paymentStatus === '' && showSpamHint && !isExpired && (
          <div style={{
            marginTop: '20px', padding: '12px 16px',
            background: 'rgba(226, 149, 67, 0.05)',
            border: '1px dashed rgba(226, 149, 67, 0.25)',
            borderRadius: 'var(--radius-md)', fontSize: '12.5px', lineHeight: '1.45',
            color: 'var(--text-secondary)', textAlign: 'left',
          }}>
            <strong>💡 Still waiting for the email?</strong>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
              <li>Check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folders.</li>
              <li>Verify that your email address is spelled correctly.</li>
              <li>Close this modal and click "Place Order" to resend the email.</li>
            </ul>
          </div>
        )}

        {/* Action / Cancel button */}
        {paymentStatus !== 'processing' && paymentStatus !== 'success' && (
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%', marginTop: '24px', padding: '12px',
              background: isExpired || paymentStatus === 'failed' ? 'var(--brand-primary)' : 'none',
              border: isExpired || paymentStatus === 'failed' ? 'none' : '2px solid var(--border-color)',
              color: isExpired || paymentStatus === 'failed' ? 'var(--bg-white)' : 'var(--text-secondary)',
              fontWeight: '700', borderRadius: 'var(--radius-full)',
              cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease',
            }}
          >
            {isExpired ? 'Re-place Order' : paymentStatus === 'failed' ? 'Cancel & Try Again' : 'Cancel & Go Back'}
          </button>
        )}
      </div>
    </div>
  );
}
