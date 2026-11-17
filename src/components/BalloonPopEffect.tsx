import React from 'react';

export interface BalloonPopEffectProps {
  color?: string; // Balloon theme color
  accentColor?: string;
  size?: number; // Base pixel size (default: 260)
  className?: string;
}

export const BalloonPopEffect: React.FC<BalloonPopEffectProps> = ({
  color = '#FF3366',
  accentColor = '#FFD200',
  size = 280,
  className = '',
}) => {
  return (
    <div
      data-testid="comic-starburst-pop"
      className={`absolute pointer-events-none select-none z-30 flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Starburst Center Core Gradient */}
          <radialGradient id="blastCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF7A1" />
            <stop offset="70%" stopColor="#FFD000" />
            <stop offset="100%" stopColor="#FF6B00" />
          </radialGradient>

          {/* Shockwave Glow */}
          <radialGradient id="shockwaveGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="90%" stopColor="#FFAA00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
          </radialGradient>

          {/* Rubber scrap gradient matching balloon */}
          <linearGradient id="scrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#660014" />
          </linearGradient>
        </defs>

        {/* 1. EXPANDING SHOCKWAVE RINGS */}
        <g className="animate-[shockwaveExpand_0.6s_ease-out_forwards] origin-center">
          <ellipse cx="150" cy="150" rx="90" ry="85" stroke="#FFA726" strokeWidth="3" strokeDasharray="16 8" opacity="0.6" />
          <ellipse cx="150" cy="150" rx="120" ry="115" stroke="#FFE082" strokeWidth="2" strokeDasharray="12 6" opacity="0.4" />
        </g>

        {/* 2. MAIN COMIC JAGGED STARBURST FLASH (Image 3 Parity) */}
        <g className="animate-[starburstFlash_0.55s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] origin-center">
          {/* Outer Orange/Red Spikes */}
          <polygon
            points="
              150,20 162,95 210,45 185,110 255,75 205,130 280,120 215,155
              275,190 205,185 250,235 185,210 205,275 160,225 150,285 138,225
              95,275 112,210 50,235 92,185 20,190 85,155 20,120 95,130
              45,75 115,110 90,45 138,95
            "
            fill="#FF7700"
            stroke="#D32F2F"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Bright Yellow Spikes */}
          <polygon
            points="
              150,42 159,105 198,62 178,118 234,90 194,134 254,126 202,154
              250,182 194,178 230,218 178,198 194,250 158,212 150,258 140,212
              106,250 120,198 70,218 104,178 50,182 98,154 46,126 104,134
              64,90 122,118 102,62 140,105
            "
            fill="url(#blastCoreGrad)"
            stroke="#FFF9C4"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Core White Energy Flare */}
          <circle cx="150" cy="150" r="38" fill="#FFFFFF" opacity="0.95" />
          <circle cx="150" cy="150" r="24" fill="#FFFDE7" />
        </g>

        {/* 3. FLYING SHREDDED BALLOON SCRAPS (Scalloped torn edges & knot) */}
        {/* Scrap A: Top-Left torn curved rubber piece */}
        <g className="animate-[flyScrapA_0.6s_ease-out_forwards] origin-center">
          <path
            d="M 115,95 Q 95,65 70,72 Q 85,88 78,102 Q 95,108 115,95 Z"
            fill={color}
            stroke="#4A0010"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Highlight on scrap */}
          <path d="M 105,90 Q 90,72 75,76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Scrap B: Bottom-Left torn knot piece with string stub */}
        <g className="animate-[flyScrapB_0.6s_ease-out_forwards] origin-center">
          <path
            d="M 90,195 Q 65,220 52,210 Q 64,192 78,185 Z"
            fill={color}
            stroke="#4A0010"
            strokeWidth="2"
          />
          {/* Tied knot remnant */}
          <polygon points="50,210 58,216 52,224" fill="#88001B" stroke="#4A0010" strokeWidth="1.5" />
          <path d="M 52,224 Q 40,236 46,248" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Scrap C: Top-Right torn curved rubber */}
        <g className="animate-[flyScrapC_0.6s_ease-out_forwards] origin-center">
          <path
            d="M 195,100 Q 225,75 240,88 Q 224,102 232,118 Q 210,114 195,100 Z"
            fill="#00B4D8"
            stroke="#003566"
            strokeWidth="2"
          />
        </g>

        {/* Scrap D: Bottom-Right rubber flap */}
        <g className="animate-[flyScrapD_0.6s_ease-out_forwards] origin-center">
          <path
            d="M 195,200 Q 225,215 238,202 Q 224,190 228,175 Z"
            fill="#2ECC71"
            stroke="#145A32"
            strokeWidth="2"
          />
        </g>

        {/* Scrap E: Bottom center torn scrap */}
        <g className="animate-[flyScrapE_0.6s_ease-out_forwards] origin-center">
          <path
            d="M 145,210 Q 155,242 168,238 Q 160,225 158,210 Z"
            fill="#FFD200"
            stroke="#7E5109"
            strokeWidth="2"
          />
        </g>

        {/* 4. MULTI-COLOURED GEOMETRIC CONFETTI & CURLY RIBBONS */}
        {/* Blue Diamonds */}
        <polygon points="75,55 83,63 75,71 67,63" fill="#00D2D3" className="animate-[confettiPop1_0.5s_ease-out_forwards]" />
        <polygon points="230,230 238,238 230,246 222,238" fill="#54A0FF" className="animate-[confettiPop2_0.5s_ease-out_forwards]" />

        {/* Pink / Red Triangles */}
        <polygon points="120,40 130,52 112,50" fill="#FF4757" className="animate-[confettiPop3_0.5s_ease-out_forwards]" />
        <polygon points="215,60 228,68 218,78" fill="#FF6B81" className="animate-[confettiPop1_0.5s_ease-out_forwards]" />
        <polygon points="160,250 172,258 158,266" fill="#FF4757" className="animate-[confettiPop2_0.5s_ease-out_forwards]" />

        {/* Yellow & Purple Rectangles */}
        <rect x="235" y="145" width="10" height="7" rx="1.5" fill="#FFA502" transform="rotate(25 240 148)" className="animate-[confettiPop3_0.5s_ease-out_forwards]" />
        <rect x="52" y="145" width="10" height="7" rx="1.5" fill="#9B59B6" transform="rotate(-30 57 148)" className="animate-[confettiPop1_0.5s_ease-out_forwards]" />

        {/* Curly Party Ribbons */}
        <path d="M 60,110 Q 48,118 56,128 T 46,138" fill="none" stroke="#00D2D3" strokeWidth="2.5" strokeLinecap="round" className="animate-[confettiPop2_0.55s_ease-out_forwards]" />
        <path d="M 235,100 Q 248,108 240,118 T 250,128" fill="none" stroke="#FF4757" strokeWidth="2.5" strokeLinecap="round" className="animate-[confettiPop3_0.55s_ease-out_forwards]" />
        <path d="M 120,240 Q 110,248 118,256" fill="none" stroke="#FFD200" strokeWidth="2.5" strokeLinecap="round" className="animate-[confettiPop1_0.55s_ease-out_forwards]" />

        {/* 5. 4-POINT GOLDEN SPARKLES & STARS (Image 3 Parity) */}
        {/* Star 1: Top Right */}
        <g transform="translate(230, 52) scale(0.85)" className="animate-[spinGlint_0.6s_ease-out_forwards]">
          <path d="M 0,-18 Q 0,-2 18,0 Q 0,2 0,18 Q 0,2 -18,0 Q 0,-2 0,-18 Z" fill="#FFD700" stroke="#FF9800" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
        </g>

        {/* Star 2: Top Left */}
        <g transform="translate(70, 75) scale(0.75)" className="animate-[spinGlint_0.6s_ease-out_forwards]">
          <path d="M 0,-18 Q 0,-2 18,0 Q 0,2 0,18 Q 0,2 -18,0 Q 0,-2 0,-18 Z" fill="#FFD700" stroke="#FF9800" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>

        {/* Star 3: Bottom Left */}
        <g transform="translate(68, 222) scale(0.8)" className="animate-[spinGlint_0.6s_ease-out_forwards]">
          <path d="M 0,-18 Q 0,-2 18,0 Q 0,2 0,18 Q 0,2 -18,0 Q 0,-2 0,-18 Z" fill="#FFD700" stroke="#FF9800" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>

        {/* Star 4: Middle Right */}
        <g transform="translate(248, 185) scale(0.8)" className="animate-[spinGlint_0.6s_ease-out_forwards]">
          <path d="M 0,-18 Q 0,-2 18,0 Q 0,2 0,18 Q 0,2 -18,0 Q 0,-2 0,-18 Z" fill="#FFD700" stroke="#FF9800" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>

        {/* 6. CARTOON WHITE SMOKE PUFF CLOUDS */}
        {/* Smoke Puff Left */}
        <g transform="translate(42, 120) scale(0.6)" className="animate-[puffSmoke_0.5s_ease-out_forwards]">
          <circle cx="20" cy="20" r="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="34" cy="14" r="13" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="24" cy="30" r="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        </g>

        {/* Smoke Puff Right */}
        <g transform="translate(236, 120) scale(0.6)" className="animate-[puffSmoke_0.5s_ease-out_forwards]">
          <circle cx="20" cy="20" r="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="10" cy="14" r="13" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="16" cy="30" r="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        </g>

        {/* Smoke Puff Bottom-Right */}
        <g transform="translate(200, 230) scale(0.5)" className="animate-[puffSmoke_0.5s_ease-out_forwards]">
          <circle cx="20" cy="20" r="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="28" cy="14" r="11" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        </g>
      </svg>

      {/* Embedded Animation Keyframes */}
      <style>{`
        @keyframes starburstFlash {
          0% {
            transform: scale(0.2);
            opacity: 0.2;
          }
          40% {
            transform: scale(1.15);
            opacity: 1;
          }
          75% {
            transform: scale(1.0);
            opacity: 1;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
        @keyframes shockwaveExpand {
          0% {
            transform: scale(0.3);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes flyScrapA {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-45px, -45px) rotate(-35deg); opacity: 0; }
        }
        @keyframes flyScrapB {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50px, 45px) rotate(40deg); opacity: 0; }
        }
        @keyframes flyScrapC {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(50px, -45px) rotate(35deg); opacity: 0; }
        }
        @keyframes flyScrapD {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(55px, 40px) rotate(-30deg); opacity: 0; }
        }
        @keyframes flyScrapE {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(5px, 60px) rotate(20deg); opacity: 0; }
        }
        @keyframes confettiPop1 {
          0% { transform: translate(0, 0) scale(0.4); opacity: 1; }
          100% { transform: translate(-30px, -35px) scale(1); opacity: 0; }
        }
        @keyframes confettiPop2 {
          0% { transform: translate(0, 0) scale(0.4); opacity: 1; }
          100% { transform: translate(35px, 35px) scale(1); opacity: 0; }
        }
        @keyframes confettiPop3 {
          0% { transform: translate(0, 0) scale(0.4); opacity: 1; }
          100% { transform: translate(35px, -35px) scale(1); opacity: 0; }
        }
        @keyframes spinGlint {
          0% { transform: scale(0.2) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.2) rotate(45deg); opacity: 1; }
          100% { transform: scale(0.8) rotate(90deg); opacity: 0; }
        }
        @keyframes puffSmoke {
          0% { transform: scale(0.3); opacity: 0.8; }
          60% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
