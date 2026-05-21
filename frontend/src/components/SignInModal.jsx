import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

// Inline JWT decoder - no extra package needed
const decodeJWT = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch { return null; }
};

export default function SignInModal({ isOpen, onClose, onLoginSuccess, onSwitchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setErrorMsg("");
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

  const handleAutofill = () => {
    setEmail("customer@nuvera.com");
    setPassword("password123");
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter email and password.");
      return;
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === "nuvera@gmail.com" && password === "123456") {
      onLoginSuccess({ email: "nuvera@gmail.com", name: "Admin" });
      setEmail("");
      setPassword("");
      setErrorMsg("");
      return;
    }
    const users = getRegisteredUsers();
    const match = users.find(u => u.email.toLowerCase() === trimmedEmail && u.password === password);
    if (!match) {
      setErrorMsg("Invalid email or password.");
      return;
    }
    onLoginSuccess({ email: match.email, name: match.name });
    setEmail("");
    setPassword("");
    setErrorMsg("");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = decodeJWT(credentialResponse.credential);
      if (!decoded) throw new Error('decode failed');
      const { name, email } = decoded;
      // Auto-register Google user if not already registered
      const users = getRegisteredUsers();
      const emailLower = email.toLowerCase();
      if (!users.some(u => u.email.toLowerCase() === emailLower)) {
        const googleUser = { name, email: emailLower, password: "__google__" };
        localStorage.setItem("nuvera_registered_users", JSON.stringify([...users, googleUser]));
      }
      onLoginSuccess({ email: emailLower, name });
    } catch {
      setErrorMsg("Google sign-in failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Google sign-in was cancelled or failed.");
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
          aria-label="Close sign in modal"
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '26px', 
              fontWeight: '800',
              color: 'var(--brand-primary)', 
              margin: '0 0 8px' 
            }}>
              Welcome Back!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Sign in to your Nuvera Naturals account.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="376"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--border-color))' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              or sign in with email
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

          <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '20px' }}>
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
                  placeholder="customer@nuvera.com"
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
                  placeholder="••••••••"
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
              Sign In
            </button>
          </form>

          <div 
            className="login-quick-badge" 
            style={{ 
              marginTop: '28px', 
              padding: '16px', 
              background: 'rgba(226, 149, 67, 0.06)', 
              border: '1px dashed rgba(226, 149, 67, 0.3)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}
          >
            <h4 style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--brand-secondary)', fontWeight: '750' }}>
              💡 Demo Credentials
            </h4>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Click below to auto-fill the demo account.
            </p>
            <button 
              type="button" 
              className="quick-login-shortcut-btn" 
              onClick={handleAutofill}
              style={{
                width: '100%',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '700',
                background: 'var(--brand-accent)',
                color: 'var(--brand-dark-text)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              ⚡ Auto-Fill Demo Profile
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToSignUp}
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
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
