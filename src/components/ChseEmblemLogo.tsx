import React from 'react';

interface ChseEmblemLogoProps {
  className?: string;
  size?: number;
}

export const ChseEmblemLogo: React.FC<ChseEmblemLogoProps> = ({
  className = '',
  size = 48
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="MY CHSE 12TH CLASSES Official Emblem"
    >
      <defs>
        {/* Gold Outer Gradient */}
        <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        {/* Navy Center Gradient */}
        <linearGradient id="navyCenterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>

        {/* Ribbon Gradient */}
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id="emblemShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
        </filter>

        {/* Text curve path */}
        <path
          id="textArc"
          d="M 30,100 A 70,70 0 1,1 170,100"
          fill="none"
        />
      </defs>

      {/* Outer Golden Border & Shadow */}
      <circle cx="100" cy="100" r="96" fill="url(#goldRingGrad)" filter="url(#emblemShadow)" />

      {/* Dark Navy Inner Ring */}
      <circle cx="100" cy="100" r="88" fill="#0B132B" />

      {/* Thin Gold Separator Ring */}
      <circle cx="100" cy="100" r="82" fill="none" stroke="url(#goldRingGrad)" strokeWidth="2.5" strokeDasharray="3 2" />

      {/* Inner Circle with Navy Gradient */}
      <circle cx="100" cy="100" r="76" fill="url(#navyCenterGrad)" />

      {/* Curved Upper Text: MY CHSE 12TH CLASSES */}
      <text fill="#FEF08A" fontSize="13.5" fontWeight="900" letterSpacing="2.5" fontFamily="system-ui, -apple-system, sans-serif">
        <textPath href="#textArc" startOffset="50%" textAnchor="middle">
          MY CHSE 12TH CLASSES
        </textPath>
      </text>

      {/* Laurel Wreath on Left and Right */}
      {/* Left Wreath Branch */}
      <g stroke="#FBBF24" strokeWidth="2" fill="#FBBF24" opacity="0.95">
        <path d="M 40,110 C 35,95 42,75 58,62" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left leaves */}
        <ellipse cx="40" cy="102" rx="4.5" ry="2.5" transform="rotate(-30 40 102)" />
        <ellipse cx="37" cy="91" rx="4.5" ry="2.5" transform="rotate(-15 37 91)" />
        <ellipse cx="40" cy="80" rx="4.5" ry="2.5" transform="rotate(10 40 80)" />
        <ellipse cx="46" cy="71" rx="4.5" ry="2.5" transform="rotate(35 46 71)" />
        <ellipse cx="55" cy="64" rx="4.5" ry="2.5" transform="rotate(55 55 64)" />
      </g>

      {/* Right Wreath Branch */}
      <g stroke="#FBBF24" strokeWidth="2" fill="#FBBF24" opacity="0.95">
        <path d="M 160,110 C 165,95 158,75 142,62" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right leaves */}
        <ellipse cx="160" cy="102" rx="4.5" ry="2.5" transform="rotate(30 160 102)" />
        <ellipse cx="163" cy="91" rx="4.5" ry="2.5" transform="rotate(15 163 91)" />
        <ellipse cx="160" cy="80" rx="4.5" ry="2.5" transform="rotate(-10 160 80)" />
        <ellipse cx="154" cy="71" rx="4.5" ry="2.5" transform="rotate(-35 154 71)" />
        <ellipse cx="145" cy="64" rx="4.5" ry="2.5" transform="rotate(-55 145 64)" />
      </g>

      {/* Graduation Cap (Mortarboard) in Center */}
      <g transform="translate(100, 82)">
        {/* Cap Diamond Top */}
        <polygon points="0,-22 42,-8 0,6 -42,-8" fill="#FFFFFF" />
        <polygon points="0,-20 38,-8 0,4 -38,-8" fill="#0F172A" stroke="#FDE047" strokeWidth="1.5" />

        {/* Skull cap under diamond */}
        <path d="M -20,-2 Q 0,16 20,-2 L 20,4 Q 0,22 -20,4 Z" fill="#0B132B" stroke="#FDE047" strokeWidth="1" />

        {/* Golden Button & Tassel */}
        <circle cx="0" cy="-8" r="3" fill="#FDE047" />
        {/* Tassel cord */}
        <path d="M 0,-8 Q 24,-6 28,10" fill="none" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="28" cy="12" rx="2.5" ry="5" fill="#FBBF24" />
      </g>

      {/* Open Book Beneath Cap */}
      <g transform="translate(100, 114)">
        {/* Book Spine Center Marker */}
        <path d="M 0,-6 L 0,16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />

        {/* Left Book Page */}
        <path
          d="M 0,-6 C -14,-10 -30,-4 -40,-2 L -40,14 C -30,12 -14,6 0,16 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Left Page Text Lines */}
        <line x1="-34" y1="2" x2="-8" y2="-1" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-34" y1="6" x2="-8" y2="3" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-34" y1="10" x2="-14" y2="7" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Book Page */}
        <path
          d="M 0,-6 C 14,-10 30,-4 40,-2 L 40,14 C 30,12 14,6 0,16 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Right Page Text Lines */}
        <line x1="8" y1="-1" x2="34" y2="2" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="3" x2="34" y2="6" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="7" x2="28" y2="10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Bottom Ribbon Banner: LEARN • PRACTICE • SUCCEED */}
      <g transform="translate(100, 158)">
        {/* Ribbon Tails / Wings */}
        <polygon points="-86,-4 -68,-14 -68,6 -86,16 -76,6" fill="#0B132B" stroke="#F59E0B" strokeWidth="1" />
        <polygon points="86,-4 68,-14 68,6 86,16 76,6" fill="#0B132B" stroke="#F59E0B" strokeWidth="1" />

        {/* Ribbon Body */}
        <path
          d="M -72,-12 C -24,-17 24,-17 72,-12 L 70,8 C 24,3 -24,3 -70,8 Z"
          fill="url(#ribbonGrad)"
          stroke="#F59E0B"
          strokeWidth="2"
        />

        {/* Ribbon Fold shadow */}
        <polygon points="-70,-12 -68,-4 -70,8" fill="#000000" opacity="0.4" />
        <polygon points="70,-12 68,-4 70,8" fill="#000000" opacity="0.4" />

        {/* Ribbon Text */}
        <text
          x="0"
          y="0"
          fill="#FFFFFF"
          fontSize="8.5"
          fontWeight="900"
          letterSpacing="1"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          LEARN • PRACTICE • SUCCEED
        </text>
      </g>

      {/* Decorative Golden Stars */}
      <polygon points="28,124 30,120 34,120 31,122 32,126 29,123 26,126 27,122 24,120 28,120" fill="#FBBF24" />
      <polygon points="172,124 174,120 178,120 175,122 176,126 173,123 170,126 171,122 168,120 172,120" fill="#FBBF24" />
    </svg>
  );
};
