import React, { useState, useEffect, useRef } from 'react';
import { initiateRazorpayPayment } from '../utils/razorpay';
import { API_URL } from '../config.js';
import { auth } from '../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// ─── Inline styles ────────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(30, 18, 8, 0.55)',
    backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1100, padding: '16px',
  },
  card: {
    background: 'var(--bg-white)',
    borderRadius: '20px',
    boxShadow: '0 32px 80px rgba(92,58,33,0.22)',
    width: '100%', maxWidth: '440px',
    position: 'relative', overflow: 'hidden',
  },
  accent: {
    height: '5px',
    background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-accent))',
  },
  inner: { padding: '32px 32px 28px' },
  closeBtn: {
    position: 'absolute', top: '18px', right: '18px',
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text-light)', padding: '4px',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'color 0.2s, background 0.2s',
    lineHeight: 0,
  },
  iconRing: (color) => ({
    width: '64px', height: '64px', borderRadius: '50%',
    background: `${color}14`,
    border: `2px solid ${color}44`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '16px',
  }),
  heading: {
    fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '800',
    color: 'var(--brand-primary)', margin: '0 0 8px 0', textAlign: 'center',
  },
  sub: {
    fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.55',
    textAlign: 'center', margin: '0 0 24px 0',
  },
  label: {
    fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
    letterSpacing: '0.6px', color: 'var(--text-light)', display: 'block',
    marginBottom: '6px',
  },
  phoneRow: {
    display: 'flex', alignItems: 'stretch',
    border: '1.5px solid var(--border-color)',
    borderRadius: '12px', overflow: 'hidden',
    transition: 'border-color 0.2s',
    marginBottom: '20px',
  },
  prefix: {
    padding: '0 14px',
    background: 'var(--bg-cream)',
    borderRight: '1.5px solid var(--border-color)',
    fontSize: '15px', fontWeight: '700', color: 'var(--text-secondary)',
    display: 'flex', alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  phoneInput: {
    flex: 1, border: 'none', outline: 'none', padding: '13px 14px',
    fontSize: '16px', fontWeight: '600', color: 'var(--brand-primary)',
    background: 'transparent', letterSpacing: '1px',
  },
  primaryBtn: (disabled) => ({
    width: '100%', padding: '14px',
    background: disabled ? 'var(--text-light)' : 'var(--brand-primary)',
    color: 'var(--bg-white)', border: 'none',
    borderRadius: '12px', fontSize: '15px', fontWeight: '800',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    letterSpacing: '0.3px',
  }),
  ghostBtn: {
    width: '100%', padding: '12px',
    background: 'none', border: '1.5px solid var(--border-color)',
    color: 'var(--text-secondary)', borderRadius: '12px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    transition: 'all 0.2s ease', marginTop: '10px',
  },
  errorBox: {
    background: 'rgba(234,67,53,0.07)', color: 'var(--error)',
    border: '1px solid rgba(234,67,53,0.3)',
    borderRadius: '10px', padding: '12px 14px',
    fontSize: '13px', fontWeight: '700', lineHeight: '1.4',
    marginBottom: '16px',
  },
  otpGrid: {
    display: 'flex', gap: '10px', justifyContent: 'center',
    marginBottom: '24px',
  },
  otpBox: (filled) => ({
    width: '48px', height: '56px',
    border: `2px solid ${filled ? 'var(--brand-accent)' : 'var(--border-color)'}`,
    borderRadius: '12px', fontSize: '22px', fontWeight: '800',
    textAlign: 'center', color: 'var(--brand-primary)',
    background: filled ? 'rgba(226,149,67,0.06)' : 'var(--bg-white)',
    outline: 'none', transition: 'all 0.15s ease',
    caretColor: 'var(--brand-accent)',
  }),
  timerRow: {
    textAlign: 'center', fontSize: '13px', color: 'var(--text-light)',
    marginBottom: '16px',
  },
  resendBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--brand-primary)', fontWeight: '800', fontSize: '13px',
    textDecoration: 'underline', padding: '0',
  },
  spinnerRing: {
    width: '64px', height: '64px', borderRadius: '50%',
    border: '3px solid rgba(226,149,67,0.2)',
    borderTop: '3px solid var(--brand-accent)',
    animation: 'spin 0.9s linear infinite',
    marginBottom: '16px',
  },
};

