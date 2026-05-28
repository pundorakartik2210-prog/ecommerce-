import React, { useState, useEffect, useRef, useCallback } from 'react';

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

function buildSlide(product) {
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
  const cleanName = product.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
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
    couponCode: `${cleanName}20`,
    gradient: product.bgGradient || "linear-gradient(135deg, #7c4f30 0%, #3e2614 100%)",
    color: product.color || "#e29543",
    jarColor: product.color || "#e29543",
    lidColor: product.color || "#8c6239",
    labelTitle: product.name,
    image: product.image
  };
}

export default function PromoSlider({ products = [], onShopNow }) {
  const slides = products.map(buildSlide);
  const total = slides.length;

  // displayIndex runs from 0 to total+1:
  //   0           = clone of last slide  (for seamless prev wrap)
  //   1 … total   = real slides
  //   total+1     = clone of first slide (for seamless next wrap)
  const [displayIndex, setDisplayIndex] = useState(1);
  const [animated, setAnimated]         = useState(true); // controls CSS transition
  const [copiedId, setCopiedId]         = useState(null);
  const timerRef    = useRef(null);
  const lockRef     = useRef(false); // prevents double-fire during jump

  // The "real" slide index (0-based) derived from displayIndex
  const realIndex = displayIndex === 0
    ? total - 1
    : displayIndex === total + 1
    ? 0
    : displayIndex - 1;

  // Build the extended display array: [cloneLast, ...slides, cloneFirst]
  const displaySlides = total > 0
    ? [slides[total - 1], ...slides, slides[0]]
    : [];

  // After CSS transition ends on a clone, instantly jump to the real counterpart
  const handleTransitionEnd = useCallback(() => {
    if (displayIndex === 0) {
      // Was on cloned last → jump to real last (index = total)
      setAnimated(false);
      setDisplayIndex(total);
      lockRef.current = false;
    } else if (displayIndex === total + 1) {
      // Was on cloned first → jump to real first (index = 1)
      setAnimated(false);
      setDisplayIndex(1);
      lockRef.current = false;
    } else {
      lockRef.current = false;
    }
  }, [displayIndex, total]);

  // Re-enable animation on next tick after an instant jump
  useEffect(() => {
    if (!animated) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimated(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [animated]);

  // Auto-advance timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!lockRef.current) {
        lockRef.current = true;
        setDisplayIndex(prev => prev + 1);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [total, startTimer]);

  const goNext = () => {
    if (total <= 1 || lockRef.current) return;
    lockRef.current = true;
    startTimer();
    setDisplayIndex(prev => prev + 1);
  };

  const goPrev = () => {
    if (total <= 1 || lockRef.current) return;
    lockRef.current = true;
    startTimer();
    setDisplayIndex(prev => prev - 1);
  };

  const goTo = (realIdx) => {
    if (total <= 1 || lockRef.current || realIdx === realIndex) return;
    lockRef.current = true;
    startTimer();
    setDisplayIndex(realIdx + 1); // real slides live at index 1..total
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (total === 0) return null;

  return (
    <div className="promo-slider-container">
      {/* Clipping viewport */}
      <div className="promo-slider-viewport">
        {/* Sliding track */}
        <div
          className="promo-slider-track"
          style={{
            transform: `translateX(-${displayIndex * 100}%)`,
            transition: animated ? 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displaySlides.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              className="promo-slide"
              style={{ background: slide.gradient }}
              aria-hidden={idx !== displayIndex}
            >
              <div className="slide-graphic-bg" style={{
                backgroundImage: `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)`
              }}></div>
              <div className="slide-blob-1"></div>
              <div className="slide-blob-2"></div>

              <div className="slide-content">
                <span className="slide-badge">{slide.badge}</span>
                <h2 className="slide-title" dangerouslySetInnerHTML={{ __html: slide.title }}></h2>
                <p className="slide-description">{slide.desc}</p>
                <div className="slide-actions">
                  <button className="slide-btn" onClick={onShopNow}>
                    Shop The Collection
                  </button>
                  <div
                    className={`slide-coupon-badge ${copiedId === slide.id + idx ? 'copied' : ''}`}
                    onClick={() => handleCopyCode(slide.couponCode, slide.id + idx)}
                    title="Click to copy coupon code"
                  >
                    <span className="coupon-label">CODE:</span>
                    <span className="coupon-code">{slide.couponCode}</span>
                    <span className="coupon-icon">
                      {copiedId === slide.id + idx ? (
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
                    {copiedId === slide.id + idx && <span className="copied-tooltip">Copied!</span>}
                  </div>
                </div>
              </div>

              <div className="slide-illustration">
                {slide.image ? (
                  <img src={slide.image} alt={slide.labelTitle} className="slide-jar-img" />
                ) : (
                  <div className="jar-mockup" style={{ borderColor: slide.color }}>
                    <div className="jar-lid" style={{ background: slide.lidColor, borderColor: slide.color }}></div>
                    <div className="jar-label" style={{ borderColor: slide.color }}>
                      <span className="jar-label-brand">Nuvera</span>
                      <span className="jar-label-logo">🥜</span>
                      <span className="jar-label-title" style={{ color: slide.color }}>{slide.labelTitle}</span>
                    </div>
                    <div className="jar-content-preview" style={{ background: slide.jarColor }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button className="slider-arrow left" onClick={goPrev} aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="slider-arrow right" onClick={goNext} aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}

      {/* Dots — based on real index */}
      {total > 1 && (
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`slider-dot ${idx === realIndex ? 'active' : ''}`}
              onClick={() => goTo(idx)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
