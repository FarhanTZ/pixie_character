import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixieCharacter } from '../data/characters';

interface CharacterOverlayProps {
  character: PixieCharacter;
  currentIndex: number;
  total: number;
}

export const CharacterOverlay: React.FC<CharacterOverlayProps> = ({
  character,
  currentIndex,
  total,
}) => {
  return (
    <div className="fixed top-24 sm:top-28 left-6 sm:left-12 z-20 pointer-events-none select-none max-w-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-start text-left"
        >
          {/* Subtitle / Element Tag */}
          <div className="text-[11px] sm:text-xs font-mono tracking-[0.35em] uppercase text-white/80 mb-1.5 drop-shadow">
            {character.title} • {character.element}
          </div>

          {/* Main Name */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-none mb-3">
            {character.name}
          </h2>

          {/* Quote / Description */}
          <p className="text-xs sm:text-sm text-white max-w-sm sm:max-w-md font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            "{character.quote}"
          </p>

          {/* Pagination / Step Indicator */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-white shadow-sm'
                      : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono text-white/80 tracking-widest ml-1">
              0{currentIndex + 1} / 0{total}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
