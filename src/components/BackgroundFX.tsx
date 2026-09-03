import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixieCharacter } from '../data/characters';

interface BackgroundFXProps {
  character: PixieCharacter;
}

export const BackgroundFX: React.FC<BackgroundFXProps> = ({ character }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent" />
  );
};
