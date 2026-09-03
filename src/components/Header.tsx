import React from 'react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-30 px-6 sm:px-12 py-6 flex justify-between items-center select-none pointer-events-none">
      {/* Brand Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white drop-shadow-md">
          PIXIE
        </h1>
        <span className="text-[10px] tracking-[0.25em] text-white/50 border border-white/20 px-2 py-0.5 rounded-full uppercase">
          Universe
        </span>
      </motion.div>

      {/* Navigation Sub-label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-xs tracking-[0.2em] uppercase font-mono text-white/60 hidden sm:block"
      >
        CHARACTER SHOWCASE
      </motion.div>
    </header>
  );
};
