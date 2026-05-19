import React from "react";

/**
 * DMS brand logo — the layered purple-to-cyan gradient icon.
 * This is the exact same SVG as favicon.svg, used as logo everywhere.
 */
const DmsLogo = ({ size = 48 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))", flexShrink: 0 }}>
    <defs>
      <linearGradient id="dmsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <path d="M12 2L2 7l10 5 10-5-10-5Z" fill="url(#dmsGrad)" />
    <path d="M2 17l10 5 10-5" stroke="url(#dmsGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="url(#dmsGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

export default DmsLogo;
