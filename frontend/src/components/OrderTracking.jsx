import React, { useState, useEffect } from 'react';
import { API_URL } from '../config.js';


const TIMELINE_STEPS = [
  { label: "Ordered", desc: "Order received" },
  { label: "Packed", desc: "In Nuvera warehouse" },
  { label: "Shipped", desc: "In transit with BlueDart" },
  { label: "Out for Delivery", desc: "Nearby hub" },
  { label: "Delivered", desc: "Enjoy your butter!" }
];

export default function OrderTracking({ sessionOrders, autoTrackOrderId, onClearAutoTrack }) {
  const [searchOrderId, setSearchOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrackSubmit = async (e, orderIdOverride = null) => {
    if (e) e.preventDefault();
    const query = (orderIdOverride || searchOrderId).trim().toUpperCase();
    if (!query) return;
    setHasSearched(true);
    setLoading(true);

    if (sessionOrders[query]) {
      setTrackedOrder(sessionOrders[query]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/status/${query}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.status === 'verified' && data.order) {
          setTrackedOrder({
            orderId: data.order.orderId,
            date: data.order.date,
            total: data.order.total,
            statusStep: data.order.statusStep,
            items: data.order.cart.map(item => ({
              name: item.name,
              selectedWeight: item.selectedWeight || '1kg',
              quantity: item.quantity || 1,
              price: item.prices ? (item.prices[item.selectedWeight] || Object.values(item.prices)[0]) : item.price || 0
            }))
          });
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Error tracking order from backend:", err);
    }

    setTrackedOrder(null);
    setLoading(false);
  };

  const handleQuickSelect = (orderId) => {
    setSearchOrderId(orderId);
    handleTrackSubmit(null, orderId);
  };

  useEffect(() => {
    if (autoTrackOrderId) {
      setSearchOrderId(autoTrackOrderId);
      handleTrackSubmit(null, autoTrackOrderId);
    }
  }, [autoTrackOrderId]);

  const sessionOrderIds = Object.keys(sessionOrders);

  return (
    <div className="order-tracking-page-container" style={{ width: '100%', margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--brand-primary)', margin: '0 0 10px 0' }}>Track Order Status</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '24px', lineHeight: '1.5' }}>
        Follow your slow-roasted organic protein treats straight to your doorstep.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>

        {/* Top section: Tracker form & chips */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Tracker Form */}
          <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
            {autoTrackOrderId && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(226, 149, 67, 0.06)',
                border: '1px solid rgba(226, 149, 67, 0.2)',
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '14px',
                fontSize: '12.5px',
                color: 'var(--brand-primary)',
                fontWeight: '700'
              }}>
                <span>🔒 Auto-tracking active order from checkout.</span>
                <button
                  type="button"
                  onClick={onClearAutoTrack}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-accent)',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '0'
                  }}
                >
                  Track another order
                </button>
              </div>
            )}
            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Enter Order ID (e.g. NUV-12495)"
                style={{
                  flexGrow: 1,
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  outline: 'none',
                  background: autoTrackOrderId ? '#f1f5f9' : 'var(--bg-cream)',
                  cursor: autoTrackOrderId ? 'not-allowed' : 'text',
                  color: autoTrackOrderId ? 'var(--text-secondary)' : 'inherit'
                }}
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                disabled={!!autoTrackOrderId}
              />
              <button
                type="submit"
                style={{
                  background: autoTrackOrderId ? '#cbd5e1' : 'var(--brand-primary)',
                  color: autoTrackOrderId ? '#64748b' : 'var(--bg-white)',
                  border: 'none',
                  fontWeight: '700',
                  padding: '0 24px',
                  borderRadius: 'var(--radius-full)',
                  cursor: autoTrackOrderId ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  transition: 'var(--transition)'
                }}
                disabled={!!autoTrackOrderId}
              >
                Track Shipment
              </button>
            </form>
          </div>

          {/* Quick lookup Chips */}
          {!autoTrackOrderId && sessionOrderIds.length > 0 && (
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
              <h4 style={{ textTransform: 'uppercase', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '0.5px' }}>
                Your Placed Orders:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sessionOrderIds.map(oid => (
                  <button
                    key={oid}
                    style={{
                      background: 'var(--bg-cream)',
                      border: '1.5px dashed var(--brand-accent)',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      color: 'var(--brand-primary)',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '750',
                      transition: 'var(--transition)'
                    }}
                    onClick={() => handleQuickSelect(oid)}
                  >
                    🛒 Order {oid}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right column: Timeline and details */}
        {/* Full-width Timeline and Details section below */}
        <div style={{ width: '100%' }}>
          {hasSearched ? (
            trackedOrder ? (
              <div style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: '30px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                {/* Header info */}
                <div style={{
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Tracking Status for
                    </span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', color: 'var(--brand-primary)', fontWeight: '800' }}>
                      {trackedOrder.orderId}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>Order Date: <strong>{trackedOrder.date}</strong></span>
                    <span>Total Paid: <strong style={{ color: 'var(--success)', fontSize: '16px' }}>₹{trackedOrder.total}</strong></span>
                  </div>
                </div>

                {/* Premium Delivery Truck Progress Animation (Wide display) */}
                <div className="shipment-route-animation-card" style={{ marginBottom: '32px' }}>
                  <div className="route-endpoints">
                    <span className="endpoint-hub">🏭 Warehouse</span>
                    <span className="endpoint-door">🏠 Doorstep</span>
                  </div>
                  <div className="route-track-line">
                    <div className="route-track-fill" style={{ width: `${trackedOrder.statusStep * 25}%` }}></div>
                    <div className="route-delivery-truck" style={{ left: `calc(${trackedOrder.statusStep * 25}% - 14px)` }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 8h-2V5c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h1c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h1c1.1 0 2-.9 2-2v-5l-3-4zm-12 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm11-8.5l2 2.5h-4v-2.5h2zm-1 8.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="route-status-bubble">
                    <span>
                      🚚 BlueDart Dispatch: <strong>{TIMELINE_STEPS[trackedOrder.statusStep].label}</strong>
                    </span>
                  </div>
                </div>

                {/* Horizontal / Responsive Stepper */}
                <div className="horizontal-stepper-container">
                  <div className="horizontal-stepper-line">
                    <div className="horizontal-stepper-fill" style={{ width: `${(trackedOrder.statusStep / (TIMELINE_STEPS.length - 1)) * 100}%` }}></div>
                  </div>
                  <div className="horizontal-stepper-row">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx < trackedOrder.statusStep;
                      const isActive = idx === trackedOrder.statusStep;
                      return (
                        <div key={idx} className="horizontal-stepper-item">
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: isCompleted ? 'var(--success)' : isActive ? 'var(--bg-white)' : 'var(--bg-cream)',
                            border: `3px solid ${isCompleted ? 'var(--success)' : isActive ? 'var(--brand-accent)' : 'var(--border-color)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isCompleted ? 'var(--bg-white)' : 'var(--brand-accent)',
                            boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                            marginBottom: '10px',
                            transition: 'all 0.3s ease',
                            flexShrink: 0
                          }}>
                            {isCompleted && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                          <div>
                            <span style={{
                              display: 'block',
                              fontSize: '13px',
                              fontWeight: isActive ? '800' : '700',
                              color: isCompleted ? 'var(--success)' : isActive ? 'var(--brand-accent)' : 'var(--text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px'
                            }}>
                              {step.label}
                            </span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-light)', marginTop: '4px', lineHeight: '1.35' }}>
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '20px',
                  marginTop: '30px'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                    Shipment Items:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {trackedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          background: 'var(--bg-cream)',
                          padding: '12px 20px',
                          borderRadius: '8px',
                          border: '1px solid rgba(0,0,0,0.03)'
                        }}
                      >
                        <span style={{ fontWeight: '600', color: 'var(--brand-primary)' }}>
                          {item.name} <span style={{ color: 'var(--text-light)', fontWeight: '400' }}>({item.selectedWeight})</span>
                        </span>
                        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                          <span style={{ fontWeight: '800', color: 'var(--brand-primary)', minWidth: '80px', textAlign: 'right' }}>₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                padding: '40px 24px',
                textAlign: 'center',
                color: 'var(--error)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '12px' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800' }}>Order ID Not Found</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  We couldn't locate that Order ID. Please check the typing or select one of our pre-built demo orders on the left.
                </p>
              </div>
            )
          ) : (
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '60px 24px',
              textAlign: 'center',
              color: 'var(--text-light)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: '12px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>Awaiting Order ID</h4>
              <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.4' }}>
                Enter your Order ID in the search box or select a quick lookup card to inspect its real-time shipping progress timeline.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
