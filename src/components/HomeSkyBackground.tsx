import React, { useState, useEffect, useMemo } from 'react';
import bgSkyHome from '../assets/balloon-blast/bg_sky_home.jpg';
import { BalloonPopEffect } from './BalloonPopEffect';
import { sounds } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface HomeSkyBackgroundProps {
  showAmbientBalloons?: boolean;
}

interface AmbientBalloon {
  id: number;
  left: number; // percentage
  size: number;
  color: string;
  darkColor: string;
  rimColor: string;
  stringColor: string;
  speed: number;
  currentY: number;
  popTicks: number; // 0 = floating, >0 = bursting countdown
}

const AMBIENT_PALETTES = [
  { main: '#FF204E', dark: '#8A001A', rim: '#FF4D6D', string: '#E60033' }, // Red
  { main: '#00A3FF', dark: '#00408A', rim: '#33B5FF', string: '#0073E6' }, // Blue
  { main: '#10B981', dark: '#065F46', rim: '#34D399', string: '#059669' }, // Green
  { main: '#FFC700', dark: '#B37D00', rim: '#FFD633', string: '#E6A100' }, // Yellow
  { main: '#A855F7', dark: '#5B189A', rim: '#C084FC', string: '#9333EA' }, // Purple
  { main: '#FF6B00', dark: '#A33B00', rim: '#FF8833', string: '#EA580C' }, // Orange
];

