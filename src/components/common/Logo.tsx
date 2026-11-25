import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="helmGradA" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <filter id="glowA" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.6" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="#0d1117" />
      <rect x="0.5" y="0.5" width="99" height="99" rx="21.5" stroke="#30363d" />

      {/* Outer Helm Wheel */}
      <circle cx="50" cy="50" r="32" stroke="url(#helmGradA)" strokeWidth="3.5" fill="#161b22" />
      <circle cx="50" cy="50" r="26" stroke="#21262d" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* 6 Steering Spokes ending in Git Nodes */}
      <line x1="50" y1="8" x2="50" y2="28" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="72" x2="50" y2="92" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="29" x2="31" y2="39" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
      <line x1="69" y1="61" x2="86" y2="71" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="71" x2="31" y2="61" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
      <line x1="69" y1="39" x2="86" y2="29" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />

      {/* Terminal Branch Nodes */}
      <circle cx="50" cy="8" r="4.5" fill="#38bdf8" stroke="#0d1117" strokeWidth="2" />
      <circle cx="50" cy="92" r="4.5" fill="#818cf8" stroke="#0d1117" strokeWidth="2" />
      <circle cx="14" cy="29" r="4.5" fill="#818cf8" stroke="#0d1117" strokeWidth="2" />
      <circle cx="86" cy="71" r="4.5" fill="#34d399" stroke="#0d1117" strokeWidth="2" />
      <circle cx="14" cy="71" r="4.5" fill="#38bdf8" stroke="#0d1117" strokeWidth="2" />
      <circle cx="86" cy="29" r="4.5" fill="#34d399" stroke="#0d1117" strokeWidth="2" />

      {/* Central Core Hub with Bold "GIT" Wordmark */}
      <circle cx="50" cy="50" r="19" fill="#0d1117" stroke="#38bdf8" strokeWidth="2.5" filter="url(#glowA)" />
      <text
        x="50"
        y="55"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#ffffff"
        textAnchor="middle"
        letterSpacing="1"
      >
        GIT
      </text>
    </svg>
  );
};
