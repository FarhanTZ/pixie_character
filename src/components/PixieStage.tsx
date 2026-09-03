import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixieCharacter } from '../data/characters';

interface PixieStageProps {
  character: PixieCharacter;
  direction: number;
}

export const PixieStage: React.FC<PixieStageProps> = ({ character, direction }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* 1. SEPARATE BACKGROUND LAYER */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={`bg-${character.id}`}
          custom={direction}
          initial={{
            opacity: 0,
            x: direction > 0 ? '100%' : '-100%',
          }}
          animate={{
            opacity: 1,
            x: '0%',
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? '-100%' : '100%',
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={character.bgImage}
            alt={`${character.name} Background`}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. SEPARATE CHARACTER LAYER (Ukuran Sedikit Diperbesar Sesuai Permintaan) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={`char-${character.id}`}
            custom={direction}
            initial={{
              opacity: 0,
              scale: 0.25,
              x: direction > 0 ? '55vw' : '-55vw',
              rotate: direction > 0 ? 10 : -10,
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: 1,
              scale: 1.14, // Diperbesar sedikit dari sebelumnya
              x: 0,
              rotate: 0,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 210,
                damping: 24,
                mass: 0.85,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.18,
              x: direction > 0 ? '-55vw' : '55vw',
              rotate: direction > 0 ? -14 : 14,
              filter: 'blur(12px)',
              transition: {
                duration: 0.45,
                ease: [0.32, 0, 0.67, 0],
              },
            }}
            className="w-full h-full flex items-center justify-center p-2 sm:p-4"
          >
            <img
              src={character.characterImage}
              alt={character.name}
              className="w-auto h-[88vh] sm:h-[92vh] max-w-[90vw] object-contain filter drop-shadow-[0_22px_48px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
