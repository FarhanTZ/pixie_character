import React from 'react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-30 px-6 sm:px-12 py-6 sm:py-8 flex justify-between items-center select-none pointer-events-none">
      {/* Brand Title (Kiri Atas) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3.5"
      >
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white drop-shadow-lg">
          PIXAR
        </h1>
        <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-cyan-300 border border-cyan-400/40 px-2.5 py-1 rounded-full uppercase backdrop-blur-sm bg-cyan-950/30">
          3D UNIVERSE
        </span>
      </motion.div>

      {/* Navigation Sub-label (Pojok Kanan Atas) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <span className="text-sm sm:text-base lg:text-lg font-bold tracking-[0.25em] uppercase font-mono text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] border-b-2 border-white/40 pb-0.5">
          3D CHARACTER SHOWCASE
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
      </motion.div>
    </header>
  );
};
