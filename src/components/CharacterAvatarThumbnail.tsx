import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixieCharacter } from '../data/characters';

interface CharacterAvatarThumbnailProps {
  character: PixieCharacter;
  onClick?: () => void;
}

export const CharacterAvatarThumbnail: React.FC<CharacterAvatarThumbnailProps> = ({
  character,
  onClick,
}) => {
  return (
    <div className="fixed bottom-8 sm:bottom-12 left-6 sm:left-12 z-30 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={`avatar-${character.id}`}
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -15 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="flex items-center gap-3.5 group cursor-pointer"
          onClick={onClick}
        >
          {/* Avatar Circle Frame with Dynamic Neon Aura */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1 backdrop-blur-2xl bg-white/20 border border-white/50 shadow-[0_8px_24px_rgba(0,0,0,0.35)] group-hover:border-white transition-all duration-300 group-hover:scale-105">
            {/* Glowing Accent Ring */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-40 group-hover:opacity-80 filter blur-sm transition-opacity duration-300 pointer-events-none"
              style={{ backgroundColor: character.themeColor }}
            />

            {/* Cropped Head/Portrait Image Container */}
            <div className="relative z-10 w-full h-full rounded-xl overflow-hidden bg-black/40 border border-white/20 flex items-center justify-center">
              <img
                src={character.characterImage}
                alt={`${character.name} Avatar`}
                className="w-full h-full object-cover object-top scale-135 translate-y-1 group-hover:scale-145 transition-transform duration-300 pointer-events-none"
              />
            </div>

            {/* Active Online Indicator dot */}
            <span
              className="absolute -bottom-1 -right-1 z-20 w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_8px_#fff]"
              style={{
                backgroundColor: character.themeColor,
                boxShadow: `0 0 10px ${character.themeColor}`,
              }}
            />
          </div>

          {/* Quick Info next to Avatar */}
          <div className="flex flex-col items-start drop-shadow">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-white/80 uppercase">
              PORTRAIT 0{character.id.replace('pixie-0', '')}
            </span>
            <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase group-hover:text-white transition-colors">
              {character.name}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
