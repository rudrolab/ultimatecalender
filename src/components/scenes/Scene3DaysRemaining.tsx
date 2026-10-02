import React, { useEffect, useRef, useState } from 'react';
import { YearStats } from '../../core/dateEngine';
import { CountdownTime } from '../../core/countdown';

interface Scene3Props {
  stats: YearStats;
  countdown: CountdownTime;
}

interface DotParticle {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  curveOffset: number;
  delay: number;
  color: string;
  size: number;
}

export const Scene3DaysRemaining: React.FC<Scene3Props> = ({ stats, countdown }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationSettled, setAnimationSettled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;
    const clientW = canvas.clientWidth;
    const clientH = canvas.clientHeight;
    canvas.width = clientW * dpr;
    canvas.height = clientH * dpr;
    ctx.scale(dpr, dpr);

    const centerX = clientW / 2;
    const centerY = clientH * 0.42;

    const daysLeft = stats.daysRemaining;
    const numberStr = String(daysLeft);

    // 1. Generate target points for the number digits via offscreen rasterizer
    const offscreen = document.createElement('canvas');
    offscreen.width = clientW;
    offscreen.height = clientH;
    const offCtx = offscreen.getContext('2d');

    const targetPoints: { x: number; y: number }[] = [];

    if (offCtx) {
      const fontSize = clientW < 400 ? 110 : 130;
      offCtx.font = `900 ${fontSize}px "Space Grotesk", "JetBrains Mono", sans-serif`;
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(numberStr, centerX, centerY);

      const imgData = offCtx.getImageData(0, 0, clientW, clientH);
      const data = imgData.data;
      const allFilledPoints: { x: number; y: number }[] = [];

      // Scan with step 4 for high density
      const step = 4;
      for (let y = 0; y < clientH; y += step) {
        for (let x = 0; x < clientW; x += step) {
          const alpha = data[(y * clientW + x) * 4 + 3];
          if (alpha > 120) {
            allFilledPoints.push({ x, y });
          }
        }
      }

      if (allFilledPoints.length > 0) {
        // Evenly sample exactly daysLeft points along the digit strokes
        for (let i = 0; i < daysLeft; i++) {
          const idx = Math.floor((i / daysLeft) * allFilledPoints.length);
          targetPoints.push(allFilledPoints[idx]);
        }
      }
    }

    // Fallback if offscreen canvas points are empty
    while (targetPoints.length < daysLeft) {
      targetPoints.push({
        x: centerX + (Math.random() - 0.5) * 160,
        y: centerY + (Math.random() - 0.5) * 80,
      });
    }

    // 2. Initialize particles starting from a calendar-like distribution
    const particles: DotParticle[] = [];
    const gridCols = Math.min(18, Math.max(8, Math.ceil(Math.sqrt(daysLeft * 2))));
    const gridSpacing = Math.min(22, (clientW - 60) / gridCols);
    const startGridX = centerX - ((gridCols - 1) * gridSpacing) / 2;
    const startGridY = centerY - 140;

    for (let i = 0; i < daysLeft; i++) {
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);

      const sx = startGridX + col * gridSpacing + (Math.random() - 0.5) * 4;
      const sy = startGridY + row * gridSpacing + (Math.random() - 0.5) * 4;

      const target = targetPoints[i];

      particles.push({
        id: i,
        startX: sx,
        startY: sy,
        targetX: target.x,
        targetY: target.y,
        currentX: sx,
        currentY: sy,
        curveOffset: (Math.random() - 0.5) * 80,
        delay: Math.random() * 250, // slight organic stagger
        color: i % 3 === 0 ? '#ff3344' : '#ffffff',
        size: clientW < 400 ? 3.2 : 3.8,
      });
    }

    const startTime = performance.now();
    const duration = 1400; // ms to complete arrangement

    const animate = (now: number) => {
      ctx.clearRect(0, 0, clientW, clientH);

      let allDone = true;

      particles.forEach((p) => {
        const elapsed = Math.max(0, now - startTime - p.delay);
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          allDone = false;
        }

        // Custom easing with elastic deceleration into place
        const ease = 1 - Math.pow(1 - progress, 3);
        const arc = Math.sin(progress * Math.PI) * p.curveOffset * (1 - progress);

        p.currentX = p.startX + (p.targetX - p.startX) * ease + arc;
        p.currentY = p.startY + (p.targetY - p.startY) * ease;

        // Draw the dot
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);

        // Glow effect
        if (progress > 0.8) {
          ctx.shadowColor = '#ff3344';
          ctx.shadowBlur = 8;
          ctx.fillStyle = p.color === '#ff3344' ? '#ff3344' : '#ffffff';
        } else {
          ctx.shadowColor = 'rgba(255, 51, 68, 0.4)';
          ctx.shadowBlur = 4;
          ctx.fillStyle = p.color;
        }

        ctx.fill();
      });

      if (!allDone) {
        animId = requestAnimationFrame(animate);
      } else {
        setAnimationSettled(true);

        // Keep a subtle idle breathing pulse for the arranged dots
        const idleAnimate = (idleTime: number) => {
          ctx.clearRect(0, 0, clientW, clientH);
          const pulse = Math.sin(idleTime * 0.003) * 0.4;

          particles.forEach((p, idx) => {
            const dotPulse = Math.sin(idleTime * 0.003 + idx * 0.1) * 0.4;
            ctx.beginPath();
            ctx.arc(p.targetX, p.targetY, p.size + dotPulse, 0, Math.PI * 2);
            ctx.shadowColor = '#ff3344';
            ctx.shadowBlur = 8;
            ctx.fillStyle = p.color;
            ctx.fill();
          });

          animId = requestAnimationFrame(idleAnimate);
        };

        animId = requestAnimationFrame(idleAnimate);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [stats.daysRemaining]);

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 px-4 sm:px-6 select-none relative overflow-hidden">
      {/* Top Header Tag */}
      <div className="text-center pt-2 z-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          METRIC 01 / {stats.daysRemaining} REMAINING DOTS ARRANGE INTO:
        </span>
      </div>

      {/* Main Interactive Canvas Area where Dots Physically Form the Number */}
      <div className="relative w-full h-[320px] sm:h-[350px] my-auto flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Ambient Bloom behind number */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-red-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />
      </div>

      {/* Details below arranged number */}
      <div className="flex flex-col items-center justify-center text-center z-10 pb-2">
        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-[0.3em] text-[#ff3344] uppercase glow-red">
          DAYS LEFT
        </h2>

        <div className="mt-2 py-1 px-4 rounded-full border border-white/10 bg-white/[0.02]">
          <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
            {stats.currentDateFormatted}
          </span>
        </div>

        {/* Live Sub-Day Countdown */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 w-full max-w-xs text-center font-mono">
          <div className="p-2 rounded-lg border border-white/5 bg-[#12141c]">
            <div className="text-base font-bold text-zinc-100 tabular-nums">
              {String(countdown.hours).padStart(2, '0')}
            </div>
            <div className="text-[8px] text-zinc-500 tracking-wider">HOURS</div>
          </div>

          <div className="p-2 rounded-lg border border-white/5 bg-[#12141c]">
            <div className="text-base font-bold text-zinc-100 tabular-nums">
              {String(countdown.minutes).padStart(2, '0')}
            </div>
            <div className="text-[8px] text-zinc-500 tracking-wider">MINUTES</div>
          </div>

          <div className="p-2 rounded-lg border border-[#ff3344]/30 bg-[#ff3344]/10">
            <div className="text-base font-bold text-[#ff3344] tabular-nums glow-red">
              {String(countdown.seconds).padStart(2, '0')}
            </div>
            <div className="text-[8px] text-[#ff3344]/80 tracking-wider">SECONDS</div>
          </div>
        </div>

        <div className="mt-3 text-[10px] font-mono text-zinc-500 tracking-wider">
          EVERY DOT ABOVE IS ONE OF YOUR REMAINING {stats.daysRemaining} DAYS
        </div>
      </div>
    </div>
  );
};
