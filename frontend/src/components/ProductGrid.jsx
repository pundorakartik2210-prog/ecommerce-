import React from 'react';
import ProductCard from './ProductCard';

const formatCategoryTitle = (category) => {
  if (category === "all") return "Explore Our Collection";
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + " Collection";
};

export default function ProductGrid({ 
  products, 
  wishlist, 
  onWishlistToggle, 
  onAddToCart, 
  onProductClick,
  activeCategory,
  onResetSearch,
  cart,
  onUpdateCartQuantity
}) {

  // 1. Filter products by category/weight
  let filteredProducts = [...products];

  if (activeCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.type === activeCategory);
  }



  const isWishlisted = (product) => {
    return wishlist.some(item => item.id === product.id);
  };

  return (
    <section className="store-section" id="products-catalog">
      <div className="container">
        
        {/* Header Controls (Centered Premium Style) */}
        <div className="store-header centered">
          <h2 className="store-title">
            {formatCategoryTitle(activeCategory)}
          </h2>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(prod => (
              <ProductCard 
                key={prod.id}
                product={prod}
                isWishlisted={isWishlisted(prod)}
                onWishlistToggle={onWishlistToggle}
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
                cart={cart}
                onUpdateCartQuantity={onUpdateCartQuantity}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            maxWidth: '560px',
            margin: '40px auto'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2" style={{ marginBottom: '16px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--brand-primary)', margin: '0 0 8px 0' }}>
              No Butters Match Your Search
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              We couldn't find any peanut butters matching your active filters or search terms.
            </p>
            <button className="empty-state-btn" onClick={onResetSearch}>
              View All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
