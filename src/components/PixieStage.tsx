import React from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { PixieCharacter } from '../data/characters';

interface PixieStageProps {
  character: PixieCharacter;
  direction: number;
}

// Ultra Smooth Cinematic Background Transition
const bgVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 1.08,
    x: dir >= 0 ? '5%' : '-5%',
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: '0%',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.96,
    x: dir >= 0 ? '-5%' : '5%',
    transition: {
      duration: 0.7,
      ease: [0.7, 0, 0.84, 0],
    },
  }),
};

// Smooth Spring + Shrink Character Transition
const charVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 0.25,
    x: dir >= 0 ? '50vw' : '-50vw',
    rotate: dir >= 0 ? 8 : -8,
  }),
  center: {
    opacity: 1,
    scale: 1.15, // Scale diperbesar lebih mantap & megah
    x: 0,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 22,
      mass: 0.9,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.18,
    x: dir >= 0 ? '-50vw' : '50vw',
    rotate: dir >= 0 ? -12 : 12,
    transition: {
      duration: 0.45,
      ease: [0.32, 0, 0.67, 0],
    },
  }),
};

export const PixieStage: React.FC<PixieStageProps> = ({ character, direction }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* 1. SEPARATE BACKGROUND LAYER */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={`bg-${character.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={character.bgImage}
            alt={`${character.name} Background`}
            className="w-full h-full object-cover object-center pixie-img-smooth"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. SEPARATE CHARACTER LAYER (Scale Diperbesar & Tetap Halus) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={`char-${character.id}`}
            custom={direction}
            variants={charVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full flex items-center justify-center p-2 sm:p-4"
          >
            <img
              src={character.characterImage}
              alt={character.name}
              className="w-auto h-[90vh] sm:h-[94vh] max-w-[92vw] object-contain pixie-img-smooth drop-shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
