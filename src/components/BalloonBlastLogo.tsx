import React from 'react';

interface BalloonBlastLogoProps {
  className?: string;
}

export const BalloonBlastLogo: React.FC<BalloonBlastLogoProps> = ({ className = '' }) => {
  return (
    <div
      data-testid="balloon-blast-code-logo"
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{
        width: 'clamp(240px, 46vw, 480px)',
        aspectRatio: '620 / 310',
      }}
    >
      <svg
        viewBox="0 0 620 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_14px_28px_rgba(0,0,0,0.28)]"
      >
        <defs>
          {/* BALLOON Gradients */}
          <linearGradient id="logoBalloonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF385C" />
            <stop offset="28%" stopColor="#FF6B00" />
            <stop offset="68%" stopColor="#FFAA00" />
            <stop offset="100%" stopColor="#FFD600" />
          </linearGradient>

          <linearGradient id="logoBalloonShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8A0921" />
            <stop offset="100%" stopColor="#4A0010" />
          </linearGradient>

          <linearGradient id="logoBalloonRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="100%" stopColor="#FF9900" />
          </linearGradient>

          {/* BLAST Gradients */}
          <linearGradient id="logoBlastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="25%" stopColor="#00A2FF" />
            <stop offset="70%" stopColor="#4834DF" />
            <stop offset="100%" stopColor="#9B51E0" />
          </linearGradient>

          <linearGradient id="logoBlastShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#190A50" />
            <stop offset="100%" stopColor="#0C0328" />
          </linearGradient>

          <linearGradient id="logoBlastRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C4F7FF" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>

          {/* Mini Balloon Gradients */}
          <radialGradient id="miniRed" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FF9FB2" />
            <stop offset="35%" stopColor="#FF2E55" />
            <stop offset="100%" stopColor="#990022" />
          </radialGradient>

          <radialGradient id="miniBlue" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#99E6FF" />
            <stop offset="35%" stopColor="#00A8FF" />
            <stop offset="100%" stopColor="#004899" />
          </radialGradient>

          <radialGradient id="miniYellow" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFCC" />
            <stop offset="35%" stopColor="#FFD000" />
            <stop offset="100%" stopColor="#CC7A00" />
          </radialGradient>

          <radialGradient id="miniGreen" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#A8FFB2" />
            <stop offset="35%" stopColor="#10AC84" />
            <stop offset="100%" stopColor="#08523F" />
          </radialGradient>

          <radialGradient id="miniLime" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#E2FF75" />
            <stop offset="40%" stopColor="#88D600" />
            <stop offset="100%" stopColor="#3F7000" />
          </radialGradient>

          {/* Golden Sparkle Glow */}
          <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FFE066" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
          </radialGradient>

          {/* Drop Shadows */}
          <filter id="logoStickerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ========================================================
            1. ACCENT MINI BALLOONS (FLANKING SIDES)
           ======================================================== */}
        {/* Left-Side Mini Balloons */}
        <g id="leftBalloons" className="animate-[wiggle_4s_ease-in-out_infinite] origin-[170px_100px]">
          {/* Top Red Balloon */}
          <ellipse cx="172" cy="72" rx="25" ry="32" fill="url(#miniRed)" stroke="#550011" strokeWidth="4" />
          <ellipse cx="164" cy="58" rx="7" ry="12" fill="#FFFFFF" opacity="0.85" transform="rotate(-18 164 58)" />
          <circle cx="161" cy="74" r="3" fill="#FFFFFF" opacity="0.9" />
          <polygon points="168,103 176,103 172,110" fill="#990022" stroke="#550011" strokeWidth="3" />
          <path d="M 172,110 Q 165,125 178,138 T 170,154" fill="none" stroke="#FF4D6D" strokeWidth="3" strokeLinecap="round" />

          {/* Cyan/Blue Balloon */}
          <ellipse cx="132" cy="162" rx="20" ry="26" fill="url(#miniBlue)" stroke="#002D66" strokeWidth="3.5" />
          <ellipse cx="126" cy="151" rx="5" ry="9" fill="#FFFFFF" opacity="0.85" transform="rotate(-18 126 151)" />
          <polygon points="128,187 136,187 132,193" fill="#004899" stroke="#002D66" strokeWidth="2.5" />

          {/* Yellow Balloon Behind Left */}
          <ellipse cx="158" cy="208" rx="21" ry="27" fill="url(#miniYellow)" stroke="#804D00" strokeWidth="3.5" />
          <ellipse cx="152" cy="197" rx="5.5" ry="9" fill="#FFFFFF" opacity="0.85" transform="rotate(-15 152 197)" />
          <polygon points="154,234 162,234 158,240" fill="#CC7A00" stroke="#804D00" strokeWidth="2.5" />
        </g>

        {/* Right-Side Mini Balloons */}
        <g id="rightBalloons" className="animate-[wiggle_4.5s_ease-in-out_infinite_reverse] origin-[450px_100px]">
          {/* Top Green Balloon */}
          <ellipse cx="462" cy="78" rx="24" ry="31" fill="url(#miniGreen)" stroke="#053326" strokeWidth="4" />
          <ellipse cx="454" cy="65" rx="6.5" ry="11" fill="#FFFFFF" opacity="0.85" transform="rotate(-15 454 65)" />
          <polygon points="458,108 466,108 462,115" fill="#08523F" stroke="#053326" strokeWidth="3" />
          <path d="M 462,115 Q 470,128 458,142 T 465,158" fill="none" stroke="#2ED573" strokeWidth="3" strokeLinecap="round" />

          {/* Top-Right Yellow Balloon */}
          <ellipse cx="422" cy="85" rx="20" ry="25" fill="url(#miniYellow)" stroke="#804D00" strokeWidth="3.5" />
          <ellipse cx="416" cy="74" rx="5" ry="8.5" fill="#FFFFFF" opacity="0.85" transform="rotate(-18 416 74)" />

          {/* Lime Green Balloon */}
          <ellipse cx="505" cy="120" rx="19" ry="25" fill="url(#miniLime)" stroke="#274A00" strokeWidth="3.5" />
          <ellipse cx="499" cy="109" rx="5" ry="8" fill="#FFFFFF" opacity="0.85" transform="rotate(-15 499 109)" />
        </g>

        {/* ========================================================
            2. OUTER STICKER BORDER (THICK CHUNKY MULTI-COLOR RIM)
           ======================================================== */}
        {/* Layer A: Deep navy/black drop chassis shadow */}
        <g filter="url(#logoStickerShadow)">
          <path
            d="M 125,120 C 120,70 170,45 220,45 L 410,42 C 480,42 510,75 510,120 C 515,160 480,205 450,215 L 435,260 C 420,290 350,290 310,285 C 270,290 190,285 180,250 L 165,225 C 130,210 115,165 125,120 Z"
            fill="#0B132B"
          />
        </g>

        {/* Layer B: Crisp white/cream sticker edge */}
        <path
          d="M 130,118 C 126,75 173,50 220,50 L 405,47 C 475,47 504,78 504,118 C 509,155 476,198 446,208 L 432,252 C 418,280 352,282 310,277 C 272,282 196,277 186,244 L 172,220 C 138,206 122,160 130,118 Z"
          fill="#FFFFFF"
          stroke="#F8FAFC"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Layer C: Vibrant Magenta/Cyan Accent Rim */}
        <path
          d="M 136,118 C 132,80 176,56 220,56 L 400,53 C 468,53 496,82 496,118 C 500,152 470,192 440,202 L 426,246 C 412,272 352,274 310,270 C 274,274 204,270 192,238 L 178,214 C 146,200 130,158 136,118 Z"
          fill="#1E293B"
          stroke="#6366F1"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* ========================================================
            3. ROW 1: "BALLOON" (FIERY RED-ORANGE-GOLD GRADIENT)
           ======================================================== */}
        <g id="rowBalloon" transform="translate(10, -5)">
          {/* 3D Extrusion Shadow Layer */}
          <text
            x="300"
            y="136"
            textAnchor="middle"
            fill="url(#logoBalloonShadow)"
            stroke="url(#logoBalloonShadow)"
            strokeWidth="16"
            strokeLinejoin="round"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="78"
            letterSpacing="3.5"
          >
            BALLOON
          </text>

          {/* Crisp Black Inner Outline */}
          <text
            x="300"
            y="126"
            textAnchor="middle"
            fill="none"
            stroke="#3B050B"
            strokeWidth="12"
            strokeLinejoin="round"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="78"
            letterSpacing="3.5"
          >
            BALLOON
          </text>

          {/* Golden Yellow Outer Rim */}
          <text
            x="300"
            y="126"
            textAnchor="middle"
            fill="none"
            stroke="url(#logoBalloonRim)"
            strokeWidth="5"
            strokeLinejoin="round"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="78"
            letterSpacing="3.5"
          >
            BALLOON
          </text>

          {/* Vibrant Core Gradient Lettering */}
          <text
            x="300"
            y="126"
            textAnchor="middle"
            fill="url(#logoBalloonGrad)"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="78"
            letterSpacing="3.5"
          >
            BALLOON
          </text>

          {/* Glossy White Curved Specular Highlights */}
          {/* B */}
          <path d="M 148,82 C 153,74 163,73 171,76 C 170,85 158,89 148,82 Z" fill="#FFFFFF" opacity="0.9" />
          {/* A */}
          <path d="M 194,84 C 197,76 205,74 213,76 C 210,84 201,88 194,84 Z" fill="#FFFFFF" opacity="0.9" />
          {/* L */}
          <path d="M 238,80 C 242,73 248,73 252,78 C 248,88 242,88 238,80 Z" fill="#FFFFFF" opacity="0.9" />
          {/* L */}
          <path d="M 276,80 C 280,73 286,73 290,78 C 286,88 280,88 276,80 Z" fill="#FFFFFF" opacity="0.9" />
          {/* O */}
          <path d="M 314,83 C 322,74 336,75 342,82 C 334,88 322,88 314,83 Z" fill="#FFFFFF" opacity="0.9" />
          {/* O */}
          <path d="M 374,83 C 382,74 396,75 402,82 C 394,88 382,88 374,83 Z" fill="#FFFFFF" opacity="0.9" />
          {/* N */}
          <path d="M 432,80 C 436,73 444,74 448,79 C 444,88 436,88 432,80 Z" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* ========================================================
            4. ROW 2: "BLAST" (ELECTRIC CYAN-BLUE-VIOLET GRADIENT)
           ======================================================== */}
        <g id="rowBlast" transform="translate(10, 5)">
          {/* 3D Extrusion Shadow Layer */}
          <text
            x="300"
            y="238"
            textAnchor="middle"
            fill="url(#logoBlastShadow)"
            stroke="url(#logoBlastShadow)"
            strokeWidth="16"
            strokeLinejoin="round"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="5"
          >
            BLAST
          </text>

          {/* Crisp Navy Inner Outline */}
          <text
            x="300"
            y="226"
            textAnchor="middle"
            fill="none"
            stroke="#0A0222"
            strokeWidth="12"
            strokeLinejoin="round"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="5"
          >
            BLAST
          </text>

          {/* Cyan/Lavender Highlight Outer Rim */}
          <text
            x="300"
            y="226"
            textAnchor="middle"
            fill="none"
            stroke="url(#logoBlastRim)"
            strokeWidth="5"
            strokeLinejoin="round"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="5"
          >
            BLAST
          </text>

          {/* Core Electric Blue/Purple Gradient */}
          <text
            x="300"
            y="226"
            textAnchor="middle"
            fill="url(#logoBlastGrad)"
            fontFamily="'Fredoka', 'Lilita One', 'Impact', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="5"
          >
            BLAST
          </text>

          {/* Glossy Specular Arcs for BLAST */}
          {/* B */}
          <path d="M 188,178 C 195,168 206,168 214,172 C 210,183 198,186 188,178 Z" fill="#FFFFFF" opacity="0.95" />
          {/* L */}
          <path d="M 242,176 C 248,168 256,168 260,174 C 255,185 246,185 242,176 Z" fill="#FFFFFF" opacity="0.95" />
          {/* A */}
          <path d="M 288,180 C 294,170 306,168 314,172 C 310,183 298,185 288,180 Z" fill="#FFFFFF" opacity="0.95" />
          {/* S */}
          <path d="M 346,176 C 354,168 366,170 372,176 C 364,183 352,183 346,176 Z" fill="#FFFFFF" opacity="0.95" />
          {/* T */}
          <path d="M 398,172 C 404,166 418,166 424,172 C 416,180 404,180 398,172 Z" fill="#FFFFFF" opacity="0.95" />
        </g>

        {/* ========================================================
            5. GOLDEN LENS FLARES & 4-POINT SPARKLES
           ======================================================== */}
        {/* Flare 1: Left on 'B' of BALLOON */}
        <g transform="translate(142, 65) scale(0.75)" className="animate-pulse">
          <circle cx="0" cy="0" r="16" fill="url(#sparkleGlow)" />
          <path d="M 0,-24 Q 0,-2 22,0 Q 0,2 0,24 Q 0,2 -22,0 Q 0,-2 0,-24 Z" fill="#FFFFFF" />
          <path d="M 0,-16 Q 0,-2 14,0 Q 0,2 0,16 Q 0,2 -14,0 Q 0,-2 0,-16 Z" fill="#FFE57F" />
        </g>

        {/* Flare 2: Center junction between BALLOON & BLAST */}
        <g transform="translate(365, 148) scale(0.9)" className="animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]">
          <circle cx="0" cy="0" r="18" fill="url(#sparkleGlow)" />
          <path d="M 0,-28 Q 0,-3 26,0 Q 0,3 0,28 Q 0,3 -26,0 Q 0,-3 0,-28 Z" fill="#FFFFFF" />
        </g>

        {/* Flare 3: Right top on 'T' of BLAST */}
        <g transform="translate(446, 172) scale(0.8)" className="animate-pulse">
          <circle cx="0" cy="0" r="18" fill="url(#sparkleGlow)" />
          <path d="M 0,-24 Q 0,-2 22,0 Q 0,2 0,24 Q 0,2 -22,0 Q 0,-2 0,-24 Z" fill="#FFFFFF" />
        </g>

        {/* Sparkle 4: Bottom left of BLAST */}
        <g transform="translate(196, 240) scale(0.65)" className="animate-pulse">
          <circle cx="0" cy="0" r="14" fill="url(#sparkleGlow)" />
          <path d="M 0,-18 Q 0,-2 18,0 Q 0,2 0,18 Q 0,2 -18,0 Q 0,-2 0,-18 Z" fill="#FFFFFF" />
        </g>

        {/* Tiny Star Sparks */}
        <circle cx="120" cy="98" r="2.5" fill="#FFEAA7" className="animate-ping" style={{ animationDuration: '2s' }} />
        <circle cx="490" cy="175" r="3" fill="#FFEAA7" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        <circle cx="440" cy="245" r="2" fill="#FFEAA7" />
        <circle cx="160" cy="248" r="2.5" fill="#FFEAA7" />
      </svg>
    </div>
  );
};
