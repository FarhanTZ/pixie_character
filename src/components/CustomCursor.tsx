import React, { useEffect, useRef } from 'react';
import { PixarCharacter } from '../data/characters';

interface CustomCursorProps {
  character?: PixarCharacter;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ character }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; isTouch: boolean }>({
    x: -100,
    y: -100,
    isTouch: false,
  });
  const particlesRef = useRef<Particle[]>([]);
  const activeColorsRef = useRef<string[]>(['#F472B6', '#C084FC', '#38BDF8', '#FBBF24']);
  const lastSpawnRef = useRef<number>(0);

  // Dynamically adapt trail palette based on active Character Theme & Accent Colors
  useEffect(() => {
    if (character) {
      activeColorsRef.current = [
        character.themeColor,
        character.accentColor,
        '#FFFFFF',
        character.themeColor,
      ];
    } else {
      activeColorsRef.current = ['#F472B6', '#C084FC', '#38BDF8', '#FBBF24'];
    }
  }, [character]);

  useEffect(() => {
    // Detect touch-only mobile devices to save battery & CPU
    const isTouchDevice = 'ontouchstart' in window && navigator.maxTouchPoints > 0;
    if (isTouchDevice && window.innerWidth < 768) {
      mouseRef.current.isTouch = true;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Throttled particle spawn for maximum 120FPS smoothness without memory pressure
      if (now - lastSpawnRef.current > 18) {
        lastSpawnRef.current = now;
        const colors = activeColorsRef.current;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.2 + 0.4;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.3,
          size: Math.random() * 4 + 2.5,
          color,
          alpha: 0.9,
          maxLife: 22,
          life: 0,
        });

        // Limit maximum pool size
        if (particlesRef.current.length > 40) {
          particlesRef.current.shift();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Render 60FPS loop for character element aura trail
    const renderLoop = () => {
      if (particlesRef.current.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          if (p.life >= p.maxLife) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const currentColor = character ? character.themeColor : '#F472B6';
  const currentAccent = character ? character.accentColor : '#38BDF8';

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden hidden md:block">
      {/* Dynamic Element Particle Canvas Trail */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full transform-gpu" />

      {/* Glowing Starry Cursor Follower */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full pointer-events-none transition-transform duration-75 ease-out will-change-transform"
      >
        <div
          className="w-full h-full rounded-full transition-colors duration-500 animate-pulse"
          style={{
            background: `radial-gradient(circle, #FFFFFF 20%, ${currentColor} 60%, ${currentAccent} 100%)`,
            boxShadow: `0 0 14px ${currentColor}`,
          }}
        />
      </div>
    </div>
  );
};
