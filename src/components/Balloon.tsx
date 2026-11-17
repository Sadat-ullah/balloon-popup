import React, { useState } from 'react';
import { BalloonPopEffect } from './BalloonPopEffect';
import { triggerHaptic } from '../utils/haptics';

export interface BalloonProps {
  id: string | number;
  value: number;
  colorIndex: number;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  floatDelay: number;
  floatDuration: number;
  isPopped: boolean;
  isDisabled: boolean;
  isCorrect?: boolean;
  onPop: (value: number) => void;
}

export const BALLOON_PALETTES = [
  // 1. Red (Image 2 Parity)
  {
    name: 'red',
    main: '#FF204E',
    dark: '#8A001A',
    light: '#FFA3B5',
    stroke: '#570010',
    rim: '#FF4D6D',
    string: '#E60033',
    stringStroke: '#8A001A',
    splash: 'rgba(255, 32, 78, 0.45)',
  },
  // 2. Blue (Image 2 Parity)
  {
    name: 'blue',
    main: '#00A3FF',
    dark: '#00408A',
    light: '#99DEFF',
    stroke: '#002957',
    rim: '#33B5FF',
    string: '#0073E6',
    stringStroke: '#003B7A',
    splash: 'rgba(0, 163, 255, 0.45)',
  },
  // 3. Green (Image 2 Parity)
  {
    name: 'green',
    main: '#10B981',
    dark: '#065F46',
    light: '#A7F3D0',
    stroke: '#023D2C',
    rim: '#34D399',
    string: '#059669',
    stringStroke: '#024230',
    splash: 'rgba(16, 185, 129, 0.45)',
  },
  // 4. Yellow (Image 2 Parity)
  {
    name: 'yellow',
    main: '#FFC700',
    dark: '#B37D00',
    light: '#FFF5B8',
    stroke: '#735000',
    rim: '#FFD633',
    string: '#E6A100',
    stringStroke: '#805900',
    splash: 'rgba(255, 199, 0, 0.45)',
  },
  // 5. Purple (Image 2 Parity)
  {
    name: 'purple',
    main: '#A855F7',
    dark: '#5B189A',
    light: '#E9D5FF',
    stroke: '#3C096C',
    rim: '#C084FC',
    string: '#9333EA',
    stringStroke: '#4A0E78',
    splash: 'rgba(168, 85, 247, 0.45)',
  },
  // 6. Orange (Image 2 Parity)
  {
    name: 'orange',
    main: '#FF6B00',
    dark: '#A33B00',
    light: '#FFC499',
    stroke: '#6B2700',
    rim: '#FF8833',
    string: '#EA580C',
    stringStroke: '#7C2D12',
    splash: 'rgba(255, 107, 0, 0.45)',
  },
];

