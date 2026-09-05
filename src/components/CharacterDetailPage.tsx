import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixarCharacter, PIXAR_CHARACTERS } from '../data/characters';
import { getRandomBattleWord, DifficultyLevel, DIFFICULTY_SETTINGS } from '../data/gameData';
import { sfxManager } from '../utils/sfxManager';
import { characterAudioManager } from '../utils/audioManager';

interface CharacterSkill {
  name: string;
  tagline: string;
  desc: string;
  color: string;
}

const CHARACTER_SKILLS: Record<string, CharacterSkill> = {
  'pixar-01': {
    name: 'SOLAR FLARE',
    tagline: 'FREEZE TIME 4.5S & 2X SCORE',
    desc: 'Freezes all falling words for 4.5s and doubles score gain',
    color: '#FFD700',
  },
  'pixar-02': {
    name: 'QUANTUM DECRYPT',
    tagline: 'AUTO-HACK 3 LOWEST & +25 HP',
    desc: 'Instantly vaporizes the 3 lowest words and heals 25 HP',
    color: '#00F0FF',
  },
  'pixar-03': {
    name: 'TEMPEST SLOW-MO',
    tagline: '75% SLOW & 2X ENERGY CHARGE',
    desc: 'Reduces falling speed by 75% for 6s with rapid energy regen',
    color: '#00FF9D',
  },
  'pixar-04': {
    name: 'INFERNO OVERDRIVE',
    tagline: 'INCINERATE ALL & +850 BURST',
    desc: 'Vaporizes all words on screen and deals +850 score burst',
    color: '#FF3366',
  },
  'pixar-05': {
    name: 'GRAVITY HARMONIC',
    tagline: 'REVERSE GRAVITY & +35 SHIELD',
    desc: 'Pushes all words back to top, heals 35 HP, and adds +5 combo',
    color: '#D946EF',
  },
};

interface CharacterDetailPageProps {
  character: PixarCharacter;
  onBack: () => void;
}

