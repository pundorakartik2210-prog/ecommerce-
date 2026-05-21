import React, { useEffect } from 'react';

export default function AboutUs() {
  // Ensure page starts at the top when navigated to
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="about-us-section">
      <div className="section-header">
        <span className="section-subtitle font-sans">Our Heritage & Standards</span>
        <h1 className="section-main-title font-serif">Purity in Every Spread</h1>
        <p className="section-desc">
          Nuvera Naturals is built upon a simple foundation: raw organic ingredients, uncompromising standards, and a legacy of pristine food safety.
        </p>
      </div>

      <div className="about-us-container">
        
        {/* Left Column: Safety Certificate Frame */}
        <div className="about-left-certificate">
          <div className="about-certificate-frame">
            {/* Elegant Golden Stamp Border */}
            <div className="certificate-border-accent"></div>
            
            {/* Certificate Header */}
            <div className="certificate-header">
              <div className="gold-crest-badge">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <circle cx="12" cy="11" r="3"></circle>
                  <path d="M12 2v20"></path>
                </svg>
              </div>
              <h2 className="cert-header-title">Certificate of Compliance</h2>
              <span className="cert-header-subtitle">Standard Food Safety & Quality Management</span>
            </div>

            {/* Certificate Body */}
            <div className="certificate-body">
              <p className="cert-statement">
                This is to officially certify that the peanut butter processing facilities, raw materials sourcing grids, and packaging ecosystems of
              </p>
              <h3 className="cert-recipient-name">Nuvera Naturals Labs Pvt Ltd.</h3>
              <p className="cert-statement-details">
                have been rigorously inspected, tested, and audited under global food hygiene protocols, yielding fully compliant, clean-label fitness spreads.
              </p>

              {/* Codes & Trust Details */}
              <div className="cert-credentials-grid">
                <div className="cert-credential-item">
                  <span className="cert-credential-label">FSSAI License No.</span>
                  <span className="cert-credential-val font-mono">12226999000482</span>
                </div>
                <div className="cert-credential-item">
                  <span className="cert-credential-label">IFSI Safety Code</span>
                  <span className="cert-credential-val font-mono">IFSI-IND-2026-NUTR</span>
                </div>
                <div className="cert-credential-item">
                  <span className="cert-credential-label">Audit Standards</span>
                  <span className="cert-credential-val">HACCP Class A</span>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="certificate-footer">
              <div className="cert-signatory">
                <span className="signatory-name font-serif">Dr. Alok Sen</span>
                <span className="signatory-title">Director of Quality Assurance</span>
              </div>
              <div className="certified-gold-seal">
                <div className="seal-outer-ring">
                  <div className="seal-inner-ring">
                    <span className="seal-text font-sans">100% PURE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Company Sourcing & Quality Protocols */}
        <div className="about-right-info">
          
          {/* Company Story */}
          <div className="about-info-block">
            <h2 className="info-block-title font-serif">Our Sourcing Heritage</h2>
            <p className="info-block-text">
              Nuvera Naturals was born in Whitefield, Bangalore, out of a shared dream to build a transparent, premium pantry brand. We believe that what you put into your body directly determines your life's output. That is why we refuse to take shortcuts. Every single batch starts with Grade-A, USDA-certified organic peanuts and raw almonds harvested from sustainable, regenerative farmer cooperatives in South India.
            </p>
          </div>

          {/* How It's Made Flow */}
          <div className="about-info-block">
            <h2 className="info-block-title font-serif">How It’s Crafted</h2>
            <div className="craft-process-steps">
              
              <div className="process-step">
                <div className="step-num font-serif">1</div>
                <div className="step-content">
                  <h4 className="step-title">Slow Dry Roasting</h4>
                  <p className="step-text">
                    We slow-roast premium whole nuts in custom micro-batches using exact convection temperature profiles. This gently draws out deep aromatic peanut oils without ever scorching or degrading their healthy fats.
                  </p>
                </div>
              </div>

              <div className="process-step">
                <div className="step-num font-serif">2</div>
                <div className="step-content">
                  <h4 className="step-title">Traditional Stone Grinding</h4>
                  <p className="step-text">
                    Rather than crushing nuts in high-speed, heat-generating steel blenders, we use traditional stone mills. The slow, gentle friction preserves natural micronutrients and produces an incredibly rich, velvety mouthfeel.
                  </p>
                </div>
              </div>

              <div className="process-step">
                <div className="step-num font-serif">3</div>
                <div className="step-content">
                  <h4 className="step-title">Micro-Batch Infusion</h4>
                  <p className="step-text">
                    Finally, we fold in pure unrefined Himalayan pink salt and premium grass-fed whey isolate to achieve the ultimate nutritional balance. We jar instantly to seal in freshness, completely free of palm oils or chemical preservatives.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* What We Test */}
          <div className="about-info-block testing-block">
            <h2 className="info-block-title font-serif">Purity Testing Protocols</h2>
            <p className="info-block-text">
              We operate under strict FSSAI directives and IFSI food safety initiative codes. To ensure that every single spoonful of Nuvera Naturals is clean and therapeutic, we execute rigorous quality control steps on every batch:
            </p>
            
            <div className="testing-grid">
              
              <div className="testing-card">
                <div className="testing-card-icon">🧪</div>
                <h4 className="testing-card-title">Aflatoxin Screening</h4>
                <p className="testing-card-desc">
                  Peanuts can naturally carry aflatoxin molds. We pass raw materials through advanced Liquid Chromatography testing to guarantee zero ppb contamination.
                </p>
              </div>

              <div className="testing-card">
                <div className="testing-card-icon">⚡</div>
                <h4 className="testing-card-title">Zero Heavy Metals</h4>
                <p className="testing-card-desc">
                  Independent third-party laboratory audits verify that our spreads contain absolute zero traces of toxic lead, cadmium, or chemical solvents.
                </p>
              </div>

              <div className="testing-card">
                <div className="testing-card-icon">🛡️</div>
                <h4 className="testing-card-title">Bio-Availability Verified</h4>
                <p className="testing-card-desc">
                  We check and optimize our grass-fed whey integration ratios to make sure the amino acids remain highly bio-available for active gym recoveries.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
