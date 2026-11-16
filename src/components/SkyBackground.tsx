import React, { useState, useEffect } from 'react';

interface SkyBackgroundProps {
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
  popTicks: number;
}

const BALLOON_COLORS = ['#FF3366', '#00BBF9', '#FFD23F', '#06D6A0', '#9D4EDD', '#FF7A00'];

export const SkyBackground: React.FC<SkyBackgroundProps> = ({ showAmbientBalloons = true }) => {
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

  useEffect(() => {
    if (!showAmbientBalloons) return;

    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.popTicks > 0) {
            const nextTicks = b.popTicks - 1;
            if (nextTicks === 0) {
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

          if (nextY >= b.burstAtPercent && b.id % 2 === 1) {
            return {
              ...b,
              popTicks: 9,
            };
          }

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
      {/* Sunlit Sky Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #38B6FF 0%, #70D6FF 45%, #BEE9E8 100%)',
        }}
      />

      <div
        className="absolute -top-16 -right-16 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-60 blur-2xl"
        style={{ background: 'radial-gradient(circle, #FFF75E 0%, #FFD23F 40%, rgba(255,255,255,0) 70%)' }}
      />
      <div className="absolute top-6 right-6 w-20 h-20 md:w-28 md:h-28 rounded-full bg-yellow-200/50 blur-md animate-pulse-slow" />

      {/* Parallax Cloud Layer 1 */}
      <div className="absolute inset-0 opacity-40">
        <svg className="absolute w-[200%] h-48 -top-4 animate-[drift_45s_linear_infinite]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,60 Q150,10 300,50 T600,45 T900,60 T1200,40 L1200,120 L0,120 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Parallax Cloud Layer 2 */}
      <div className="absolute top-12 left-0 right-0 h-44 opacity-75">
        <div className="cloud-bubble absolute -left-20 top-2 w-48 h-20 bg-white/80 rounded-full blur-[0.5px] shadow-sm animate-[drift_25s_linear_infinite]" />
        <div className="cloud-bubble absolute left-1/3 top-10 w-64 h-24 bg-white/70 rounded-full blur-[0.5px] shadow-sm animate-[drift_32s_linear_infinite]" />
        <div className="cloud-bubble absolute left-2/3 top-4 w-52 h-20 bg-white/80 rounded-full blur-[0.5px] shadow-sm animate-[drift_28s_linear_infinite]" />
      </div>

      {/* Ambient Rising Balloons */}
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
                      className="absolute w-2 h-2 rounded-full animate-ping"
                      style={{
                        backgroundColor: b.color,
                        transform: `rotate(${ang}deg) translate(${b.size * 0.4}px)`,
                        animationDuration: '0.4s',
                      }}
                    />
                  ))}
                  <span className="text-sm font-black animate-scale-out drop-shadow">💥</span>
                </div>
              ) : (
                <svg viewBox="0 0 100 125" className="w-full h-full drop-shadow-md opacity-85 hover:opacity-100 transition-opacity">
                  <defs>
                    <radialGradient id={`ambientShine-${b.id}`} cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                      <stop offset="60%" stopColor={b.color} />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="50" cy="50" rx="42" ry="48" fill={`url(#ambientShine-${b.id})`} />
                  <ellipse cx="36" cy="34" rx="10" ry="16" fill="rgba(255,255,255,0.4)" transform="rotate(-15 36 34)" />
                  <polygon points="46,95 54,95 50,102" fill={b.color} />
                  <path d="M50,102 Q48,112 52,122" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" fill="none" />
                </svg>
              )}
            </div>
          );
        })}

      <style>{`
        @keyframes drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
