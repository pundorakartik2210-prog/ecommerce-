import React from 'react';

const CATEGORIES = [
  {
    id: "all",
    label: "All Butters",
    // Simple custom inline SVG
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    )
  },
  {
    id: "creamy",
    label: "Classic Creamy",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M3 12h18M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9z"/>
      </svg>
    )
  },
  {
    id: "crunchy",
    label: "Extra Crunchy",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: "chocolate",
    label: "Chocolate Fusion",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="15" y1="3" x2="15" y2="21"/>
      </svg>
    )
  },
  {
    id: "high-protein",
    label: "High Protein",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11M6.5 17.5h11M6.5 6.5v11M17.5 6.5v11"/>
        <path d="M12 9v6M9 12h6"/>
      </svg>
    )
  },
  {
    id: "sugar-free",
    label: "Sugar-Free / Keto",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M12 12v10"/>
        <path d="M12 12l-8 4M12 12l8 4"/>
      </svg>
    )
  }
];

export default function CategoryBar({ activeCategory, onCategoryChange }) {
  return (
    <div className="category-bar-wrapper">
      <div className="category-bar-container">
        {CATEGORIES.map(cat => (
          <div 
            key={cat.id} 
            className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            <div className="category-icon-wrapper">
              {cat.svg}
            </div>
            <span className="category-label">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
