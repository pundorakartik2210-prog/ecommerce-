import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function WishlistPage({
  products = [],
  wishlist = [],
  cart = [],
  onRemoveItem,
  onMoveToCart,
  onAddToCart,
  onUpdateCartQuantity,
  onContinueShopping,
  onProductClick
}) {
  const [selectedTag, setSelectedTag] = useState("all");

  const formatType = (type) => {
    if (!type) return "";
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  // Extract unique types present in the products array
  const availableTypes = Array.from(
    new Set(
      products
        .map(p => p.type)
        .filter(Boolean)
    )
  );

  const filteredWishlist = selectedTag === "all"
    ? wishlist
    : wishlist.filter(item => {
        if (!item.type) return false;
        return item.type.toLowerCase() === selectedTag.toLowerCase();
      });

  // Get recommended flavors (not in wishlist, up to 4 items)
  const recommendations = products
    .filter(p => !wishlist.some(w => w.id === p.id))
    .slice(0, 4);

  return (
    <section className="store-section" style={{ padding: '10px 0 60px 0' }}>
      <div className="container">
        
        {/* Unified Store-Style Header */}
        <div className="store-header" style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <h2 className="store-title" style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
            My Wishlist
            <span style={{ fontSize: '14px', color: 'var(--text-light)', marginLeft: '12px', fontWeight: '600' }}>
              {wishlist.length > 0 ? `Showing ${filteredWishlist.length} of ${wishlist.length} saved favorites` : 'Zero items saved'}
            </span>
          </h2>

          {wishlist.length > 0 && (
            <div className="wishlist-filter-bar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: 0 }}>
              <button 
                className={`filter-pill-btn ${selectedTag === 'all' ? 'active' : ''}`} 
                onClick={() => setSelectedTag('all')}
              >
                All Jars ({wishlist.length})
              </button>
              {availableTypes.map(type => (
                <button
                  key={type}
                  className={`filter-pill-btn ${selectedTag === type ? 'active' : ''}`}
                  onClick={() => setSelectedTag(type)}
                >
                  {formatType(type)}
                </button>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 ? (
          <>
            {filteredWishlist.length > 0 ? (
              <div className="product-grid">
                {filteredWishlist.map(item => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    isWishlisted={true}
                    onWishlistToggle={onRemoveItem}
                    onAddToCart={onAddToCart}
                    onProductClick={onProductClick}
                    cart={cart}
                    onUpdateCartQuantity={onUpdateCartQuantity}
                  />
                ))}
              </div>
            ) : (
              /* Category Filter Empty State */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--bg-white) 0%, #faf6f0 100%)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '48px 40px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '32px',
                  flexWrap: 'wrap'
                }}>
                  <div className="heartbeat-pulse-badge" style={{ width: '72px', height: '72px', flexShrink: 0 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                  <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '22px', margin: '0 0 8px 0', fontWeight: '850' }}>
                      No Match in Category
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', margin: '0 0 20px 0', maxWidth: '600px' }}>
                      You don't have any saved variants under the "{formatType(selectedTag)}" category. Try clearing the filter or checking another category to find your favorites.
                    </p>
                    <button 
                      className="checkout-btn" 
                      onClick={() => setSelectedTag('all')} 
                      style={{ width: 'auto', padding: '10px 24px', fontSize: '13px', margin: 0 }}
                    >
                      Show All Saved Jars
                    </button>
                  </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '22px', margin: '0 0 24px 0', fontWeight: '800' }}>
                      Trending Flavors You May Love
                    </h3>
                    <div className="product-grid">
                      {recommendations.map(prod => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          isWishlisted={false}
                          onWishlistToggle={onRemoveItem}
                          onAddToCart={onAddToCart}
                          onProductClick={onProductClick}
                          cart={cart}
                          onUpdateCartQuantity={onUpdateCartQuantity}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Entire Wishlist Empty State */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-white) 0%, #faf6f0 100%)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '56px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              flexWrap: 'wrap'
            }}>
              <div className="heartbeat-pulse-badge" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '24px', margin: '0 0 8px 0', fontWeight: '850' }}>
                  Your Wishlist is Empty
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0', maxWidth: '650px' }}>
                  Love at first bite! Add premium, slow-roasted organic peanut butter flavors to your wishlist so you can track or purchase them easily later.
                </p>
                <button 
                  className="checkout-btn" 
                  onClick={onContinueShopping} 
                  style={{ width: 'auto', padding: '12px 28px', fontSize: '14px', margin: 0 }}
                >
                  Explore Flavors
                </button>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '22px', margin: '0 0 24px 0', fontWeight: '800' }}>
                  Trending Flavors You May Love
                </h3>
                <div className="product-grid">
                  {recommendations.map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      isWishlisted={false}
                      onWishlistToggle={onRemoveItem}
                      onAddToCart={onAddToCart}
                      onProductClick={onProductClick}
                      cart={cart}
                      onUpdateCartQuantity={onUpdateCartQuantity}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
