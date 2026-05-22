import React from 'react';
import logoImg from '../assets/logo_final_white.png';
import logoTextImg from '../assets/logo-text-clean.png';

export default function Footer({ onPolicyClick, onTrackClick, onAboutClick }) {
  return (
    <footer className="footer-wrapper">
      <div className="container">

        <div className="footer-grid">

          {/* Column 1: Brand Info */}
          <div>
            <div className="brand-logo" style={{ cursor: 'default' }}>
              <div style={{ background: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img src={`${logoImg}?v=10`} alt="Nuvera Naturals Logo" className="footer-logo-img" style={{ mixBlendMode: 'normal', display: 'block' }} />
              </div>
              <img src={logoTextImg} alt="Nuvera Naturals" className="footer-logo-text-img" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <p className="footer-brand-desc">
              Dedicated to crafting the world's finest organic peanut butter variants. Stone-ground, slow dry-roasted, and filled with protein goodness. No palm oils, no preservatives.
            </p>
            <div className="footer-socials-container">
              <p className="footer-socials-label">Follow Us</p>
              <div className="footer-socials">
                <a href="https://facebook.com" className="footer-social-btn footer-social-fb" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://instagram.com" className="footer-social-btn footer-social-ig" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://twitter.com" className="footer-social-btn footer-social-tw" aria-label="Twitter/X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Store navigation */}
          <div>
            <h4 className="footer-col-title">Shop Butters</h4>
            <ul className="footer-links">
              <li>
                <a href="#products-catalog" className="footer-icon-link policy-link">
                  <span className="policy-icon-container shop-icon-creamy">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </span>
                  <span>Classic Creamy</span>
                </a>
              </li>
              <li>
                <a href="#products-catalog" className="footer-icon-link policy-link">
                  <span className="policy-icon-container shop-icon-crunchy">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </span>
                  <span>Extra Crunchy</span>
                </a>
              </li>
              <li>
                <a href="#products-catalog" className="footer-icon-link policy-link">
                  <span className="policy-icon-container shop-icon-choco">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </span>
                  <span>Dark Chocolate Dream</span>
                </a>
              </li>
              <li>
                <a href="#products-catalog" className="footer-icon-link policy-link">
                  <span className="policy-icon-container shop-icon-protein">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </span>
                  <span>High Protein Power</span>
                </a>
              </li>
              <li>
                <a href="#products-catalog" className="footer-icon-link policy-link">
                  <span className="policy-icon-container shop-icon-organic">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </span>
                  <span>Organic Sugar-Free</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Policy Pages */}
          <div>
            <h4 className="footer-col-title">Company Info</h4>
            <ul className="footer-links">
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="footer-icon-link policy-link">
                  <span className="policy-icon-container policy-icon-info">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </span>
                  <span>About Us</span>
                </a>
              </li>

              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); onPolicyClick('privacy'); }} className="footer-icon-link policy-link">
                  <span className="policy-icon-container policy-icon-shield">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </span>
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#return" onClick={(e) => { e.preventDefault(); onPolicyClick('return'); }} className="footer-icon-link policy-link">
                  <span className="policy-icon-container policy-icon-refresh">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                    </svg>
                  </span>
                  <span>Return & Refund Policy</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="footer-col-title">Contact Info</h4>
            <div className="footer-contact-item">
              <span className="policy-icon-container policy-icon-info" style={{ marginTop: '2px', cursor: 'default' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <span style={{ fontSize: '13.5px', lineHeight: '1.4' }}>Whitefield, Bangalore, Karnataka, India</span>
            </div>
            <div className="footer-contact-item">
              <span className="policy-icon-container policy-icon-mail" style={{ marginTop: '2px', cursor: 'default' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <span style={{ fontSize: '13.5px', lineHeight: '1.4' }}>support@nuveranaturals.com</span>
            </div>
            <div className="footer-contact-item">
              <span className="policy-icon-container policy-icon-phone" style={{ marginTop: '2px', cursor: 'default' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="policy-icon">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <span style={{ fontSize: '13.5px', lineHeight: '1.4' }}>+91 98765 43210</span>
            </div>
          </div>

        </div>

        {/* Footer Bottom bar */}
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Nuvera Naturals Labs Pvt Ltd. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Crafted with 100% Organic Love 🥜</span>
            <span>Made in Whitefield, Bangalore</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
