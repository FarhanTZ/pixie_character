import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { PIXIE_CHARACTERS, PixieCharacter } from './data/characters';
import { Header } from './components/Header';
import { CustomCursor } from './components/CustomCursor';
import { PixieStage } from './components/PixieStage';
import { CharacterOverlay } from './components/CharacterOverlay';
import { NavigationButtons } from './components/NavigationButtons';
import { BackgroundFX } from './components/BackgroundFX';
import { SelectButton } from './components/SelectButton';
import { CharacterDetailPage } from './components/CharacterDetailPage';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(4);
  const [direction, setDirection] = useState<number>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<PixieCharacter | null>(null);

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

  // Wheel / Scroll event listener on Main Showcase view
  useEffect(() => {
    if (selectedCharacter) return; // Disable showcase wheel when in detail page

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now - lastScrollTimeRef.current < 550) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      if (delta > 15) {
        lastScrollTimeRef.current = now;
        handleNext();
      } else if (delta < -15) {
        lastScrollTimeRef.current = now;
        handlePrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev, selectedCharacter]);

  // Touch Swipe navigation on Main Showcase view
  useEffect(() => {
    if (selectedCharacter) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
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
  }, [handleNext, handlePrev, selectedCharacter]);

  // Keyboard navigation on Main Showcase view
  useEffect(() => {
    if (selectedCharacter) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedCharacter]);

  return (
    <div className="relative w-full min-h-screen bg-[#070709] text-white">
      {/* Custom Cursor */}
      <CustomCursor />

      <AnimatePresence mode="wait">
        {selectedCharacter ? (
          /* PAGE 2: Scroll-Driven Frame Animation Detail Page */
          <CharacterDetailPage
            key="detail-page"
            character={selectedCharacter}
            onBack={() => {
              setSelectedCharacter(null);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        ) : (
          /* PAGE 1: Main Fullscreen Showcase */
          <main
            key="showcase-page"
            className="relative w-screen h-screen bg-[#070709] text-white overflow-hidden select-none"
          >
            {/* Background Ambience */}
            <BackgroundFX character={currentCharacter} />

            {/* Top Header Logo */}
            <Header />

            {/* Fullscreen Pixie Stage */}
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

            {/* Glassmorphic Select Button (Klik untuk masuk ke Page Detail Scroll) */}
            <SelectButton
              character={currentCharacter}
              onSelect={(char) => setSelectedCharacter(char)}
            />

            {/* Typography & Character Info Overlay */}
            <CharacterOverlay
              character={currentCharacter}
              currentIndex={currentIndex}
              total={characterCount}
            />
          </main>
        )}
      </AnimatePresence>
    </div>
  );
}
