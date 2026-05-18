import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    id: 1,
    badge: "Limited Time Offer",
    title: "100% Organic <span>Peanut Butter</span>",
    desc: "Experience pure, unadulterated nut butter handcrafted with love. Slow-roasted to perfection with zero hydrogenated oils. Save 20% today!",
    couponCode: "PEANUT20",
    color: "#5c3a21",
    jarColor: "#e29543",
    lidColor: "#8c6239",
    labelTitle: "Classic Creamy"
  },
  {
    id: 2,
    badge: "Fitness Premium Pack",
    title: "Supercharged <span>High Protein</span> Power",
    desc: "Engineered with grass-fed whey isolate and organic MCT oil. A whopping 12g of clean protein per serving. Buy 2 tubs and get free delivery!",
    couponCode: "FITPOWER",
    color: "#1e3e62",
    jarColor: "#7c98b3",
    lidColor: "#153250",
    labelTitle: "Power Butter"
  },
  {
    id: 3,
    badge: "Indulgent Fusion",
    title: "Decadent <span>Dark Chocolate</span> Dream",
    desc: "Single-origin premium dark cacao swirled with roasted peanut butter. 70% less sugar than conventional spreads. Clean eating never tasted so good!",
    couponCode: "CHOCOLOVE",
    color: "#543310",
    jarColor: "#ae8660",
    lidColor: "#462507",
    labelTitle: "Chocolate Dream"
  }
];

export default function PromoSlider({ onShopNow }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000); // Auto scroll every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActiveSlide(prev => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const current = SLIDES[activeSlide];

  return (
    <div className="promo-slider-container">
      <div 
        className="promo-slide" 
        style={{ backgroundColor: current.color }}
        key={current.id}
      >
        {/* Vector leaf graphic simulation overlay */}
        <div className="slide-graphic-bg" style={{
          backgroundImage: `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)`
        }}></div>

        <div className="slide-content">
          <span className="slide-badge">{current.badge}</span>
          <h2 className="slide-title" dangerouslySetInnerHTML={{ __html: current.title }}></h2>
          <p className="slide-description">{current.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="slide-btn" onClick={onShopNow}>
              Shop The Collection
            </button>
            <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', color: 'var(--brand-accent)' }}>
              Use Code: {current.couponCode}
            </span>
          </div>
        </div>

        {/* Premium Jar Illustration */}
        <div className="slide-illustration">
          <div className="jar-mockup" style={{ borderColor: current.color }}>
            <div className="jar-lid" style={{ background: current.lidColor, borderColor: current.color }}></div>
            <div className="jar-label" style={{ borderColor: current.color }}>
              <span className="jar-label-brand">Nuvera</span>
              <span className="jar-label-logo">🥜</span>
              <span className="jar-label-title" style={{ color: current.color }}>{current.labelTitle}</span>
            </div>
            <div className="jar-content-preview" style={{ background: current.jarColor }}></div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="slider-arrow left" onClick={prevSlide} aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polygon points="12 19 5 12 12 5"></polygon>
        </svg>
      </button>
      <button className="slider-arrow right" onClick={nextSlide} aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polygon points="12 5 19 12 12 19"></polygon>
        </svg>
      </button>

      {/* Bottom Indicator Dots */}
      <div className="slider-dots">
        {SLIDES.map((_, idx) => (
          <div 
            key={idx} 
            className={`slider-dot ${idx === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(idx)}
          ></div>
        ))}
      </div>
    </div>
  );
}
