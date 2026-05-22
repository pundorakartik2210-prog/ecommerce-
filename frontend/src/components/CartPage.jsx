import React, { useState } from 'react';
import OrderVerificationModal from './OrderVerificationModal';

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutComplete,
  user,
  onLoginPrompt,
  onContinueShopping
}) {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState("");
  const [isPendingLoading, setIsPendingLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.prices[item.selectedWeight] * item.quantity), 0);
  const discountAmount = Math.round(subtotal * discount);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === "PEANUT20") {
      setDiscount(0.20);
      setAppliedCode("PEANUT20 (20% OFF)");
    } else if (code === "FITPOWER") {
      setDiscount(0.15);
      setAppliedCode("FITPOWER (15% OFF)");
    } else if (code === "CHOCOLOVE") {
      setDiscount(0.10);
      setAppliedCode("CHOCOLOVE (10% OFF)");
    } else {
      alert("Invalid coupon code! Try PEANUT20, FITPOWER, or CHOCOLOVE.");
    }
    setCouponCode("");
  };

  const handleCheckout = async () => {
    if (!user) {
      onLoginPrompt();
      return;
    }
    
    setIsPendingLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          cart: cart,
          total: total
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPendingOrderId(data.orderId);
        setIsVerifying(true);
      } else {
        alert(data.message || "Failed to initiate secure order checkout. Please try again.");
      }
    } catch (err) {
      alert("Network error: Could not reach the server to initiate checkout.");
    } finally {
      setIsPendingLoading(false);
    }
  };

  const handleVerificationSuccess = (verifiedOrder) => {
    setIsVerifying(false);
    setGeneratedOrderId(verifiedOrder.orderId);
    setCheckoutSuccess(true);
    onCheckoutComplete(verifiedOrder.orderId, cart, total);
  };

  if (checkoutSuccess) {
    return (
      <div style={{
        background: 'var(--bg-white)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        padding: '48px 32px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '40px auto'
      }}>
        <div className="success-icon-badge" style={{ margin: '0 auto 24px auto', width: '56px', height: '56px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '26px', margin: '0 0 12px 0' }}>Order Successfully Placed!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
          Thank you for choosing Nuvera Naturals! Your premium, slow-roasted organic peanut butter order is being processed and will ship shortly.
        </p>
        
        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Your Trackable Order ID:
        </span>
        <div className="order-number-box" style={{ margin: '12px auto', fontSize: '22px', maxWidth: '240px', padding: '12px' }}>
          {generatedOrderId}
        </div>
        
        <p style={{ color: 'var(--brand-accent)', fontSize: '13px', fontWeight: '800', margin: '12px 0 32px 0' }}>
          💡 Copy this Order ID to track your BlueDart shipment in the "Track Order" page!
        </p>

        <button 
          className="empty-state-btn" 
          onClick={onContinueShopping}
          style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const shippingPercent = Math.min((subtotal / 500) * 100, 100);
  const isFreeShipping = subtotal >= 500;

  return (
    <div style={{ padding: '0 10px' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--brand-primary)', margin: '0 0 20px 0' }}>Shopping Cart</h2>

      {cart.length > 0 && (
        <div className="shipping-goal-tracker-card" style={{ marginBottom: '24px' }}>
          <div className="shipping-tracker-header">
            <div className="shipping-icon-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="shipping-tracker-info">
              {isFreeShipping ? (
                <span className="shipping-tracker-title">🎉 Congratulations! You have unlocked <strong>FREE Shipping</strong> on this order!</span>
              ) : (
                <span className="shipping-tracker-title">
                  You are only <strong>₹{500 - subtotal}</strong> away from earning <strong>FREE Delivery</strong>! Add another jar to save.
                </span>
              )}
            </div>
          </div>
          <div className="shipping-progress-track">
            <div 
              className={`shipping-progress-fill ${isFreeShipping ? 'unlocked' : ''}`} 
              style={{ width: `${shippingPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {cart.length > 0 ? (
        <div className="cart-page-layout">
          
          {/* Left: Cart Items List */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '20px' }}>
              {cart.map((item, index) => {
                const price = item.prices[item.selectedWeight];
                return (
                  <div 
                    key={`${item.id}-${item.selectedWeight}-${index}`} 
                    className="drawer-item" 
                    style={{ 
                      padding: '20px 0', 
                      borderBottom: index === cart.length - 1 ? 'none' : '1px solid var(--border-color)',
                      alignItems: 'center'
                    }}
                  >
                    <div className="drawer-item-img" style={{ width: '54px', height: '64px', overflow: 'hidden' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div className="drawer-item-jar" style={{ background: item.color, width: '34px', height: '48px', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', width: '22px', height: '5px', background: 'var(--brand-accent)' }}></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="drawer-item-info" style={{ marginLeft: '20px' }}>
                      <h4 className="drawer-item-name" style={{ fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{item.name}</h4>
                      <div className="drawer-item-meta" style={{ fontSize: '12px' }}>Pack Size: <strong>{item.selectedWeight}</strong></div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '10px' }}>
                        <div className="qty-adjuster" style={{ padding: '4px 10px' }}>
                          <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.selectedWeight, -1)} style={{ fontSize: '14px' }}>-</button>
                          <span className="qty-val" style={{ fontSize: '14px', minWidth: '20px' }}>{item.quantity}</span>
                          <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.selectedWeight, 1)} style={{ fontSize: '14px' }}>+</button>
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--brand-primary)' }}>₹{price * item.quantity}</span>
                      </div>
                    </div>

                    <button 
                      className="item-remove-btn" 
                      onClick={() => onRemoveItem(item.id, item.selectedWeight)}
                      style={{ padding: '8px', color: 'var(--text-light)' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Coupon Application card */}
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Apply Promos</h4>
              <div className="promo-code-container" style={{ maxWidth: '440px' }}>
                <input 
                  type="text" 
                  className="promo-input" 
                  placeholder="Enter Code (PEANUT20, FITPOWER, CHOCOLOVE)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="promo-btn" onClick={handleApplyCoupon}>
                  Apply
                </button>
              </div>
              {appliedCode && (
                <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Promo coupon applied: {appliedCode}
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Price Details */}
          <div className="cart-summary-desktop-card">
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Price Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Price ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: '600' }}>
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Charges</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                {deliveryFee > 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '-4px' }}>
                    *Add ₹{500 - subtotal} more for FREE shipping!
                  </div>
                )}
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: '800', 
                fontSize: '16px', 
                color: 'var(--brand-primary)', 
                margin: '16px 0 20px 0', 
                borderTop: '1px dashed var(--border-color)', 
                paddingTop: '16px' 
              }}>
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>

              <button 
                className="checkout-btn" 
                onClick={handleCheckout}
                disabled={isPendingLoading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '14px',
                  background: !user ? 'var(--brand-secondary)' : 'var(--brand-primary)',
                  opacity: isPendingLoading ? 0.7 : 1,
                  cursor: isPendingLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isPendingLoading ? "Sending Verification Mail..." : (!user ? "Login to Place Order" : "Place Order (Secure)")}
              </button>
            </div>
          </div>

        </div>
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
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--text-light)', marginBottom: '16px' }}>
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-primary)', fontSize: '20px', margin: '0 0 8px 0' }}>Your Shopping Cart is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4', margin: '0 0 24px 0' }}>
            Look around! We have some fresh, high-protein organic slow-roasted nut butters that would love a place in your pantry.
          </p>
          <button className="empty-state-btn" onClick={onContinueShopping} style={{ display: 'inline-block', width: '200px' }}>
            Find Something Fresh
          </button>
        </div>
      )}

      <OrderVerificationModal
        isOpen={isVerifying}
        orderId={pendingOrderId}
        name={user ? user.name : ""}
        email={user ? user.email : ""}
        total={total}
        onClose={() => setIsVerifying(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
}
