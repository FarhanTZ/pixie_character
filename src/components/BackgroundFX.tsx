import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixarCharacter } from '../data/characters';

interface BackgroundFXProps {
  character: PixarCharacter;
}

export const BackgroundFX: React.FC<BackgroundFXProps> = ({ character }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#070709]">
      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${character.themeColor}12 0%, #070709 75%)`,
          }}
        />
      </AnimatePresence>
    </div>
  );
};
