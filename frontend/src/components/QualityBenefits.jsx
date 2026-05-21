import React from 'react';

export default function QualityBenefits() {
  return (
    <section className="quality-benefits-section">
      <div className="section-header">
        <span className="section-subtitle">Pure Quality Standards</span>
        <h2 className="section-main-title">Crafted for Wellness, Certified for Safety</h2>
        <p className="section-desc">At Nuvera Naturals, we combine gourmet flavor with pristine safety certifications to deliver the finest peanut butter your family deserves.</p>
      </div>

      <div className="benefits-grid">
        <div className="benefit-card">
          <div className="benefit-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8l4 4-4 4M8 12h8"></path>
            </svg>
          </div>
          <h3 className="benefit-title">100% Dry-Roasted Peanuts</h3>
          <p className="benefit-text">We slow-roast premium peanuts in micro-batches to unlock their natural oils and deep flavor. Zero palm oil, zero additives.</p>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <h3 className="benefit-title">High Bioavailable Protein</h3>
          <p className="benefit-text">Supercharged with clean, grass-fed whey isolate and energy-boosting MCTs to support active, healthy lifestyles.</p>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 className="benefit-title">No Hydrogenated Fats</h3>
          <p className="benefit-text">Oil separation is a sign of purity! We never use hydrogenated emulsifiers, keeping our spread fully natural and clean.</p>
        </div>
      </div>
    </section>
  );
}
