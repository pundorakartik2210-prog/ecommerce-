import React from 'react';

export default function ProductCard({ 
  product, 
  isWishlisted, 
  onWishlistToggle, 
  onAddToCart, 
  onProductClick 
}) {
  const { id, name, tag, tagline, rating, reviewsCount, baseWeight, prices, color, bgGradient, image } = product;
  const basePrice = prices[baseWeight];

  return (
    <div className="product-card">
      {/* Badge Tag */}
      {tag && (
        <span className={`card-badge ${tag.toLowerCase().includes('fitness') ? 'fitness' : tag.toLowerCase().includes('keto') ? 'keto' : ''}`}>
          {tag}
        </span>
      )}

      {/* Wishlist Heart Button */}
      <button 
        className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onWishlistToggle(product);
        }}
        aria-label="Add to wishlist"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      {/* Graphic Media Section */}
      <div 
        className="card-media" 
        style={{ background: bgGradient, position: 'relative', overflow: 'hidden' }}
        onClick={() => onProductClick(product)}
      >
        {image ? (
          <img 
            src={image} 
            alt={name} 
            style={{ 
              width: '85%', 
              height: '85%', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.18))',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }} 
            className="product-card-img"
          />
        ) : (
          /* CSS Glassmorphism Jar Mockup */
          <div className="card-jar-mockup" style={{ borderColor: 'var(--brand-primary)' }}>
            <div className="card-jar-lid" style={{ background: color, borderColor: 'var(--brand-primary)' }}></div>
            <div className="card-jar-label" style={{ borderColor: 'var(--brand-primary)' }}>
              <span className="card-jar-brand">Nuvera</span>
              <span className="card-jar-title" style={{ color: color }}>
                {product.type === 'sugar-free' ? 'Pure' : product.type === 'high-protein' ? 'Power' : product.type === 'chocolate' ? 'Choc' : 'Classic'}
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
              background: color,
              opacity: 0.85
            }}></div>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="card-body">
        <span className="card-category">{product.type.replace('-', ' ')}</span>
        <h3 className="card-title" onClick={() => onProductClick(product)}>
          {name}
        </h3>
        <p className="card-tagline">{tagline}</p>

        {/* Rating Section */}
        <div className="rating-stars">
          {[...Array(5)].map((_, idx) => (
            <svg 
              key={idx} 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill={idx < Math.floor(rating) ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ))}
          <span className="rating-value">{rating}</span>
          <span className="rating-count">({reviewsCount})</span>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <div className="card-price-info">
            <span className="card-price-weight">Weight: {baseWeight}</span>
            <span className="card-price">{basePrice}</span>
          </div>
          
          <button 
            className="card-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, baseWeight);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
