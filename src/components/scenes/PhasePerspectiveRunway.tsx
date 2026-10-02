import React, { useEffect, useRef } from 'react';
import { YearStats } from '../../core/dateEngine';

interface PhasePerspectiveRunwayProps {
  stats: YearStats;
  subPhase: 0 | 1 | 2 | 3;
  scrollT?: number; // 0 to 1 continuous scrub
  // 0 = "MOST PEOPLE WILL WAIT FOR JANUARY." with 3D runway
  // 1 = "DON'T." particle dots, then stream converges into red TODAY dot
  // 2 = "START" with 2027 JAN 01
  // 3 = "TODAY." finale
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  alpha: number;
}

export const PhasePerspectiveRunway: React.FC<PhasePerspectiveRunwayProps> = ({ stats, subPhase, scrollT }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextYear = stats.year + 1;

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

    // Vanishing point coordinates
    const horizonY = clientH * 0.32;
    const centerX = clientW / 2;
    const runwayBottomY = clientH * 0.88;
    const runwayTopY = horizonY + 25;
    const runwayBottomWidth = clientW * 0.78;
    const runwayTopWidth = clientW * 0.28;

    const redDotY = runwayBottomY + 28;
    const redDotX = centerX;

    // Create particles for "DON'T." if in subPhase 1
    const dontParticles: Particle[] = [];
    if (subPhase === 1) {
      // Offscreen render to get points of text "DON'T."
      const off = document.createElement('canvas');
      off.width = clientW;
      off.height = clientH;
      const offCtx = off.getContext('2d');
      if (offCtx) {
        offCtx.font = '800 68px "Chakra Petch", sans-serif';
        offCtx.fillStyle = '#ffffff';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText("DON'T.", centerX, clientH * 0.52);

        const imgData = offCtx.getImageData(0, 0, clientW, clientH);
        const data = imgData.data;

        for (let y = 0; y < clientH; y += 4) {
          for (let x = 0; x < clientW; x += 4) {
            const a = data[(y * clientW + x) * 4 + 3];
            if (a > 140) {
              dontParticles.push({
                x,
                y,
                originX: x,
                originY: y,
                targetX: redDotX + (Math.random() - 0.5) * 8,
                targetY: redDotY,
                size: Math.random() * 1.5 + 1.8,
                alpha: 1,
              });
            }
          }
        }
      }
    }

    const startTime = performance.now();

    const render = (now: number) => {
      ctx.clearRect(0, 0, clientW, clientH);

      // If subPhase 3 (TODAY finale), only render dark background, DOM handles the giant text
      if (subPhase === 3) return;

      // 1. Draw Trapezoidal Perspective Runway Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Left boundary
      ctx.moveTo(centerX - runwayTopWidth / 2, runwayTopY);
      ctx.lineTo(centerX - runwayBottomWidth / 2, runwayBottomY);
      // Right boundary
      ctx.moveTo(centerX + runwayTopWidth / 2, runwayTopY);
      ctx.lineTo(centerX + runwayBottomWidth / 2, runwayBottomY);
      // Top line
      ctx.moveTo(centerX - runwayTopWidth / 2, runwayTopY);
      ctx.lineTo(centerX + runwayTopWidth / 2, runwayTopY);
      ctx.stroke();

      // Horizontal ground line in subPhase 2 (START)
      if (subPhase === 2) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - runwayTopWidth / 2 - 20, runwayTopY);
        ctx.lineTo(centerX + runwayTopWidth / 2 + 20, runwayTopY);
        ctx.stroke();
      }

      // 2. Draw 7 columns of perspective rings receding to the horizon
      const numRows = 12;
      const numCols = 7;

      for (let r = 0; r < numRows; r++) {
        // Perspective depth interpolation
        const t = Math.pow(r / (numRows - 1), 2.2);
        const y = runwayTopY + t * (runwayBottomY - runwayTopY);
        const widthAtY = runwayTopWidth + t * (runwayBottomWidth - runwayTopWidth);
        const ringRadiusX = 3 + t * 7;
        const ringRadiusY = 1.2 + t * 2.8;

        for (let c = 0; c < numCols; c++) {
          const colT = c / (numCols - 1);
          const x = centerX - widthAtY / 2 + colT * widthAtY;

          ctx.beginPath();
          ctx.ellipse(x, y, ringRadiusX, ringRadiusY, 0, 0, Math.PI * 2);

          if (subPhase === 2 && r >= numRows - 4) {
            // In START subPhase, foreground dots glow brightly as solid white discs
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            // Hollow rings with soft white glow
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + t * 0.5})`;
            ctx.lineWidth = 1 + t * 0.5;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Red TODAY Oval in foreground (except in subPhase 2)
      if (subPhase !== 2) {
        ctx.beginPath();
        ctx.ellipse(redDotX, redDotY, 15, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3344';
        ctx.shadowColor = '#ff3344';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. In subPhase 1: Animate DON'T particles streaming down into the red dot
      if (subPhase === 1 && dontParticles.length > 0) {
        const elapsed = now - startTime;
        // Phase 1A: 0-1200ms display DON'T text statically
        // Phase 1B: 1200-2800ms stream down into red dot
        const streamProgress = scrollT !== undefined ? scrollT : Math.max(0, Math.min((elapsed - 1200) / 1600, 1));
        const streamEase = Math.pow(streamProgress, 2.8);

        dontParticles.forEach((p, idx) => {
          if (streamProgress === 0) {
            // Static glowing DON'T particle
            ctx.beginPath();
            ctx.arc(p.originX, p.originY, p.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 5;
            ctx.fill();
          } else {
            // Streaming particle down to red dot with curve
            const stagger = (idx % 20) * 0.03;
            const itemProgress = Math.max(0, Math.min((streamProgress - stagger) / 0.6, 1));
            const ease = Math.pow(itemProgress, 2.5);

            const arcOffset = Math.sin(ease * Math.PI) * ((idx % 2 === 0 ? 1 : -1) * 35);
            p.x = p.originX + (p.targetX - p.originX) * ease + arcOffset;
            p.y = p.originY + (p.targetY - p.originY) * ease;

            const alpha = 1 - ease * 0.8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (1 - ease * 0.4), 0, Math.PI * 2);
            // Color shifts from white to red near convergence
            ctx.fillStyle = ease > 0.6 ? `rgba(255, 60, 75, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowColor = ease > 0.6 ? '#ff3344' : '#ffffff';
            ctx.shadowBlur = 6;
            ctx.fill();
          }
        });
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [subPhase]);

  // Subphase 3: TODAY. Finale
  if (subPhase === 3) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center select-none bg-[#090a0f] text-white">
        <div className="flex items-center justify-center space-x-2 animate-scaleUp">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-tech font-extrabold tracking-widest text-white uppercase glow-white">
            TODAY
          </h1>
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#ff3344] shadow-[0_0_24px_#ff3344,0_0_50px_rgba(255,51,68,0.8)] inline-block mt-4 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between py-2 px-4 sm:px-6 select-none bg-[#090a0f] text-white relative overflow-hidden">
      {/* Top Header Text */}
      <div className="text-center pt-2 sm:pt-4 z-10">
        {subPhase === 0 && (
          <h1 className="text-xl sm:text-2xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white">
            MOST PEOPLE WILL WAIT FOR JANUARY.
          </h1>
        )}
        {subPhase === 1 && (
          <h1 className="text-xl sm:text-2xl font-tech font-bold tracking-[0.25em] text-zinc-500 uppercase">
            MOST PEOPLE WILL WAIT FOR JANUARY.
          </h1>
        )}
        {subPhase === 2 && (
          <h1 className="text-4xl sm:text-5xl font-tech font-extrabold tracking-[0.3em] text-white uppercase glow-white">
            START
          </h1>
        )}
      </div>

      {/* 2027 JAN 01 at the Horizon */}
      <div className="absolute top-[21%] sm:top-[22%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 text-center pointer-events-none">
        <h2 className="text-3xl sm:text-4xl font-tech font-bold tracking-widest text-white glow-white">
          {nextYear}
        </h2>
        <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase mt-0.5">
          JAN 01
        </span>
      </div>

      {/* Canvas for 3D Runway, Rings, and DON'T Particle Stream */}
      <div className="relative w-full h-[380px] sm:h-[420px] my-auto">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Bottom context / CTA */}
      <div className="w-full text-center text-xs font-mono text-zinc-500 border-t border-white/5 pt-3 pb-2 uppercase tracking-widest z-10">
        {subPhase === 0 && 'LOOKING AHEAD TO THE NEW HORIZON'}
        {subPhase === 1 && 'TIME DOES NOT WAIT FOR THE CALENDAR'}
        {subPhase === 2 && 'THE REAL START IS RIGHT NOW'}
      </div>
    </div>
  );
};
