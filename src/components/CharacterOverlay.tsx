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
    <>
      {/* 1. TOP-LEFT INFO (Character Title, Name, Quote, Pagination) */}
      <div className="fixed top-24 sm:top-28 left-6 sm:left-12 z-20 pointer-events-none select-none max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`top-left-${character.id}`}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 25 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-start text-left"
          >
            {/* Subtitle / Element Tag */}
            <div className="text-xs sm:text-sm font-mono font-semibold tracking-[0.35em] uppercase text-white/90 mb-2 drop-shadow">
              {character.title} • {character.element}
            </div>

            {/* Main Name */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none mb-3.5">
              {character.name}
            </h2>

            {/* Quote */}
            <p className="text-sm sm:text-base lg:text-lg text-white max-w-md sm:max-w-lg font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              "{character.quote}"
            </p>

            {/* Pagination / Step Indicator */}
            <div className="flex items-center gap-3.5 mt-5">
              <div className="flex items-center gap-2">
                {Array.from({ length: total }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                        : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-widest ml-1.5 drop-shadow">
                0{currentIndex + 1} / 0{total}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. BOTTOM-RIGHT (Gambar Karakter di Pojok Kanan Bawah + Lore & Specs) */}
      <div className="fixed bottom-8 sm:bottom-12 right-6 sm:right-12 z-20 pointer-events-none select-none max-w-md lg:max-w-lg text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bottom-right-${character.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-end"
          >
            {/* GAMBAR KARAKTER DI POJOK KANAN BAWAH */}
            <div className="relative w-36 h-36 sm:w-52 sm:h-52 rounded-3xl backdrop-blur-xl bg-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] mb-3.5 overflow-hidden flex items-center justify-center">
              <img
                src={character.characterImage}
                alt={`${character.name} Character`}
                className="w-full h-full object-cover object-top scale-160 translate-y-4 sm:translate-y-7 pointer-events-none select-none"
              />
            </div>

            {/* Spec Taglines */}
            <div className="flex items-center gap-2.5 mb-2.5 text-xs sm:text-sm font-mono tracking-widest text-white/80 uppercase">
              <span>{character.specs.origin}</span>
              <span className="text-white/40">•</span>
              <span className="text-white font-bold drop-shadow">{character.specs.resonance}</span>
            </div>

            {/* Archive Lore Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white font-normal leading-relaxed drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
              {character.lore}
            </p>

            {/* Class Badge */}
            <div className="mt-4 flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-mono tracking-widest text-white/60 uppercase">
                CLASS
              </span>
              <span className="px-3.5 py-1 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase rounded-full border border-white/40 text-white backdrop-blur-md bg-white/15 shadow-md">
                {character.specs.classType}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
