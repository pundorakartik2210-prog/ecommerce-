import { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import logoImg from '../assets/logo_final_white.png';
import logoTextImg from '../assets/logo-text-clean.png';

export default function Navbar({
  cartCount,
  wishlistCount,
  onStoreClick,
  onCartClick,
  onWishlistClick,
  onTrackingClick,
  onAboutClick,
  onAdminClick,
  activeTab,
  onSearch,
  onLogoClick,
  user,
  onLoginClick,
  onSignUpClick,
  onLogout
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close suggestions and user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions as search query changes
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val); // Real-time filtering

    if (val.trim().length > 1) {
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(val.toLowerCase()) ||
        p.tagline.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (prodName) => {
    setSearchTerm(prodName);
    onSearch(prodName);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  return (
    <nav className="navbar-sticky">
      <div className="navbar-container">

        {/* Brand Logo & Name */}
        <div className="brand-logo" onClick={onLogoClick}>
          <img src={`${logoImg}?v=10`} alt="Nuvera Naturals Logo" className="navbar-logo-img" style={{ mixBlendMode: 'normal' }} />
          <img src={logoTextImg} alt="Nuvera Naturals" className="navbar-logo-text-img" />
        </div>

        {/* Search Bar (Flipkart Style) */}
        <div className="search-wrapper" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="search-bar-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search premium peanut butters (e.g., Creamy, Sugar-Free...)"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.trim().length > 1 && setShowSuggestions(true)}
              />
              <button type="submit" className="search-btn" aria-label="Search button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map(prod => (
                <div
                  key={prod.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(prod.name)}
                >
                  <div className="suggestion-img">
                    {/* Tiny Jar Preview */}
                    <div style={{
                      width: '20px',
                      height: '28px',
                      border: '1.5px solid var(--brand-primary)',
                      borderRadius: '3px',
                      background: prod.color,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '14px',
                        height: '4px',
                        background: 'var(--brand-accent)',
                        border: '1px solid var(--brand-primary)'
                      }}></div>
                    </div>
                  </div>
                  <div className="suggestion-info">
                    <span className="suggestion-name">{prod.name}</span>
                    <span className="suggestion-tag">{prod.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions (Profile Dropdown Menu) */}
        <div className="nav-actions">

          <div className="nav-user-container" ref={userMenuRef}>
            <div
              className="profile-avatar-chip"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <div className="profile-avatar-circle">
                {user ? user.name.charAt(0).toUpperCase() : "G"}
              </div>
              <span>Hi, {user ? user.name : "Guest"}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {showUserDropdown && (
              <div className="user-profile-dropdown">
                {/* 1. Shop Store */}
                <button
                  className={`dropdown-nav-btn ${activeTab === 'store' ? 'active' : ''}`}
                  onClick={() => {
                    onStoreClick();
                    setShowUserDropdown(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Shop Store</span>
                  </div>
                </button>

                {/* 2. My Cart */}
                <button
                  className={`dropdown-nav-btn ${activeTab === 'cart' ? 'active' : ''}`}
                  onClick={() => {
                    onCartClick();
                    setShowUserDropdown(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>My Cart</span>
                  </div>
                  {cartCount > 0 && <span className="dropdown-badge">{cartCount}</span>}
                </button>

                {/* 3. My Wishlist */}
                <button
                  className={`dropdown-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                  onClick={() => {
                    onWishlistClick();
                    setShowUserDropdown(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>My Wishlist</span>
                  </div>
                  {wishlistCount > 0 && <span className="dropdown-badge">{wishlistCount}</span>}
                </button>

                {/* 4. Orders */}
                <button
                  className={`dropdown-nav-btn ${activeTab === 'tracking' ? 'active' : ''}`}
                  onClick={() => {
                    onTrackingClick();
                    setShowUserDropdown(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <span>Orders</span>
                  </div>
                </button>

                {/* 5. About Us */}
                <button
                  className={`dropdown-nav-btn ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => {
                    onAboutClick();
                    setShowUserDropdown(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>About Us</span>
                  </div>
                </button>

                {/* 6. Admin Portal */}
                {(!user || user.email === 'nuvera@gmail.com') && (
                  <button 
                    className="dropdown-nav-btn"
                    onClick={() => {
                      onAdminClick?.();
                      setShowUserDropdown(false);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--brand-accent)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span style={{ fontWeight: '700' }}>Admin Portal</span>
                    </div>
                  </button>
                )}

                <div className="dropdown-divider"></div>

                {/* Authentication Action */}
                {user ? (
                  <button
                    className="dropdown-action-btn logout-btn"
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="dropdown-auth-actions">
                    <button
                      className="dropdown-action-btn login-btn"
                      onClick={() => {
                        onLoginClick();
                        setShowUserDropdown(false);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      <span>Sign In</span>
                    </button>
                    <button
                      className="dropdown-action-btn signup-btn"
                      onClick={() => {
                        onSignUpClick();
                        setShowUserDropdown(false);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="17" y1="11" x2="23" y2="11"></line>
                      </svg>
                      <span>Sign Up</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>


      </div>
    </nav>
  );
}
