import React, { useState } from 'react';

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

const BALLOON_PALETTES = [
  { main: '#FF3366', dark: '#C9184A', light: '#FF758F', knot: '#A4133C', text: '#FFFFFF', splash: 'rgba(255, 51, 102, 0.45)' }, // Red
  { main: '#00B4D8', dark: '#0077B6', light: '#90E0EF', knot: '#03045E', text: '#FFFFFF', splash: 'rgba(0, 180, 216, 0.45)' }, // Blue
  { main: '#06D6A0', dark: '#049669', light: '#6EE7B7', knot: '#065F46', text: '#022C22', splash: 'rgba(6, 214, 160, 0.45)' }, // Green
  { main: '#FFD166', dark: '#F59E0B', light: '#FEF08A', knot: '#D97706', text: '#78350F', splash: 'rgba(255, 209, 102, 0.45)' }, // Yellow
  { main: '#9D4EDD', dark: '#7B2CBF', light: '#C77DFF', knot: '#5A189A', text: '#FFFFFF', splash: 'rgba(157, 78, 221, 0.45)' }, // Purple
  { main: '#FF7A00', dark: '#EA580C', light: '#FDBA74', knot: '#C2410C', text: '#FFFFFF', splash: 'rgba(255, 122, 0, 0.45)' }, // Orange
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

    // Trigger dramatic surface tension ripple & swelling
    setIsRippling(true);
    setTimeout(() => {
      setIsRippling(false);
      onPop(value);
    }, 140);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    handleTriggerPop();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleTriggerPop();
  };

  // If popped: render water splash decal, droplet particles, and celebratory checkmark (Fix 5 & Fix 11)
  if (isPopped) {
    // If not correct: wrong balloon pressed -> remove cracker & celebratory burst animations
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
        {/* Background Water/Paint Splash Decal (Fix 11) */}
        <div
          data-splash-vfx="true"
          className="absolute -inset-16 sm:-inset-24 flex items-center justify-center animate-[splashDecal_0.8s_ease-out_forwards] pointer-events-none -z-10"
        >
          <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-64 sm:h-64 drop-shadow-md">
            {/* Organic paint/water splash splat shape */}
            <path
              d="M100,20 C125,15 140,40 155,45 C170,50 185,75 180,95 C175,115 190,135 175,155 C160,175 135,165 115,180 C95,195 75,175 55,180 C35,185 25,160 20,140 C15,120 30,100 25,80 C20,60 40,35 60,30 C80,25 75,25 100,20 Z"
              fill={palette.splash}
            />
            {/* Satellite water droplets */}
            <circle cx="28" cy="45" r="7" fill={palette.splash} />
            <circle cx="175" cy="40" r="9" fill={palette.splash} />
            <circle cx="185" cy="120" r="6" fill={palette.splash} />
            <circle cx="160" cy="180" r="8" fill={palette.splash} />
            <circle cx="45" cy="170" r="7.5" fill={palette.splash} />
            <circle cx="15" cy="110" r="6.5" fill={palette.splash} />
          </svg>
        </div>

        {/* Radial Droplet Burst Particles & Celebratory Cracker */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <div
              key={i}
              className="absolute w-3.5 h-3.5 rounded-full animate-ping"
              style={{
                backgroundColor: palette.main,
                transform: `rotate(${angle}deg) translate(${40 + (i % 3) * 8}px)`,
                animationDuration: '0.5s',
              }}
            />
          ))}
          <span className="text-2xl font-extrabold text-white drop-shadow-md animate-scale-out">💥</span>
        </div>

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
          isRippling ? 'scale(1.22, 0.84)' : 'scale(1)'
        }`,
        animation: `waterBalloonWobble ${floatDuration}s ease-in-out infinite`,
        animationDelay: `${floatDelay}s`,
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* Balloon SVG body with water-balloon specular refraction */}
      <div className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 relative group filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
        <svg viewBox="0 0 100 130" className="w-full h-full overflow-visible">
          <defs>
            {/* Water Balloon Spherical Radial Gradient */}
            <radialGradient id={`balloonShine-${colorIndex}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="25%" stopColor={palette.light} />
              <stop offset="70%" stopColor={palette.main} />
              <stop offset="100%" stopColor={palette.dark} />
            </radialGradient>

            {/* Bottom curvature water shadow */}
            <linearGradient id={`bottomShadow-${colorIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="55%" stopColor="transparent" />
              <stop offset="100%" stopColor={palette.dark} stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Balloon String with liquid curve */}
          <path
            d="M 50,94 Q 42,106 52,118 T 48,130"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Balloon Knot */}
          <polygon
            points="46,88 54,88 50,96"
            fill={palette.knot}
          />

          {/* Balloon Oval Body (Elastic Water Balloon Profile) */}
          <ellipse
            cx="50"
            cy="46"
            rx="42"
            ry="48"
            fill={`url(#balloonShine-${colorIndex})`}
            className="transition-all duration-150"
          />

          {/* Bottom curvature shadow */}
          <ellipse
            cx="50"
            cy="46"
            rx="42"
            ry="48"
            fill={`url(#bottomShadow-${colorIndex})`}
          />

          {/* Secondary Liquid Curved Highlight */}
          <path
            d="M 22,26 C 24,16 36,12 50,12 C 40,14 30,22 26,34 Z"
            fill="#FFFFFF"
            opacity="0.7"
          />

          {/* Specular Droplet Sparkle */}
          <ellipse cx="30" cy="24" rx="4.5" ry="7.5" fill="#FFFFFF" opacity="0.95" transform="rotate(-20 30 24)" />

          {/* Number Display Badge */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={palette.text}
            fontSize="32"
            fontWeight="900"
            fontFamily="'Fredoka', cursive, sans-serif"
            style={{
              filter: palette.text === '#FFFFFF'
                ? 'drop-shadow(0px 3px 2px rgba(0,0,0,0.5))'
                : 'drop-shadow(0px 1px 1px rgba(255,255,255,0.8))',
            }}
          >
            {value}
          </text>
        </svg>
      </div>

      {/* Water-balloon jelly wobble animation styles */}
      <style>{`
        @keyframes waterBalloonWobble {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1, 1) rotate(-1.5deg);
          }
          25% {
            transform: translate(-50%, -50%) translateY(-9px) scale(1.05, 0.95) rotate(1deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-18px) scale(0.96, 1.04) rotate(-1deg);
          }
          75% {
            transform: translate(-50%, -50%) translateY(-9px) scale(1.04, 0.96) rotate(2deg);
          }
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
        @keyframes splashDecal {
          0% {
            transform: scale(0.3);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.75;
          }
          100% {
            transform: scale(1);
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  );
};
