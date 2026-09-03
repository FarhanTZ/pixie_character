import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixieCharacter } from '../data/characters';

interface SelectButtonProps {
  character: PixieCharacter;
  onSelect?: (character: PixieCharacter) => void;
}

export const SelectButton: React.FC<SelectButtonProps> = ({ character, onSelect }) => {
  const [selected, setSelected] = useState<boolean>(false);

  const handleClick = () => {
    setSelected(true);
    if (onSelect) onSelect(character);
    setTimeout(() => {
      setSelected(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-8 sm:bottom-11 left-1/2 -translate-x-1/2 z-30 select-none">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95, y: 0 }}
        className="relative group overflow-hidden px-7 sm:px-9 py-2.5 sm:py-3 rounded-full border border-white/70 hover:border-white backdrop-blur-2xl bg-white/20 hover:bg-white/35 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        style={{
          boxShadow: `0 8px 32px 0 rgba(255, 255, 255, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.6), 0 0 25px ${character.themeColor}35`,
        }}
      >
        {/* Shimmer Light Reflection across crystal glass */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Dynamic Light Glow Accent */}
        <div
          className="absolute inset-0 opacity-25 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${character.themeColor} 0%, transparent 75%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key="selected-state"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-white font-black tracking-[0.2em] text-xs sm:text-sm uppercase font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-400 border border-white flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.9)]">
                  <svg
                    className="w-2.5 h-2.5 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white font-extrabold">PIXIE SELECTED</span>
              </motion.div>
            ) : (
              <motion.div
                key="default-state"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-white font-black tracking-[0.2em] text-xs sm:text-sm uppercase font-mono drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              >
                {/* Glowing status dot */}
                <span
                  className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]"
                  style={{
                    backgroundColor: character.themeColor,
                    boxShadow: `0 0 10px ${character.themeColor}`,
                  }}
                />
                <span className="text-white font-extrabold">
                  SELECT PIXIE
                </span>
                <svg
                  className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform drop-shadow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
};
