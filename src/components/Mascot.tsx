import React from 'react';

export type MascotState = 'idle' | 'happy' | 'thinking' | 'encourage';

interface MascotProps {
  state: MascotState;
  className?: string;
  speechBubble?: string;
}

export const Mascot: React.FC<MascotProps> = ({ state, className = '', speechBubble }) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble in normal flex flow to guarantee 0px collision with siblings */}
      {speechBubble && (
        <div className="mb-2 bg-white/95 text-slate-800 text-xs md:text-sm font-bold py-1.5 px-3.5 rounded-2xl shadow-md border-2 border-amber-300 animate-bounce-slow whitespace-nowrap z-20 pointer-events-none relative">
          {speechBubble}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-amber-300 transform rotate-45" />
        </div>
      )}

      {/* Vector Mascot Character */}
      <div 
        className={`w-28 h-28 md:w-36 md:h-36 relative transition-transform duration-300 ${
          state === 'happy' ? 'animate-bounce' : state === 'idle' ? 'animate-float-slow' : ''
        }`}
      >
        <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-xl">
          <defs>
            {/* Gradients */}
            <linearGradient id="mascotBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="100%" stopColor="#FFE082" />
            </linearGradient>
            <linearGradient id="mascotEar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF8A65" />
              <stop offset="100%" stopColor="#E64A19" />
            </linearGradient>
            <linearGradient id="mascotCheek" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8A80" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FF5252" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="aviatorCap" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00BBF9" />
              <stop offset="100%" stopColor="#0077B6" />
            </linearGradient>
            <linearGradient id="gogglesLens" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#80DEEA" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Ears */}
          <circle cx="36" cy="38" r="16" fill="url(#mascotEar)" />
          <circle cx="36" cy="38" r="10" fill="#FFCCBC" />
          <circle cx="104" cy="38" r="16" fill="url(#mascotEar)" />
          <circle cx="104" cy="38" r="10" fill="#FFCCBC" />

          {/* Body & Head */}
          <ellipse cx="70" cy="74" rx="44" ry="40" fill="url(#mascotBody)" stroke="#F57C00" strokeWidth="3" />

          {/* Aviator Helmet */}
          <path
            d="M 28,66 C 28,32 112,32 112,66 C 112,50 102,30 70,30 C 38,30 28,50 28,66 Z"
            fill="url(#aviatorCap)"
            stroke="#023E8A"
            strokeWidth="3"
          />
          {/* Aviator Ear Flaps */}
          <rect x="25" y="60" width="8" height="18" rx="4" fill="#0077B6" />
          <rect x="107" y="60" width="8" height="18" rx="4" fill="#0077B6" />

          {/* Goggles on Helmet */}
          <rect x="42" y="38" width="24" height="16" rx="6" fill="#37474F" stroke="#263238" strokeWidth="2" />
          <rect x="74" y="38" width="24" height="16" rx="6" fill="#37474F" stroke="#263238" strokeWidth="2" />
          <rect x="64" y="44" width="12" height="4" fill="#263238" />
          <ellipse cx="54" cy="46" rx="9" ry="6" fill="url(#gogglesLens)" />
          <ellipse cx="86" cy="46" rx="9" ry="6" fill="url(#gogglesLens)" />
          <line x1="49" y1="43" x2="55" y2="49" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="81" y1="43" x2="87" y2="49" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="44" cy="80" rx="9" ry="5" fill="url(#mascotCheek)" />
          <ellipse cx="96" cy="80" rx="9" ry="5" fill="url(#mascotCheek)" />

          {/* Cute Nose */}
          <polygon points="70,72 65,67 75,67" fill="#5D4037" />

          {/* EYES & BROWS BASED ON STATE */}
          {state === 'happy' && (
            <>
              {/* Crescent squinting happy eyes */}
              <path d="M 44,66 Q 52,58 60,66" fill="none" stroke="#263238" strokeWidth="4" strokeLinecap="round" />
              <path d="M 80,66 Q 88,58 96,66" fill="none" stroke="#263238" strokeWidth="4" strokeLinecap="round" />
              {/* Sparkles near head */}
              <circle cx="22" cy="40" r="3" fill="#FFD700" className="animate-ping" />
              <circle cx="118" cy="40" r="3" fill="#FFD700" className="animate-ping" />
            </>
          )}

          {state === 'idle' && (
            <>
              {/* Big round sparkling eyes */}
              <ellipse cx="52" cy="65" rx="6.5" ry="8" fill="#263238" />
              <circle cx="50" cy="62" r="3" fill="#FFFFFF" />
              <circle cx="54" cy="67" r="1.5" fill="#FFFFFF" />
              <ellipse cx="88" cy="65" rx="6.5" ry="8" fill="#263238" />
              <circle cx="86" cy="62" r="3" fill="#FFFFFF" />
              <circle cx="90" cy="67" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {state === 'thinking' && (
            <>
              {/* Looking up eyes */}
              <ellipse cx="52" cy="62" rx="6.5" ry="8" fill="#263238" />
              <circle cx="52" cy="59" r="3" fill="#FFFFFF" />
              <ellipse cx="88" cy="62" rx="6.5" ry="8" fill="#263238" />
              <circle cx="88" cy="59" r="3" fill="#FFFFFF" />
              {/* Curious eyebrows */}
              <path d="M 46,54 Q 52,51 58,55" fill="none" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 82,56 Q 88,51 94,54" fill="none" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {state === 'encourage' && (
            <>
              {/* Empathetic friendly eyes */}
              <ellipse cx="52" cy="65" rx="6" ry="7.5" fill="#263238" />
              <circle cx="51" cy="63" r="2.8" fill="#FFFFFF" />
              <ellipse cx="88" cy="65" rx="6" ry="7.5" fill="#263238" />
              <circle cx="87" cy="63" r="2.8" fill="#FFFFFF" />
              {/* Supportive tilted eyebrows */}
              <path d="M 45,55 Q 52,58 59,56" fill="none" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 81,56 Q 88,58 95,55" fill="none" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* MOUTH BASED ON STATE */}
          {state === 'happy' && (
            /* Big joyous open mouth */
            <path
              d="M 60,78 Q 70,92 80,78 Z"
              fill="#D81B60"
              stroke="#880E4F"
              strokeWidth="2"
            />
          )}

          {state === 'idle' && (
            /* Gentle warm smile */
            <path d="M 64,77 Q 70,82 76,77" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
          )}

          {state === 'thinking' && (
            /* Small curious O mouth */
            <ellipse cx="70" cy="78" rx="4" ry="4" fill="#4E342E" />
          )}

          {state === 'encourage' && (
            /* Gentle small reassuring open smile */
            <path d="M 64,77 Q 70,83 76,77" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* PAWS / HANDS */}
          {state === 'happy' ? (
            // Hands raised in celebration!
            <>
              <ellipse cx="26" cy="50" rx="9" ry="11" fill="#FFE082" stroke="#F57C00" strokeWidth="2.5" transform="rotate(-30 26 50)" />
              <ellipse cx="114" cy="50" rx="9" ry="11" fill="#FFE082" stroke="#F57C00" strokeWidth="2.5" transform="rotate(30 114 50)" />
            </>
          ) : state === 'thinking' ? (
            // Hand on chin
            <>
              <ellipse cx="78" cy="86" rx="9" ry="8" fill="#FFE082" stroke="#F57C00" strokeWidth="2.5" />
              <ellipse cx="32" cy="98" rx="8" ry="9" fill="#FFE082" stroke="#F57C00" strokeWidth="2.5" />
            </>
          ) : (
            // Default resting / floating paws
            <>
              <ellipse cx="36" cy="96" rx="8" ry="9" fill="#FFE082" stroke="#F57C00" strokeWidth="2.5" />
              <ellipse cx="104" cy="96" rx="8" ry="9" fill="#FFE082" stroke="#F57C00" strokeWidth="2.5" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
