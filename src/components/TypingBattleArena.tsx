import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixarCharacter } from '../data/characters';
import { CHARACTER_WORDS } from '../data/gameData';
import { characterAudioManager } from '../utils/audioManager';
import { sfxManager } from '../utils/sfxManager';

interface TypingBattleArenaProps {
  character: PixarCharacter;
  onExit: () => void;
}

interface FallingWord {
  id: number;
  word: string;
  y: number; // 0 to 100 percentage
  speed: number;
  lane: number; // 0, 1, 2 for columns
  isTarget: boolean;
}

interface DamageFloater {
  id: number;
  text: string;
  isCrit: boolean;
  x: number;
  y: number;
}

export const TypingBattleArena: React.FC<TypingBattleArenaProps> = ({ character, onExit }) => {
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [energy, setEnergy] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [wordsCleared, setWordsCleared] = useState<number>(0);

  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [gameState, setGameState] = useState<'playing' | 'victory' | 'gameover'>('playing');

  const [isPlayingActionVideo, setIsPlayingActionVideo] = useState<boolean>(false);
  const [characterSpeech, setCharacterSpeech] = useState<string | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const [damageNumbers, setDamageNumbers] = useState<DamageFloater[]>([]);

  const wordsTypedRef = useRef<number>(0);
  const totalKeystrokesRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const spawnTimerRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const nextWordIdRef = useRef<number>(1);

  // Preload character WebP animation frames (like CharacterDetailPage)
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    const count = character.frameCount || 96;
    for (let i = 0; i < count; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${character.frameFolder}/frame_${numStr}.webp`;
      img.decoding = 'async';
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [character]);

  // 60FPS Lerp Loop to render frames smoothly on Canvas
  useEffect(() => {
    let rafId: number;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (canvas && imagesRef.current.length > 0) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.01) {
          currentFrameRef.current += diff * 0.22;
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
            const parentWidth = canvas.parentElement?.clientWidth || 500;
            const parentHeight = canvas.parentElement?.clientHeight || 600;

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

  // Advance frame index dynamically as user types
  const advanceFrameOnTyping = (jump = 3) => {
    const totalFrames = character.frameCount || 96;
    totalKeystrokesRef.current += jump;
    targetFrameRef.current = (targetFrameRef.current + jump) % totalFrames;
  };

  // Spawn damage floater
  const spawnDamage = (amount: number, isCrit: boolean, lane = 1) => {
    const id = Date.now() + Math.random();
    setDamageNumbers((prev) => [
      ...prev,
      {
        id,
        text: isCrit ? `💥 CRITICAL +${amount}!` : `+${amount}`,
        isCrit,
        x: (lane - 1) * 120 + (Math.random() * 40 - 20),
        y: Math.random() * 30 - 15,
      },
    ]);
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 900);
  };

  // Spawn a new falling word from top
  const spawnWord = useCallback(() => {
    const wordList = CHARACTER_WORDS[character.id] || CHARACTER_WORDS['pixar-01'];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const lane = Math.floor(Math.random() * 3); // 0 (left), 1 (mid), 2 (right)

    setFallingWords((prev) => {
      if (prev.some((w) => w.word === randomWord && w.y < 40)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: nextWordIdRef.current++,
          word: randomWord,
          y: 0,
          speed: 0.28 + Math.random() * 0.15,
          lane,
          isTarget: false,
        },
      ];
    });
  }, [character.id]);

  // Main Game Loop for falling words animation & life check
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnTimerRef.current = window.setInterval(() => {
      spawnWord();
    }, 1800);

    spawnWord();
    const t = setTimeout(() => spawnWord(), 800);

    let lastTime = performance.now();
    const updateLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      setFallingWords((prev) => {
        let missedCount = 0;
        const updated = prev
          .map((w) => ({
            ...w,
            y: w.y + w.speed * delta,
          }))
          .filter((w) => {
            if (w.y >= 92) {
              missedCount++;
              return false;
            }
            return true;
          });

        if (missedCount > 0) {
          playSfx('enemyHit');
          setCombo(0);
          setPlayerHp((hp) => {
            const nextHp = hp - missedCount * 12;
            if (nextHp <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextHp;
          });
        }

        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(updateLoop);
    };

    gameLoopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      clearTimeout(t);
      if (spawnTimerRef.current !== null) clearInterval(spawnTimerRef.current);
      if (gameLoopRef.current !== null) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, spawnWord, playSfx]);

  // Keep input focused
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (gameState === 'playing') {
        inputRef.current?.focus();
      }
    }, 600);
    return () => clearInterval(focusInterval);
  }, [gameState]);

  // Input Typing Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;

    const val = e.target.value.toUpperCase();
    setUserInput(val);
    playSfx('key');
    advanceFrameOnTyping(2); // Progress character frame animation on each keystroke

    const matchedWordIdx = fallingWords.findIndex((w) => w.word === val);

    if (matchedWordIdx !== -1) {
      const matched = fallingWords[matchedWordIdx];
      wordsTypedRef.current += 1;
      const elapsedMins = Math.max((Date.now() - startTimeRef.current) / 60000, 0.05);
      const calculatedWpm = Math.round(wordsTypedRef.current / elapsedMins);
      setWpm(calculatedWpm);

      // Extra burst frame jump on word completion
      advanceFrameOnTyping(8);

      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      const isCrit = newCombo % 4 === 0;
      const basePoints = 120 + matched.word.length * 20;
      const points = isCrit ? Math.round(basePoints * 2.2) : basePoints;

      setScore((prev) => prev + points * Math.max(1, Math.floor(newCombo / 3)));
      setWordsCleared((prev) => {
        const next = prev + 1;
        if (next >= 35) {
          setGameState('victory');
          playSfx('victory');
        }
        return next;
      });

      if (newCombo >= 2) {
        if (character.audioUrl && (newCombo % 2 === 0 || newCombo === 3)) {
          characterAudioManager.play(character.audioUrl);
        }

        const battleQuotes = [
          `"${character.quote}"`,
          `Feel my ${character.element}!`,
          `Resonance Maximum! ⚡`,
          `Combo x${newCombo}! Clean strike! 🔥`,
          `Unstoppable Energy! 💥`,
        ];
        const selectedQuote = newCombo % 3 === 0 ? `"${character.quote}"` : battleQuotes[newCombo % battleQuotes.length];
        setCharacterSpeech(selectedQuote);

        if (speechTimeoutRef.current !== null) {
          clearTimeout(speechTimeoutRef.current);
        }
        speechTimeoutRef.current = window.setTimeout(() => {
          setCharacterSpeech(null);
        }, 1800);
      }

      setEnergy((prev) => Math.min(100, prev + 15));
      spawnDamage(points, isCrit, matched.lane);
      playSfx(isCrit ? 'crit' : 'correct');

      setFallingWords((prev) => prev.filter((w) => w.id !== matched.id));
      setUserInput('');
    }
  };

  // Ultimate Skill
  const handleUnleashUltimate = () => {
    if (energy < 100 || gameState !== 'playing' || fallingWords.length === 0) return;

    setEnergy(0);
    const clearCount = fallingWords.length;
    const ultimateDmg = 500 + clearCount * 150;

    spawnDamage(ultimateDmg, true, 1);
    playSfx('crit');
    advanceFrameOnTyping(20); // Big animation surge

    if (character.audioUrl) {
      characterAudioManager.play(character.audioUrl);
    }

    setScore((prev) => prev + ultimateDmg);
    setWordsCleared((prev) => prev + clearCount);
    setFallingWords([]);
    setUserInput('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && energy >= 100) {
        e.preventDefault();
        handleUnleashUltimate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [energy, fallingWords]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col justify-between p-3 sm:p-6 lg:p-8 select-none overflow-hidden"
    >
      {/* 1. SEPARATE CHARACTER BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={character.bgImage}
          alt="Battle Stage Background"
          className="w-full h-full object-cover filter brightness-105"
        />
      </div>

      {/* 2. TOP HUD BAR */}
      <header className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-7xl mx-auto">
        {/* Player Stats */}
        <div className="flex items-center gap-3 bg-white/25 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.25)] w-full sm:w-auto">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/80 bg-black/30 flex items-center justify-center shadow-md">
            <img src={character.characterImage} alt={character.name} className="w-full h-full object-cover scale-150" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-white mb-1 drop-shadow">
              <span>{character.name}</span>
              <span className="text-emerald-300 font-black">{playerHp}% SHIELD</span>
            </div>
            <div className="w-36 sm:w-48 h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/40 shadow-inner">
              <motion.div
                animate={{ width: `${playerHp}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_#34d399]"
              />
            </div>
          </div>
        </div>

        {/* Center Score & Combo Badge */}
        <div className="flex items-center gap-4 bg-white/25 backdrop-blur-2xl px-5 py-2 rounded-2xl border border-white/60 shadow-lg">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/90 tracking-widest uppercase font-bold drop-shadow">SCORE</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.7)]">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="h-8 w-px bg-white/40" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/90 tracking-widest uppercase font-bold drop-shadow">COMBO</span>
            <motion.span
              key={combo}
              animate={{ scale: [1.3, 1] }}
              className="text-xl sm:text-2xl font-black font-mono text-pink-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]"
            >
              {combo}x
            </motion.span>
          </div>

          <div className="h-8 w-px bg-white/40" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/90 tracking-widest uppercase font-bold drop-shadow">CLEARED</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-cyan-300 drop-shadow">
              {wordsCleared}/35
            </span>
          </div>

          <button
            onClick={onExit}
            className="ml-2 px-3.5 py-1.5 rounded-full bg-white/30 hover:bg-white/50 border border-white/70 text-white font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            ✕ EXIT
          </button>
        </div>
      </header>

      {/* 3. MAIN SPLIT ARENA: KIRI (STREAM KATA JATUH + TYPING INPUT DI BAWAH) & KANAN (KARAKTER DIBUNGKUS BORDER SEPERTI DETAIL PAGE DENGAN ANIMASI FRAME) */}
      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between max-w-7xl mx-auto w-full flex-1 gap-6 lg:gap-8 my-auto px-2 sm:px-6">
        
        {/* BAGIAN KIRI: STREAM KATA MUNCUL DARI ATAS & TYPING DECK DI BAWAHNYA */}
        <div className="relative w-full lg:w-[54%] flex flex-col items-center justify-between h-[48vh] sm:h-[58vh] lg:h-[72vh]">
          
          {/* FALLING WORDS STREAM ARENA (MUNCUL DARI ATAS) */}
          <div className="relative w-full flex-1 rounded-3xl bg-black/30 backdrop-blur-xl border border-white/30 overflow-hidden shadow-2xl p-4">
            
            {/* 3 Falling Lanes Indicator Lines */}
            <div className="absolute inset-0 grid grid-cols-3 divide-x divide-white/10 pointer-events-none" />

            {/* Falling Words List */}
            {fallingWords.map((item) => {
              const laneX = item.lane === 0 ? 'left-[16%]' : item.lane === 1 ? 'left-[50%]' : 'left-[84%]';
              const isTargetPrefix = userInput.length > 0 && item.word.startsWith(userInput);

              return (
                <div
                  key={item.id}
                  className={`absolute -translate-x-1/2 transition-all duration-75 pointer-events-none ${laneX}`}
                  style={{ top: `${item.y}%` }}
                >
                  <div
                    className={`px-4 py-1.5 rounded-2xl font-mono font-black text-sm sm:text-base lg:text-lg tracking-widest shadow-xl flex items-center gap-1 border ${
                      isTargetPrefix
                        ? 'bg-amber-400 text-black border-yellow-200 scale-110 shadow-[0_0_20px_#facc15]'
                        : item.y > 75
                        ? 'bg-rose-600/90 text-white border-rose-400 animate-bounce shadow-[0_0_15px_#f43f5e]'
                        : 'bg-white/30 text-white border-white/60 backdrop-blur-md'
                    }`}
                  >
                    <span>{item.word}</span>
                  </div>
                </div>
              );
            })}

            {/* FLOATING DAMAGE NUMBERS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              {damageNumbers.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 1, y: 0, scale: d.isCrit ? 1.5 : 1.2 }}
                  animate={{ opacity: 0, y: -70, scale: d.isCrit ? 2.0 : 1.4 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute text-2xl sm:text-4xl font-black font-mono drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] whitespace-nowrap ${
                    d.isCrit ? 'text-amber-300' : 'text-cyan-300'
                  }`}
                  style={{ transform: `translate(${d.x}px, ${d.y}px)` }}
                >
                  {d.text}
                </motion.div>
              ))}
            </div>

            {/* Bottom Danger Line */}
            <div className="absolute bottom-2 inset-x-0 h-1 bg-gradient-to-r from-rose-500/20 via-rose-500/80 to-rose-500/20 pointer-events-none animate-pulse" />
          </div>

          {/* TYPING INPUT & ULTIMATE BAR DI SEBELAH KIRI BAWAH */}
          <div className="relative w-full flex flex-col items-center gap-2.5 mt-3.5 sm:mt-4">
            {/* INPUT FORM */}
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="TYPE FALLING WORD..."
                autoFocus
                className="w-full text-center py-3 sm:py-3.5 px-6 rounded-full bg-white/35 border-2 border-white/90 focus:border-cyan-300 focus:outline-none text-white font-mono font-black text-lg sm:text-xl lg:text-2xl tracking-[0.25em] uppercase backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.3)] placeholder:text-white/60 drop-shadow"
              />
            </div>

            {/* ULTIMATE SKILL BUTTON / BAR */}
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-3 flex-1 mr-4">
                <span className="text-[10px] sm:text-xs font-mono font-black text-white tracking-widest drop-shadow">
                  ULTIMATE:
                </span>
                <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/50 shadow-inner">
                  <motion.div
                    animate={{ width: `${energy}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-300 shadow-[0_0_12px_rgba(244,114,182,0.8)]"
                  />
                </div>
              </div>

              <motion.button
                onClick={handleUnleashUltimate}
                disabled={energy < 100}
                whileHover={energy >= 100 ? { scale: 1.06 } : {}}
                whileTap={energy >= 100 ? { scale: 0.94 } : {}}
                className={`px-5 sm:px-6 py-2 rounded-full font-mono font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg ${
                  energy >= 100
                    ? 'bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-300 text-black animate-pulse shadow-[0_0_20px_rgba(244,114,182,0.9)]'
                    : 'bg-white/20 text-white/50 border border-white/30 cursor-not-allowed backdrop-blur-md'
                }`}
              >
                {energy >= 100 ? '⚡ CLEAR ALL (SPACE)' : `${energy}% CHARGED`}
              </motion.button>
            </div>
          </div>

        </div>

        {/* BAGIAN KANAN: KARAKTER DIBUNGKUS BORDER SEPERTI DI DETAIL PAGE DENGAN ANIMASI 96-FRAME CANVAS */}
        <div className="relative w-full lg:w-[46%] h-[38vh] sm:h-[50vh] lg:h-[72vh] flex items-center justify-center">
          
          {/* FROSTED BORDER FRAME CONTAINER (SEPERTI DI DETAIL PAGE) */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.5)] border-2 border-white/30 backdrop-blur-md bg-white/10 p-2 sm:p-3 flex items-center justify-center">
            
            {/* Ambient Element Glow */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${character.themeColor}, transparent 70%)` }}
            />

            {/* CHARACTER SPEECH BUBBLE ON COMBO */}
            <AnimatePresence>
              {characterSpeech && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className="absolute top-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-xs z-40 bg-black/80 backdrop-blur-xl border-2 border-amber-300/90 px-4 py-2 rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg animate-bounce">💬</span>
                    <p className="text-xs sm:text-sm font-mono font-black text-amber-300 drop-shadow">
                      {characterSpeech}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Character Header Label Inside Border */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/40 border border-white/40 text-[10px] font-mono font-black text-white tracking-widest uppercase backdrop-blur-md">
                {character.name}
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase border border-white/30 text-white"
                style={{ backgroundColor: `${character.themeColor}40` }}
              >
                {character.element}
              </span>
            </div>

            {/* HIGH-PERFORMANCE 96-FRAME CANVAS ANIMATION (Menyesuaikan aksi ketikan real-time) */}
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover rounded-2xl pointer-events-none"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none rounded-2xl" />
          </div>
        </div>
      </div>

      {/* 4. VICTORY / GAMEOVER MODAL */}
      <AnimatePresence>
        {gameState !== 'playing' && (
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
              <div className="text-6xl sm:text-7xl mb-1">
                {gameState === 'victory' ? '🏆' : '💀'}
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {gameState === 'victory' ? 'MISSION ACCOMPLISHED!' : 'SHIELD BROKEN'}
              </h2>

              <p className="text-xs sm:text-sm text-white/90 font-mono drop-shadow">
                {gameState === 'victory'
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
                  onClick={() => {
                    setGameState('playing');
                    setPlayerHp(100);
                    setScore(0);
                    setCombo(0);
                    setEnergy(0);
                    setWordsCleared(0);
                    setFallingWords([]);
                  }}
                  className="flex-1 py-3 rounded-full bg-white text-black font-mono font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer shadow-lg"
                >
                  PLAY AGAIN
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 py-3 rounded-full bg-white/25 hover:bg-white/40 border border-white/60 text-white font-mono font-black text-xs uppercase tracking-widest hover:scale-105 transition-all cursor-pointer shadow"
                >
                  BACK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
