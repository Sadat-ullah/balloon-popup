import React from 'react';

export interface BalloonPopEffectProps {
  color?: string; // Balloon theme color
  accentColor?: string;
  size?: number; // Base pixel size
  className?: string;
}

export const BalloonPopEffect: React.FC<BalloonPopEffectProps> = ({
  color = '#FF204E',
  accentColor = '#FFA3B5',
  size = 290,
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
        perspective: '900px',
      }}
    >
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        style={{ willChange: 'transform, opacity' }}
      >
        <defs>
          {/* 3D Pressure Sphere Spherical Gradient */}
          <radialGradient id="sphereShockwaveGrad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#FFF275" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#FF9F1A" stopOpacity="0.45" />
            <stop offset="92%" stopColor="#FF3838" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* 3D Rubber Shard Outer Lit Gradient */}
          <linearGradient id="rubberOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="25%" stopColor={accentColor} />
            <stop offset="65%" stopColor={color} />
            <stop offset="100%" stopColor="#4A0010" />
          </linearGradient>

          {/* 3D Rubber Shard Inner Matte Shadow Gradient */}
          <linearGradient id="rubberInnerGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2A0008" />
            <stop offset="60%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.5" />
          </linearGradient>

          {/* Core Energy Flare */}
          <radialGradient id="blast3DCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FFF9C4" />
            <stop offset="65%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF6D00" />
          </radialGradient>

          {/* Volumetric Smoke Air Puff Gradient */}
          <radialGradient id="airPuffGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#E2E8F0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0" />
          </radialGradient>

          {/* 3D Droplet Spherical Bead */}
          <radialGradient id="dropletBead" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor={accentColor} />
            <stop offset="85%" stopColor={color} />
            <stop offset="100%" stopColor="#4A0010" />
          </radialGradient>
        </defs>

        {/* ========================================================
            1. 3D ELASTIC MEMBRANE SNAP & EXPANDING PRESSURE SPHERE
           ======================================================== */}
        <g className="animate-[sphereRupture_0.58s_cubic-bezier(0.1,0.9,0.2,1)_forwards] origin-center">
          {/* Spherical Shockwave Bubble */}
          <circle cx="160" cy="160" r="85" fill="url(#sphereShockwaveGrad)" />
          {/* Specular Rim Rings */}
          <circle cx="160" cy="160" r="105" stroke="#FFF7A1" strokeWidth="3" opacity="0.85" strokeDasharray="24 12" />
          <circle cx="160" cy="160" r="128" stroke="#FFA726" strokeWidth="2" opacity="0.5" />
        </g>

        {/* ========================================================
            2. CENTRAL JAGGED STARBURST CORE (Image 3 Comic Flare)
           ======================================================== */}
        <g className="animate-[starburst3D_0.55s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] origin-center">
          {/* Outer Multi-Spike Starburst */}
          <polygon
            points="
              160,25 174,102 225,50 196,120 270,82 216,140 295,130 226,165
              290,202 216,198 265,250 195,225 218,290 170,240 160,300 148,240
              102,290 122,225 55,250 102,198 25,202 94,165 25,130 104,140
              50,82 124,120 95,50 146,102
            "
            fill="#FF7700"
            stroke="#D32F2F"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Bright Core */}
          <polygon
            points="
              160,48 170,112 212,68 190,128 248,98 206,144 268,136 214,164
              264,194 206,190 244,232 190,212 206,264 168,225 160,274 150,225
              114,264 128,212 76,232 112,190 56,194 106,164 52,136 114,144
              72,98 130,128 108,68 148,112
            "
            fill="url(#blast3DCore)"
            stroke="#FFF9C4"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Central Flash Highlight */}
          <circle cx="160" cy="160" r="38" fill="#FFFFFF" opacity="0.95" />
          <circle cx="160" cy="160" r="22" fill="#FFFDE7" />
        </g>

        {/* ========================================================
            3. 3D CURLING RUBBER SHARDS (Tumbling in 3D Perspective)
           ======================================================== */}
        {/* Shard 1: Top-Left Large Curved Membrane */}
        <g className="animate-[tumbleShard1_0.6s_ease-out_forwards] origin-center">
          {/* Inner Rolled Edge */}
          <path
            d="M 125,105 Q 100,70 72,80 Q 88,98 80,112 Q 102,118 125,105 Z"
            fill="url(#rubberInnerGrad)"
            stroke="#3B000C"
            strokeWidth="2"
          />
          {/* Outer Surface with Specular Curl */}
          <path
            d="M 122,102 Q 102,72 76,82"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>

        {/* Shard 2: Bottom-Left Torn Knot Piece with Curling String */}
        <g className="animate-[tumbleShard2_0.62s_ease-out_forwards] origin-center">
          {/* Torn Scalloped Rubber Body */}
          <path
            d="M 98,205 Q 70,232 56,220 Q 70,202 85,195 Z"
            fill="url(#rubberOuterGrad)"
            stroke="#3B000C"
            strokeWidth="2"
          />
          {/* Tied Knot Remnant */}
          <polygon points="54,220 62,226 56,234" fill="#88001B" stroke="#3B000C" strokeWidth="1.5" />
          {/* Curling String Snippet */}
          <path d="M 56,234 Q 42,248 48,260" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Shard 3: Top-Right Curling Fragment */}
        <g className="animate-[tumbleShard3_0.58s_ease-out_forwards] origin-center">
          <path
            d="M 205,110 Q 238,82 254,96 Q 236,112 245,128 Q 220,124 205,110 Z"
            fill="url(#rubberOuterGrad)"
            stroke="#002D66"
            strokeWidth="2"
          />
          {/* Specular Ridge */}
          <path d="M 208,108 Q 236,86 250,98" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
        </g>

        {/* Shard 4: Bottom-Right Flapping Shred */}
        <g className="animate-[tumbleShard4_0.6s_ease-out_forwards] origin-center">
          <path
            d="M 205,210 Q 238,228 252,214 Q 238,200 242,185 Z"
            fill="url(#rubberOuterGrad)"
            stroke="#145A32"
            strokeWidth="2"
          />
        </g>

        {/* Shard 5: Bottom Center Curled Scrap */}
        <g className="animate-[tumbleShard5_0.58s_ease-out_forwards] origin-center">
          <path
            d="M 152,220 Q 164,256 178,250 Q 170,236 166,220 Z"
            fill="url(#rubberInnerGrad)"
            stroke="#7E5109"
            strokeWidth="2"
          />
        </g>

        {/* ========================================================
            4. 3D VOLUMETRIC AIR PUFFS & GLOSSY DROPLETS/SPARKLES
           ======================================================== */}
        {/* Shaded 3D Smoke Puff Left */}
        <g transform="translate(48, 126)" className="animate-[puffSmoke3D_0.52s_ease-out_forwards]">
          <circle cx="20" cy="20" r="18" fill="url(#airPuffGrad)" />
          <circle cx="34" cy="14" r="14" fill="url(#airPuffGrad)" />
          <circle cx="24" cy="32" r="13" fill="url(#airPuffGrad)" />
        </g>

        {/* Shaded 3D Smoke Puff Right */}
        <g transform="translate(244, 126)" className="animate-[puffSmoke3D_0.52s_ease-out_forwards]">
          <circle cx="20" cy="20" r="18" fill="url(#airPuffGrad)" />
          <circle cx="8" cy="14" r="14" fill="url(#airPuffGrad)" />
          <circle cx="16" cy="32" r="13" fill="url(#airPuffGrad)" />
        </g>

        {/* 3D Glossy Liquid Beads (Radial Depth Scale) */}
        <circle cx="88" cy="65" r="7.5" fill="url(#dropletBead)" className="animate-[dropletBurst1_0.55s_ease-out_forwards]" />
        <circle cx="245" cy="72" r="8" fill="url(#dropletBead)" className="animate-[dropletBurst2_0.55s_ease-out_forwards]" />
        <circle cx="255" cy="235" r="7" fill="url(#dropletBead)" className="animate-[dropletBurst3_0.55s_ease-out_forwards]" />
        <circle cx="75" cy="235" r="8.5" fill="url(#dropletBead)" className="animate-[dropletBurst4_0.55s_ease-out_forwards]" />

        {/* Multi-Colored Geometric Confetti */}
        <polygon points="80,60 88,68 80,76 72,68" fill="#00D2D3" className="animate-[confetti3D1_0.52s_ease-out_forwards]" />
        <polygon points="240,240 248,248 240,256 232,248" fill="#54A0FF" className="animate-[confetti3D2_0.52s_ease-out_forwards]" />
        <rect x="245" y="150" width="11" height="8" rx="2" fill="#FFA502" transform="rotate(28 250 154)" className="animate-[confetti3D3_0.52s_ease-out_forwards]" />
        <rect x="56" y="150" width="11" height="8" rx="2" fill="#9B59B6" transform="rotate(-32 61 154)" className="animate-[confetti3D1_0.52s_ease-out_forwards]" />

        {/* 4-Point Golden Lens-Flare Stars */}
        <g transform="translate(240, 58) scale(0.9)" className="animate-[starGlint3D_0.58s_ease-out_forwards]">
          <path d="M 0,-20 Q 0,-2 20,0 Q 0,2 0,20 Q 0,2 -20,0 Q 0,-2 0,-20 Z" fill="#FFD700" stroke="#FF9800" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
        </g>

        <g transform="translate(76, 80) scale(0.8)" className="animate-[starGlint3D_0.58s_ease-out_forwards]">
          <path d="M 0,-18 Q 0,-2 18,0 Q 0,2 0,18 Q 0,2 -18,0 Q 0,-2 0,-18 Z" fill="#FFD700" stroke="#FF9800" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
        </g>

        <g transform="translate(258, 195) scale(0.85)" className="animate-[starGlint3D_0.58s_ease-out_forwards]">
          <path d="M 0,-18 Q 0,-2 18,0 Q 0,2 0,18 Q 0,2 -18,0 Q 0,-2 0,-18 Z" fill="#FFD700" stroke="#FF9800" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Hardware-Accelerated 3D Keyframe Animations */}
      <style>{`
        @keyframes sphereRupture {
          0% {
            transform: scale3d(0.2, 0.2, 0.2);
            opacity: 0.95;
          }
          40% {
            transform: scale3d(1.15, 1.15, 1.15);
            opacity: 0.8;
          }
          100% {
            transform: scale3d(1.5, 1.5, 1.5);
            opacity: 0;
          }
        }
        @keyframes starburst3D {
          0% {
            transform: scale3d(0.2, 0.2, 0.2);
            opacity: 0.2;
          }
          35% {
            transform: scale3d(1.18, 1.18, 1.18);
            opacity: 1;
          }
          70% {
            transform: scale3d(1.0, 1.0, 1.0);
            opacity: 0.9;
          }
          100% {
            transform: scale3d(0.92, 0.92, 0.92);
            opacity: 0;
          }
        }
        @keyframes tumbleShard1 {
          0% { transform: translate3d(0, 0, 0) rotate3d(1, 1, 0, 0deg) scale(1); opacity: 1; }
          100% { transform: translate3d(-55px, -52px, 80px) rotate3d(1, 1, 1, -120deg) scale(0.65); opacity: 0; }
        }
        @keyframes tumbleShard2 {
          0% { transform: translate3d(0, 0, 0) rotate3d(0, 1, 1, 0deg) scale(1); opacity: 1; }
          100% { transform: translate3d(-58px, 55px, 60px) rotate3d(1, 0, 1, 130deg) scale(0.6); opacity: 0; }
        }
        @keyframes tumbleShard3 {
          0% { transform: translate3d(0, 0, 0) rotate3d(1, 0, 1, 0deg) scale(1); opacity: 1; }
          100% { transform: translate3d(58px, -52px, 90px) rotate3d(0, 1, 1, 125deg) scale(0.7); opacity: 0; }
        }
        @keyframes tumbleShard4 {
          0% { transform: translate3d(0, 0, 0) rotate3d(1, 1, 0, 0deg) scale(1); opacity: 1; }
          100% { transform: translate3d(62px, 50px, 70px) rotate3d(1, 1, 0, -115deg) scale(0.65); opacity: 0; }
        }
        @keyframes tumbleShard5 {
          0% { transform: translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg) scale(1); opacity: 1; }
          100% { transform: translate3d(8px, 68px, 50px) rotate3d(1, 0, 0, 95deg) scale(0.6); opacity: 0; }
        }
        @keyframes puffSmoke3D {
          0% { transform: scale3d(0.3, 0.3, 0.3); opacity: 0.9; }
          60% { transform: scale3d(1.15, 1.15, 1.15); opacity: 0.7; }
          100% { transform: scale3d(1.4, 1.4, 1.4); opacity: 0; }
        }
        @keyframes dropletBurst1 {
          0% { transform: translate3d(0, 0, 0) scale(0.3); opacity: 1; }
          100% { transform: translate3d(-40px, -35px, 40px) scale(1); opacity: 0; }
        }
        @keyframes dropletBurst2 {
          0% { transform: translate3d(0, 0, 0) scale(0.3); opacity: 1; }
          100% { transform: translate3d(40px, -35px, 40px) scale(1); opacity: 0; }
        }
        @keyframes dropletBurst3 {
          0% { transform: translate3d(0, 0, 0) scale(0.3); opacity: 1; }
          100% { transform: translate3d(40px, 35px, 40px) scale(1); opacity: 0; }
        }
        @keyframes dropletBurst4 {
          0% { transform: translate3d(0, 0, 0) scale(0.3); opacity: 1; }
          100% { transform: translate3d(-40px, 35px, 40px) scale(1); opacity: 0; }
        }
        @keyframes confetti3D1 {
          0% { transform: translate3d(0, 0, 0) scale(0.4); opacity: 1; }
          100% { transform: translate3d(-35px, -40px, 50px) rotate(180deg) scale(1); opacity: 0; }
        }
        @keyframes confetti3D2 {
          0% { transform: translate3d(0, 0, 0) scale(0.4); opacity: 1; }
          100% { transform: translate3d(40px, 40px, 50px) rotate(-160deg) scale(1); opacity: 0; }
        }
        @keyframes confetti3D3 {
          0% { transform: translate3d(0, 0, 0) scale(0.4); opacity: 1; }
          100% { transform: translate3d(42px, -38px, 50px) rotate(140deg) scale(1); opacity: 0; }
        }
        @keyframes starGlint3D {
          0% { transform: scale(0.2) rotate(0deg); opacity: 0; }
          35% { transform: scale(1.25) rotate(45deg); opacity: 1; }
          100% { transform: scale(0.85) rotate(90deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
