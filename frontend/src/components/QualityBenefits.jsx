import React from 'react';

export default function QualityBenefits() {
  return (
    <section className="quality-benefits-section">
      <div className="section-header">
        <span className="section-subtitle">Pure Quality Standards</span>
        <h2 className="section-main-title">Crafted for Wellness, Certified for Safety</h2>
        <p className="section-desc">At nuvera natural, we combine gourmet flavor with pristine safety certifications to deliver the finest peanut butter your family deserves.</p>
      </div>

      <div className="benefits-grid">
        <div className="benefit-card roasted">
          <span className="benefit-number">01</span>
          <div className="benefit-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="benefit-svg">
              <path d="M2 22s13.79-4.04 15.65-8.38A9.7 9.7 0 0 0 18 9.24a4.46 4.46 0 0 0-4-4 9.7 9.7 0 0 0-4.38 1.41C5.25 8.5 2 22 2 22z" fill="currentColor" fillOpacity="0.15" />
              <path d="M12 12s4.89-4.89 4.89-9.78" />
              <path d="M2 22L12 12" />
            </svg>
          </div>
          <h3 className="benefit-title">100% Dry-Roasted Peanuts</h3>
          <p className="benefit-text">We slow-roast premium peanuts in micro-batches to unlock their natural oils and deep flavor. Zero palm oil, zero additives.</p>
          <div className="card-bg-leaf">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.4" className="bg-leaf-svg">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.5 8.5.5-2 2-6.5 5.5-8.5 3.5 2 5 6.5 5.5 8.5 2.7-1.9 4.5-5 4.5-8.5 0-5.5-4.5-10-10-10z"/>
              <path d="M12 2v10"/>
            </svg>
          </div>
        </div>

        <div className="benefit-card protein">
          <span className="benefit-number">02</span>
          <div className="benefit-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="benefit-svg">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.15" />
            </svg>
          </div>
          <h3 className="benefit-title">High Bioavailable Protein</h3>
          <p className="benefit-text">Supercharged with clean, grass-fed whey isolate and energy-boosting MCTs to support active, healthy lifestyles.</p>
          <div className="card-bg-leaf">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.4" className="bg-leaf-svg">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.5 8.5.5-2 2-6.5 5.5-8.5 3.5 2 5 6.5 5.5 8.5 2.7-1.9 4.5-5 4.5-8.5 0-5.5-4.5-10-10-10z"/>
              <path d="M12 2v10"/>
            </svg>
          </div>
        </div>

        <div className="benefit-card pure">
          <span className="benefit-number">03</span>
          <div className="benefit-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="benefit-svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
            </svg>
          </div>
          <h3 className="benefit-title">No Hydrogenated Fats</h3>
          <p className="benefit-text">Oil separation is a sign of purity! We never use hydrogenated emulsifiers, keeping our spread fully natural and clean.</p>
          <div className="card-bg-leaf">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.4" className="bg-leaf-svg">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.5 8.5.5-2 2-6.5 5.5-8.5 3.5 2 5 6.5 5.5 8.5 2.7-1.9 4.5-5 4.5-8.5 0-5.5-4.5-10-10-10z"/>
              <path d="M12 2v10"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
