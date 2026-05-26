import React, { useState } from 'react';

const MOCK_DB_ORDERS = {
  "NUV-12495": {
    orderId: "NUV-12495",
    date: "2026-05-12",
    total: 948,
    statusStep: 4,
    items: [
      { name: "Classic Creamy Peanut Butter", selectedWeight: "1kg", quantity: 2, price: 599 },
      { name: "Organic Pure Sugar-Free", selectedWeight: "2.5kg", quantity: 1, price: 1249 }
    ]
  },
  "NUV-58920": {
    orderId: "NUV-58920",
    date: "2026-05-15",
    total: 749,
    statusStep: 2,
    items: [
      { name: "Chocolate Smoothy", selectedWeight: "1kg", quantity: 1, price: 749 }
    ]
  },
  "NUV-90184": {
    orderId: "NUV-90184",
    date: "2026-05-16",
    total: 4699,
    statusStep: 1,
    items: [
      { name: "High-Protein Power Butter", selectedWeight: "2.5kg", quantity: 1, price: 2300 },
      { name: "All-Natural Extra Crunchy", selectedWeight: "5kg", quantity: 1, price: 2399 }
    ]
  }
};

const TIMELINE_STEPS = [
  { label: "Ordered", desc: "Order received" },
  { label: "Packed", desc: "In Nuvera warehouse" },
  { label: "Shipped", desc: "In transit with BlueDart" },
  { label: "Out for Delivery", desc: "Nearby hub" },
  { label: "Delivered", desc: "Enjoy your butter!" }
];

export default function OrderTracking({ sessionOrders }) {
  const [searchOrderId, setSearchOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const query = searchOrderId.trim().toUpperCase();
    setHasSearched(true);

    if (sessionOrders[query]) {
      setTrackedOrder(sessionOrders[query]);
      return;
    }

    if (MOCK_DB_ORDERS[query]) {
      setTrackedOrder(MOCK_DB_ORDERS[query]);
      return;
    }

    // Order not found in either source — show "not found" UI
    setTrackedOrder(null);
  };

  const handleQuickSelect = (orderId) => {
    setSearchOrderId(orderId);
    setHasSearched(true);
    if (sessionOrders[orderId]) {
      setTrackedOrder(sessionOrders[orderId]);
    } else {
      setTrackedOrder(MOCK_DB_ORDERS[orderId]);
    }
  };

  const sessionOrderIds = Object.keys(sessionOrders);

  return (
    <div style={{ padding: '0 10px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--brand-primary)', margin: '0 0 10px 0' }}>Track Order Status</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '24px', lineHeight: '1.5' }}>
        Follow your slow-roasted organic protein treats straight to your doorstep.
      </p>

      <div className="cart-page-layout">
        
        {/* Left column: Tracker form & chips */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tracker Form */}
          <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
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
                  background: 'var(--bg-cream)'
                }}
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
              <button 
                type="submit" 
                style={{
                  background: 'var(--brand-primary)',
                  color: 'var(--bg-white)',
                  border: 'none',
                  fontWeight: '700',
                  padding: '0 24px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'var(--transition)'
                }}
              >
                Track Shipment
              </button>
            </form>
          </div>

          {/* Quick lookup Chips */}
          <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
            <h4 style={{ textTransform: 'uppercase', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '0.5px' }}>
              Select a Demo Order to Test:
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
                  🛒 Active Order ({oid})
                </button>
              ))}
              <button 
                style={{
                  background: 'var(--bg-cream)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                onClick={() => handleQuickSelect("NUV-90184")}
              >
                📦 Packed (NUV-90184)
              </button>
              <button 
                style={{
                  background: 'var(--bg-cream)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                onClick={() => handleQuickSelect("NUV-58920")}
              >
                🚚 In Transit (NUV-58920)
              </button>
              <button 
                style={{
                  background: 'var(--bg-cream)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                onClick={() => handleQuickSelect("NUV-12495")}
              >
                ✓ Delivered (NUV-12495)
              </button>
            </div>
          </div>

        </div>

        {/* Right column: Timeline and details */}
        <div className="cart-summary-desktop-card" style={{ flexShrink: 0, position: 'relative', top: 'auto' }}>
          {hasSearched ? (
            trackedOrder ? (
              <div style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: '24px'
              }}>
                <div style={{
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '14px',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tracking Status for
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', color: 'var(--brand-primary)', fontWeight: '800' }}>
                    {trackedOrder.orderId}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Order Date: {trackedOrder.date} | Total paid: ₹{trackedOrder.total}
                  </div>
                </div>

                {/* Premium Delivery Truck Progress Animation */}
                <div className="shipment-route-animation-card" style={{ marginBottom: '28px' }}>
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

                {/* Shipping Timeline */}
                <div style={{ position: 'relative', paddingLeft: '32px', margin: '20px 0' }}>
                  {/* Vertical Progress Connector Line */}
                  <div style={{
                    position: 'absolute',
                    left: '9px',
                    top: '6px',
                    bottom: '10px',
                    width: '3px',
                    background: 'var(--border-color)',
                    zIndex: 1
                  }}>
                    {/* Active completed sub-bar */}
                    <div style={{
                      width: '100%',
                      height: `${(trackedOrder.statusStep / (TIMELINE_STEPS.length - 1)) * 100}%`,
                      background: 'var(--success)',
                      transition: 'height 0.8s ease-in-out'
                    }}></div>
                  </div>

                  {TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = idx < trackedOrder.statusStep;
                    const isActive = idx === trackedOrder.statusStep;

                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          gap: '16px', 
                          marginBottom: '24px', 
                          position: 'relative', 
                          zIndex: 2 
                        }}
                      >
                        {/* Circle Indicator */}
                        <div style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '2px',
                          width: '21px',
                          height: '21px',
                          borderRadius: '50%',
                          background: isCompleted ? 'var(--success)' : isActive ? 'var(--bg-white)' : 'var(--bg-cream)',
                          border: `3px solid ${isCompleted ? 'var(--success)' : isActive ? 'var(--brand-accent)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isCompleted ? 'var(--bg-white)' : 'var(--brand-accent)',
                          boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                          transition: 'all 0.3s ease'
                        }}>
                          {isCompleted && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>

                        {/* Text labels */}
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
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Items in this order */}
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px',
                  marginTop: '16px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                    Shipment Items:
                  </h4>
                  {trackedOrder.items.map((item, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '13px', 
                        color: 'var(--text-secondary)',
                        marginBottom: '6px'
                      }}
                    >
                      <span>{item.name} ({item.selectedWeight}) <strong style={{ color: 'var(--text-light)' }}>x{item.quantity}</strong></span>
                      <span style={{ fontWeight: '700' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                padding: '32px 24px',
                textAlign: 'center',
                color: 'var(--error)'
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
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--text-light)'
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