export const CharacterDetailPage: React.FC<CharacterDetailPageProps> = ({ character, onBack }) => {
  const currentSkill = CHARACTER_SKILLS[character.id] || CHARACTER_SKILLS['pixar-01'];

  const [showDifficultyPicker, setShowDifficultyPicker] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const diffConfig = DIFFICULTY_SETTINGS[difficulty];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isBattleMode, setIsBattleMode] = useState<boolean>(false);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [energy, setEnergy] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [wordsCleared, setWordsCleared] = useState<number>(0);
  const [fallingWords, setFallingWords] = useState<Array<{ id: number; word: string; y: number; speed: number; lane: number }>>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [characterSpeech, setCharacterSpeech] = useState<string | null>(null);
  const [damageNumbers, setDamageNumbers] = useState<Array<{ id: number; text: string; isCrit: boolean; x: number; y: number }>>([]);
  const [battleState, setBattleState] = useState<'playing' | 'victory' | 'gameover'>('playing');
  const [skillBanner, setSkillBanner] = useState<{ title: string; subtitle: string; color: string } | null>(null);

  const wordsTypedRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const nextWordIdRef = useRef<number>(1);
  const spawnTimerRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const fallingWordsRef = useRef<Array<{ id: number; word: string; y: number; speed: number; lane: number }>>([]);
  const lastLaneRef = useRef<number>(-1);
  const freezeUntilRef = useRef<number>(0);
  const slowUntilRef = useRef<number>(0);
  const [hitFlash, setHitFlash] = useState<boolean>(false);

  // Preload frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < character.frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${character.frameFolder}/frame_${numStr}.webp`;
      img.decoding = 'async';
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [character]);

  // Scroll listener for archive mode
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = Math.max(0, Math.min(1, currentScroll / (totalScroll || 1)));
          setScrollProgress(progress);
          targetFrameRef.current = progress * (character.frameCount - 1);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [character]);

  // 60FPS Lerp Loop for Canvas Rendering
  useEffect(() => {
    let rafId: number;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (canvas && imagesRef.current.length > 0) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.01) {
          currentFrameRef.current += diff * 0.2;
        } else {
          currentFrameRef.current = targetFrameRef.current;
        }

        const frameIdx = Math.max(
          0,
          Math.min(imagesRef.current.length - 1, Math.round(currentFrameRef.current))
        );

        if (frameIdx !== lastDrawnFrameRef.current) {
          const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
          const img = imagesRef.current[frameIdx];

          if (ctx && img && img.complete && img.naturalWidth > 0) {
            const parentWidth = canvas.parentElement?.clientWidth || window.innerWidth;
            const parentHeight = canvas.parentElement?.clientHeight || window.innerHeight;

            if (canvas.width !== parentWidth || canvas.height !== parentHeight) {
              canvas.width = parentWidth;
              canvas.height = parentHeight;
            }

            const hRatio = canvas.width / img.naturalWidth;
            const vRatio = canvas.height / img.naturalHeight;
            const ratio = Math.max(hRatio, vRatio);

            const centerShiftX = (canvas.width - img.naturalWidth * ratio) / 2;
            const centerShiftY = (canvas.height - img.naturalHeight * ratio) / 2;

            ctx.drawImage(
              img,
              0,
              0,
              img.naturalWidth,
              img.naturalHeight,
              centerShiftX,
              centerShiftY,
              img.naturalWidth * ratio,
              img.naturalHeight * ratio
            );
            lastDrawnFrameRef.current = frameIdx;
          }
        }
      }
      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [character]);

  // Web Audio API SFX (Using persistent AudioContext singleton)
  const playSfx = useCallback((type: 'key' | 'correct' | 'error' | 'crit' | 'enemyHit' | 'victory') => {
    sfxManager.play(type);
  }, []);

  // Advance frame animation when typing
  const advanceFrame = (step = 2.5) => {
    targetFrameRef.current = (targetFrameRef.current + step) % (character.frameCount || 96);
  };

  // Spawn damage / score floater inside character canvas
  const spawnDamage = (text: string, type: 'crit' | 'hit' | 'miss') => {
    const id = Date.now() + Math.random();
    // Random position within character canvas: 20% to 80% horizontal, 25% to 75% vertical
    const randomLeft = 20 + Math.random() * 60;
    const randomTop = 25 + Math.random() * 50;

    setDamageNumbers((prev) => [
      ...prev,
      {
        id,
        text,
        isCrit: type === 'crit',
        x: randomLeft, // stored as percentage
        y: randomTop,  // stored as percentage
      },
    ]);
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 1100);
  };

  // Spawn word from data (with anti-overlap lane algorithm)
  const spawnWord = useCallback(() => {
    const minLen = diffConfig.minLen;
    const maxLen = diffConfig.maxLen;
    const randomWord = getRandomBattleWord(minLen, maxLen);

    const currentWords = fallingWordsRef.current;

    // Find available lane that doesn't have a word near the top (y < 28%)
    const availableLanes = [0, 1, 2].filter((lane) => {
      return !currentWords.some((w) => w.lane === lane && w.y < 28);
    });

    let selectedLane: number;
    if (availableLanes.length > 0) {
      const diffLanes = availableLanes.filter((l) => l !== lastLaneRef.current);
      selectedLane = diffLanes.length > 0
        ? diffLanes[Math.floor(Math.random() * diffLanes.length)]
        : availableLanes[Math.floor(Math.random() * availableLanes.length)];
    } else {
      const topWordPerLane = [0, 1, 2].map((lane) => {
        const wordsInLane = currentWords.filter((w) => w.lane === lane);
        const topY = wordsInLane.reduce((min, w) => Math.min(min, w.y), 100);
        return { lane, topY };
      });
      topWordPerLane.sort((a, b) => b.topY - a.topY);
      selectedLane = topWordPerLane[0].lane;
      if (topWordPerLane[0].topY < 18) return;
    }

    lastLaneRef.current = selectedLane;

    if (currentWords.some((w) => w.word === randomWord)) return;

    const baseSpeed = (diffConfig.baseSpeed * 0.5) + Math.min(wordsCleared * 0.0015, 0.04);

    const newWord = {
      id: nextWordIdRef.current++,
      word: randomWord,
      y: 0,
      speed: baseSpeed,
      lane: selectedLane,
    };

    fallingWordsRef.current = [...fallingWordsRef.current, newWord];
    setFallingWords(fallingWordsRef.current);
  }, [diffConfig, wordsCleared]);

  // Battle Mode Game Loop (smooth falling word animation, skill modifiers, and collision)
  useEffect(() => {
    if (!isBattleMode || battleState !== 'playing') return;

    spawnTimerRef.current = window.setInterval(() => {
      spawnWord();
    }, diffConfig.spawnIntervalMs);

    spawnWord();
    const t = setTimeout(() => spawnWord(), Math.round(diffConfig.spawnIntervalMs / 2));

    let lastTime = performance.now();
    const updateLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67, 2.0);
      lastTime = now;

      const nowTime = performance.now();
      const isFrozen = nowTime < freezeUntilRef.current;
      const isSlowed = nowTime < slowUntilRef.current;
      const speedMultiplier = isFrozen ? 0 : isSlowed ? 0.25 : 1.0;

      const missedWords: Array<{ id: number; lane: number }> = [];
      const remaining: Array<{ id: number; word: string; y: number; speed: number; lane: number }> = [];

      for (const w of fallingWordsRef.current) {
        const nextY = w.y + (w.speed * speedMultiplier) * delta;
        // Word travels all the way down to bottom (88%) before disappearing and deducting HP
        if (nextY >= 88) {
          missedWords.push({ id: w.id, lane: w.lane });
        } else {
          remaining.push({ ...w, y: nextY });
        }
      }

      fallingWordsRef.current = remaining;
      setFallingWords(remaining);

      if (missedWords.length > 0) {
        playSfx('enemyHit');
        setCombo(0);
        setHitFlash(true);
        setTimeout(() => setHitFlash(false), 250);

        for (const _m of missedWords) {
          spawnDamage(`-${diffConfig.damagePerMiss} HP MISS!`, 'miss');
        }

        setPlayerHp((hp) => {
          const nextHp = hp - missedWords.length * diffConfig.damagePerMiss;
          if (nextHp <= 0) {
            setBattleState('gameover');
            return 0;
          }
          return nextHp;
        });
      }

      gameLoopRef.current = requestAnimationFrame(updateLoop);
    };

    gameLoopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      clearTimeout(t);
      if (spawnTimerRef.current !== null) clearInterval(spawnTimerRef.current);
      if (gameLoopRef.current !== null) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isBattleMode, battleState, spawnWord, playSfx, diffConfig]);

  // Focus input on battle mode
  useEffect(() => {
    if (isBattleMode && battleState === 'playing') {
      const interval = setInterval(() => inputRef.current?.focus(), 500);
      return () => clearInterval(interval);
    }
  }, [isBattleMode, battleState]);

  // Typing Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isBattleMode || battleState !== 'playing') return;

    const val = e.target.value.toUpperCase();
    setUserInput(val);
    playSfx('key');
    advanceFrame(2);

    const matchedIdx = fallingWordsRef.current.findIndex((w) => w.word === val);
    if (matchedIdx !== -1) {
      const matched = fallingWordsRef.current[matchedIdx];
      wordsTypedRef.current += 1;
      const elapsedMins = Math.max((Date.now() - startTimeRef.current) / 60000, 0.05);
      const calculatedWpm = Math.round(wordsTypedRef.current / elapsedMins);
      setWpm(calculatedWpm);

      advanceFrame(8);

      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      const isCrit = newCombo % 4 === 0;
      const basePoints = Math.round((120 + matched.word.length * 20) * diffConfig.scoreMultiplier);
      const points = isCrit ? Math.round(basePoints * 2.2) : basePoints;

      // Check Aurora Lumina 2x score during Solar Flare freeze
      const isAuroraFrozen = performance.now() < freezeUntilRef.current;
      const finalPoints = isAuroraFrozen ? points * 2 : points;

      setScore((prev) => prev + finalPoints * Math.max(1, Math.floor(newCombo / 3)));
      setWordsCleared((prev) => {
        const next = prev + 1;
        if (next >= diffConfig.targetWords) {
          setBattleState('victory');
          playSfx('victory');
        }
        return next;
      });

      if (newCombo >= 2) {
        const battleQuotes = [
          `"${character.quote}"`,
          `Feel my ${character.element}!`,
          `Resonance Maximum!`,
          `Combo x${newCombo}! Clean strike!`,
          `Unstoppable Energy!`,
        ];
        const selectedQuote = newCombo % 3 === 0 ? `"${character.quote}"` : battleQuotes[newCombo % battleQuotes.length];
        setCharacterSpeech(selectedQuote);

        if (speechTimeoutRef.current !== null) clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = window.setTimeout(() => setCharacterSpeech(null), 1800);
      }

      // Energy charge (Vortex Sylph gains 2x energy)
      const energyGain = character.id === 'pixar-03' ? 25 : 15;
      setEnergy((prev) => Math.min(100, prev + energyGain));

      spawnDamage(
        isAuroraFrozen
          ? `2X SOLAR +${finalPoints}`
          : isCrit
          ? `CRIT +${finalPoints}`
          : `+${finalPoints}`,
        isCrit || isAuroraFrozen ? 'crit' : 'hit'
      );
      playSfx(isCrit || isAuroraFrozen ? 'crit' : 'correct');

      fallingWordsRef.current = fallingWordsRef.current.filter((w) => w.id !== matched.id);
      setFallingWords(fallingWordsRef.current);
      setUserInput('');
    }
  };

  // Unique Character Skill Activation (Spacebar / Button)
  const handleActivateSkill = () => {
    if (energy < 100 || !isBattleMode || battleState !== 'playing') return;

    setEnergy(0);
    playSfx('crit');
    advanceFrame(25);

    // Show skill announcement banner
    setSkillBanner({
      title: `${character.name}: ${currentSkill.name}`,
      subtitle: currentSkill.tagline,
      color: currentSkill.color,
    });
    setTimeout(() => setSkillBanner(null), 3200);

    const nowTime = performance.now();

    if (character.id === 'pixar-01') {
      // 1. AURORA LUMINA: Solar Flare (Freeze time for 4.5s & 2x Score)
      freezeUntilRef.current = nowTime + 4500;
      spawnDamage('SOLAR FLARE: TIME FROZEN 4.5S!', 'crit');
    } else if (character.id === 'pixar-02') {
      // 2. CYBER NYX: Quantum Decrypt (Auto-hacks the 3 lowest words + heals 25 HP)
      const sorted = [...fallingWordsRef.current].sort((a, b) => b.y - a.y);
      const toRemove = sorted.slice(0, 3);
      const removeIds = new Set(toRemove.map((w) => w.id));

      fallingWordsRef.current = fallingWordsRef.current.filter((w) => !removeIds.has(w.id));
      setFallingWords(fallingWordsRef.current);
      setWordsCleared((prev) => prev + toRemove.length);
      setScore((prev) => prev + 450);
      setPlayerHp((hp) => Math.min(100, hp + 25));
      spawnDamage('QUANTUM DECRYPT: +25 HP & 3 HACKED!', 'crit');
    } else if (character.id === 'pixar-03') {
      // 3. VORTEX SYLPH: Tempest Slow-Mo (75% slow for 6s + rapid energy regen)
      slowUntilRef.current = nowTime + 6000;
      spawnDamage('TEMPEST SLOW-MO: 75% SPEED SLOW!', 'crit');
    } else if (character.id === 'pixar-04') {
      // 4. IGNIS VALKYRIE: Inferno Overdrive (Incinerate all words on screen + 850 score)
      const count = fallingWordsRef.current.length;
      const totalDmg = 850 + count * 100;
      setScore((prev) => prev + totalDmg);
      setWordsCleared((prev) => prev + count);
      fallingWordsRef.current = [];
      setFallingWords([]);
      spawnDamage(`INFERNO OVERDRIVE: +${totalDmg}!`, 'crit');
    } else if (character.id === 'pixar-05') {
      // 5. NEBULA SIREN: Gravity Harmonic (Reverse gravity to top + heal 35 HP + 5 Combo)
      fallingWordsRef.current = fallingWordsRef.current.map((w) => ({ ...w, y: Math.max(0, w.y - 65) }));
      setFallingWords(fallingWordsRef.current);
      setPlayerHp((hp) => Math.min(100, hp + 35));
      setCombo((prev) => prev + 5);
      setMaxCombo((prev) => Math.max(prev, combo + 5));
      spawnDamage('GRAVITY HARMONIC: REVERSED & +35 HP!', 'crit');
    }

    setUserInput('');
  };

  const handleClearInput = useCallback(() => {
    setUserInput('');
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Escape' || (e.ctrlKey && e.code === 'Backspace')) && isBattleMode) {
        e.preventDefault();
        handleClearInput();
      } else if (e.code === 'Space' && energy >= 100 && isBattleMode) {
        e.preventDefault();
        handleActivateSkill();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [energy, isBattleMode, handleClearInput]);

  const handleStartBattle = (selectedDiff?: DifficultyLevel) => {
    const activeDiff = selectedDiff || difficulty;
    setDifficulty(activeDiff);
    setShowDifficultyPicker(false);
    setIsBattleMode(true);
    setBattleState('playing');
    setUserInput('');
    setPlayerHp(100);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setEnergy(0);
    setWordsCleared(0);
    setSkillBanner(null);
    freezeUntilRef.current = 0;
    slowUntilRef.current = 0;
    fallingWordsRef.current = [];
    setFallingWords([]);
    startTimeRef.current = Date.now();
    wordsTypedRef.current = 0;
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const handleExitBattle = () => {
    setIsBattleMode(false);
    setShowDifficultyPicker(false);
    setUserInput('');
    fallingWordsRef.current = [];
    setFallingWords([]);
  };

  const handleBack = () => {
    setUserInput('');
    characterAudioManager.stop();
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
      className={`relative w-full ${isBattleMode ? 'h-screen overflow-hidden' : 'min-h-[350vh] sm:min-h-[400vh]'} bg-[#070709] text-white select-none overflow-x-hidden`}
    >
      {/* 1. LAYER 1: SEPARATE FIXED FULLSCREEN BACKGROUND */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 transform-gpu">
        <img
          src={character.bgImage}
          alt={`${character.name} Background`}
          className="w-full h-full object-cover object-center filter brightness-105"
          loading="eager"
        />
      </div>

      {/* 2. LAYER 2: ANIMATED CHARACTER STAGE (TETAP SAMA DI SISI KANAN BAIK SAAT SCROLL ATAUPUN SAAT TYPING BATTLE) */}
      <div className="fixed top-0 right-0 w-full lg:w-[50vw] xl:w-[52vw] h-full pointer-events-none z-10 flex items-center justify-center p-2 sm:p-6 lg:p-8 transform-gpu">
        <div className="relative w-full h-full max-h-[85vh] sm:max-h-[90vh] lg:max-h-[92vh] rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.5)] border border-white/20">
          
          {/* CHARACTER SPEECH BUBBLE ON COMBO (TRANSPARENT, NO EMOJI) */}
          <AnimatePresence>
            {characterSpeech && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="absolute top-16 sm:top-20 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-sm z-50 bg-black/40 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-none"
              >
                <p className="text-xs sm:text-sm lg:text-base font-mono font-bold text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wider text-center sm:text-left">
                  {characterSpeech}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FLOATING DAMAGE / SCORE NUMBERS ACROSS CHARACTER STAGE */}
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
              {damageNumbers.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, scale: 0.5, y: 15 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: d.isCrit ? [0.6, 1.4, 1.3, 1.0] : [0.6, 1.15, 1.1, 0.9],
                    y: d.text.includes('MISS') ? [15, 30, 45] : [-5, -35, -55],
                  }}
                  transition={{ duration: 1.0, ease: 'easeOut', times: [0, 0.2, 0.7, 1] }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl lg:text-3xl font-black font-mono tracking-wider drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)] whitespace-nowrap px-3 py-1 rounded-xl backdrop-blur-sm border ${
                    d.text.includes('MISS')
                      ? 'text-rose-400 bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                      : d.isCrit
                      ? 'text-amber-300 bg-amber-950/40 border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.7)]'
                      : 'text-cyan-300 bg-cyan-950/40 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.6)]'
                  }`}
                  style={{
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                  }}
                >
                  {d.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
        </div>
      </div>

      {/* 3. TOP FIXED NAVIGATION BAR (Responsive Frosted Glass) */}
      <header className="fixed top-0 left-0 w-full z-40 px-4 sm:px-8 lg:px-12 py-3.5 sm:py-5 flex justify-between items-center select-none backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="flex items-center gap-3">
          <button
            onClick={isBattleMode ? handleExitBattle : handleBack}
            className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/25 hover:bg-white/40 border border-white/60 text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 drop-shadow"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>{isBattleMode ? 'EXIT BATTLE' : 'BACK TO ARCHIVE'}</span>
          </button>
        </div>

        {/* CENTER STATS WHEN IN BATTLE MODE */}
        {isBattleMode && (
          <div className="flex items-center gap-3 sm:gap-4 bg-white/25 backdrop-blur-2xl px-4 sm:px-5 py-1.5 rounded-2xl border border-white/60 shadow-lg">
            {/* Active Difficulty Badge */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider border shadow-sm ${
                difficulty === 'easy'
                  ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                  : difficulty === 'medium'
                  ? 'bg-amber-400 text-amber-950 border-amber-300'
                  : 'bg-rose-500 text-white border-rose-300'
              }`}
            >
              {difficulty}
            </span>

            <div className="h-5 w-px bg-white/40" />

            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-white/90 font-bold uppercase">SCORE</span>
              <span className="text-sm sm:text-base font-mono font-black text-amber-300 drop-shadow">{score}</span>
            </div>
            <div className="h-6 w-px bg-white/40" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-white/90 font-bold uppercase">COMBO</span>
              <span className="text-sm sm:text-base font-mono font-black text-pink-300 drop-shadow">{combo}x</span>
            </div>
            <div className="h-6 w-px bg-white/40" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-white/90 font-bold uppercase">CLEARED</span>
              <span className="text-sm sm:text-base font-mono font-black text-cyan-300 drop-shadow">
                {wordsCleared}/{diffConfig.targetWords}
              </span>
            </div>
            <div className="h-6 w-px bg-white/40" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-white/90 font-bold uppercase">SHIELD</span>
              <span className="text-sm sm:text-base font-mono font-black text-emerald-300 drop-shadow">{playerHp}%</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span
            className="px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase rounded-full border border-white/60 backdrop-blur-xl bg-white/20 text-white shadow-lg"
          >
            {character.element}
          </span>
        </div>
      </header>

      {/* 4. SCROLL PROGRESS BAR (Desktop & iPad Landscape) - Hidden in Battle Mode */}
      {!isBattleMode && (
        <div className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none hidden lg:flex">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white tracking-widest -rotate-90 origin-center mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            FRAME SCROLL
          </span>
          <div className="w-2 h-32 sm:h-36 bg-black/30 backdrop-blur-md rounded-full overflow-hidden border border-white/40 shadow-lg">
            <div
              className="w-full rounded-full transition-all duration-150"
              style={{
                height: `${scrollProgress * 100}%`,
                backgroundColor: character.themeColor,
                boxShadow: `0 0 12px ${character.themeColor}`,
              }}
            />
          </div>
          <span className="text-xs font-mono text-white font-black mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      )}

      {/* 5. CONTENT AREA: JIKA BATTLE MODE AKTIF, TAMPILKAN STREAM KATA & TYPING DECK DI SEBELAH KIRI (KANAN TETAP STAGE CANVAS) */}
      {isBattleMode ? (
        <div className="relative z-30 w-full px-4 sm:px-8 lg:pl-48 xl:pl-64 2xl:pl-72 pt-24 pb-8 h-screen flex flex-col justify-between pointer-events-auto">
          <div className="w-full max-w-md lg:max-w-[480px] xl:max-w-[500px] flex flex-col justify-between h-[82vh] my-auto">
              
              {/* STREAM ARENA */}
              <div className={`relative w-full flex-1 rounded-3xl bg-black/35 backdrop-blur-xl border ${hitFlash ? 'border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.85)]' : 'border-white/30'} overflow-hidden shadow-2xl p-4 transition-all duration-150`}>
                {/* 3 Lane Lines */}
                <div className="absolute inset-0 grid grid-cols-3 divide-x divide-white/10 pointer-events-none" />

                {/* Falling Words List */}
                {fallingWords.map((item) => {
                  const laneX = item.lane === 0 ? 'left-[16%]' : item.lane === 1 ? 'left-[50%]' : 'left-[84%]';
                  const isTargetPrefix = userInput.length > 0 && item.word.startsWith(userInput);

                  return (
                    <div
                      key={item.id}
                      className={`absolute -translate-x-1/2 pointer-events-none ${laneX}`}
                      style={{ top: `${item.y}%`, willChange: 'top' }}
                    >
                      <div
                        className={`px-4 py-1.5 rounded-2xl font-mono font-black text-sm sm:text-base lg:text-lg tracking-widest shadow-xl flex items-center gap-1 border ${
                          isTargetPrefix
                            ? 'bg-amber-400 text-black border-yellow-200 scale-110 shadow-[0_0_20px_#facc15]'
                            : item.y > 72
                            ? 'bg-rose-600/90 text-white border-rose-400 animate-bounce shadow-[0_0_15px_#f43f5e]'
                            : 'bg-white/30 text-white border-white/60 backdrop-blur-md'
                        }`}
                      >
                        <span>{item.word}</span>
                      </div>
                    </div>
                  );
                })}

                {/* SKILL ACTIVATION ANNOUNCEMENT BANNER */}
                <AnimatePresence>
                  {skillBanner && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                      className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] pointer-events-none"
                    >
                      <div
                        className="px-4 py-3 rounded-2xl backdrop-blur-2xl border flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                        style={{
                          backgroundColor: `${skillBanner.color}25`,
                          borderColor: skillBanner.color,
                          boxShadow: `0 0 25px ${skillBanner.color}60`,
                        }}
                      >
                        <span
                          className="font-mono font-black text-xs sm:text-sm uppercase tracking-widest drop-shadow"
                          style={{ color: skillBanner.color }}
                        >
                          {skillBanner.title}
                        </span>
                        <span className="font-mono text-[10px] sm:text-xs text-white/90 font-medium tracking-wide mt-0.5">
                          {skillBanner.subtitle}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Danger Line */}
                <div className="absolute bottom-2 inset-x-0 h-1 bg-gradient-to-r from-rose-500/20 via-rose-500/80 to-rose-500/20 pointer-events-none animate-pulse" />
              </div>

              {/* TYPING INPUT & ULTIMATE BAR */}
              <div className="relative w-full flex flex-col items-center gap-2.5 mt-3.5">
                <div className="relative w-full flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="TYPE FALLING WORD..."
                    autoFocus
                    className="w-full text-center py-3 sm:py-3.5 pl-6 pr-24 rounded-full bg-white/35 border-2 border-white/90 focus:border-cyan-300 focus:outline-none text-white font-mono font-black text-lg sm:text-xl lg:text-2xl tracking-[0.25em] uppercase backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.3)] placeholder:text-white/60 drop-shadow"
                  />
                  <AnimatePresence>
                    {userInput.length > 0 && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={handleClearInput}
                        className="absolute right-3 px-3 py-1.5 rounded-full bg-white/25 hover:bg-white/45 border border-white/50 text-white font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow cursor-pointer active:scale-95"
                        title="Clear Typed Text (ESC)"
                      >
                        CLEAR (ESC)
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between w-full px-2">
                  <div className="flex items-center gap-3 flex-1 mr-4">
                    <span className="text-[10px] sm:text-xs font-mono font-black text-white tracking-widest drop-shadow">
                      SKILL:
                    </span>
                    <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/50 shadow-inner">
                      <motion.div
                        animate={{ width: `${energy}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-300 shadow-[0_0_12px_rgba(244,114,182,0.8)]"
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={handleActivateSkill}
                    disabled={energy < 100}
                    whileHover={energy >= 100 ? { scale: 1.06 } : {}}
                    whileTap={energy >= 100 ? { scale: 0.94 } : {}}
                    className={`px-4 sm:px-5 py-2 rounded-full font-mono font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                      energy >= 100
                        ? 'bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-300 text-black animate-pulse shadow-[0_0_20px_rgba(244,114,182,0.9)]'
                        : 'bg-white/20 text-white/50 border border-white/30 cursor-not-allowed backdrop-blur-md'
                    }`}
                  >
                    {energy >= 100 ? `${currentSkill.name} (SPACE)` : `${energy}% CHARGED`}
                  </motion.button>
                </div>

                {/* SHORTCUT HINTS */}
                <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono font-bold text-white/70 tracking-wider">
                  <span>[ESC] CLEAR INPUT</span>
                  <span>•</span>
                  <span>[SPACE] {currentSkill.name}</span>
                </div>
              </div>

            </div>
        </div>
      ) : (
        /* 5. SCROLLABLE STORY & LORE CONTENT SECTIONS (Saat Mode Normal/Archive) */
        <div className="relative z-20 w-full px-4 sm:px-8 lg:pl-48 xl:pl-64 2xl:pl-72 pt-28 pb-16">
          <div className="w-full max-w-md lg:max-w-[480px] xl:max-w-[500px] flex flex-col space-y-16 lg:space-y-0">
            {/* Section 1: Hero Overview */}
            <section className="min-h-[80vh] lg:min-h-screen flex flex-col justify-center py-8 lg:py-16">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-2xl bg-white/20 p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {!showDifficultyPicker ? (
                      /* STATE A: NORMAL CHARACTER SPECIFICATION CARD */
                      <motion.div
                        key="character-spec"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/90 mb-2 drop-shadow">
                          PIXAR SPECIFICATION
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-3 sm:mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                          {character.name}
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-white italic font-medium mb-3 sm:mb-5 drop-shadow">
                          "{character.quote}"
                        </p>
                        <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal drop-shadow mb-5 sm:mb-6">
                          {character.lore}
                        </p>
                        <div className="flex flex-col items-stretch">
                          <motion.button
                            onClick={() => setShowDifficultyPicker(true)}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97, y: 0 }}
                            className="relative group overflow-hidden w-full py-3.5 px-6 rounded-full border border-white/70 hover:border-white backdrop-blur-2xl bg-white/20 hover:bg-white/35 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                            style={{
                              boxShadow: `0 8px 32px 0 rgba(255, 255, 255, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.6), 0 0 25px ${character.themeColor}35`,
                            }}
                          >
                            {/* Shimmer Light Reflection */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                            {/* Dynamic Glow Accent */}
                            <div
                              className="absolute inset-0 opacity-25 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none rounded-full"
                              style={{
                                background: `radial-gradient(circle at center, ${character.themeColor} 0%, transparent 75%)`,
                              }}
                            />

                            {/* Content */}
                            <div className="relative z-10 flex items-center justify-center gap-2.5 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-[0.2em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                              <span
                                className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]"
                                style={{
                                  backgroundColor: character.themeColor,
                                  boxShadow: `0 0 10px ${character.themeColor}`,
                                }}
                              />
                              <span className="font-extrabold whitespace-nowrap">
                                PLAY TYPING BATTLE
                              </span>
                              <svg
                                className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform drop-shadow"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </div>
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      /* STATE B: MORPHED INTO DIFFICULTY SELECTOR CARD */
                      <motion.div
                        key="difficulty-picker"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-white/90 drop-shadow">
                            CHALLENGE LEVEL
                          </div>
                          <button
                            onClick={() => setShowDifficultyPicker(false)}
                            className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/40 text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-all border border-white/40 cursor-pointer"
                          >
                            ✕ CANCEL
                          </button>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                          SELECT DIFFICULTY
                        </h2>
                        <p className="text-xs text-white/90 leading-relaxed font-mono mb-4 drop-shadow">
                          Choose your typing speed & word complexity before launching into combat with {character.name}.
                        </p>

                        <div className="space-y-2.5 w-full">
                          {/* 1. EASY */}
                          <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartBattle('easy')}
                            className="w-full text-left p-3.5 rounded-2xl bg-white/20 hover:bg-emerald-500/30 border border-emerald-400/50 hover:border-emerald-300 transition-all cursor-pointer shadow-lg group flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                <span className="font-mono font-black text-sm text-emerald-300 uppercase tracking-wider">
                                  EASY
                                </span>
                                <span className="text-[9px] font-mono text-white/70 px-2 py-0.5 rounded-full bg-black/30 border border-white/20">
                                  1.0x SCORE
                                </span>
                              </div>
                              <span className="text-[11px] text-white/90 font-mono mt-1">
                                Short 3–5 letter words • Relaxed speed • 25 target
                              </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-emerald-400 group-hover:text-emerald-950 flex items-center justify-center text-white transition-all shadow">
                              ➔
                            </div>
                          </motion.button>

                          {/* 2. MEDIUM */}
                          <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartBattle('medium')}
                            className="w-full text-left p-3.5 rounded-2xl bg-white/20 hover:bg-amber-500/30 border border-amber-400/50 hover:border-amber-300 transition-all cursor-pointer shadow-lg group flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                                <span className="font-mono font-black text-sm text-amber-300 uppercase tracking-wider">
                                  MEDIUM (RECOMMENDED)
                                </span>
                                <span className="text-[9px] font-mono text-amber-300 px-2 py-0.5 rounded-full bg-black/30 border border-amber-400/40 font-bold">
                                  1.5x SCORE
                                </span>
                              </div>
                              <span className="text-[11px] text-white/90 font-mono mt-1">
                                Standard 5–8 letter words • Normal speed • 35 target
                              </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-amber-400 group-hover:text-amber-950 flex items-center justify-center text-white transition-all shadow">
                              ➔
                            </div>
                          </motion.button>

                          {/* 3. HARD */}
                          <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartBattle('hard')}
                            className="w-full text-left p-3.5 rounded-2xl bg-white/20 hover:bg-rose-500/30 border border-rose-400/50 hover:border-rose-300 transition-all cursor-pointer shadow-lg group flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                                <span className="font-mono font-black text-sm text-rose-300 uppercase tracking-wider">
                                  HARD (PRO MODE)
                                </span>
                                <span className="text-[9px] font-mono text-rose-300 px-2 py-0.5 rounded-full bg-black/30 border border-rose-400/40 font-bold">
                                  2.2x SCORE
                                </span>
                              </div>
                              <span className="text-[11px] text-white/90 font-mono mt-1">
                                Complex 7–12 letter words • Fast speed • 50 target
                              </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center text-white transition-all shadow">
                              ➔
                            </div>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* SCROLL TO ADVANCE ANIMATION HINT (BELOW CARD) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-white/80 tracking-widest drop-shadow py-1"
                >
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white animate-ping shadow-[0_0_8px_#fff]" />
                  <span>SCROLL TO ADVANCE ANIMATION</span>
                </motion.div>
              </section>

            {/* Section 2: Genesis & Backstory */}
            <section className="min-h-[80vh] lg:min-h-screen flex flex-col justify-center py-8 lg:py-16">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-2xl bg-white/20 p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/90 mb-2 drop-shadow">
                  ORIGIN & GENESIS
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3 sm:mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {character.specs.origin}
                </h2>
                <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal mb-5 sm:mb-6 drop-shadow">
                  {character.details.backstory}
                </p>
                <div className="flex gap-2.5 sm:gap-3 flex-wrap">
                  <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono font-bold bg-white/25 rounded-full border border-white/60 text-white shadow">
                    RESONANCE: {character.specs.resonance}
                  </span>
                  <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono font-bold bg-white/25 rounded-full border border-white/60 text-white shadow">
                    CLASS: {character.specs.classType}
                  </span>
                </div>
              </motion.div>
            </section>

            {/* Section 3: Combat Abilities */}
            <section className="min-h-[80vh] lg:min-h-screen flex flex-col justify-center py-8 lg:py-16">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-2xl bg-white/20 p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/90 mb-2 drop-shadow">
                  COMBAT ABILITIES
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4 sm:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  TACTICAL ARSENAL
                </h2>

                <div className="space-y-3 sm:space-y-3.5">
                  {/* 00 / ACTIVE TYPING BATTLE SKILL */}
                  <div
                    className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border backdrop-blur-md shadow-lg"
                    style={{
                      backgroundColor: `${currentSkill.color}18`,
                      borderColor: `${currentSkill.color}60`,
                      boxShadow: `0 0 25px ${currentSkill.color}25`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                          style={{ backgroundColor: currentSkill.color, color: currentSkill.color }}
                        />
                        <span
                          className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest"
                          style={{ color: currentSkill.color }}
                        >
                          TYPING BATTLE SKILL [SPACE]
                        </span>
                      </div>
                      <span
                        className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-black/30"
                        style={{ color: currentSkill.color, borderColor: `${currentSkill.color}60` }}
                      >
                        100% ENERGY
                      </span>
                    </div>

                    <div className="text-base sm:text-lg font-black text-white mb-1 drop-shadow">
                      {currentSkill.name}
                    </div>
                    <div
                      className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: currentSkill.color }}
                    >
                      {currentSkill.tagline}
                    </div>
                    <p className="text-xs text-white/95 leading-relaxed font-normal drop-shadow">
                      {currentSkill.desc}
                    </p>
                  </div>

                  <div className="bg-white/25 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/40 shadow-md">
                    <div className="text-[10px] sm:text-xs font-mono font-bold text-white/80 mb-0.5">01 / PASSIVE / BASE ABILITY</div>
                    <div className="text-sm sm:text-base font-black text-white mb-1 drop-shadow">
                      {character.details.ability1.name}
                    </div>
                    <p className="text-xs text-white/95 leading-relaxed font-normal drop-shadow">
                      {character.details.ability1.desc}
                    </p>
                  </div>

                  <div className="bg-white/25 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/40 shadow-md">
                    <div className="text-[10px] sm:text-xs font-mono font-bold text-white/80 mb-0.5">02 / PASSIVE / BASE ABILITY</div>
                    <div className="text-sm sm:text-base font-black text-white mb-1 drop-shadow">
                      {character.details.ability2.name}
                    </div>
                    <p className="text-xs text-white/95 leading-relaxed font-normal drop-shadow">
                      {character.details.ability2.desc}
                    </p>
                  </div>

                  <div className="bg-white/25 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/40 shadow-md">
                    <div className="text-[10px] sm:text-xs font-mono font-bold text-white/80 mb-0.5">03 / PASSIVE / BASE ABILITY</div>
                    <div className="text-sm sm:text-base font-black text-white mb-1 drop-shadow">
                      {character.details.ability3.name}
                    </div>
                    <p className="text-xs text-white/95 leading-relaxed font-normal drop-shadow">
                      {character.details.ability3.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 4: Attribute Matrix */}
            <section className="min-h-[80vh] lg:min-h-screen flex flex-col justify-center py-8 lg:py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-2xl bg-white/20 p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.3)] w-full"
              >
                <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/90 mb-2 drop-shadow">
                  CORE METRICS
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-4 sm:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  ATTRIBUTE MATRIX
                </h2>

                <div className="space-y-3 sm:space-y-3.5">
                  {Object.entries(character.details.stats).map(([stat, val]) => (
                    <div key={stat} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] sm:text-xs font-mono font-bold uppercase text-white drop-shadow">
                        <span>{stat}</span>
                        <span className="font-black text-white">{val}%</span>
                      </div>
                      <div className="w-full bg-black/30 h-2 sm:h-2.5 rounded-full overflow-hidden border border-white/30">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: character.themeColor,
                            boxShadow: `0 0 12px ${character.themeColor}`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8 flex justify-center">
                  <button
                    onClick={handleBack}
                    className="w-full py-3 sm:py-3.5 rounded-full bg-white text-black font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    SELECT ANOTHER CHARACTER
                  </button>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      )}

      {/* VICTORY / GAMEOVER MODAL IN BATTLE MODE */}
      <AnimatePresence>
        {isBattleMode && battleState !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/20 border border-white/60 backdrop-blur-3xl p-8 sm:p-12 rounded-3xl max-w-md w-full text-center flex flex-col items-center gap-4 shadow-2xl"
            >
              <div className="mb-1">
                <span className={`px-4 py-1.5 rounded-full font-mono font-black text-xs sm:text-sm uppercase tracking-widest border ${
                  battleState === 'victory'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                }`}>
                  {battleState === 'victory' ? 'VICTORY' : 'DEFEAT'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {battleState === 'victory' ? 'MISSION ACCOMPLISHED!' : 'SHIELD BROKEN'}
              </h2>

              <p className="text-xs sm:text-sm text-white/90 font-mono drop-shadow">
                {battleState === 'victory'
                  ? `All Cosmic Words intercepted flawlessly with ${character.name}!`
                  : 'The stream breached your defense perimeter.'}
              </p>

              <div className="grid grid-cols-3 gap-3 w-full my-2 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/40 font-mono text-center shadow-inner">
                <div>
                  <div className="text-[10px] text-white/80 font-bold">SCORE</div>
                  <div className="text-base font-black text-amber-300 drop-shadow">{score}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/80 font-bold">MAX COMBO</div>
                  <div className="text-base font-black text-pink-300 drop-shadow">{maxCombo}x</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/80 font-bold">AVG WPM</div>
                  <div className="text-base font-black text-cyan-300 drop-shadow">{wpm || 65}</div>
                </div>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => handleStartBattle()}
                  className="flex-1 py-3 rounded-full bg-white text-black font-mono font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer shadow-lg"
                >
                  PLAY AGAIN
                </button>
                <button
                  onClick={handleExitBattle}
                  className="flex-1 py-3 rounded-full bg-white/25 hover:bg-white/40 border border-white/60 text-white font-mono font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer shadow"
                >
                  EXIT BATTLE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