export const HomeSkyBackground: React.FC<HomeSkyBackgroundProps> = ({ showAmbientBalloons = true }) => {
  // Ambient rising balloons (Pop ONLY on user tap/click, never automatically)
  const [balloons, setBalloons] = useState<AmbientBalloon[]>(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const pal = AMBIENT_PALETTES[i % AMBIENT_PALETTES.length];
      return {
        id: i,
        left: 8 + i * 14 + (i % 2) * 3,
        size: 52 + (i % 3) * 10,
        color: pal.main,
        darkColor: pal.dark,
        rimColor: pal.rim,
        stringColor: pal.string,
        speed: 12 + (i % 3) * 3,
        currentY: (i * 16) % 95,
        popTicks: 0,
      };
    });
  });

  // Sparkle stars
  const sparkles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: `${(i * 19 + 7) % 94}%`,
      top: `${(i * 23 + 12) % 85}%`,
      size: 10 + (i % 3) * 6,
      delay: `${(i * 0.4) % 3}s`,
      duration: `${1.8 + (i % 3) * 0.7}s`,
    }));
  }, []);

  // Bokeh floating light orbs
  const bokehOrbs = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${(i * 29 + 15) % 88}%`,
      top: `${(i * 31 + 20) % 75}%`,
      size: 35 + (i % 4) * 20,
      delay: `${i * 0.8}s`,
      duration: `${6 + (i % 3) * 2}s`,
    }));
  }, []);

  // Smooth floating ascent loop: balloons NEVER pop automatically
  useEffect(() => {
    if (!showAmbientBalloons) return;

    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          // If balloon is currently popping after a user tap, count down ticks then respawn at bottom
          if (b.popTicks > 0) {
            const nextTicks = b.popTicks - 1;
            if (nextTicks === 0) {
              return {
                ...b,
                currentY: -18,
                left: (b.left + 29) % 88 + 6,
                popTicks: 0,
              };
            }
            return { ...b, popTicks: nextTicks };
          }

          // Gentle smooth rising ascent (never auto-pops)
          const nextY = b.currentY + 0.35;

          // Reached top -> cycle around smoothly to bottom
          if (nextY > 118) {
            return {
              ...b,
              currentY: -18,
              left: (b.left + 23) % 90 + 5,
              popTicks: 0,
            };
          }

          return { ...b, currentY: nextY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [showAmbientBalloons]);

  // Handle manual interactive tap-to-pop
  const handleTapBalloon = (balloonId: number) => {
    // Trigger punchy pop sound & haptic feedback
    sounds.playBalloonPop();
    triggerHaptic(35);

    // Trigger starburst burst animation
    setBalloons((prev) =>
      prev.map((b) => (b.id === balloonId && b.popTicks === 0 ? { ...b, popTicks: 11 } : b))
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden select-none z-0">
      {/* 1. High-Resolution Rich Sky Art Base */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 pointer-events-none"
        style={{
          backgroundImage: `url(${bgSkyHome})`,
        }}
      />

      {/* 2. Shimmering Sun Rays / God Rays Animation */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[140vw] h-[140vh] origin-top-right animate-[sunrayRotate_24s_linear_infinite]"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(255,255,255,0.7) 0%, rgba(255,243,176,0.3) 30%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-amber-200/30 animate-[rayPulse_6s_ease-in-out_infinite]"
        />
      </div>

      {/* 3. Drifting Fluffy Cloud Bands */}
      <div className="absolute inset-0 opacity-85 pointer-events-none">
        {/* Layer 1 - Slow distant cloud */}
        <div
          className="absolute top-10 left-0 w-[200vw] h-40 flex items-center animate-[cloudDrift_48s_linear_infinite]"
        >
          <div className="w-1/2 flex justify-around">
            <div className="w-64 h-24 bg-white/40 rounded-full blur-md" />
            <div className="w-80 h-28 bg-white/35 rounded-full blur-lg" />
          </div>
          <div className="w-1/2 flex justify-around">
            <div className="w-64 h-24 bg-white/40 rounded-full blur-md" />
            <div className="w-80 h-28 bg-white/35 rounded-full blur-lg" />
          </div>
        </div>

        {/* Layer 2 - Lower mid-ground cloud */}
        <div
          className="absolute top-36 left-0 w-[200vw] h-36 flex items-center animate-[cloudDrift_32s_linear_infinite]"
        >
          <div className="w-1/2 flex justify-around">
            <div className="w-72 h-20 bg-white/30 rounded-full blur-sm" />
            <div className="w-96 h-24 bg-white/25 rounded-full blur-md" />
          </div>
          <div className="w-1/2 flex justify-around">
            <div className="w-72 h-20 bg-white/30 rounded-full blur-sm" />
            <div className="w-96 h-24 bg-white/25 rounded-full blur-md" />
          </div>
        </div>
      </div>

      {/* 4. Magical Floating Bokeh Light Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {bokehOrbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full bg-white/45 blur-sm"
            style={{
              left: orb.left,
              top: orb.top,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              animation: `bokehFloat ${orb.duration} ease-in-out infinite`,
              animationDelay: orb.delay,
            }}
          />
        ))}
      </div>

      {/* 5. Twinkling Diamond Stars */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute text-white pointer-events-none"
          style={{
            left: sp.left,
            top: sp.top,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            animation: `sparkleTwinkle ${sp.duration} ease-in-out infinite`,
            animationDelay: sp.delay,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
            <path d="M12,0 L14,9 L23,12 L14,15 L12,24 L10,15 L1,12 L10,9 Z" />
          </svg>
        </div>
      ))}

      {/* 6. Interactive Tap-to-Pop Ambient Rising Balloons (Image 2 & 3 Parity) */}
      {showAmbientBalloons && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {balloons.map((b) => {
            const isPopping = b.popTicks > 0;
            return (
              <div
                key={b.id}
                data-ambient-balloon={b.id}
                className="absolute select-none pointer-events-auto cursor-pointer transform hover:scale-110 active:scale-95 transition-transform"
                style={{
                  left: `${b.left}%`,
                  bottom: `${b.currentY}%`,
                  width: `${b.size}px`,
                  height: `${b.size * 1.4}px`,
                  transform: 'translate(-50%, 0)',
                }}
                onClick={() => handleTapBalloon(b.id)}
                onPointerDown={() => handleTapBalloon(b.id)}
              >
                {isPopping ? (
                  <div data-ambient-burst={b.id} className="relative w-full h-full flex items-center justify-center">
                    {/* Image 3 Comic Starburst Pop Effect */}
                    <BalloonPopEffect
                      color={b.color}
                      accentColor="#FFD200"
                      size={b.size * 2.8}
                    />
                  </div>
                ) : (
                  /* Glossy Outlined Balloon SVG with Curly String (Image 2) */
                  <svg viewBox="0 0 100 140" className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]">
                    <defs>
                      <radialGradient id={`ambientShine-${b.id}`} cx="35%" cy="32%" r="66%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                        <stop offset="25%" stopColor={b.rimColor} />
                        <stop offset="60%" stopColor={b.color} />
                        <stop offset="100%" stopColor={b.darkColor} />
                      </radialGradient>
                    </defs>

                    {/* Curly String */}
                    <path
                      d="M 50,96 C 42,104 38,114 48,120 C 58,126 56,134 46,140"
                      fill="none"
                      stroke={b.stringColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Knot */}
                    <polygon points="44,90 56,90 50,97" fill={b.darkColor} stroke={b.darkColor} strokeWidth="1" />

                    {/* Balloon Body with Colored Rim & Inner Fill */}
                    <ellipse cx="50" cy="48" rx="42" ry="46" fill="none" stroke={b.rimColor} strokeWidth="4.5" />
                    <ellipse cx="50" cy="48" rx="41" ry="45" fill={`url(#ambientShine-${b.id})`} stroke={b.darkColor} strokeWidth="2.5" />

                    {/* Specular Crescent Highlight */}
                    <path d="M 24,26 C 28,16 38,13 50,13 C 38,16 30,24 26,36 Z" fill="#FFFFFF" opacity="0.9" />
                    <ellipse cx="31" cy="27" rx="4" ry="6.5" fill="#FFFFFF" opacity="0.95" transform="rotate(-20 31 27)" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Keyframe Animations */}
      <style>{`
        @keyframes sunrayRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes bokehFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-30px) scale(1.15); opacity: 0.45; }
        }
        @keyframes sparkleTwinkle {
          0%, 100% { transform: scale(0.4) rotate(0deg); opacity: 0.2; }
          50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
