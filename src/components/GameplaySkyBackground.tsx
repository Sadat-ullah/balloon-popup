import React, { useMemo } from 'react';

export const GameplaySkyBackground: React.FC = () => {
  // Floating magical sun-motes / firefly sparkles
  const sparkles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 17 + 8) % 92}%`,
      top: `${12 + ((i * 21) % 65)}%`,
      size: 4 + (i % 3) * 3,
      delay: `${(i * 0.5) % 4}s`,
      duration: `${3 + (i % 4) * 1.5}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. High-Resolution Gameplay Sky & Rolling Hills Artwork */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: 'url(/assets/balloon-blast/bg_sky_gameplay.jpg)',
        }}
      />

      {/* 2. Pulsing Solar Corona at the Top */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 md:w-[600px] h-64 md:h-80 rounded-full opacity-60 blur-3xl pointer-events-none animate-[sunPulse_5s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, rgba(255,248,154,0.9) 0%, rgba(255,214,10,0.5) 40%, transparent 70%)',
        }}
      />

      {/* 3. Floating Sun Dust / Firefly Sparkles */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute rounded-full bg-amber-100 pointer-events-none shadow-[0_0_8px_rgba(255,235,59,0.9)]"
          style={{
            left: sp.left,
            top: sp.top,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            animation: `moteDrift ${sp.duration} ease-in-out infinite`,
            animationDelay: sp.delay,
          }}
        />
      ))}

      {/* 4. Subtle Shimmering Sky Atmosphere Filter */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/10 pointer-events-none" />

      {/* Animation Keyframes */}
      <style>{`
        @keyframes sunPulse {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 0.55;
          }
          50% {
            transform: translate(-50%, 0) scale(1.18);
            opacity: 0.85;
          }
        }
        @keyframes moteDrift {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-24px) translateX(8px) scale(1.25);
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
};
