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
      {/* PREVIOUS BUTTON (Left Side - Responsive position and size) */}
      <div className="fixed top-1/2 -translate-y-1/2 left-2 sm:left-6 lg:left-8 z-30 select-none">
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous Character"
          className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border border-white/60 hover:border-white backdrop-blur-2xl bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg hover:shadow-2xl active:scale-95 group"
          style={{
            boxShadow: `0 8px 32px 0 rgba(255, 255, 255, 0.15), 0 0 20px ${accentColor}30`,
          }}
        >
          <svg
            className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-transform group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
      </div>

      {/* NEXT BUTTON (Right Side - Responsive position and size) */}
      <div className="fixed top-1/2 -translate-y-1/2 right-2 sm:right-6 lg:right-8 z-30 select-none">
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next Character"
          className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border border-white/60 hover:border-white backdrop-blur-2xl bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg hover:shadow-2xl active:scale-95 group"
          style={{
            boxShadow: `0 8px 32px 0 rgba(255, 255, 255, 0.15), 0 0 20px ${accentColor}30`,
          }}
        >
          <svg
            className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>
    </>
  );
};
