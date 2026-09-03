import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'lamp-in' | 'lamp-jump' | 'wordmark' | 'fade-out'>('lamp-in');

  useEffect(() => {
    // Pixar Iconic Intro Sequence
    const t1 = setTimeout(() => setPhase('lamp-jump'), 800);
    const t2 = setTimeout(() => setPhase('wordmark'), 1800);
    const t3 = setTimeout(() => setPhase('fade-out'), 3200);
    const t4 = setTimeout(() => onComplete(), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'fade-out' && (
        <motion.div
          key="pixar-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-50 bg-[#08080c] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* 3D Cinematic Spotlight Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/10 filter blur-[140px]" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-blue-600/15 filter blur-[100px]" />
          </div>

          {/* Pixar 3D Lamp Animation */}
          <div className="relative mb-6 flex flex-col items-center">
            <motion.div
              initial={{ y: -120, opacity: 0, rotate: -25 }}
              animate={
                phase === 'lamp-in'
                  ? { y: 0, opacity: 1, rotate: 0 }
                  : phase === 'lamp-jump'
                  ? { y: [-20, 10, -10, 0], scaleY: [1, 0.7, 1.1, 1], scaleX: [1, 1.25, 0.95, 1] }
                  : { y: 0, opacity: 1, rotate: [0, 8, -4, 0] }
              }
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
              className="relative flex flex-col items-center"
            >
              {/* 3D Lamp Light Beam */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 0.8, 0.4, 0.7], scaleY: [0, 1, 0.9, 1] }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-64 bg-gradient-to-b from-cyan-300/40 via-blue-400/15 to-transparent filter blur-md origin-top pointer-events-none"
                style={{
                  clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                }}
              />

              {/* 3D Lamp SVG Icon */}
              <svg
                className="w-20 h-20 sm:w-24 sm:h-24 text-white drop-shadow-[0_10px_25px_rgba(0,240,255,0.6)]"
                viewBox="0 0 100 100"
                fill="none"
              >
                {/* Lamp Shade Head */}
                <path
                  d="M32 20 L68 20 L80 50 L20 50 Z"
                  fill="url(#lampGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                {/* Bulb Light */}
                <circle cx="50" cy="50" r="12" fill="#00F0FF" className="animate-pulse" />
                {/* Lamp Neck Joints */}
                <path d="M50 20 L50 8 M44 8 L56 8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 50 L35 72 L65 85 L50 95" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {/* Base */}
                <ellipse cx="50" cy="95" rx="24" ry="4" fill="#64748B" stroke="#FFFFFF" strokeWidth="2" />

                <defs>
                  <linearGradient id="lampGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          {/* Pixar 3D Typography Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 30, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.25em' }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="text-5xl sm:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)] tracking-[0.25em] pl-3">
              PIXAR
            </h1>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-3 text-xs sm:text-sm font-mono tracking-[0.4em] uppercase text-cyan-300/80 font-bold"
            >
              3D ANIMATION ARCHIVE
            </motion.span>
          </motion.div>

          {/* Skip Button */}
          <button
            onClick={onComplete}
            className="absolute bottom-8 right-8 text-[11px] font-mono tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer uppercase"
          >
            [ SKIP INTRO ➔ ]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
