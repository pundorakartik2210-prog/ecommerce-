import React from 'react';
import logoImg from '../assets/logo_final.png';

export default function Footer({ onPolicyClick, onTrackClick, onAboutClick }) {
  return (
    <footer className="footer-wrapper">
      <div className="container">

        <div className="footer-grid">

          {/* Column 1: Brand Info */}
          <div>
            <div className="brand-logo" style={{ cursor: 'default' }}>
              <img src={`${logoImg}?v=2`} alt="Nuvera Naturals Logo" className="footer-logo-img" />
              <div className="brand-name" style={{ color: 'white', fontSize: '22px' }}>Nuvera<span style={{ color: 'var(--brand-accent)' }}>Naturals</span></div>
            </div>
            <p className="footer-brand-desc">
              Dedicated to crafting the world's finest organic peanut butter variants. Stone-ground, slow dry-roasted, and filled with protein goodness. No palm oils, no preservatives.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" className="footer-social-btn" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://instagram.com" className="footer-social-btn" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://twitter.com" className="footer-social-btn" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Store navigation */}
          <div>
            <h4 className="footer-col-title">Shop Butters</h4>
            <ul className="footer-links">
              <li><a href="#products-catalog">Classic Creamy</a></li>
              <li><a href="#products-catalog">Extra Crunchy</a></li>
              <li><a href="#products-catalog">Dark Chocolate Dream</a></li>
              <li><a href="#products-catalog">High Protein Power</a></li>
              <li><a href="#products-catalog">Organic Sugar-Free</a></li>
            </ul>
          </div>

          {/* Column 3: Policy Pages */}
          <div>
            <h4 className="footer-col-title">Company Info</h4>
            <ul className="footer-links">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); onAboutClick(); }}>About Us</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onPolicyClick('contact'); }}>Contact Details</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); onPolicyClick('privacy'); }}>Privacy Policy</a></li>
              <li><a href="#return" onClick={(e) => { e.preventDefault(); onPolicyClick('return'); }}>Return & Refund Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Shipments Support */}
          <div>
            <h4 className="footer-col-title">Order Logistics</h4>
            <p style={{ color: 'rgba(250,248,245,0.75)', lineHeight: '1.5', margin: '0 0 12px 0' }}>
              Want to see where your slow-ground organic peanut butter jars are currently travelling?
            </p>
            <button className="track-footer-btn" onClick={onTrackClick}>
              📦 Launch Order Tracker
            </button>
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
