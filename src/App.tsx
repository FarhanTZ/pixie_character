import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { PIXAR_CHARACTERS, PixarCharacter } from './data/characters';
import { Header } from './components/Header';
import { PixarStage } from './components/PixarStage';
import { CharacterOverlay } from './components/CharacterOverlay';
import { NavigationButtons } from './components/NavigationButtons';
import { BackgroundFX } from './components/BackgroundFX';
import { SelectButton } from './components/SelectButton';
import { CharacterDetailPage } from './components/CharacterDetailPage';
import { IntroAnimation } from './components/IntroAnimation';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const characterCount = PIXAR_CHARACTERS.length;

  // Helper: Read initial character & detail state from URL pathname
  const getInitialState = () => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path) {
      const foundIdx = PIXAR_CHARACTERS.findIndex(
        (c) => c.slug === path || c.id === path
      );
      if (foundIdx !== -1) {
        return {
          index: foundIdx,
          selected: PIXAR_CHARACTERS[foundIdx],
        };
      }
    }
    return {
      index: 4,
      selected: null,
    };
  };

  const initial = getInitialState();
  const [currentIndex, setCurrentIndex] = useState<number>(initial.index);
  const [direction, setDirection] = useState<number>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<PixarCharacter | null>(initial.selected);

  const currentCharacter = PIXAR_CHARACTERS[currentIndex];
  const activeChar = selectedCharacter || currentCharacter;

  // Sync browser URL with current navigation & selection
  const updateUrl = (char: PixarCharacter | null) => {
    if (char) {
      window.history.pushState({ slug: char.slug }, '', `/${char.slug}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // Handle browser Back / Forward buttons (PopState event)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (path) {
        const found = PIXAR_CHARACTERS.find((c) => c.slug === path || c.id === path);
        if (found) {
          const idx = PIXAR_CHARACTERS.indexOf(found);
          setCurrentIndex(idx);
          setSelectedCharacter(found);
          return;
        }
      }
      setSelectedCharacter(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % characterCount);
  }, [characterCount]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + characterCount) % characterCount);
  }, [characterCount]);

  // Touch Swipe navigation on Main Showcase view
  useEffect(() => {
    if (selectedCharacter || showIntro) return;

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
  }, [handleNext, handlePrev, selectedCharacter, showIntro]);

  // Keyboard navigation on Main Showcase view (ArrowLeft / ArrowRight)
  useEffect(() => {
    if (selectedCharacter || showIntro) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedCharacter, showIntro]);

  const handleSelectCharacter = (char: PixarCharacter) => {
    setSelectedCharacter(char);
    updateUrl(char);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToGallery = () => {
    setSelectedCharacter(null);
    updateUrl(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070709] text-white">
      {/* Pixar Magical Particle Spark Cursor Trail */}
      <CustomCursor character={showIntro ? undefined : activeChar} />

      {/* Pixar Iconic Opening Intro Animation */}
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      <AnimatePresence mode="wait">
        {selectedCharacter ? (
          /* PAGE 2: Direct URL Scroll-Driven Frame Animation Detail Page */
          <CharacterDetailPage
            key={`detail-${selectedCharacter.id}`}
            character={selectedCharacter}
            onBack={handleBackToGallery}
          />
        ) : (
          /* PAGE 1: Main Fullscreen Showcase */
          <main
            key="showcase-page"
            className="relative w-screen h-screen bg-[#070709] text-white overflow-hidden select-none"
          >
            {/* Background Ambience */}
            <BackgroundFX character={currentCharacter} />

            {/* Top Header Logo & Made by FarhanTZ */}
            <Header />

            {/* Fullscreen Pixar Stage */}
            <PixarStage
              character={currentCharacter}
              direction={direction}
            />

            {/* Left & Right Navigation Buttons */}
            <NavigationButtons
              onPrev={handlePrev}
              onNext={handleNext}
              accentColor={currentCharacter.themeColor}
            />

            {/* Glassmorphic Select Button (Bawah Tengah) */}
            <SelectButton
              character={currentCharacter}
              onSelect={handleSelectCharacter}
            />

            {/* Typography, Character Info Overlay & Bottom-Right Image */}
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
