import React, { useState } from 'react';

export default function WishlistPage({
  wishlist,
  onRemoveItem,
  onMoveToCart,
  onContinueShopping,
  onProductClick
}) {
  const [selectedTag, setSelectedTag] = useState("all");

  const filteredWishlist = selectedTag === "all"
    ? wishlist
    : wishlist.filter(item => {
        if (!item.tag) return false;
        return item.tag.toLowerCase().includes(selectedTag.toLowerCase());
      });

  return (
    <div style={{ padding: '0 10px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Dynamic SEO Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--brand-primary)', margin: '0 0 4px 0' }}>My Wishlist</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '13px', margin: 0 }}>
            {wishlist.length > 0 ? `Showing ${filteredWishlist.length} of ${wishlist.length} saved favorites` : 'Zero items saved'}
          </p>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <>
          {/* Visual Interactive Category Filter Pills */}
          <div className="wishlist-filter-bar" style={{ marginBottom: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className={`filter-pill-btn ${selectedTag === 'all' ? 'active' : ''}`} 
              onClick={() => setSelectedTag('all')}
            >
              All Jars ({wishlist.length})
            </button>
            <button 
              className={`filter-pill-btn ${selectedTag === 'creamy' ? 'active' : ''}`} 
              onClick={() => setSelectedTag('creamy')}
            >
              Silky Creamy
            </button>
            <button 
              className={`filter-pill-btn ${selectedTag === 'crunchy' ? 'active' : ''}`} 
              onClick={() => setSelectedTag('crunchy')}
            >
              Honey Crunchy
            </button>
            <button 
              className={`filter-pill-btn ${selectedTag === 'fitness' ? 'active' : ''}`} 
              onClick={() => setSelectedTag('fitness')}
            >
              High-Protein Fitness
            </button>
            <button 
              className={`filter-pill-btn ${selectedTag === 'chocolate' ? 'active' : ''}`} 
              onClick={() => setSelectedTag('chocolate')}
            >
              Choco Infused
            </button>
          </div>

          {filteredWishlist.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px'
            }}>
              {filteredWishlist.map(item => {
                const price = item.prices[item.baseWeight];
                return (
                  <div 
                    key={item.id} 
                    className="product-card" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Graphic Media Section */}
                    <div 
                      className="card-media" 
                      onClick={() => onProductClick && onProductClick(item)}
                      style={{ cursor: onProductClick ? 'pointer' : 'default' }}
                    >
                      {/* Remove from Wishlist Button */}
                      <button 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'var(--error-light)',
                          color: 'var(--error)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 10,
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'var(--transition)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(item);
                        }}
                        title="Remove from Wishlist"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>

                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="product-card-img"
                        />
                      ) : (
                        /* CSS Glassmorphism Jar Mockup */
                        <div className="card-jar-mockup" style={{ borderColor: 'var(--brand-primary)', margin: 'auto' }}>
                          <div className="card-jar-lid" style={{ background: item.color, borderColor: 'var(--brand-primary)' }}></div>
                          <div className="card-jar-label" style={{ borderColor: 'var(--brand-primary)' }}>
                            <span className="card-jar-brand">Nuvera</span>
                            <span className="card-jar-title" style={{ color: item.color }}>
                              {item.type === 'sugar-free' ? 'Pure' : item.type === 'high-protein' ? 'Power' : item.type === 'chocolate' ? 'Choc' : 'Classic'}
                            </span>
                          </div>
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '56px',
                            height: '18px',
                            borderRadius: '4px',
                            background: item.color,
                            opacity: 0.85
                          }}></div>
                        </div>
                      )}
                    </div>

                    <div className="product-info" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 4px 0', fontWeight: '800' }}>{item.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: '0 0 12px 0' }}>Base size: {item.baseWeight}</p>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        marginTop: 'auto',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--brand-primary)' }}>₹{price}</span>
                        <button 
                          className="empty-state-btn"
                          onClick={() => onMoveToCart(item)}
                          style={{ 
                            padding: '6px 14px', 
                            fontSize: '11px', 
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '48px 24px',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '32px auto'
            }}>
              <h4 style={{ color: 'var(--brand-primary)', fontSize: '18px', margin: '0 0 8px 0' }}>No Match in Wishlist</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 16px 0' }}>
                You don't have any saved variants under the "{selectedTag}" category. Try selecting another filter!
              </p>
              <button className="empty-state-btn" onClick={() => setSelectedTag('all')} style={{ display: 'inline-block', width: '160px' }}>
                View All Jars
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{
          background: 'var(--bg-white)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: '64px 32px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '20px auto'
        }}>
          <div className="heartbeat-pulse-badge" style={{ margin: '0 auto 16px auto', width: '56px', height: '56px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '20px', margin: '0 0 8px 0' }}>Your Wishlist is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4', margin: '0 0 24px 0' }}>
            Love at first bite! Add premium slow-roasted peanut butter flavors to your wishlist so you can buy them later.
          </p>
          <button className="empty-state-btn" onClick={onContinueShopping} style={{ display: 'inline-block', width: '200px' }}>
            Explore Flavors
          </button>
        </div>
      )}
    </div>
  );
}
