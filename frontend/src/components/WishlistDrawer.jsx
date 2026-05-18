import React from 'react';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlist, 
  onRemoveItem, 
  onMoveToCart 
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="drawer-body">
        
        {/* Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            My Favorites
          </h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close wishlist drawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {wishlist.length > 0 ? (
            wishlist.map(item => {
              const price = item.prices[item.baseWeight];
              return (
                <div key={item.id} className="drawer-item" style={{ alignItems: 'flex-start' }}>
                  
                  {/* Visual Jar Preview */}
                  <div className="drawer-item-img">
                    <div className="drawer-item-jar" style={{ background: item.color, height: '42px', width: '28px' }}>
                      <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '4px', background: 'var(--brand-accent)' }}></div>
                    </div>
                  </div>

                  <div className="drawer-item-info">
                    <h4 className="drawer-item-name" style={{ fontSize: '14px', marginBottom: '2px' }}>{item.name}</h4>
                    <span className="drawer-item-meta" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>
                      Base pack size: {item.baseWeight}
                    </span>
                    <span className="drawer-item-price" style={{ fontSize: '15px' }}>₹{price}</span>
                    
                    <button 
                      className="empty-state-btn"
                      onClick={() => onMoveToCart(item)}
                      style={{ 
                        padding: '6px 16px', 
                        fontSize: '11px', 
                        marginTop: '10px', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Add to Cart
                    </button>
                  </div>

                  <button 
                    className="item-remove-btn" 
                    onClick={() => onRemoveItem(item)}
                    aria-label="Remove item from wishlist"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>

                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <h4 className="empty-state-title">Wishlist is Empty</h4>
              <p style={{ fontSize: '13px' }}>Tap the heart button on any dry-roasted peanut butter tub to save it here for later.</p>
              <button className="empty-state-btn" onClick={onClose}>
                Find Something Sweet
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
