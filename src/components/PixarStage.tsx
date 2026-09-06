import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { PixarCharacter } from '../data/characters';
import { characterAudioManager } from '../utils/audioManager';

interface PixarStageProps {
  character: PixarCharacter;
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

// Smooth Desktop Spring Character Transition
const charVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 0.25,
    x: dir >= 0 ? '50vw' : '-50vw',
    rotate: dir >= 0 ? 8 : -8,
  }),
  center: {
    opacity: 1,
    scale: 1.15,
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

export const PixarStage: React.FC<PixarStageProps> = ({ character, direction }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isNearCursor, setIsNearCursor] = useState<boolean>(false);
  const [isMobilePlaying, setIsMobilePlaying] = useState<boolean>(false);

  // Play distinctive voice audio only on explicit character navigation
  useEffect(() => {
    setIsMobilePlaying(false);
    setIsNearCursor(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Only play character vocal sound on explicit arrow navigation (direction !== 0)
    if (character.audioUrl && direction !== 0) {
      characterAudioManager.play(character.audioUrl);
    }
  }, [character, direction]);

  // DESKTOP ONLY: Proximity Mouse Move Playback
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distX = mouseX - centerX;
      const distY = mouseY - centerY;
      const distance = Math.hypot(distX, distY);
      const proximityRadius = Math.min(window.innerWidth, window.innerHeight) * 0.42;

      if (distance < proximityRadius) {
        setIsNearCursor(true);
      } else {
        setIsNearCursor(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync video play/pause
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const shouldPlay = isNearCursor || isMobilePlaying;

    if (shouldPlay) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isNearCursor, isMobilePlaying]);

  // KHUSUS TOUCHSCREEN / MOBILE ONLY
  const handleTouchToggle = () => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      setIsMobilePlaying((prev) => !prev);
    }
  };

  const isVideoActive = isNearCursor || isMobilePlaying;

  return (
    <div
      onTouchEnd={handleTouchToggle}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
    >
      {/* 1. SEPARATE STATIC BACKGROUND LAYER */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={`bg-${character.id}`}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <img
            src={character.bgImage}
            alt={`${character.name} Background`}
            fetchPriority="high"
            width="1920"
            height="1080"
            className="w-full h-full object-cover object-center pixar-img-smooth"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. SEPARATE STATIC FOREGROUND CHARACTER LAYER */}
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
              fetchPriority="high"
              width="1200"
              height="800"
              className={`w-auto h-[90vh] sm:h-[94vh] max-w-[96vw] sm:max-w-[92vw] object-contain pixar-img-smooth drop-shadow-[0_20px_45px_rgba(0,0,0,0.55)] transition-opacity duration-500 ${
                isVideoActive ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. DIRECT FULLSCREEN VIDEO LAYER */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none z-15 transition-opacity duration-700 ${
          isVideoActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <video
          ref={videoRef}
          key={`vid-${character.id}`}
          src={character.videoUrl}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};
