import React, { useState } from 'react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckoutComplete,
  user,
  onLoginPrompt
}) {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  if (!isOpen) return null;

  // Compute Subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.prices[item.selectedWeight] * item.quantity), 0);
  
  // Coupon Codes
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PEANUT20") {
      setDiscount(0.20);
      setAppliedCode("PEANUT20 (20% OFF)");
    } else if (couponCode.toUpperCase() === "FITPOWER") {
      setDiscount(0.15);
      setAppliedCode("FITPOWER (15% OFF)");
    } else if (couponCode.toUpperCase() === "CHOCOLOVE") {
      setDiscount(0.10);
      setAppliedCode("CHOCOLOVE (10% OFF)");
    } else {
      alert("Invalid coupon code! Try PEANUT20, FITPOWER, or CHOCOLOVE.");
    }
    setCouponCode("");
  };

  const discountAmount = Math.round(subtotal * discount);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal - discountAmount + deliveryFee;

  const handleCheckout = () => {
    // Stop checkout if user is not authenticated!
    if (!user) {
      onLoginPrompt();
      return;
    }

    // Generate simulated order ID: NUV-XXXXX
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `NUV-${orderNum}`;
    
    setGeneratedOrderId(orderId);
    setCheckoutSuccess(true);
    
    // Add mock order tracking details back to App state
    onCheckoutComplete(orderId, cart, total);
  };

  const handleCloseSuccess = () => {
    setCheckoutSuccess(false);
    setGeneratedOrderId("");
    setDiscount(0);
    setAppliedCode("");
    onClose();
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="drawer-body">
        
        {/* Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            My Shopping Cart
          </h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart drawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Dynamic Views: Checkout Success vs Standard Cart */}
        {checkoutSuccess ? (
          <div className="drawer-content" style={{ padding: '40px 24px' }}>
            <div className="checkout-success-view">
              <div className="success-icon-badge">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="empty-state-title" style={{ fontSize: '24px' }}>Order Placed!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 24px 0' }}>
                Thank you for shopping with Nuvera Naturals! Your delicious organic peanut butter order is being processed.
              </p>
              
              <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>
                Your Trackable Order ID:
              </span>
              <div className="order-number-box">{generatedOrderId}</div>
              
              <p style={{ color: 'var(--brand-accent)', fontSize: '13px', fontWeight: '800', margin: '8px 0 32px 0' }}>
                💡 Tip: Copy this Order ID to track shipment in real-time in the "Track Order" panel!
              </p>

              <button className="checkout-btn" onClick={handleCloseSuccess}>
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="drawer-content">
              {cart.length > 0 ? (
                cart.map((item, index) => {
                  const price = item.prices[item.selectedWeight];
                  return (
                    <div key={`${item.id}-${item.selectedWeight}-${index}`} className="drawer-item">
                      <div className="drawer-item-img">
                        <div className="drawer-item-jar" style={{ background: item.color }}>
                          <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '4px', background: 'var(--brand-accent)' }}></div>
                        </div>
                      </div>
                      
                      <div className="drawer-item-info">
                        <h4 className="drawer-item-name">{item.name}</h4>
                        <div className="drawer-item-meta">Size: {item.selectedWeight}</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                          <div className="qty-adjuster">
                            <button 
                              className="qty-btn" 
                              onClick={() => onUpdateQuantity(item.id, item.selectedWeight, -1)}
                            >
                              -
                            </button>
                            <span className="qty-val">{item.quantity}</span>
                            <button 
                              className="qty-btn" 
                              onClick={() => onUpdateQuantity(item.id, item.selectedWeight, 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="drawer-item-price">{price * item.quantity}</span>
                        </div>
                      </div>

                      <button 
                        className="item-remove-btn" 
                        onClick={() => onRemoveItem(item.id, item.selectedWeight)}
                        aria-label="Remove item"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <h4 className="empty-state-title">Your Cart is Empty</h4>
                  <p style={{ fontSize: '13px' }}>Spread some happiness! Fill your tub with our nutritious, slow-roasted peanut butter variants.</p>
                  <button className="empty-state-btn" onClick={onClose}>
                    Explore Collection
                  </button>
                </div>
              )}
            </div>

            {/* Cart Summary & Action Footer */}
            {cart.length > 0 && (
              <div className="drawer-footer">
                
                {/* Apply Coupon Codes */}
                <div className="promo-code-container">
                  <input 
                    type="text" 
                    className="promo-input" 
                    placeholder="Enter Coupon (PEANUT20, FITPOWER)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="promo-btn" onClick={handleApplyCoupon}>
                    Apply
                  </button>
                </div>

                {appliedCode && (
                  <span className="promo-applied-msg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Coupon Applied: {appliedCode}
                  </span>
                )}

                {/* Subtotals */}
                <div className="cart-summary-row">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-summary-row" style={{ color: 'var(--success)' }}>
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="cart-summary-row">
                  <span>Estimated Delivery</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                {deliveryFee > 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '-6px', marginBottom: '8px', paddingLeft: '2px' }}>
                    *Add ₹{500 - subtotal} more for FREE shipping!
                  </div>
                )}

                <div className="cart-summary-row total">
                  <span>Grand Total</span>
                  <span>₹{total}</span>
                </div>

                {/* Checkout CTA */}
                <button className="checkout-btn" onClick={handleCheckout} style={{ background: !user ? 'var(--brand-secondary)' : 'var(--brand-primary)' }}>
                  {!user ? (
                    <>
                      Login to Place Order
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      Place Order (Secure checkout)
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}
