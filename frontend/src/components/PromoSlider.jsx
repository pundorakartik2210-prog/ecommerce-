import React, { useState, useEffect } from 'react';

const CUSTOM_PROMO_TEMPLATES = {
  "pb-classic-creamy": {
    badge: "Limited Time Offer",
    title: "100% Organic <span>Peanut Butter</span>",
    desc: "Experience pure, unadulterated nut butter handcrafted with love. Slow-roasted to perfection with zero hydrogenated oils. Save 20% today!",
    couponCode: "PEANUT20",
    gradient: "linear-gradient(135deg, #7c4f30 0%, #3e2614 100%)"
  },
  "pb-classic-crunchy": {
    badge: "New Launch",
    title: "Classic Crunchy <span>Peanut Butter</span>",
    desc: "Enjoy the perfect blend of rich, slow-roasted creamy peanut butter loaded with dry-roasted peanut chunks. 100% natural!",
    couponCode: "CRUNCH20",
    gradient: "linear-gradient(135deg, #D97706 0%, #78350F 100%)"
  },
  "pb-extra-crunchy": {
    badge: "Customer Favorite",
    title: "All-Natural <span>Extra Crunchy</span>",
    desc: "For those who believe texture is everything! Loaded with generously sized chunks of perfectly dry-roasted peanuts.",
    couponCode: "EXTRA20",
    gradient: "linear-gradient(135deg, #C67A32 0%, #7C2D12 100%)"
  },
  "pb-dark-chocolate": {
    badge: "Indulgent Fusion",
    title: "Decadent <span>Chocolate Smoothy</span>",
    desc: "Single-origin premium dark cacao swirled with roasted peanut butter. 70% less sugar than conventional spreads. Clean eating never tasted so good!",
    couponCode: "CHOCOLOVE",
    gradient: "linear-gradient(135deg, #6b431c 0%, #2f1d07 100%)"
  },
  "pb-high-protein": {
    badge: "Fitness Premium Pack",
    title: "Supercharged <span>High Protein</span> Power",
    desc: "Engineered with grass-fed whey isolate and organic MCT oil. A whopping 12g of clean protein per serving. Buy 2 tubs and get free delivery!",
    couponCode: "FITPOWER",
    gradient: "linear-gradient(135deg, #254b75 0%, #11243b 100%)"
  },
  "pb-sugar-free": {
    badge: "Keto Friendly",
    title: "Organic Pure <span>Sugar-Free</span>",
    desc: "100% single ingredient: certified organic dry-roasted peanuts. Zero added sugars, zero oils. Pure peanut goodness.",
    couponCode: "KETOPURE",
    gradient: "linear-gradient(135deg, #606C38 0%, #283618 100%)"
  },
  "pb-honey-almond": {
    badge: "New Launch",
    title: "Honey Almond <span>Peanut Blend</span>",
    desc: "Premium California almonds and high-grade peanuts ground with a slow drizzle of organic wildflower honey.",
    couponCode: "HONEYALMOND",
    gradient: "linear-gradient(135deg, #B5823F 0%, #78350F 100%)"
  }
};

export default function PromoSlider({ products = [], onShopNow }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  // Map products list to slides list dynamically
  const slides = products.map((product) => {
    const template = CUSTOM_PROMO_TEMPLATES[product.id];
    if (template) {
      return {
        id: product.id,
        badge: template.badge,
        title: template.title,
        desc: template.desc,
        couponCode: template.couponCode,
        gradient: template.gradient,
        color: product.color || "#e29543",
        jarColor: product.color || "#e29543",
        lidColor: product.color || "#8c6239",
        labelTitle: product.name,
        image: product.image
      };
    }

    // Fallback template for any newly added product
    const cleanName = product.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
    const couponCode = `${cleanName}20`;

    // Highlight the last word of product name in the slider title
    const words = product.name.split(' ');
    let formattedTitle = product.name;
    if (words.length > 1) {
      const lastWord = words.pop();
      formattedTitle = `${words.join(' ')} <span>${lastWord}</span>`;
    }

    return {
      id: product.id,
      badge: product.tag || "New Launch",
      title: formattedTitle,
      desc: product.tagline || product.description || "Experience premium, unadulterated nut butter handcrafted with love.",
      couponCode: couponCode,
      gradient: product.bgGradient || "linear-gradient(135deg, #7c4f30 0%, #3e2614 100%)",
      color: product.color || "#e29543",
      jarColor: product.color || "#e29543",
      lidColor: product.color || "#8c6239",
      labelTitle: product.name,
      image: product.image
    };
  });

  // Clamp activeSlide if it exceeds current slides size (e.g. after deletion)
  useEffect(() => {
    if (slides.length > 0 && activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [slides.length, activeSlide]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000); // Auto scroll every 6 seconds
    return () => clearInterval(timer);
  }, [activeSlide, slides.length]);

  // Reset copied state on slide change
  useEffect(() => {
    setCopied(false);
  }, [activeSlide]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setActiveSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slides.length === 0) {
    return null; // Don't render slider if all products are deleted
  }

  const current = slides[activeSlide] || slides[0];

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
        {slides.map((_, idx) => (
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
