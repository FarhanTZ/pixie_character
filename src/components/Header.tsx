import React from 'react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-30 px-6 sm:px-12 py-5 sm:py-6 flex justify-between items-center select-none pointer-events-none">
      {/* Brand Logo Resmi (Pojok Kiri Atas) dari Asset Asli logo.png */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center"
      >
        <img
          src="/assets/pixar/logo/logo.png"
          alt="Pixar Logo"
          className="h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        />
      </motion.div>

      {/* Navigation Sub-label (Pojok Kanan Atas: "CHARACTER SHOWCASE" tanpa kata 3D) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <span className="text-sm sm:text-base lg:text-lg font-bold tracking-[0.25em] uppercase font-mono text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] border-b-2 border-white/40 pb-0.5">
          CHARACTER SHOWCASE
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse shadow-[0_0_12px_rgba(244,114,182,0.9)]" />
      </motion.div>
    </header>
  );
};
