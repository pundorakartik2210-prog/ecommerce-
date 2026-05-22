import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    id: 1,
    badge: "Limited Time Offer",
    title: "100% Organic <span>Peanut Butter</span>",
    desc: "Experience pure, unadulterated nut butter handcrafted with love. Slow-roasted to perfection with zero hydrogenated oils. Save 20% today!",
    couponCode: "PEANUT20",
    color: "#5c3a21",
    gradient: "linear-gradient(135deg, #7c4f30 0%, #3e2614 100%)",
    jarColor: "#e29543",
    lidColor: "#8c6239",
    labelTitle: "Classic Creamy",
    image: "/src/assets/classic_creamy.png"
  },
  {
    id: 2,
    badge: "Fitness Premium Pack",
    title: "Supercharged <span>High Protein</span> Power",
    desc: "Engineered with grass-fed whey isolate and organic MCT oil. A whopping 12g of clean protein per serving. Buy 2 tubs and get free delivery!",
    couponCode: "FITPOWER",
    color: "#1e3e62",
    gradient: "linear-gradient(135deg, #254b75 0%, #11243b 100%)",
    jarColor: "#7c98b3",
    lidColor: "#153250",
    labelTitle: "Power Butter",
    image: "/src/assets/fitness_power.png"
  },
  {
    id: 3,
    badge: "Indulgent Fusion",
    title: "Decadent <span>Dark Chocolate</span> Dream",
    desc: "Single-origin premium dark cacao swirled with roasted peanut butter. 70% less sugar than conventional spreads. Clean eating never tasted so good!",
    couponCode: "CHOCOLOVE",
    color: "#543310",
    gradient: "linear-gradient(135deg, #6b431c 0%, #2f1d07 100%)",
    jarColor: "#ae8660",
    lidColor: "#462507",
    labelTitle: "Chocolate Dream",
    image: "/src/assets/chocolate_dream.png"
  }
];

export default function PromoSlider({ onShopNow }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000); // Auto scroll every 6 seconds
    return () => clearInterval(timer);
  }, [activeSlide]);

  // Reset copied state on slide change
  useEffect(() => {
    setCopied(false);
  }, [activeSlide]);

  const nextSlide = () => {
    setActiveSlide(prev => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = SLIDES[activeSlide];

  return (
    <div className="promo-slider-container">
      <div 
        className="promo-slide" 
        style={{ background: current.gradient }}
        key={current.id}
      >
        {/* Vector leaf graphic simulation overlay */}
        <div className="slide-graphic-bg" style={{
          backgroundImage: `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)`
        }}></div>

        {/* Decorative glassmorphic background elements */}
        <div className="slide-blob-1"></div>
        <div className="slide-blob-2"></div>

        <div className="slide-content">
          <span className="slide-badge">{current.badge}</span>
          <h2 className="slide-title" dangerouslySetInnerHTML={{ __html: current.title }}></h2>
          <p className="slide-description">{current.desc}</p>
          <div className="slide-actions">
            <button className="slide-btn" onClick={onShopNow}>
              Shop The Collection
            </button>
            <div 
              className={`slide-coupon-badge ${copied ? 'copied' : ''}`}
              onClick={() => handleCopyCode(current.couponCode)}
              title="Click to copy coupon code"
            >
              <span className="coupon-label">CODE:</span>
              <span className="coupon-code">{current.couponCode}</span>
              <span className="coupon-icon">
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </span>
              {copied && <span className="copied-tooltip">Copied!</span>}
            </div>
          </div>
        </div>

        {/* Premium Jar Illustration */}
        <div className="slide-illustration">
          {current.image ? (
            <img
              src={current.image}
              alt={current.labelTitle}
              className="slide-jar-img"
            />
          ) : (
            <div className="jar-mockup" style={{ borderColor: current.color }}>
              <div className="jar-lid" style={{ background: current.lidColor, borderColor: current.color }}></div>
              <div className="jar-label" style={{ borderColor: current.color }}>
                <span className="jar-label-brand">Nuvera</span>
                <span className="jar-label-logo">🥜</span>
                <span className="jar-label-title" style={{ color: current.color }}>{current.labelTitle}</span>
              </div>
              <div className="jar-content-preview" style={{ background: current.jarColor }}></div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="slider-arrow left" onClick={prevSlide} aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button className="slider-arrow right" onClick={nextSlide} aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
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
