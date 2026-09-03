import React, { useEffect, useRef } from 'react';

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

const TRAIL_COLORS = [
  '#F472B6', // Pink
  '#C084FC', // Violet
  '#38BDF8', // Cyan
  '#FBBF24', // Amber
  '#34D399', // Mint Green
];

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; moved: boolean }>({
    x: -100,
    y: -100,
    moved: false,
  });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Spawn 2-3 fluffy spark particles on move
      for (let i = 0; i < 2; i++) {
        const color = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.4, // Slight gravity fall
          size: Math.random() * 5 + 3,
          color,
          alpha: 0.9,
          maxLife: Math.random() * 25 + 20,
          life: 0,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Render 60FPS loop for magical cursor trail
    const renderLoop = () => {
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

        // Draw soft glowing fluffy spark
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {/* Particle Canvas Trail (z-[100] agar tampil di atas layar opening) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Glowing Starry Cursor Follower */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none transition-transform duration-75 ease-out will-change-transform"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-300 shadow-[0_0_15px_rgba(244,114,182,0.9)] animate-pulse" />
      </div>
    </div>
  );
};
