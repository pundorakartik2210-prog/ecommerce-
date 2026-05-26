import React from 'react';

export default function PolicyModals({ activePolicy, onClose }) {
  if (!activePolicy) return null;

  const renderContent = () => {
    switch (activePolicy) {
      case 'about':
        return (
          <>
            <h2 className="policy-title">About nuvera natural</h2>
            <div className="policy-content">
              <p>Welcome to <strong>nuvera natural</strong>, where healthy eating meets decadent flavor. Founded in 2024, our mission has been simple: to create the world’s most nutritious, pure, and delicious nut butters without compromising on natural purity or ingredient quality.</p>

              <h3>Our Philosophy</h3>
              <p>We believe that nature provides the best fuel for the human body. That’s why we refuse to use cheap palm oils, hydrogenated fats, high fructose corn syrups, or chemical preservatives. Every single jar of nuvera natural is slow-roasted and stone-ground in micro-batches to preserve vital micronutrients and maintain clean premium flavor.</p>

              <h3>Why Choose Nuvera?</h3>
              <ul>
                <li><strong>100% Organic Sourcing</strong>: We source only A-grade, USDA-certified organic peanuts and almonds from sustainable farming cooperatives.</li>
                <li><strong>Slow Dry Roasting</strong>: Our custom temperature profile highlights the deep nutty notes of peanuts while maintaining standard nutritional integrity.</li>
                <li><strong>Himalayan Pink Salt</strong>: We only season our products with unrefined mineral-rich pink salt.</li>
                <li><strong>Ultra High Fitness Standards</strong>: No shortcuts. High protein formulas are packed with premium grass-fed whey isolate for maximum bioavailability.</li>
              </ul>
              <p>From gym pre-workouts to kids' school sandwiches, we serve wellness lovers, keto adventurers, and pure nut enthusiasts who refuse to compromise. Thank you for letting us be a part of your healthy lifestyle journey!</p>
            </div>
          </>
        );


      case 'privacy':
        return (
          <>
            <h2 className="policy-title">Privacy Protection Policy</h2>
            <div className="policy-content">
              <p>At <strong>nuvera natural</strong>, we value your trust above all else. This Privacy Policy details how we collect, store, secure, and handle your sensitive personal information when you utilize our e-commerce platform.</p>

              <h3>1. Data We Collect</h3>
              <p>When you checkout or browse our site, we collect necessary transactions data to fulfill your order:</p>
              <ul>
                <li>Contact detail profiles (Name, Email, Delivery addresses, Phone numbers)</li>
                <li>Cookies and analytical sessions (To remember items inside your shopping cart drawer)</li>
                <li>Device profiles (IP addresses, browser client tags to ensure checkout security)</li>
              </ul>

              <h3>2. Data Security & Storage</h3>
              <p>We implement state-of-the-art secure socket layers (SSL) and tokenization. Your financial payment information is never stored directly on our servers; payments are processed securely through certified, PCI-compliant payment gateways.</p>

              <h3>3. No Selling of Information</h3>
              <p>We respect your inbox. <strong>We do not sell, rent, trade, or distribute your email addresses or phone contacts to third-party marketing companies.</strong> Data is strictly utilized to process peanut butter orders, track shipping transit, or deliver exclusive brand discount vouchers.</p>
            </div>
          </>
        );

      case 'return':
        return (
          <>
            <h2 className="policy-title">Return & Refund Guarantee</h2>
            <div className="policy-content">
              <p>Because peanut butter is an organic food item, we are fully committed to absolute freshness and hygiene. We provide a customer-first policy so you can order with total confidence!</p>

              <h3>100% Satisfaction Guarantee</h3>
              <p>If your peanut butter jar arrives damaged during shipping transit, has a broken vacuum seal, or does not meet your quality standards, we will immediately issue a <strong>full refund or ship a replacement tub absolutely free!</strong></p>

              <h3>Policy Conditions</h3>
              <ul>
                <li><strong>Claims Timeline</strong>: Issues must be reported to our customer service email (<a href="https://mail.google.com/mail/?view=cm&fs=1&to=nuveranatural@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>nuveranatural@gmail.com</a>) within <strong>7 days</strong> of delivery.</li>
                <li><strong>No Return of Opened Jars Required</strong>: For food safety reasons, we do not require you to ship open or leaking jars back to our manufacturing Haryana facility. Simply snap a quick photograph and send it to our team!</li>
                <li><strong>Refund Processing Time</strong>: Approved refunds are processed directly back to your source account within <strong>3-5 business days</strong>.</li>
              </ul>

              <h3>Corporate Order Cancellations</h3>
              <p>Corporate custom or bulk wholesale orders can be cancelled or altered up to 24 hours prior to scheduled dry-roasting and packing cycles.</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()} style={{ width: '720px' }}>

        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close policy modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="policy-modal-scrollable">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
