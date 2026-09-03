import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroAnimationProps {
  onComplete: () => void;
}

interface FurParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  rotation: number;
}

const FUR_COLORS = [
  '#F472B6', // Pink
  '#EC4899', // Hot Pink
  '#D946EF', // Purple/Fuchsia
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#38BDF8', // Sky Blue
  '#FBBF24', // Amber/Yellow
  '#FB923C', // Orange
  '#34D399', // Emerald
];

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [phase, setPhase] = useState<'idle' | 'squish' | 'burst' | 'fade-out'>('idle');
  const [particles, setParticles] = useState<FurParticle[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Triggered when user presses "START GAME" -> Fluffy Creature Burst
  const handleStartGame = () => {
    setIsPlaying(true);
    setPhase('squish');

    // Play opening audio
    const audio = new Audio('/assets/pixar/animasi_opening/opening_sound.mp3');
    audio.volume = 1.0;
    audioRef.current = audio;
    audio.play().catch(() => {});

    // Generate 48 Fluffy Fur Pompoms radiating outward from center
    const newParticles: FurParticle[] = Array.from({ length: 48 }).map((_, i) => {
      const angle = (i / 48) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = Math.random() * 600 + 400; // Explode across entire screen
      return {
        id: i,
        x: 0,
        y: 0,
        targetX: Math.cos(angle) * distance,
        targetY: Math.sin(angle) * distance + (Math.random() * 200 - 100),
        size: Math.random() * 32 + 24, // 24px - 56px fluffy balls
        color: FUR_COLORS[i % FUR_COLORS.length],
        rotation: Math.random() * 720 - 360,
      };
    });
    setParticles(newParticles);

    // Sequence timeline
    // 1. Squish & Gather Energy (0.6s)
    setTimeout(() => {
      setPhase('burst');
    }, 600);

    // 2. Fur Explosion & Float Down (2.5s)
    setTimeout(() => {
      setPhase('fade-out');
    }, 3200);

    // 3. Complete and Reveal Main Showcase (3.7s)
    setTimeout(() => {
      onComplete();
    }, 3700);
  };

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPhase('fade-out');
    setTimeout(() => onComplete(), 200);
  };

  return (
    <AnimatePresence>
      {phase !== 'fade-out' && (
        <motion.div
          key="pixar-furry-burst-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden backdrop-blur-3xl bg-white/75"
        >
          {/* MULTI-COLOR GRADIENT (Biru, Oranye, Kuning, Merah ke Pink, Hijau) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* 1. Biru */}
            <motion.div
              animate={{
                x: [0, 50, 0],
                y: [0, -35, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -top-20 -left-20 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-blue-500/35 filter blur-[130px]"
            />

            {/* 2. Oranye & Kuning */}
            <motion.div
              animate={{
                x: [0, -45, 0],
                y: [0, 35, 0],
                scale: [1, 1.25, 1],
              }}
              transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -top-10 -right-10 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-gradient-to-br from-amber-400/40 via-orange-500/35 to-yellow-300/40 filter blur-[130px]"
            />

            {/* 3. Merah ke Pink */}
            <motion.div
              animate={{
                x: [0, -35, 0],
                y: [0, -45, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 6.5, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -bottom-20 -right-20 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-gradient-to-tr from-rose-500/40 via-pink-500/40 to-fuchsia-400/35 filter blur-[140px]"
            />

            {/* 4. Hijau */}
            <motion.div
              animate={{
                x: [0, 40, 0],
                y: [0, 30, 0],
                scale: [1, 1.18, 1],
              }}
              transition={{ duration: 7.5, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-emerald-400/35 filter blur-[130px]"
            />

            {/* Center Mesh Blend */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/15 via-pink-400/20 to-yellow-300/15 backdrop-blur-2xl" />
          </div>

          {/* BOLA-BOLA BULU (IDLE FLUFFY POM-POMS) TETAP DIPERTAHANKAN MELAYANG INDAH DI BACKGROUND */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={`fluff-bg-particle-${i}`}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 900),
                  scale: Math.random() * 0.6 + 0.45,
                }}
                animate={{
                  y: [null, Math.random() * -180 - 60],
                  x: [null, Math.random() * 100 - 50],
                  rotate: [0, Math.random() * 360 - 180],
                }}
                transition={{
                  duration: Math.random() * 4 + 3.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
                className="absolute w-8 h-8 rounded-full flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)] opacity-80"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="36" fill={FUR_COLORS[i % FUR_COLORS.length]} />
                  {Array.from({ length: 10 }).map((_, s) => {
                    const angle = (s / 10) * 2 * Math.PI;
                    return (
                      <circle
                        key={s}
                        cx={50 + Math.cos(angle) * 35}
                        cy={50 + Math.sin(angle) * 35}
                        r="10"
                        fill={FUR_COLORS[i % FUR_COLORS.length]}
                        opacity="0.85"
                      />
                    );
                  })}
                  <circle cx="42" cy="42" r="12" fill="#FFFFFF" opacity="0.4" />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* FLUFFY FUR BURST PARTICLES (Exploding outward upon clicking START GAME) */}
          {phase === 'burst' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
                  animate={{
                    x: p.targetX,
                    y: [p.targetY * 0.5, p.targetY, p.targetY + 150],
                    scale: [0.2, 1.3, 0.9, 0],
                    opacity: [1, 1, 0.8, 0],
                    rotate: p.rotation,
                  }}
                  transition={{
                    duration: 2.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{ width: p.size, height: p.size }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                    <circle cx="50" cy="50" r="38" fill={p.color} />
                    {Array.from({ length: 12 }).map((_, spikeIdx) => {
                      const spikeAngle = (spikeIdx / 12) * 2 * Math.PI;
                      const cx = 50 + Math.cos(spikeAngle) * 36;
                      const cy = 50 + Math.sin(spikeAngle) * 36;
                      return <circle key={spikeIdx} cx={cx} cy={cy} r="10" fill={p.color} opacity="0.85" />;
                    })}
                    <circle cx="42" cy="42" r="14" fill="#FFFFFF" opacity="0.35" />
                  </svg>
                </motion.div>
              ))}
            </div>
          )}

          {/* ANIMATED PIXAR LOGO CONTAINER (TETAP MELAYANG TERUS DENGAN SOLID 100%) */}
          <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-8 w-full">
            <motion.div
              animate={
                phase === 'idle'
                  ? {
                      y: [-12, 12, -12],
                      rotate: [-1, 1, -1],
                      transition: {
                        duration: 3.8,
                        ease: 'easeInOut',
                        repeat: Infinity,
                      },
                    }
                  : phase === 'squish'
                  ? {
                      scaleX: [1, 1.25, 0.85],
                      scaleY: [1, 0.75, 1.2],
                      y: [0, 15, -20],
                      transition: { duration: 0.6, ease: 'easeInOut' },
                    }
                  : phase === 'burst'
                  ? {
                      scale: [1.2, 1.6, 2.2],
                      opacity: [1, 0.8, 0],
                      filter: ['blur(0px)', 'blur(10px)', 'blur(25px)'],
                      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                    }
                  : {}
              }
              className="relative flex items-center justify-center w-[90vw] max-w-[650px] sm:max-w-[750px] md:max-w-[850px]"
            >
              {/* Soft Ambient Glow Behind Logo */}
              <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-pink-400/30 via-purple-400/25 to-cyan-400/30 filter blur-3xl opacity-70 pointer-events-none" />

              {/* Pixar Logo */}
              <img
                src="/assets/pixar/logo/logo.png"
                alt="Pixar Logo"
                className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.18)] pointer-events-none"
              />
            </motion.div>

            {/* START GAME BUTTON */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="mt-10 sm:mt-12 flex flex-col items-center"
                >
                  <motion.button
                    onClick={handleStartGame}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    className="relative group overflow-hidden px-8 sm:px-11 py-3 sm:py-3.5 rounded-full border border-white/80 hover:border-white backdrop-blur-2xl bg-white/35 hover:bg-white/50 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                    style={{
                      boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 25px rgba(217, 70, 239, 0.35)',
                    }}
                  >
                    {/* Shimmer Reflection on Hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                    {/* Dynamic Ambient Glow Accent */}
                    <div
                      className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none rounded-full"
                      style={{
                        background: 'radial-gradient(circle at center, #D946EF 0%, transparent 75%)',
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-2.5 text-slate-900 group-hover:text-black font-mono font-extrabold text-xs sm:text-sm tracking-[0.25em] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse" />
                      <span>START GAME</span>
                      <svg
                        className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clean Glassmorphic Skip Button */}
          {isPlaying && (
            <button
              onClick={handleSkip}
              className="absolute bottom-8 right-8 z-20 px-5 py-2.5 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-xl border border-white/60 text-xs font-mono tracking-widest text-slate-800 hover:text-black transition-all cursor-pointer uppercase shadow-lg hover:scale-105 active:scale-95"
            >
              [ SKIP INTRO ➔ ]
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
