import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../config.js';

// Inline JWT decoder - no extra package needed
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export default function SignUpModal({ isOpen, onClose, onLoginSuccess, onSwitchToSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setErrorMsg(""); setSuccessMsg("");
    onClose();
  };

  const sendWelcomeEmail = (userName, userEmail) => {
    fetch(`${API_URL}/api/welcome-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: userName, email: userEmail })
    }).catch(err => console.error("Failed to send welcome email:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) { setErrorMsg("Passwords do not match."); return; }
    if (password.length < 6) { setErrorMsg("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Account created! Signing you in...");
        sendWelcomeEmail(data.user.name, data.user.email);
        setTimeout(() => {
          onLoginSuccess({ email: data.user.email, name: data.user.name });
          setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
          setSuccessMsg(""); setErrorMsg("");
        }, 1000);
      } else {
        setErrorMsg(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = decodeJWT(credentialResponse.credential);
      if (!decoded) throw new Error('decode failed');
      const { name: googleName, email: googleEmail } = decoded;
      const emailLower = googleEmail.toLowerCase();

      const res = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: googleName, email: emailLower })
      });
      const data = await res.json();
      if (data.success) {
        // Only send welcome email if newly created (check via message or a flag)
        sendWelcomeEmail(data.user.name, data.user.email);
        setSuccessMsg("Account created with Google!");
        setTimeout(() => {
          onLoginSuccess({ email: data.user.email, name: data.user.name });
          setSuccessMsg("");
        }, 800);
      } else {
        setErrorMsg("Google sign-up failed. Please try again.");
      }
    } catch {
      setErrorMsg("Google sign-up failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Google sign-up was cancelled or failed.");
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-body auth-modal-body"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: 'calc(100% - 0px)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="auth-split-container">
          {/* Left panel: Visual & Brand statement */}
          <div className="auth-split-visual-panel">
            <div className="auth-visual-pattern" />
            <div className="auth-visual-glow" />

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', letterSpacing: '0.03em', zIndex: 1 }}>
              nuvera natural<span style={{ color: 'var(--auth-accent)' }}>.</span>
            </div>

            <div style={{ zIndex: 1, paddingRight: '20px' }}>
              <div style={{ fontSize: '15px', fontStyle: 'italic', opacity: 0.85, lineHeight: '1.6', marginBottom: '8px' }}>
                "Start your journey into natural well-being. Create an account to save wishlist items, track shipments and checkout faster."
              </div>
              <div style={{ width: '40px', height: '1.5px', background: 'var(--auth-accent)', margin: '16px 0' }} />
              <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.7, fontWeight: '700' }}>
                Fresh. Pure. Branded.
              </div>
            </div>

            <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5, fontWeight: '700', zIndex: 1 }}>
              © nuvera organic Ltd.
            </div>

            {/* Botanical fine-line art vector overlay */}
            <svg width="150" height="200" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="auth-visual-art-overlay">
              <path d="M50 140 C50 110, 40 70, 60 20" />
              <path d="M48 115 C40 105, 30 100, 25 105 C20 110, 30 120, 42 122 Z" fill="currentColor" fillOpacity="0.05" />
              <path d="M52 95 C62 85, 72 80, 78 85 C84 90, 74 100, 58 102 Z" fill="currentColor" fillOpacity="0.05" />
              <path d="M47 80 C37 70, 27 65, 22 70 C17 75, 27 85, 41 87 Z" fill="currentColor" fillOpacity="0.05" />
              <path d="M53 60 C63 50, 73 45, 78 50 C83 55, 73 65, 57 67 Z" fill="currentColor" fillOpacity="0.05" />
              <path d="M49 45 C41 37, 33 32, 28 37 C23 42, 31 52, 45 50 Z" fill="currentColor" fillOpacity="0.05" />
            </svg>
          </div>

          {/* Right panel: Sign Up form */}
          <div className="auth-split-form-panel">
            {/* Background glow overlay */}
            <div className="auth-modal-bg-glow" />

            <button
              className="auth-close-btn-premium"
              onClick={handleClose}
              aria-label="Close sign up modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div
              className="modal-scrollable-content auth-form-scroll"
              style={{
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59, 90, 77, 0.12) 0%, rgba(34, 60, 48, 0.05) 100%)',
                    border: '1.5px solid rgba(59, 90, 77, 0.25)',
                    color: 'var(--auth-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    boxShadow: '0 8px 20px rgba(34, 60, 48, 0.05)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {/* Reverted back to the original add-user icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: 'var(--auth-primary)',
                  margin: '0 0 6px',
                  letterSpacing: '-0.01em'
                }}>
                  Create Your Account
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4', fontWeight: '500' }}>
                  Join nuvera natural — takes less than a minute!
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{ width: '100%', maxWidth: '376px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signup_with"
                    shape="rectangular"
                    theme="outline"
                    size="large"
                    width="368"
                  />
                </div>
              </div>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">or sign up with email</span>
                <div className="auth-divider-line" />
              </div>

              {errorMsg && (
                <div style={{
                  background: 'var(--error-light)',
                  color: 'var(--error)',
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderLeft: '4px solid var(--error)',
                  boxShadow: '0 2px 8px rgba(198, 40, 40, 0.05)'
                }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span>
                  <span style={{ flex: 1 }}>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div style={{
                  background: 'var(--success-light)',
                  color: 'var(--success)',
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderLeft: '4px solid var(--success)',
                  boxShadow: '0 2px 8px rgba(46, 125, 50, 0.05)'
                }}>
                  <span style={{ fontSize: '16px' }}>✓</span>
                  <span style={{ flex: 1 }}>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '14px' }}>
                <div className="auth-form-group">
                  <label>Full Name</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Email Address</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="e.g. rahul@example.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Password</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input"
                      style={{ paddingRight: '46px' }}
                      placeholder="Min. 6 characters"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="auth-visibility-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input"
                      style={{ paddingRight: '46px' }}
                      placeholder="Re-enter password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="auth-visibility-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                  style={{ marginTop: '6px' }}
                >
                  {loading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin" style={{ marginRight: '6px' }}>
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignIn}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--auth-accent)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--auth-accent-hover)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--auth-accent)'}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
