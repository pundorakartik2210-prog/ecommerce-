import { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onCartClick, 
  onWishlistClick, 
  onTrackingClick, 
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
          <svg width="34" height="34" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 0 1 9 9c0 2.274 -1.354 4.828 -3.22 6.78a2 2 0 0 1 -1.43 .62h-8.7c-.54 0 -1.055 -.22 -1.43 -.62c-1.866 -1.952 -3.22 -4.506 -3.22 -6.78a9 9 0 0 1 9 -9z" fill="var(--brand-accent)" stroke="var(--brand-primary)" strokeWidth="2" />
            <path d="M8 9a4 4 0 0 1 8 0" stroke="var(--brand-primary)" strokeWidth="2" />
            <line x1="9" y1="13" x2="15" y2="13" stroke="var(--brand-primary)" strokeWidth="2" />
            <line x1="10" y1="16" x2="14" y2="16" stroke="var(--brand-primary)" strokeWidth="2" />
          </svg>
          <div className="brand-name">Nuvera<span>Naturals</span></div>
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

        {/* Right Actions (Sign In) */}
        <div className="nav-actions">
          
          {/* Authentication Badge */}
          {user ? (
            <div className="nav-user-container" ref={userMenuRef}>
              <div 
                className="profile-avatar-chip" 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="profile-avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>Hi, {user.name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {showUserDropdown && (
                <div className="user-profile-dropdown">
                  <button 
                    className="dropdown-action-btn"
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
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="nav-signin-btn" 
                onClick={onLoginClick}
              >
                Sign In
              </button>
              <button 
                className="nav-signup-btn" 
                onClick={onSignUpClick}
              >
                Sign Up
              </button>
            </div>
          )}

        </div>


      </div>
    </nav>
  );
}
