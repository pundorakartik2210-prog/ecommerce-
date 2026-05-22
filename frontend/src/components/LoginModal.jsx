import React, { useState, useEffect } from 'react';

export default function LoginModal({ isOpen, initialMode = "signin", onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync authMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setErrorMsg("");
      setSuccessMsg("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Retrieve registered users from localStorage (seed with default mock if empty)
  const getRegisteredUsers = () => {
    const defaultUser = {
      name: "Rahul",
      email: "customer@nuvera.com",
      password: "password123"
    };

    const stored = localStorage.getItem("nuvera_registered_users");
    if (!stored) {
      const initialList = [defaultUser];
      localStorage.setItem("nuvera_registered_users", JSON.stringify(initialList));
      return initialList;
    }

    try {
      const parsed = JSON.parse(stored);
      // Ensure default user exists
      if (!parsed.some(u => u.email.toLowerCase() === defaultUser.email.toLowerCase())) {
        parsed.push(defaultUser);
        localStorage.setItem("nuvera_registered_users", JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return [defaultUser];
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const users = getRegisteredUsers();

    if (authMode === "signup") {
      // 1. SIGN UP FLOW
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setErrorMsg("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }

      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }

      // Check if email already exists
      const emailLower = email.trim().toLowerCase();
      if (users.some(u => u.email.toLowerCase() === emailLower)) {
        setErrorMsg("This email is already registered. Please Sign In.");
        return;
      }

      // Register new user
      const newUser = {
        name: name.trim(),
        email: emailLower,
        password: password
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem("nuvera_registered_users", JSON.stringify(updatedUsers));

      setSuccessMsg("Account created successfully!");

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
      
      // Auto sign-in
      setTimeout(() => {
        onLoginSuccess({
          email: newUser.email,
          name: newUser.name
        });
      }, 1000);

    } else {
      // 2. SIGN IN FLOW
      if (!email.trim() || !password.trim()) {
        setErrorMsg("Please enter email and password.");
        return;
      }

      const emailLower = email.trim().toLowerCase();
      if (emailLower === "nuvera@gmail.com" && password === "123456") {
        onLoginSuccess({
          email: "nuvera@gmail.com",
          name: "Admin"
        });
        return;
      }
      const matchedUser = users.find(u => u.email.toLowerCase() === emailLower && u.password === password);

      if (!matchedUser) {
        setErrorMsg("Invalid email or password. Hint: customer@nuvera.com / password123");
        return;
      }

      onLoginSuccess({
        email: matchedUser.email,
        name: matchedUser.name
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close auth modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={{ padding: '8px' }}>
          
          {/* Header tabs for signin/signup */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <button 
              type="button"
              style={{
                flex: 1,
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: authMode === 'signin' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                color: authMode === 'signin' ? 'var(--brand-primary)' : 'var(--text-light)',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onClick={() => { setAuthMode('signin'); setErrorMsg(""); setSuccessMsg(""); setShowPassword(false); setShowConfirmPassword(false); }}
            >
              Sign In
            </button>
            <button 
              type="button"
              style={{
                flex: 1,
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: authMode === 'signup' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                color: authMode === 'signup' ? 'var(--brand-primary)' : 'var(--text-light)',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onClick={() => { setAuthMode('signup'); setErrorMsg(""); setSuccessMsg(""); setShowPassword(false); setShowConfirmPassword(false); }}
            >
              Sign Up
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--brand-primary)', margin: '0 0 6px 0' }}>
              {authMode === 'signin' ? "Welcome Back!" : "Join Nuvera Naturals"}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              {authMode === 'signin' 
                ? "Sign in to complete secure checkouts and track organic shipments."
                : "Create an account to save wishlist items and speed up ordering."
              }
            </p>
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

          {successMsg && (
            <div style={{ 
              background: '#e6f4ea', 
              color: '#137333', 
              fontSize: '12px', 
              fontWeight: '700',
              padding: '10px 14px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '16px' 
            }}>
              ✓ {successMsg} Logging in...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {authMode === 'signup' && (
              <div className="auth-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="e.g. Rahul Sharma" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="auth-form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="e.g. customer@nuvera.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  style={{ paddingRight: '44px' }}
                  placeholder="••••••••" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {authMode === 'signup' && (
              <div className="auth-form-group">
                <label>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="auth-input" 
                    style={{ paddingRight: '44px' }}
                    placeholder="••••••••" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
            )}

            <button type="submit" className="checkout-btn" style={{ width: '100%', marginTop: '12px', padding: '12px' }}>
              {authMode === 'signin' ? "Sign In & Checkout" : "Create Account & Sign In"}
            </button>
          </form>

          {/* Switch flow links at bottom */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {authMode === 'signin' ? (
              <span>
                New to Nuvera Naturals?{' '}
                <button 
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                  onClick={() => { setAuthMode('signup'); setErrorMsg(""); setSuccessMsg(""); }}
                >
                  Create an Account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button 
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                  onClick={() => { setAuthMode('signin'); setErrorMsg(""); setSuccessMsg(""); }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
