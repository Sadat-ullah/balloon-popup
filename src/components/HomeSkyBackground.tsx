import React, { useState, useEffect, useMemo } from 'react';

interface HomeSkyBackgroundProps {
  showAmbientBalloons?: boolean;
}

interface AmbientBalloon {
  id: number;
  left: number; // percentage
  size: number;
  color: string;
  speed: number;
  burstAtPercent: number;
  currentY: number;
  popTicks: number; // 0 = floating, >0 = bursting countdown
}

const BALLOON_COLORS = ['#FF3366', '#00BBF9', '#FFD166', '#06D6A0', '#9D4EDD', '#FF7A00'];

export const HomeSkyBackground: React.FC<HomeSkyBackgroundProps> = ({ showAmbientBalloons = true }) => {
  // Ambient rising balloons with mid-air bursts
  const [balloons, setBalloons] = useState<AmbientBalloon[]>(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      left: 8 + i * 14 + (i % 2) * 4,
      size: 48 + (i % 4) * 10,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      speed: 12 + (i % 3) * 3,
      burstAtPercent: 35 + (i % 4) * 12,
      currentY: (i * 18) % 90,
      popTicks: 0,
    }));
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

  // Single deterministic tick loop: handles ascent, spontaneous burst, and automatic cleanup
  useEffect(() => {
    if (!showAmbientBalloons) return;

    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          // If balloon is currently popping, countdown ticks then respawn cleanly
          if (b.popTicks > 0) {
            const nextTicks = b.popTicks - 1;
            if (nextTicks === 0) {
              // Burst animation complete -> clean reset to bottom
              return {
                ...b,
                currentY: -15,
                left: (b.left + 31) % 88 + 6,
                popTicks: 0,
                burstAtPercent: 35 + Math.random() * 35,
              };
            }
            return { ...b, popTicks: nextTicks };
          }

          const nextY = b.currentY + 0.35;

          // Timed spontaneous burst mid-air
          if (nextY >= b.burstAtPercent && b.id % 2 === 1) {
            return {
              ...b,
              popTicks: 9, // ~450ms (9 ticks * 50ms)
            };
          }

          // Reached top -> recycle to bottom
          if (nextY > 115) {
            return {
              ...b,
              currentY: -15,
              left: (b.left + 23) % 90 + 5,
              popTicks: 0,
              burstAtPercent: 35 + Math.random() * 35,
            };
          }

          return { ...b, currentY: nextY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [showAmbientBalloons]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. High-Resolution Rich Sky Art Base */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: 'url(/assets/balloon-blast/bg_sky_home.jpg)',
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
          className="absolute inset-0 animate-[rayPulse_6s_ease-in-out_infinite]"
          style={{
            background:
              'repeating-linear-gradient(130deg, rgba(255,255,255,0.18) 0px, transparent 60px, rgba(255,255,255,0.12) 120px, transparent 180px)',
          }}
        />
      </div>

      {/* 3. Floating Bokeh Orbs */}
      {bokehOrbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full bg-white/20 blur-md pointer-events-none"
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

      {/* 4. Drifting Iridescent Cloud Layer (Parallax Floating) */}
      <div className="absolute top-8 left-0 right-0 h-48 opacity-80 pointer-events-none">
        <div className="absolute -left-10 top-4 w-72 h-24 bg-white/40 backdrop-blur-[1px] rounded-full shadow-[0_8px_32px_rgba(255,255,255,0.4)] animate-[cloudDrift_30s_linear_infinite]" />
        <div className="absolute left-1/2 top-14 w-80 h-28 bg-white/30 backdrop-blur-[1px] rounded-full shadow-[0_8px_32px_rgba(255,255,255,0.3)] animate-[cloudDrift_42s_linear_infinite]" />
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

      {/* 6. Enlarged Ambient Rising Balloons with Mid-Air Bursts (Zero freezing guaranteed) */}
      {showAmbientBalloons &&
        balloons.map((b) => {
          const isPopping = b.popTicks > 0;
          return (
            <div
              key={b.id}
              data-ambient-balloon={b.id}
              className="absolute transition-transform select-none"
              style={{
                left: `${b.left}%`,
                bottom: `${b.currentY}%`,
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
                transform: 'translate(-50%, 0)',
              }}
            >
              {isPopping ? (
                <div data-ambient-burst={b.id} className="relative w-full h-full flex items-center justify-center">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, pi) => (
                    <div
                      key={pi}
                      className="absolute w-2.5 h-2.5 rounded-full animate-ping"
                      style={{
                        backgroundColor: b.color,
                        transform: `rotate(${ang}deg) translate(${b.size * 0.4}px)`,
                        animationDuration: '0.4s',
                      }}
                    />
                  ))}
                  <span className="text-base font-black animate-scale-out drop-shadow">💥</span>
                </div>
              ) : (
                <svg viewBox="0 0 100 125" className="w-full h-full drop-shadow-lg opacity-90 hover:opacity-100 transition-opacity">
                  <defs>
                    <radialGradient id={`homeAmbientShine-${b.id}`} cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="60%" stopColor={b.color} />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="50" cy="50" rx="42" ry="48" fill={`url(#homeAmbientShine-${b.id})`} />
                  <ellipse cx="36" cy="34" rx="10" ry="16" fill="rgba(255,255,255,0.45)" transform="rotate(-15 36 34)" />
                  <polygon points="46,95 54,95 50,102" fill={b.color} />
                  <path d="M50,102 Q48,112 52,122" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" />
                </svg>
              )}
            </div>
          );
        })}

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