export default function OrderVerificationModal({
  isOpen,
  cart,
  total,
  user,
  onClose,
  onVerificationSuccess,
}) {
  // 'phone' | 'otp' | 'processing' | 'success' | 'failed'
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const paymentTriggered = useRef(false);

  // Reset whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setOrderId('');
      setLoading(false);
      setErrorMsg('');
      setResendTimer(0);
      paymentTriggered.current = false;
    }
  }, [isOpen]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // Cleanup recaptcha on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (isResend = false) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setErrorMsg('reCAPTCHA expired. Please try again.');
          }
        });
      }

      const formattedPhone = `+91${clean}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;

      setStep('otp');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // ── OTP box handlers ───────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...otp];
      if (otp[index]) {
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        next[index - 1] = '';
        setOtp(next);
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = digits[i] || '';
    setOtp(next);
    const firstEmpty = next.findIndex((d) => !d);
    otpRefs.current[firstEmpty >= 0 ? firstEmpty : 5]?.focus();
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      if (!window.confirmationResult) {
        throw new Error('No active verification session. Please request a new OTP.');
      }
      
      const result = await window.confirmationResult.confirm(otpStr);
      const cleanPhone = `+91${phone.replace(/\D/g, '')}`;

      const res = await fetch(`${API_URL}/api/orders/verify-firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          name: user?.name || 'Customer',
          email: user?.email || '',
          cart,
          total,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('processing');
        setLoading(false);
        await launchPayment(data.order);
      } else {
        setErrorMsg(data.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 80);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid OTP. Please check and try again.');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 80);
      setLoading(false);
    }
  };

  // ── Step 3: Razorpay ──────────────────────────────────────────────────────
  const launchPayment = async (verifiedOrder) => {
    if (paymentTriggered.current) return;
    paymentTriggered.current = true;
    try {
      await initiateRazorpayPayment({
        orderId: verifiedOrder.orderId,
        amount: verifiedOrder.total,
        name: verifiedOrder.name || user?.name,
        email: verifiedOrder.email || user?.email,
      });
      setStep('success');
      setTimeout(() => onVerificationSuccess(verifiedOrder), 1200);
    } catch (err) {
      setStep('failed');
      setErrorMsg(err.message || 'Payment could not be completed. Your order has NOT been placed.');
      paymentTriggered.current = false;
    }
  };

  if (!isOpen) return null;

  const pad2 = (n) => String(n).padStart(2, '0');
  const timerText = `${pad2(Math.floor(resendTimer / 60))}:${pad2(resendTimer % 60)}`;
  const canClose = step !== 'processing' && step !== 'success';

  return (
    <div style={S.overlay}>
      <div id="recaptcha-container"></div>
      <div style={S.card}>
        <div style={S.accent} />
        <div style={S.inner}>

          {/* Close button */}
          {canClose && (
            <button
              style={S.closeBtn}
              onClick={onClose}
              aria-label="Close"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-cream)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          {/* ── STEP: phone ─────────────────────────────────────────────── */}
          {step === 'phone' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={S.iconRing('var(--brand-accent)')}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.55 5.55l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 style={S.heading}>Secure Checkout</h3>
                <p style={S.sub}>
                  Enter your mobile number to receive a one-time password and confirm your order.
                </p>
              </div>

              {errorMsg && <div style={S.errorBox}>⚠️ {errorMsg}</div>}

              <label style={S.label} htmlFor="otp-phone-input">Mobile Number</label>
              <div style={S.phoneRow}>
                <span style={S.prefix}>🇮🇳 +91</span>
                <input
                  id="otp-phone-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrorMsg(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp(false)}
                  style={S.phoneInput}
                  autoFocus
                />
              </div>

              <button
                id="otp-send-btn"
                style={S.primaryBtn(loading || phone.replace(/\D/g, '').length !== 10)}
                disabled={loading || phone.replace(/\D/g, '').length !== 10}
                onClick={() => handleSendOtp(false)}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                    </svg>
                    Sending OTP…
                  </>
                ) : '📱 Send OTP'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)', marginTop: '16px', lineHeight: '1.4' }}>
                🔒 OTP is valid for 5 minutes. Standard SMS charges may apply.
              </p>
            </>
          )}

          {/* ── STEP: otp ───────────────────────────────────────────────── */}
          {step === 'otp' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={S.iconRing('#2196F3')}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 style={S.heading}>Enter OTP</h3>
                <p style={S.sub}>
                  A 6-digit OTP was sent to <strong style={{ color: 'var(--brand-primary)' }}>+91 {phone}</strong>
                  <br /><button style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0, textDecoration: 'underline' }} onClick={() => { setStep('phone'); setErrorMsg(''); }}>Change number</button>
                </p>
              </div>



              {errorMsg && <div style={S.errorBox}>⚠️ {errorMsg}</div>}

              <div style={S.otpGrid}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    id={`otp-digit-${i}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    style={S.otpBox(!!digit)}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <div style={S.timerRow}>
                {resendTimer > 0 ? (
                  <span>Resend OTP in <strong style={{ color: 'var(--brand-primary)', fontFamily: 'monospace' }}>{timerText}</strong></span>
                ) : (
                  <span>Didn't receive it?{' '}
                    <button style={S.resendBtn} onClick={() => handleSendOtp(true)} disabled={loading}>
                      Resend OTP
                    </button>
                  </span>
                )}
              </div>

              <button
                id="otp-verify-btn"
                style={S.primaryBtn(loading || otp.join('').length !== 6)}
                disabled={loading || otp.join('').length !== 6}
                onClick={handleVerifyOtp}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                    </svg>
                    Verifying…
                  </>
                ) : '✓ Verify & Proceed to Payment'}
              </button>

              <button style={S.ghostBtn} onClick={onClose}>
                Cancel & Go Back
              </button>
            </>
          )}

          {/* ── STEP: processing ────────────────────────────────────────── */}
          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={S.spinnerRing} />
              </div>
              <h3 style={S.heading}>Launching Payment</h3>
              <p style={S.sub}>
                Please complete payment in the Razorpay window.<br />
                <strong>Do not close this tab.</strong>
              </p>
            </div>
          )}

          {/* ── STEP: success ────────────────────────────────────────────── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ ...S.iconRing('#28a745'), margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={S.heading}>Payment Successful!</h3>
              <p style={S.sub}>Your order is confirmed. Redirecting to tracking…</p>
            </div>
          )}

          {/* ── STEP: failed ─────────────────────────────────────────────── */}
          {step === 'failed' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ ...S.iconRing('#ea4335'), margin: '0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ea4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h3 style={{ ...S.heading, color: '#ea4335' }}>Payment Failed</h3>
              {errorMsg && <div style={{ ...S.errorBox, marginBottom: '20px' }}>⚠️ {errorMsg}</div>}
              <button
                style={S.primaryBtn(false)}
                onClick={() => {
                  setStep('otp');
                  setErrorMsg('');
                  setOtp(['', '', '', '', '', '']);
                  paymentTriggered.current = false;
                  setTimeout(() => otpRefs.current[0]?.focus(), 80);
                }}
              >
                Try Again
              </button>
              <button style={S.ghostBtn} onClick={onClose}>
                Cancel Order
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
