import React, { useState, useEffect } from 'react';

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onWishlistToggle,
  isWishlisted,
  cart,
  onUpdateCartQuantity,
  onViewCart
}) {
  const [selectedWeight, setSelectedWeight] = useState((product.baseWeight || "250g").replace(/\s+/g, ''));
  const formatWeight = (w) => w ? w.replace(/(\d+)([a-zA-Z]+)/, '$1 $2') : '';

  useEffect(() => {
    // Lock body scroll when modal opens
    document.body.style.overflow = 'hidden';

    // Unlock body scroll when modal closes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  const { name, tag, tagline, description, rating, reviewsCount, prices, nutrition, ingredients, reviews, color, bgGradient, image } = product;
  const addedCartItems = cart?.filter(item => item.id === product.id) || [];

  return (
    <div className="product-details-overlay">
      <div className="product-details-body">

        {/* Close Button */}
        <button className="product-details-close-btn" onClick={onClose} aria-label="Back to products">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="product-details-container">
          <div className="modal-grid">

            {/* Left Column: Visual representation & Nutrition */}
            <div className="modal-visual-col">

              {/* Visual container */}
              <div
                className="modal-jar-preview"
                style={{
                  background: bgGradient,
                  display: image ? 'block' : 'flex'
                }}
              >
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 35%',
                      display: 'block',
                      borderRadius: 'inherit'
                    }}
                  />
                ) : (
                  /* CSS Glassmorphism Jar Mockup */
                  <div className="modal-jar" style={{ borderColor: 'var(--brand-primary)' }}>
                    <div className="modal-jar-lid" style={{ background: color, borderColor: 'var(--brand-primary)' }}></div>
                    <div className="modal-jar-label" style={{ borderColor: 'var(--brand-primary)' }}>
                      <span style={{ fontSize: '14px', fontFamily: 'var(--font-serif)', fontWeight: '800', color: 'var(--brand-primary)' }}>Nuvera</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: color, textTransform: 'uppercase', marginTop: '4px' }}>
                        {product.type.replace('-', ' ')}
                      </span>
                      <span style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '4px' }}>{formatWeight(selectedWeight)} Jar</span>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px',
                      height: '24px',
                      background: color,
                      borderRadius: '6px',
                      opacity: 0.8
                    }}></div>
                  </div>
                )}
              </div>

              {/* Nutrition Facts Table */}
              <div className="nutrition-table">
                <div className="nutrition-header">Nutritional Information</div>
                <div className="nutrition-serving">Serving Size: {nutrition.servingSize}</div>

                <div className="nutrition-row bold">
                  <span>Amount Per Serving</span>
                  <span>Calories {nutrition.calories}</span>
                </div>

                <div className="nutrition-row">
                  <span><strong>Protein</strong></span>
                  <span><strong>{nutrition.protein}</strong></span>
                </div>

                <div className="nutrition-row">
                  <span>Total Fat</span>
                  <span>{nutrition.totalFat}</span>
                </div>

                <div className="nutrition-row" style={{ paddingLeft: '24px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Saturated Fat</span>
                  <span>{nutrition.saturatedFat}</span>
                </div>

                <div className="nutrition-row">
                  <span>Total Carbohydrates</span>
                  <span>{nutrition.carbs}</span>
                </div>

                <div className="nutrition-row" style={{ paddingLeft: '24px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Dietary Fiber</span>
                  <span>{nutrition.dietaryFiber}</span>
                </div>

                <div className="nutrition-row" style={{ paddingLeft: '24px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>Total Sugars</span>
                  <span>{nutrition.sugars}</span>
                </div>

                <div className="nutrition-row">
                  <span>Sodium</span>
                  <span>{nutrition.sodium}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Descriptions & Actions */}
            <div className="modal-details-col">

              <span className="card-category" style={{ fontSize: '13px', marginBottom: '4px', display: 'inline-block', color: 'var(--brand-secondary)', fontWeight: '755' }}>
                {product.type.replace('-', ' ')}
              </span>
              <h2 className="modal-title" style={{ fontSize: '32px', margin: '0 0 4px 0', fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontWeight: '850' }}>{name}</h2>
              <span className="modal-tagline" style={{ fontSize: '15px', marginBottom: '8px', display: 'inline-block', color: 'var(--brand-accent)', fontWeight: '700' }}>{tagline}</span>

              {/* Rating Summary */}
              <div className="rating-stars" style={{ marginBottom: '0px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[...Array(5)].map((_, idx) => (
                  <svg
                    key={idx}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={idx < Math.floor(rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
                <span className="rating-value" style={{ fontSize: '14px', fontWeight: '800', color: 'var(--brand-primary)' }}>{rating}</span>
                <span className="rating-count" style={{ fontSize: '13.5px', color: 'var(--text-light)', fontWeight: '600' }}>({reviewsCount} verified purchases)</span>
              </div>

              <p className="modal-desc" style={{ fontSize: '14.5px', marginBottom: '28px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{description}</p>

              {/* Size Cards Stack */}
              <div className="size-selector-label" style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.8px', marginBottom: '10px' }}>
                Choose Jar Weight & Quantities
              </div>
              <div className="size-cards-stack" style={{ display: 'flex', gap: '14px', marginBottom: '28px', marginTop: '10px', width: '100%' }}>
                {Object.keys(prices).map(weight => {
                  const cleanWeight = weight.replace(/\s+/g, '');
                  const isGram = weight.toLowerCase().includes('g') && !weight.toLowerCase().includes('kg');
                  const weightInKg = isGram ? parseFloat(weight) / 1000 : parseFloat(weight);
                  const unitPrice = Math.round(prices[weight] / weightInKg);
                  const price = prices[weight];
                  const isSelected = selectedWeight === cleanWeight;

                  // Find quantity of this specific weight in cart
                  const cartItem = cart?.find(item => item.id === product.id && item.selectedWeight.replace(/\s+/g, '') === cleanWeight);
                  const qty = cartItem ? cartItem.quantity : 0;

                  return (
                    <div
                      key={weight}
                      className={`size-card-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedWeight(cleanWeight)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 14px',
                        borderRadius: '16px',
                        border: isSelected ? '2.5px solid var(--brand-primary)' : '1.5px solid var(--border-color)',
                        background: isSelected ? 'rgba(92, 58, 33, 0.03)' : 'var(--bg-white)',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        transition: 'all 0.25s ease',
                        cursor: 'pointer',
                        textAlign: 'center',
                        minWidth: 0
                      }}
                    >
                      {/* Weight Label */}
                      <span style={{ fontSize: '16px', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {formatWeight(weight)} Jar
                      </span>

                      {/* Unit Price (value) */}
                      <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', marginBottom: '8px' }}>
                        ₹{unitPrice}/kg value
                      </span>

                      {/* Weight Price */}
                      <span style={{ fontSize: '17px', fontWeight: '850', color: 'var(--brand-primary)', marginBottom: '14px' }}>
                        ₹{price}
                      </span>

                      {/* Add/Quantity Controls */}
                      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {qty > 0 ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'var(--bg-white)',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            border: '1.5px solid var(--brand-primary)',
                            boxShadow: 'var(--shadow-sm)'
                          }}>
                            <button
                              onClick={() => onUpdateCartQuantity(product.id, cleanWeight, -1)}
                              aria-label="Decrease quantity"
                              style={{
                                background: 'var(--brand-primary)',
                                border: 'none',
                                color: 'var(--bg-white)',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.1s ease',
                                padding: 0
                              }}
                              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
                              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                <path d="M1 1H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: '850', color: 'var(--brand-primary)', minWidth: '14px', textAlign: 'center' }}>
                              {qty}
                            </span>
                            <button
                              onClick={() => onUpdateCartQuantity(product.id, cleanWeight, 1)}
                              aria-label="Increase quantity"
                              style={{
                                background: 'var(--brand-primary)',
                                border: 'none',
                                color: 'var(--bg-white)',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.1s ease',
                                padding: 0
                              }}
                              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
                              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart(product, cleanWeight)}
                            style={{
                              background: 'transparent',
                              border: '1.5px solid var(--brand-secondary)',
                              color: 'var(--brand-secondary)',
                              borderRadius: '20px',
                              padding: '6px 16px',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '90%'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--brand-secondary)';
                              e.currentTarget.style.color = 'var(--bg-white)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'var(--brand-secondary)';
                            }}
                          >
                            <span>+</span> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions row */}
              <div className="modal-actions-row">

                {/* Wishlist toggle */}
                <button
                  className={`modal-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => onWishlistToggle(product)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "var(--wishlist-color)" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isWishlisted ? 'var(--wishlist-color)' : 'inherit' }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </button>

                {/* Add to cart / Quantity selector */}
                {addedCartItems.length > 0 ? (() => {
                  // Compute combined total for all weights of this product in cart
                  const totalAmount = addedCartItems.reduce((sum, item) => {
                    const itemPrice = prices[item.selectedWeight] ?? prices[item.selectedWeight.replace(/\s+/g, '')] ?? 0;
                    return sum + itemPrice * item.quantity;
                  }, 0);
                  return (
                    <button
                      className="modal-add-cart-btn"
                      onClick={onViewCart}
                      style={{
                        background: 'var(--success)',
                        borderColor: 'var(--success)',
                        color: '#ffffff',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      <span>View Cart & Checkout</span>
                      <span style={{
                        background: 'rgba(255,255,255,0.22)',
                        borderRadius: '20px',
                        padding: '2px 10px',
                        fontSize: '14px',
                        fontWeight: '800',
                        letterSpacing: '0.2px'
                      }}>
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </button>
                  );
                })() : (
                  <button
                    className="modal-add-cart-btn"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Continue Shopping
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="modal-reviews-section">

            {/* Section header with summary */}
            <div className="reviews-header-row">
              <div>
                <h3 className="reviews-section-title">Customer Feedback</h3>
                <p className="reviews-subtitle">{reviews.length} verified reviews</p>
              </div>
              <div className="reviews-overall-score">
                <span className="reviews-big-rating">{rating}</span>
                <div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '3px' }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                        fill={i < Math.round(rating) ? "#ffb300" : "none"}
                        stroke="#ffb300" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <span className="reviews-count-label">out of 5</span>
                </div>
              </div>
            </div>

            {/* Rating breakdown bars */}
            <div className="reviews-breakdown">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={star} className="breakdown-row">
                    <span className="breakdown-label">{star} ★</span>
                    <div className="breakdown-bar-track">
                      <div className="breakdown-bar-fill" style={{ width: `${pct}%`, background: star >= 4 ? 'var(--brand-primary)' : star === 3 ? '#ffb300' : '#e57373' }}></div>
                    </div>
                    <span className="breakdown-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Review cards */}
            <div className="reviews-list">
              {reviews.map(rev => {
                const initials = rev.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                const avatarColors = ['#8B4513', '#2E7D32', '#1565C0', '#6A1B9A', '#AD1457', '#00838F', '#E65100', '#37474F'];
                const avatarColor = avatarColors[rev.id % avatarColors.length];
                return (
                  <div key={rev.id} className="review-card-v2">
                    <div className="review-card-top">
                      {/* Avatar */}
                      <div className="review-avatar" style={{ background: avatarColor }}>
                        {initials}
                      </div>
                      <div className="review-meta">
                        <div className="review-author-row">
                          <span className="review-author">{rev.author}</span>
                          <span className="review-verified-badge">✓ Verified</span>
                        </div>
                        {/* Stars + date */}
                        <div className="review-stars-row">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="11" height="11" viewBox="0 0 24 24"
                              fill={i < rev.rating ? "#ffb300" : "none"}
                              stroke="#ffb300" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          ))}
                          <span className="review-date">{rev.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="review-comment-v2">{rev.comment}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

