import React, { useEffect, useRef, useState } from 'react';
import { YearStats } from '../../core/dateEngine';
import { CountdownTime } from '../../core/countdown';

interface Scene3Props {
  stats: YearStats;
  countdown: CountdownTime;
}

interface Particle {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  size: number;
  color: string;
}

export const Scene3DaysRemaining: React.FC<Scene3Props> = ({ stats, countdown }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [morphComplete, setMorphComplete] = useState(false);
  const [numberCount, setNumberCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.clientWidth * window.devicePixelRatio);
    const height = (canvas.height = canvas.clientHeight * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const clientW = canvas.clientWidth;
    const clientH = canvas.clientHeight;

    const centerX = clientW / 2;
    const centerY = clientH / 2;

    // Generate remaining dots mapped to an initial calendar grid
    const dotCount = Math.min(stats.daysRemaining, 160);
    const cols = 16;
    const rows = Math.ceil(dotCount / cols);
    const gridSpacing = 16;
    const gridStartX = centerX - (cols * gridSpacing) / 2;
    const gridStartY = centerY - 90;

    const particles: Particle[] = [];

    for (let i = 0; i < dotCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const sx = gridStartX + col * gridSpacing + (Math.random() - 0.5) * 4;
      const sy = gridStartY + row * gridSpacing + (Math.random() - 0.5) * 4;

      // Target attractor is near the center number
      const tx = centerX + (Math.random() - 0.5) * 60;
      const ty = centerY + (Math.random() - 0.5) * 40;

      particles.push({
        startX: sx,
        startY: sy,
        targetX: tx,
        targetY: ty,
        currentX: sx,
        currentY: sy,
        size: Math.random() * 1.5 + 2.5,
        color: i % 4 === 0 ? '#ff3344' : '#e2e8f0',
      });
    }

    const startTime = performance.now();
    const morphDuration = 850; // ms

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / morphDuration, 1);
      // Ease in cubic for acceleration into center
      const ease = Math.pow(progress, 2.5);

      ctx.clearRect(0, 0, clientW, clientH);

      // Draw converging particles
      if (progress < 1) {
        particles.forEach((p) => {
          p.currentX = p.startX + (p.targetX - p.startX) * ease;
          p.currentY = p.startY + (p.targetY - p.startY) * ease;

          const alpha = 1 - ease * 0.4;
          ctx.beginPath();
          ctx.arc(p.currentX, p.currentY, p.size * (1 - ease * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = p.color === '#ff3344' ? `rgba(255, 51, 68, ${alpha})` : `rgba(226, 232, 240, ${alpha})`;
          ctx.shadowColor = '#ff3344';
          ctx.shadowBlur = 6;
          ctx.fill();
        });

        // Fast number counter during morph
        setNumberCount(Math.floor(progress * stats.daysRemaining));
        animId = requestAnimationFrame(render);
      } else {
        // Flash at center when all dots fuse
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
        grad.addColorStop(0, 'rgba(255, 51, 68, 0.4)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();

        setNumberCount(stats.daysRemaining);
        setMorphComplete(true);
      }
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [stats.daysRemaining]);

  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-4 sm:px-8 select-none relative overflow-hidden">
      {/* Background Particle Convergence Canvas */}
      {!morphComplete && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
      )}

      {/* Top indicator */}
      <div className="text-center pt-2 z-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          METRIC 01 / REMAINING CALENDAR DAYS
        </span>
      </div>

      {/* Main Days Left Display */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <div className="relative">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-white font-display select-none animate-fadeIn">
            {numberCount}
          </span>
          <div className="absolute inset-0 bg-red-500/15 blur-3xl -z-10 rounded-full" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-[0.3em] text-[#ff3344] uppercase mt-2 glow-red">
          DAYS LEFT
        </h2>

        {/* Current Date Display */}
        <div className="mt-4 py-1.5 px-4 rounded-full border border-white/10 bg-white/[0.02]">
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-300 uppercase">
            {stats.currentDateFormatted}
          </span>
        </div>

        {/* Live Real-time Sub-Day Countdown */}
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs text-center font-mono">
          <div className="p-2.5 rounded-lg border border-white/5 bg-[#12141c]">
            <div className="text-lg sm:text-xl font-bold text-zinc-100 tabular-nums">
              {String(countdown.hours).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-zinc-500 tracking-wider">HOURS</div>
          </div>

          <div className="p-2.5 rounded-lg border border-white/5 bg-[#12141c]">
            <div className="text-lg sm:text-xl font-bold text-zinc-100 tabular-nums">
              {String(countdown.minutes).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-zinc-500 tracking-wider">MINUTES</div>
          </div>

          <div className="p-2.5 rounded-lg border border-[#ff3344]/30 bg-[#ff3344]/10">
            <div className="text-lg sm:text-xl font-bold text-[#ff3344] tabular-nums glow-red">
              {String(countdown.seconds).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-[#ff3344]/80 tracking-wider">SECONDS</div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center pb-4 text-xs font-mono text-zinc-500 z-10">
        CONVERTING EVERY DOT INTO CONCRETE REMAINING TIME
      </div>
    </div>
  );
};
