import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import bgSkyHome from '../assets/balloon-blast/bg_sky_home.jpg';
import { BalloonPopEffect } from './BalloonPopEffect';
import { sounds } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface HomeSkyBackgroundProps {
  showAmbientBalloons?: boolean;
}

const AMBIENT_PALETTES = [
  { main: '#FF204E', dark: '#8A001A', light: '#FFA3B5', rim: '#FF4D6D', string: '#E60033' }, // Red
  { main: '#00A3FF', dark: '#00408A', light: '#99DEFF', rim: '#33B5FF', string: '#0073E6' }, // Blue
  { main: '#10B981', dark: '#065F46', light: '#A7F3D0', rim: '#34D399', string: '#059669' }, // Green
  { main: '#FFC700', dark: '#B37D00', light: '#FFF5B8', rim: '#FFD633', string: '#E6A100' }, // Yellow
  { main: '#A855F7', dark: '#5B189A', light: '#E9D5FF', rim: '#C084FC', string: '#9333EA' }, // Purple
  { main: '#FF6B00', dark: '#A33B00', light: '#FFC499', rim: '#FF8833', string: '#EA580C' }, // Orange
];

export const HomeSkyBackground: React.FC<HomeSkyBackgroundProps> = ({ showAmbientBalloons = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const balloonElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 7 Ambient Balloons configuration
  const balloonDefs = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const pal = AMBIENT_PALETTES[i % AMBIENT_PALETTES.length];
      return {
        id: i,
        initialLeft: 6 + i * 14 + (i % 2) * 3, // Percentage 6% to 92%
        size: 58 + (i % 3) * 8, // Width in px
        color: pal.main,
        darkColor: pal.dark,
        lightColor: pal.light,
        rimColor: pal.rim,
        stringColor: pal.string,
        speed: 1.15 + (i % 3) * 0.25, // Pixels per frame
      };
    });
  }, []);

  // Track popped state for each balloon (true = showing 3D pop effect at current position)
  const [poppedMap, setPoppedMap] = useState<Record<number, boolean>>({});

  // Mutable physics data for 60 FPS requestAnimationFrame loop (zero setState in frame loop)
  const physicsRef = useRef(
    balloonDefs.map((b, i) => ({
      id: b.id,
      xPercent: b.initialLeft,
      currentY: (i * 115) % 650,
      isPopping: false,
    }))
  );

  // Sparkle stars & background bokeh
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

  // 60 FPS Composited Animation Frame Loop
  useEffect(() => {
    if (!showAmbientBalloons) return;

    let animId: number;

    const tick = () => {
      const h = containerRef.current?.clientHeight || window.innerHeight || 800;

      physicsRef.current.forEach((item, index) => {
        const el = balloonElementsRef.current[index];
        if (!el) return;

        // If not popping, advance position upwards
        if (!item.isPopping) {
          item.currentY += balloonDefs[index].speed;

          // Reached top -> cycle cleanly back to bottom
          if (item.currentY > h + 150) {
            item.currentY = -120;
            item.xPercent = (item.xPercent + 29) % 86 + 7;
            el.style.left = `${item.xPercent}%`;
          }

          // GPU-accelerated translate3d on the exact interactive balloon wrapper
          el.style.transform = `translate3d(0, -${item.currentY}px, 0)`;
        }
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [showAmbientBalloons, balloonDefs]);

  // Instant Zero-Latency Tap-to-Pop Handler
  const handleInstantPop = useCallback(
    (index: number) => {
      const item = physicsRef.current[index];
      if (!item || item.isPopping) return;

      // 1. Immediately freeze movement at exact current coordinates
      item.isPopping = true;

      // 2. Synchronous visual state change: mount 3D Pop Effect at exact balloon center
      setPoppedMap((prev) => ({ ...prev, [index]: true }));

      // 3. Audio & Haptics non-blockingly right after
      setTimeout(() => {
        sounds.playBalloonPop();
        triggerHaptic(35);
      }, 0);

      // 4. Recycle balloon smoothly from bottom after pop effect finishes (~520ms)
      setTimeout(() => {
        const el = balloonElementsRef.current[index];
        item.currentY = -120;
        item.xPercent = (item.xPercent + 23) % 86 + 7;
        item.isPopping = false;
        if (el) {
          el.style.left = `${item.xPercent}%`;
          el.style.transform = `translate3d(0, 120px, 0)`;
        }
        setPoppedMap((prev) => ({ ...prev, [index]: false }));
      }, 520);
    },
    []
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden select-none z-0">
      {/* 1. High-Resolution Rich Sky Art Base (pointer-events-none) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 pointer-events-none"
        style={{
          backgroundImage: `url(${bgSkyHome})`,
        }}
      />

      {/* 2. Shimmering Sun Rays / God Rays Animation (pointer-events-none) */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[140vw] h-[140vh] origin-top-right animate-[sunrayRotate_24s_linear_infinite]"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(255,255,255,0.7) 0%, rgba(255,243,176,0.3) 30%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-amber-200/30 animate-[rayPulse_6s_ease-in-out_infinite]" />
      </div>

      {/* 3. Drifting Fluffy Cloud Bands (pointer-events-none) */}
      <div className="absolute inset-0 opacity-85 pointer-events-none">
        <div className="absolute top-10 left-0 w-[200vw] h-40 flex items-center animate-[cloudDrift_48s_linear_infinite]">
          <div className="w-1/2 flex justify-around">
            <div className="w-64 h-24 bg-white/40 rounded-full blur-md" />
            <div className="w-80 h-28 bg-white/35 rounded-full blur-lg" />
          </div>
          <div className="w-1/2 flex justify-around">
            <div className="w-64 h-24 bg-white/40 rounded-full blur-md" />
            <div className="w-80 h-28 bg-white/35 rounded-full blur-lg" />
          </div>
        </div>
      </div>

      {/* 4. Magical Floating Bokeh Light Orbs (pointer-events-none) */}
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

      {/* 5. Twinkling Diamond Stars (pointer-events-none) */}
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

      {/* ========================================================
          6. INTERACTIVE 60 FPS FLOATING BALLOONS (z-index: 10)
          - Wrapped in a dedicated interaction layer (z-10)
          - Pop VFX spawns directly inside each balloon's exact coordinates!
         ======================================================== */}
      {showAmbientBalloons && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {balloonDefs.map((b, i) => {
            const isPopped = Boolean(poppedMap[i]);

            return (
              <div
                key={b.id}
                ref={(el) => {
                  balloonElementsRef.current[i] = el;
                }}
                data-ambient-balloon={b.id}
                className="absolute select-none will-change-transform cursor-pointer touch-none"
                style={{
                  left: `${b.initialLeft}%`,
                  bottom: '0px',
                  width: `${b.size}px`,
                  height: `${b.size * 1.45}px`,
                  pointerEvents: isPopped ? 'none' : 'auto',
                  touchAction: 'none',
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInstantPop(i);
                }}
              >
                {isPopped ? (
                  /* 3D Pop Burst rendered at exact center of the balloon */
                  <div
                    data-ambient-burst={b.id}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transform: 'translate(0, -10%)' }}
                  >
                    <BalloonPopEffect
                      color={b.color}
                      accentColor={b.lightColor}
                      size={b.size * 2.8}
                    />
                  </div>
                ) : (
                  /* Floating Balloon Oval Hitbox & SVG */
                  <div
                    className="relative w-full h-full cursor-pointer touch-none active:scale-90 hover:scale-105 transition-transform"
                    style={{ touchAction: 'none' }}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInstantPop(i);
                    }}
                  >
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
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />

                      {/* Knot */}
                      <polygon points="44,90 56,90 50,97" fill={b.darkColor} stroke={b.darkColor} strokeWidth="1" />

                      {/* Balloon Body with Colored Rim & Inner Fill */}
                      <ellipse cx="50" cy="48" rx="42" ry="46" fill="none" stroke={b.rimColor} strokeWidth="4.8" />
                      <ellipse cx="50" cy="48" rx="41" ry="45" fill={`url(#ambientShine-${b.id})`} stroke={b.darkColor} strokeWidth="2.8" />

                      {/* Specular Crescent Highlight */}
                      <path d="M 24,26 C 28,16 38,13 50,13 C 38,16 30,24 26,36 Z" fill="#FFFFFF" opacity="0.9" />
                      <ellipse cx="31" cy="27" rx="4" ry="6.5" fill="#FFFFFF" opacity="0.95" transform="rotate(-20 31 27)" />
                    </svg>
                  </div>
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
