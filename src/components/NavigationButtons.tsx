import React from 'react';
import { motion } from 'motion/react';

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  accentColor: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  accentColor,
}) => {
  return (
    <>
      {/* Left Navigation Button */}
      <div className="fixed left-4 sm:left-10 top-1/2 -translate-y-1/2 z-30">
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.15, x: -4 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous Character"
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xl border border-white/20 hover:border-white/60 flex items-center justify-center text-white transition-colors duration-300 shadow-2xl cursor-pointer group"
          style={{
            boxShadow: `0 0 30px rgba(0,0,0,0.6)`,
          }}
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-1 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>
      </div>

      {/* Right Navigation Button */}
      <div className="fixed right-4 sm:right-10 top-1/2 -translate-y-1/2 z-30">
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.15, x: 4 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next Character"
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xl border border-white/20 hover:border-white/60 flex items-center justify-center text-white transition-colors duration-300 shadow-2xl cursor-pointer group"
          style={{
            boxShadow: `0 0 30px rgba(0,0,0,0.6)`,
          }}
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-1 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      </div>
    </>
  );
};
