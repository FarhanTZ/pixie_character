import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [phase, setPhase] = useState<'idle' | 'appear' | 'floating' | 'fade-out'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Triggered when user presses "START GAME"
  const handleStartGame = () => {
    setIsPlaying(true);
    setPhase('appear');

    // Initialize and play opening sound
    const audio = new Audio('/assets/pixar/animasi_opening/opening_sound.mp3');
    audio.volume = 1.0;
    audioRef.current = audio;
    audio.play().catch(() => {});

    // Animation timeline sequence
    setTimeout(() => setPhase('floating'), 2300);
    setTimeout(() => setPhase('fade-out'), 3800);
    setTimeout(() => {
      onComplete();
    }, 4300);
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
          key="pixar-logo-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden backdrop-blur-3xl bg-white/75"
        >
          {/* MULTI-COLOR GRADIENT (Biru, Oranye, Kuning, Merah ke Pink, Hijau) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* 1. Biru */}
            <motion.div
              animate={{
                x: [0, 40, 0],
                y: [0, -30, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -top-20 -left-20 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-blue-500/35 filter blur-[130px]"
            />

            {/* 2. Oranye & Kuning */}
            <motion.div
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -top-10 -right-10 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-gradient-to-br from-amber-400/40 via-orange-500/35 to-yellow-300/40 filter blur-[130px]"
            />

            {/* 3. Merah ke Pink */}
            <motion.div
              animate={{
                x: [0, -30, 0],
                y: [0, -40, 0],
                scale: [1, 1.18, 1],
              }}
              transition={{ duration: 6.5, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -bottom-20 -right-20 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-gradient-to-tr from-rose-500/40 via-pink-500/40 to-fuchsia-400/35 filter blur-[140px]"
            />

            {/* 4. Hijau */}
            <motion.div
              animate={{
                x: [0, 35, 0],
                y: [0, 25, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 7.5, ease: 'easeInOut', repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-emerald-400/35 filter blur-[130px]"
            />

            {/* Center Mesh Blend */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/15 via-pink-400/20 to-yellow-300/15 backdrop-blur-2xl" />
          </div>

          {/* ANIMATED PIXAR LOGO CONTAINER */}
          <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-8 w-full">
            {/* Logo Container */}
            <motion.div
              initial={false}
              animate={
                phase === 'idle'
                  ? { opacity: 1, scale: 0.95, y: 0 }
                  : phase === 'appear'
                  ? {
                      opacity: [0.3, 1],
                      scale: [0.65, 1],
                      y: [30, 0],
                      filter: ['blur(12px)', 'blur(0px)'],
                      transition: {
                        duration: 2.3,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  : {
                      y: [-4, 4, -4],
                      scale: [1, 1.02, 1],
                      transition: {
                        duration: 1.5,
                        ease: 'easeInOut',
                        repeat: Infinity,
                      },
                    }
              }
              className="relative flex items-center justify-center w-[90vw] max-w-[650px] sm:max-w-[750px] md:max-w-[850px]"
            >
              {/* Soft Multi-color Shadow */}
              <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-pink-400/30 via-purple-400/20 to-cyan-400/30 filter blur-3xl pointer-events-none" />

              {/* Pixar Logo */}
              <img
                src="/assets/pixar/logo/logo.png"
                alt="Pixar Logo"
                className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.18)] pointer-events-none"
              />
            </motion.div>

            {/* START GAME BUTTON (Desain Kaca Kristal Frosted Glass persis seperti tombol SELECT CHARACTER) */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
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
                    {/* Shimmer Light Reflection */}
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
                      {/* Glowing Status Dot */}
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