export const Balloon: React.FC<BalloonProps> = ({
  value,
  colorIndex,
  xPercent,
  yPercent,
  floatDelay,
  floatDuration,
  isPopped,
  isDisabled,
  isCorrect = false,
  onPop,
}) => {
  const [isRippling, setIsRippling] = useState(false);
  const palette = BALLOON_PALETTES[colorIndex % BALLOON_PALETTES.length];

  const handleTriggerPop = () => {
    if (isPopped || isDisabled) return;

    triggerHaptic(30);
    // Dramatic surface tension ripple & swelling before burst
    setIsRippling(true);
    setTimeout(() => {
      setIsRippling(false);
      onPop(value);
    }, 130);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    handleTriggerPop();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleTriggerPop();
  };

  // If popped: render comic starburst pop VFX (Image 3) on correct answer, or quiet deflation on wrong
  if (isPopped) {
    if (!isCorrect) {
      return (
        <div
          data-balloon-popped={value}
          className="absolute pointer-events-none z-20"
          style={{
            left: `${xPercent}%`,
            top: `${yPercent}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    }

    return (
      <div
        data-balloon-popped={value}
        className="absolute pointer-events-none z-20"
        style={{
          left: `${xPercent}%`,
          top: `${yPercent}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Retain data-splash-vfx attribute for backward test compatibility */}
        <div data-splash-vfx="true" className="sr-only" />

        {/* Image 3: Comic-Book Starburst Pop Explosion VFX */}
        <BalloonPopEffect
          color={palette.main}
          accentColor={palette.light}
          size={290}
        />

        {/* Fix 5: Bold 3D Green Checkmark (✓) Popup on Correct Answer */}
        <div
          data-testid="correct-tick-badge"
          className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 animate-[springPop_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-green-500 to-emerald-400 border-4 border-white shadow-[0_0_30px_rgba(16,185,129,0.9)] flex items-center justify-center transform active:scale-95">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[4] drop-shadow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-balloon-value={value}
      className="absolute cursor-pointer touch-none z-10 transition-transform select-none"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: `translate(-50%, -50%) ${
          isRippling ? 'scale(1.24, 0.82)' : 'scale(1)'
        }`,
        animation: `waterBalloonWobble ${floatDuration}s ease-in-out infinite`,
        animationDelay: `${floatDelay}s`,
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* Balloon SVG body matching Image 2 (Glossy 3D Outlined Balloon with Curly String) */}
      <div className="w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44 relative group filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.22)]">
        <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
          <defs>
            {/* Rich Radial Gradient matching Image 2 */}
            <radialGradient id={`glossGrad-${colorIndex}`} cx="36%" cy="32%" r="66%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="18%" stopColor={palette.light} />
              <stop offset="55%" stopColor={palette.main} />
              <stop offset="85%" stopColor={palette.dark} />
              <stop offset="100%" stopColor={palette.stroke} />
            </radialGradient>

            {/* Bottom curvature ambient rim shadow */}
            <linearGradient id={`rimShadow-${colorIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor={palette.dark} stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* ========================================================
              1. CURLY SPIRAL RIBBON STRING (Image 2 Parity)
             ======================================================== */}
          {/* String Dark Outline */}
          <path
            d="M 50,96 C 40,105 36,118 48,124 C 62,131 58,144 46,150 C 34,156 36,168 48,174 C 58,179 54,188 46,192"
            fill="none"
            stroke={palette.stringStroke}
            strokeWidth="4.5"
            strokeLinecap="round"
            className="origin-top animate-[stringSway_3s_ease-in-out_infinite]"
          />
          {/* String Bright Core Fill */}
          <path
            d="M 50,96 C 40,105 36,118 48,124 C 62,131 58,144 46,150 C 34,156 36,168 48,174 C 58,179 54,188 46,192"
            fill="none"
            stroke={palette.string}
            strokeWidth="2.8"
            strokeLinecap="round"
            className="origin-top animate-[stringSway_3s_ease-in-out_infinite]"
          />

          {/* ========================================================
              2. TIED KNOT AT BASE (Image 2 Parity)
             ======================================================== */}
          {/* Knot Shadow */}
          <polygon
            points="43,90 57,90 51,99"
            fill={palette.stringStroke}
          />
          {/* Knot Core */}
          <polygon
            points="45,90 55,90 50,98"
            fill={palette.dark}
            stroke={palette.stroke}
            strokeWidth="1.5"
          />

          {/* ========================================================
              3. OVAL BALLOON BODY WITH COLORED STICKER OUTLINE (Image 2)
             ======================================================== */}
          {/* Outer Sticker Stroke Layer */}
          <ellipse
            cx="50"
            cy="48"
            rx="42"
            ry="47"
            fill="none"
            stroke={palette.rim}
            strokeWidth="5"
          />

          {/* Inner Dark Contour Outline */}
          <ellipse
            cx="50"
            cy="48"
            rx="41"
            ry="46"
            fill={`url(#glossGrad-${colorIndex})`}
            stroke={palette.stroke}
            strokeWidth="3.2"
          />

          {/* Bottom Depth Shadow */}
          <ellipse
            cx="50"
            cy="48"
            rx="40"
            ry="45"
            fill={`url(#rimShadow-${colorIndex})`}
          />

          {/* ========================================================
              4. SPECULAR HIGHLIGHTS (Image 2 Specular Crescents)
             ======================================================== */}
          {/* Main Upper-Left Curved White Crescent Highlight */}
          <path
            d="M 23,26 C 26,16 38,13 51,13 C 40,16 30,24 26,36 Z"
            fill="#FFFFFF"
            opacity="0.88"
          />

          {/* Secondary Round Specular Sparkle Dot */}
          <ellipse
            cx="31"
            cy="27"
            rx="4"
            ry="7"
            fill="#FFFFFF"
            opacity="0.95"
            transform="rotate(-20 31 27)"
          />

          {/* Lower Rim Translucent Bounce Light */}
          <path
            d="M 32,84 C 44,90 56,90 68,84"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* ========================================================
              5. MATH ANSWER NUMBER (High Readability)
             ======================================================== */}
          <text
            x="50"
            y="56"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            paintOrder="stroke fill"
            fontSize="34"
            fontWeight="900"
            fontFamily="'Fredoka', 'Lilita One', cursive, sans-serif"
            style={{
              filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.65))',
            }}
          >
            {value}
          </text>
        </svg>
      </div>

      {/* Balloon Animation Styles */}
      <style>{`
        @keyframes waterBalloonWobble {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1, 1) rotate(-1.5deg);
          }
          25% {
            transform: translate(-50%, -50%) translateY(-9px) scale(1.04, 0.96) rotate(1deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-18px) scale(0.96, 1.04) rotate(-1deg);
          }
          75% {
            transform: translate(-50%, -50%) translateY(-9px) scale(1.03, 0.97) rotate(2deg);
          }
        }
        @keyframes stringSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes springPop {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.25);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
