import React, { useState, useEffect, useRef, useMemo } from 'react';
import bgSkyHome from '../assets/balloon-blast/bg_sky_home.jpg';
import { BalloonPopEffect } from './BalloonPopEffect';
import { sounds } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface HomeSkyBackgroundProps {
  showAmbientBalloons?: boolean;
}

interface ActivePop {
  id: number;
  xPercent: number;
  yPixels: number;
  color: string;
  size: number;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const balloonElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activePops, setActivePops] = useState<ActivePop[]>([]);

  // Static balloon definitions
  const balloonData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const pal = AMBIENT_PALETTES[i % AMBIENT_PALETTES.length];
      return {
        id: i,
        initialLeft: 7 + i * 14 + (i % 2) * 3,
        size: 56 + (i % 3) * 10,
        color: pal.main,
        darkColor: pal.dark,
        rimColor: pal.rim,
        stringColor: pal.string,
        speed: 1.1 + (i % 3) * 0.25, // Pixels per frame
      };
    });
  }, []);

  // Mutable animation state running strictly outside React's render loop for 60 FPS
  const physicsRef = useRef(
    balloonData.map((b, i) => ({
      id: b.id,
      xPercent: b.initialLeft,
      currentY: (i * 120) % 650,
      isPopping: false,
    }))
  );

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

  // 60 FPS GPU-Accelerated requestAnimationFrame Movement Loop (Zero React setState in loop)
  useEffect(() => {
    if (!showAmbientBalloons) return;

    let animId: number;

    const tick = () => {
      const h = containerRef.current?.clientHeight || window.innerHeight || 800;

      physicsRef.current.forEach((item, index) => {
        const el = balloonElementsRef.current[index];
        if (!el || item.isPopping) return;

        item.currentY += balloonData[index].speed;

        // Reached top -> cycle cleanly back below bottom
        if (item.currentY > h + 140) {
          item.currentY = -120;
          item.xPercent = (item.xPercent + 29) % 86 + 7;
          el.style.left = `${item.xPercent}%`;
        }

        // Apply hardware-accelerated transform: translate3d
        el.style.transform = `translate3d(0, -${item.currentY}px, 0)`;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [showAmbientBalloons, balloonData]);

  // Instant Zero-Delay Tap-to-Pop Handler
  const handlePopBalloon = (index: number) => {
    const item = physicsRef.current[index];
    const bDef = balloonData[index];
    if (!item || item.isPopping) return;

    // 1. Instant audio + haptic feedback
    sounds.playBalloonPop();
    triggerHaptic(35);

    // 2. Mark popping & hide balloon body immediately
    item.isPopping = true;
    const el = balloonElementsRef.current[index];
    if (el) {
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    }

    // 3. Mount 3D Balloon Pop VFX at exact coordinates
    const popId = Date.now() + index;
    setActivePops((prev) => [
      ...prev,
      {
        id: popId,
        xPercent: item.xPercent,
        yPixels: item.currentY,
        color: bDef.color,
        size: bDef.size * 2.8,
      },
    ]);

    // 4. Remove pop effect and smoothly recycle balloon from bottom
    setTimeout(() => {
      setActivePops((prev) => prev.filter((p) => p.id !== popId));
      item.currentY = -120;
      item.xPercent = (item.xPercent + 23) % 86 + 7;
      item.isPopping = false;
      if (el) {
        el.style.left = `${item.xPercent}%`;
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      }
    }, 580);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden select-none z-0">
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
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-amber-200/30 animate-[rayPulse_6s_ease-in-out_infinite]" />
      </div>

      {/* 3. Drifting Fluffy Cloud Bands */}
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

      {/* 6. Active 3D Balloon Pop Explosions Overlay */}
      {activePops.map((pop) => (
        <div
          key={pop.id}
          data-ambient-burst={pop.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: `${pop.xPercent}%`,
            bottom: `${pop.yPixels}px`,
            transform: 'translate(-50%, 0)',
          }}
        >
          <BalloonPopEffect color={pop.color} size={pop.size} />
        </div>
      ))}

      {/* 7. Interactive 60 FPS Ambient Balloons (Instant Zero-Delay Tap-to-Pop) */}
      {showAmbientBalloons && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {balloonData.map((b, i) => (
            <div
              key={b.id}
              ref={(el) => {
                balloonElementsRef.current[i] = el;
              }}
              data-ambient-balloon={b.id}
              className="absolute pointer-events-auto cursor-pointer touch-manipulation transform active:scale-90 hover:scale-105 transition-transform"
              style={{
                left: `${b.initialLeft}%`,
                bottom: '0px',
                width: `${b.size}px`,
                height: `${b.size * 1.45}px`,
                willChange: 'transform',
                padding: '6px', // Expanded touch hitbox
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                handlePopBalloon(i);
              }}
              onClick={(e) => {
                e.preventDefault();
                handlePopBalloon(i);
              }}
            >
              {/* Glossy Outlined Balloon SVG with Curly String (Image 2 Parity) */}
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
          ))}
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
