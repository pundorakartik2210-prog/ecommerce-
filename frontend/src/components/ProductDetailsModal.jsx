import React, { useState } from 'react';

export default function ProductDetailsModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onWishlistToggle, 
  isWishlisted,
  cart,
  onUpdateCartQuantity
}) {
  const [selectedWeight, setSelectedWeight] = useState("500g");

  if (!product) return null;

  const { name, tag, tagline, description, rating, reviewsCount, prices, nutrition, ingredients, reviews, color, bgGradient, image } = product;
  const activePrice = prices[selectedWeight];

  const cartItem = cart?.find(item => item.id === product.id && item.selectedWeight === selectedWeight);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedWeight);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-scrollable">
          <div className="modal-grid">
            
            {/* Left Column: Visual representation & Nutrition */}
            <div className="modal-visual-col">
              
              {/* Visual container */}
              <div className="modal-jar-preview" style={{ background: bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {image ? (
                  <img 
                    src={image} 
                    alt={name} 
                    style={{ 
                      width: '85%', 
                      height: '85%', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.15))'
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
                      <span style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '4px' }}>{selectedWeight} Tub</span>
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
              
              <span className="card-category" style={{ fontSize: '13px' }}>{product.type.replace('-', ' ')}</span>
              <h2 className="modal-title">{name}</h2>
              <span className="modal-tagline">{tagline}</span>

              {/* Rating Summary */}
              <div className="rating-stars" style={{ marginBottom: '20px' }}>
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
                <span className="rating-value" style={{ fontSize: '14px' }}>{rating}</span>
                <span className="rating-count" style={{ fontSize: '13px' }}>({reviewsCount} verified purchases)</span>
              </div>

              <p className="modal-desc">{description}</p>

              {/* Size Chip Selector */}
              <div className="size-selector-label">Choose Tub Weight</div>
              <div className="size-chips-container">
                {Object.keys(prices).map(weight => (
                  <div 
                    key={weight}
                    className={`size-chip ${selectedWeight === weight ? 'active' : ''}`}
                    onClick={() => setSelectedWeight(weight)}
                  >
                    <span>{weight}</span>
                    <span className="chip-price">₹{prices[weight]}</span>
                  </div>
                ))}
              </div>

              {/* Ingredients Box */}
              <div className="ingredients-box">
                <div className="ingredients-title">All-Natural Ingredients</div>
                <ul className="ingredients-list">
                  {ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
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
                {quantityInCart > 0 ? (
                  <div className="modal-qty-selector" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      className="qty-btn minus"
                      onClick={() => onUpdateCartQuantity(product.id, selectedWeight, -1)}
                      style={{
                        background: 'transparent',
                        border: '2px solid var(--brand-primary)',
                        color: 'var(--brand-primary)',
                        borderRadius: 'var(--radius-full)',
                        width: '40px',
                        height: '40px',
                        fontWeight: '800',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify-content: 'center',
                        transition: 'var(--transition)'
                      }}
                    >
                      —
                    </button>
                    <span className="qty-val" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--brand-primary)', minWidth: '24px', textAlign: 'center' }}>
                      {quantityInCart}
                    </span>
                    <button 
                      className="qty-btn plus"
                      onClick={() => onUpdateCartQuantity(product.id, selectedWeight, 1)}
                      style={{
                        background: 'var(--brand-primary)',
                        border: '2px solid var(--brand-primary)',
                        color: 'var(--bg-white)',
                        borderRadius: 'var(--radius-full)',
                        width: '40px',
                        height: '40px',
                        fontWeight: '800',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify-content: 'center',
                        transition: 'var(--transition)'
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    className="modal-add-cart-btn"
                    onClick={handleAddToCartClick}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add To Cart • ₹{activePrice}
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="modal-reviews-section">
            <h3 className="reviews-section-title">Customer Feedback</h3>
            
            {reviews.map(rev => (
              <div key={rev.id} className="review-card">
                <div className="review-header">
                  <span className="review-author">{rev.author}</span>
                  
                  {/* Review Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill={i < rev.rating ? "#ffb300" : "none"} 
                        stroke="#ffb300"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                    <span className="review-date" style={{ marginLeft: '8px' }}>{rev.date}</span>
                  </div>
                </div>
                <p className="review-comment">{rev.comment}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
