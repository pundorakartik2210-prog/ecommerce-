import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleQuickAutofill = () => {
    setEmail("customer@nuvera.com");
    setPassword("password123");
    setName("Rahul"); // Premium personalized name
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all the details.");
      return;
    }

    // Accept any mock login for simplicity, but prefilled is premium
    const displayName = name.trim() || email.split('@')[0];
    
    onLoginSuccess({
      email: email.trim(),
      name: displayName
    });
    
    // Reset form states
    setEmail("");
    setPassword("");
    setName("");
    setErrorMsg("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close login modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={{ padding: '24px 8px 8px 8px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--radius-full)', 
              background: 'var(--brand-accent)', 
              color: 'var(--brand-primary)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--brand-primary)', margin: '0 0 6px 0' }}>
              Sign In Required
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Unlock secure checkouts and track shipments in real-time.
            </p>
          </div>

          {/* Quick Demo Credentials Info Bar */}
          <div className="login-quick-badge">
            <h4>💡 Quick Demo Sandbox Login</h4>
            <p>Testing checkout validations? Tap below to pre-fill active mock sandbox credentials.</p>
            <button type="button" className="quick-login-shortcut-btn" onClick={handleQuickAutofill}>
              ⚡ Auto-Fill Demo Profile
            </button>
          </div>

          {errorMsg && (
            <div style={{ 
              background: 'var(--error-light)', 
              color: 'var(--error)', 
              fontSize: '12px', 
              fontWeight: '700',
              padding: '10px 14px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '16px' 
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label>Full Name (Optional)</label>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="e.g. Rahul Sharma" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="auth-form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="customer@nuvera.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="checkout-btn" style={{ width: '100%', marginTop: '12px' }}>
              Sign In & Checkout
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
