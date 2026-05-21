import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

// Inline JWT decoder - no extra package needed
const decodeJWT = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch { return null; }
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

  if (!isOpen) return null;

  const handleClose = () => {
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setErrorMsg(""); setSuccessMsg("");
    onClose();
  };

  const getRegisteredUsers = () => {
    const defaultUser = { name: "Rahul", email: "customer@nuvera.com", password: "password123" };
    const stored = localStorage.getItem("nuvera_registered_users");
    if (!stored) {
      localStorage.setItem("nuvera_registered_users", JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.some(u => u.email.toLowerCase() === defaultUser.email)) {
        parsed.push(defaultUser);
        localStorage.setItem("nuvera_registered_users", JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return [defaultUser];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) { setErrorMsg("Passwords do not match."); return; }
    if (password.length < 6) { setErrorMsg("Password must be at least 6 characters."); return; }

    const users = getRegisteredUsers();
    const emailLower = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === emailLower)) {
      setErrorMsg("This email is already registered. Please Sign In instead.");
      return;
    }
    const newUser = { name: name.trim(), email: emailLower, password };
    localStorage.setItem("nuvera_registered_users", JSON.stringify([...users, newUser]));
    setSuccessMsg("Account created! Signing you in...");

    // Send welcome email via Laravel backend using EmailJS
    fetch('http://127.0.0.1:8000/api/welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email
      })
    }).catch(err => console.error("Failed to send welcome email:", err));

    setTimeout(() => {
      onLoginSuccess({ email: newUser.email, name: newUser.name });
      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
      setSuccessMsg(""); setErrorMsg("");
    }, 1000);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = decodeJWT(credentialResponse.credential);
      if (!decoded) throw new Error('decode failed');
      const { name: googleName, email: googleEmail } = decoded;
      const users = getRegisteredUsers();
      const emailLower = googleEmail.toLowerCase();
      // Register if first time
      if (!users.some(u => u.email.toLowerCase() === emailLower)) {
        const googleUser = { name: googleName, email: googleEmail } = decoded;
        localStorage.setItem("nuvera_registered_users", JSON.stringify([...users, { name: googleName, email: emailLower, password: "__google__" }]));
        setSuccessMsg("Account created with Google!");

        // Send welcome email via Laravel backend using EmailJS
        fetch('http://127.0.0.1:8000/api/welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: googleName,
            email: emailLower
          })
        }).catch(err => console.error("Failed to send welcome email:", err));
      } else {
        setSuccessMsg("Welcome back! Signing you in...");
      }
      setTimeout(() => {
        onLoginSuccess({ email: emailLower, name: googleName });
        setSuccessMsg("");
      }, 800);
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
        className="modal-body" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '440px', 
          width: '100%',
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderTop: '5px solid var(--brand-accent)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-white)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button 
          className="modal-close-btn" 
          onClick={handleClose} 
          aria-label="Close sign up modal"
          style={{ top: '20px', right: '20px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div 
          className="modal-scrollable-content"
          style={{ 
            padding: '40px 32px 32px', 
            overflowY: 'auto', 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'rgba(226, 149, 67, 0.12)', 
              border: '2px solid rgba(226, 149, 67, 0.3)',
              color: 'var(--brand-accent)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(226, 149, 67, 0.08)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '26px', 
              fontWeight: '800',
              color: 'var(--brand-primary)', 
              margin: '0 0 8px' 
            }}>
              Create Your Account
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Join Nuvera Naturals — takes less than a minute!
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="376"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--border-color))' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              or sign up with email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, var(--border-color))' }} />
          </div>

          {errorMsg && (
            <div style={{ 
              background: 'var(--error-light)', 
              color: 'var(--error)', 
              fontSize: '13px', 
              fontWeight: '700', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderLeft: '4px solid var(--error)'
            }}>
              <span>⚠️</span> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ 
              background: 'var(--success-light)', 
              color: 'var(--success)', 
              fontSize: '13px', 
              fontWeight: '700', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderLeft: '4px solid var(--success)'
            }}>
              <span>✓</span> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '20px' }}>
            <div className="auth-form-group">
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--brand-primary)', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  className="auth-input" 
                  style={{ paddingLeft: '44px', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-cream)' }} 
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--brand-primary)', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input 
                  type="email" 
                  className="auth-input" 
                  style={{ paddingLeft: '44px', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-cream)' }} 
                  placeholder="e.g. rahul@example.com" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--brand-primary)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  style={{ paddingLeft: '44px', paddingRight: '44px', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-cream)' }} 
                  placeholder="Min. 6 characters" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
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
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--brand-primary)', marginBottom: '6px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="auth-input" 
                  style={{ paddingLeft: '44px', paddingRight: '44px', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-cream)' }} 
                  placeholder="Re-enter password" 
                  required 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
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
              className="checkout-btn" 
              style={{ 
                width: '100%', 
                marginTop: '16px', 
                padding: '14px', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: '0 4px 14px rgba(92, 58, 33, 0.15)'
              }}
            >
              Create Account
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToSignIn}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--brand-accent)', 
                fontWeight: '700', 
                cursor: 'pointer', 
                padding: 0, 
                fontFamily: 'inherit',
                textDecoration: 'underline' 
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
