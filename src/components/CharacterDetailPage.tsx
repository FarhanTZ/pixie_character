import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PixarCharacter } from '../data/characters';

interface CharacterDetailPageProps {
  character: PixarCharacter;
  onBack: () => void;
}

export const CharacterDetailPage: React.FC<CharacterDetailPageProps> = ({ character, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  // High-performance image preloading in batch
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

  // Optimized passive scroll listener with RAF throttle
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

    // Highly Optimized 60FPS Lerp Loop
    let rafId: number;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (canvas && imagesRef.current.length > 0) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.01) {
          currentFrameRef.current += diff * 0.18;
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [character]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
      className="relative w-full min-h-[350vh] sm:min-h-[400vh] bg-[#070709] text-white select-none overflow-x-hidden"
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

      {/* 2. LAYER 2: ANIMATED CHARACTER STAGE (Besar & Megah di Mobile Maupun Desktop) */}
      <div className="fixed top-0 right-0 w-full lg:w-[50vw] xl:w-[52vw] h-full pointer-events-none z-10 flex items-center justify-center p-2 sm:p-6 lg:p-8 transform-gpu">
        <div className="relative w-full h-full max-h-[85vh] sm:max-h-[90vh] lg:max-h-[92vh] rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.5)] border border-white/20">
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
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/25 hover:bg-white/40 border border-white/60 text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 drop-shadow"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>BACK TO ARCHIVE</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase rounded-full border border-white/60 backdrop-blur-xl bg-white/20 text-white shadow-lg"
          >
            {character.element}
          </span>
        </div>
      </header>

      {/* 4. SCROLL PROGRESS BAR (Desktop & iPad Landscape) */}
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

      {/* 5. SCROLLABLE STORY & LORE CONTENT SECTIONS */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col space-y-16 lg:space-y-0">
            {/* Section 1: Hero Overview */}
            <section className="min-h-[80vh] lg:min-h-screen flex flex-col justify-center py-8 lg:py-16">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-2xl bg-white/20 p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/50 shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
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
                <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal drop-shadow">
                  {character.lore}
                </p>
                <div className="mt-5 sm:mt-6 flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs font-mono font-bold text-white tracking-wider sm:tracking-widest drop-shadow">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white animate-ping shadow-[0_0_8px_#fff]" />
                  <span>SCROLL TO ADVANCE ANIMATION</span>
                </div>
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
                  <div className="bg-white/25 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/40 shadow-md">
                    <div className="text-[10px] sm:text-xs font-mono font-bold text-white/80 mb-0.5">01 / ABILITY</div>
                    <div className="text-sm sm:text-base font-black text-white mb-1 drop-shadow">
                      {character.details.ability1.name}
                    </div>
                    <p className="text-xs text-white/95 leading-relaxed font-normal drop-shadow">
                      {character.details.ability1.desc}
                    </p>
                  </div>

                  <div className="bg-white/25 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/40 shadow-md">
                    <div className="text-[10px] sm:text-xs font-mono font-bold text-white/80 mb-0.5">02 / ABILITY</div>
                    <div className="text-sm sm:text-base font-black text-white mb-1 drop-shadow">
                      {character.details.ability2.name}
                    </div>
                    <p className="text-xs text-white/95 leading-relaxed font-normal drop-shadow">
                      {character.details.ability2.desc}
                    </p>
                  </div>

                  <div className="bg-white/25 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/40 shadow-md">
                    <div className="text-[10px] sm:text-xs font-mono font-bold text-white/80 mb-0.5">03 / ABILITY</div>
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
                    onClick={onBack}
                    className="w-full py-3 sm:py-3.5 rounded-full bg-white text-black font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    SELECT ANOTHER CHARACTER
                  </button>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
