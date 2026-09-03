import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PIXIE_CHARACTERS } from './data/characters';
import { Header } from './components/Header';
import { CustomCursor } from './components/CustomCursor';
import { PixieStage } from './components/PixieStage';
import { CharacterOverlay } from './components/CharacterOverlay';
import { NavigationButtons } from './components/NavigationButtons';
import { BackgroundFX } from './components/BackgroundFX';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const characterCount = PIXIE_CHARACTERS.length;
  const currentCharacter = PIXIE_CHARACTERS[currentIndex];
  const lastScrollTimeRef = useRef<number>(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % characterCount);
  }, [characterCount]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + characterCount) % characterCount);
  }, [characterCount]);

  // Wheel / Scroll event listener with throttling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now - lastScrollTimeRef.current < 650) return; // Throttle to allow transition to play

      if (e.deltaY > 20 || e.deltaX > 20) {
        lastScrollTimeRef.current = now;
        handleNext();
      } else if (e.deltaY < -20 || e.deltaX < -20) {
        lastScrollTimeRef.current = now;
        handlePrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev]);

  // Touch Swipe navigation support for mobile / touchpads
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleNext, handlePrev]);

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <main className="relative w-screen h-screen bg-[#070709] text-white overflow-hidden select-none">
      {/* Background Ambience */}
      <BackgroundFX character={currentCharacter} />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Top Header Logo */}
      <Header />

      {/* Fullscreen Pixie Stage (Background + Shrinking/Expanding Character) */}
      <PixieStage
        character={currentCharacter}
        direction={direction}
      />

      {/* Left & Right Navigation Buttons */}
      <NavigationButtons
        onPrev={handlePrev}
        onNext={handleNext}
        accentColor={currentCharacter.themeColor}
      />

      {/* Typography & Character Info Overlay */}
      <CharacterOverlay
        character={currentCharacter}
        currentIndex={currentIndex}
        total={characterCount}
      />
    </main>
  );
}
