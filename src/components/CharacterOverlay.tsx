import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixarCharacter } from '../data/characters';

interface CharacterOverlayProps {
  character: PixarCharacter;
  currentIndex: number;
  total: number;
}

export const CharacterOverlay: React.FC<CharacterOverlayProps> = ({
  character,
  currentIndex,
  total,
}) => {
  return (
    <>
      {/* 1. TOP-LEFT INFO (Responsive on Mobile, iPad, Desktop) */}
      <div className="fixed top-18 sm:top-24 lg:top-28 left-4 sm:left-8 lg:left-12 z-20 pointer-events-none select-none max-w-[88vw] sm:max-w-lg lg:max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`top-left-${character.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-start text-left"
          >
            {/* Subtitle / Element Tag */}
            <div className="text-[10px] sm:text-xs lg:text-sm font-mono font-semibold tracking-[0.25em] sm:tracking-[0.35em] uppercase text-white/90 mb-1.5 sm:mb-2 drop-shadow">
              {character.title} • {character.element}
            </div>

            {/* Main Name */}
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none mb-2 sm:mb-3.5">
              {character.name}
            </h2>

            {/* Quote */}
            <p className="text-xs sm:text-base lg:text-lg text-white max-w-xs sm:max-w-md lg:max-w-lg font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] line-clamp-2 sm:line-clamp-none">
              "{character.quote}"
            </p>

            {/* Pagination / Step Indicator */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 mt-3 sm:mt-5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {Array.from({ length: total }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 sm:w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                        : 'w-1.5 sm:w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs lg:text-sm font-mono font-bold text-white tracking-widest ml-1 sm:ml-1.5 drop-shadow">
                0{currentIndex + 1} / 0{total}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. BOTTOM-RIGHT (Responsive on Mobile, iPad, Desktop) */}
      <div className="fixed bottom-24 sm:bottom-10 lg:bottom-12 right-4 sm:right-8 lg:right-12 z-20 pointer-events-none select-none max-w-[70vw] sm:max-w-sm lg:max-w-lg text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bottom-right-${character.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-end"
          >
            {/* GAMBAR KARAKTER DI POJOK KANAN BAWAH */}
            <div className="relative w-20 h-20 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] mb-2 sm:mb-3.5 overflow-hidden flex items-center justify-center">
              <img
                src={character.characterImage}
                alt={`${character.name} Character`}
                className="w-full h-full object-cover object-top scale-160 translate-y-3 sm:translate-y-6 pointer-events-none select-none"
                loading="eager"
              />
            </div>

            {/* Spec Taglines */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-2.5 text-[10px] sm:text-xs lg:text-sm font-mono tracking-wider sm:tracking-widest text-white/80 uppercase">
              <span>{character.specs.origin}</span>
              <span className="text-white/40">•</span>
              <span className="text-white font-bold drop-shadow">{character.specs.resonance}</span>
            </div>

            {/* Archive Lore Description (Clean truncation on small screens to prevent overlap) */}
            <p className="text-xs sm:text-sm lg:text-lg text-white font-normal leading-relaxed drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] line-clamp-2 sm:line-clamp-3 lg:line-clamp-none">
              {character.lore}
            </p>

            {/* Class Badge */}
            <div className="mt-2 sm:mt-4 flex items-center gap-2 sm:gap-2.5">
              <span className="text-[10px] sm:text-xs lg:text-sm font-mono tracking-wider sm:tracking-widest text-white/60 uppercase">
                CLASS
              </span>
              <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-xs lg:text-sm font-mono font-bold tracking-wider uppercase rounded-full border border-white/40 text-white backdrop-blur-md bg-white/15 shadow-md">
                {character.specs.classType}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
