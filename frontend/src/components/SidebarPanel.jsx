import React from 'react';

export default function SidebarPanel({
  currentPage,
  setCurrentPage,
  cartCount,
  wishlistCount,
  user
}) {
  return (
    <div className="sidebar-navigation-panel">
      
      {/* Premium Glassmorphic User Profile Greeting Card */}
      <div className="sidebar-profile-card">
        <div className="profile-avatar-large">
          {user ? user.name.charAt(0).toUpperCase() : "G"}
        </div>
        <div className="profile-details">
          <span className="profile-greeting">Welcome back,</span>
          <span className="profile-name">{user ? user.name : "Guest Shopper"}</span>
          <span className="profile-membership-badge">
            {user ? "✨ Gold Club Member" : "🌿 Premium Shopper"}
          </span>
        </div>
      </div>

      <div className="sidebar-menu-header">
        <h3 className="menu-title">Account Navigation</h3>
      </div>
      <div className="sidebar-menu-list">
        
        <button 
          className={`sidebar-menu-item ${currentPage === 'store' ? 'active' : ''}`}
          onClick={() => setCurrentPage('store')}
        >
          <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="menu-label">Shop Store</span>
        </button>

        <button 
          className={`sidebar-menu-item ${currentPage === 'cart' ? 'active' : ''}`}
          onClick={() => setCurrentPage('cart')}
        >
          <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="menu-label">My Cart</span>
          {cartCount > 0 && <span className="menu-badge">{cartCount}</span>}
        </button>

        <button 
          className={`sidebar-menu-item ${currentPage === 'wishlist' ? 'active' : ''}`}
          onClick={() => setCurrentPage('wishlist')}
        >
          <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span className="menu-label">My Wishlist</span>
          {wishlistCount > 0 && <span className="menu-badge">{wishlistCount}</span>}
        </button>

        <button 
          className={`sidebar-menu-item ${currentPage === 'tracking' ? 'active' : ''}`}
          onClick={() => setCurrentPage('tracking')}
        >
          <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span className="menu-label">Track Order</span>
        </button>

      </div>
    </div>
  );
}
