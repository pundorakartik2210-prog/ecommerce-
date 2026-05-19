import React, { useState } from 'react';
import ProductCard from './ProductCard';

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
  const [sortBy, setSortBy] = useState("featured");
  const [weightFilter, setWeightFilter] = useState("all");

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleWeightFilterChange = (e) => {
    setWeightFilter(e.target.value);
  };

  // 1. Filter products by category/weight
  let filteredProducts = [...products];

  if (activeCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.type === activeCategory);
  }

  if (weightFilter !== "all") {
    filteredProducts = filteredProducts.filter(p => p.prices[weightFilter] !== undefined);
  }

  // 2. Sort products
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.prices[a.baseWeight] - b.prices[b.baseWeight]);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.prices[b.baseWeight] - a.prices[a.baseWeight]);
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const isWishlisted = (product) => {
    return wishlist.some(item => item.id === product.id);
  };

  return (
    <section className="store-section" id="products-catalog">
      <div className="container">
        
        {/* Header Controls (Flipkart Style) */}
        <div className="store-header">
          <h2 className="store-title">
            {activeCategory === "all" ? "Our Whole Range" : `${activeCategory.replace('-', ' ')} Collection`}
            <span>({filteredProducts.length} Premium items)</span>
          </h2>

          <div className="filters-container">
            {/* Filter by weight */}
            <select 
              className="filter-select" 
              value={weightFilter}
              onChange={handleWeightFilterChange}
              aria-label="Filter by weight"
            >
              <option value="all">All Sizes</option>
              <option value="250g">250g Tubs</option>
              <option value="500g">500g Tubs</option>
              <option value="1kg">1kg Tubs</option>
            </select>

            {/* Sort by dropdown */}
            <select 
              className="filter-select" 
              value={sortBy} 
              onChange={handleSortChange}
              aria-label="Sort by options"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
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
