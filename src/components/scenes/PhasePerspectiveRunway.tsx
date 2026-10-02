import React, { useEffect, useRef } from 'react';
import { YearStats } from '../../core/dateEngine';

interface PhasePerspectiveRunwayProps {
  stats: YearStats;
  subPhase: 0 | 1 | 2 | 3;
  scrollT?: number; // 0 to 1 continuous scrub
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

    // 3D Perspective Coordinates scaled for wide viewports
    const horizonY = clientH * 0.32;
    const centerX = clientW / 2;
    const runwayBottomY = clientH * 0.92;
    const runwayTopY = horizonY + 20;
    const runwayBottomWidth = Math.min(clientW * 0.85, 780);
    const runwayTopWidth = Math.min(clientW * 0.28, 260);

    const redDotY = runwayBottomY + 22;
    const redDotX = centerX;

    // Create particles for "DON'T." if in subPhase 1
    const dontParticles: Particle[] = [];
    if (subPhase === 1) {
      const off = document.createElement('canvas');
      off.width = clientW;
      off.height = clientH;
      const offCtx = off.getContext('2d');
      if (offCtx) {
        const textFontSize = clientW < 640 ? 76 : 110;
        offCtx.font = `800 ${textFontSize}px "Chakra Petch", sans-serif`;
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
                targetX: redDotX + (Math.random() - 0.5) * 12,
                targetY: redDotY,
                size: Math.random() * 1.8 + 2.0,
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

      // If subPhase 3 (TODAY finale), DOM renders the monumental typography
      if (subPhase === 3) return;

      // Horizon subtle radial light flare
      const flareGrad = ctx.createRadialGradient(
        centerX, horizonY, 5,
        centerX, horizonY, clientW * 0.5
      );
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      flareGrad.addColorStop(0.3, 'rgba(255, 51, 68, 0.03)');
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, clientW, clientH);

      // 1. Draw Runway Boundaries
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Left edge
      ctx.moveTo(centerX - runwayTopWidth / 2, runwayTopY);
      ctx.lineTo(centerX - runwayBottomWidth / 2, runwayBottomY);
      // Right edge
      ctx.moveTo(centerX + runwayTopWidth / 2, runwayTopY);
      ctx.lineTo(centerX + runwayBottomWidth / 2, runwayBottomY);
      // Horizon line
      ctx.moveTo(centerX - runwayTopWidth / 2, runwayTopY);
      ctx.lineTo(centerX + runwayTopWidth / 2, runwayTopY);
      ctx.stroke();

      // Horizontal ground line in subPhase 2 (START)
      if (subPhase === 2) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - runwayTopWidth / 2 - 40, runwayTopY);
        ctx.lineTo(centerX + runwayTopWidth / 2 + 40, runwayTopY);
        ctx.stroke();
      }

      // 2. Draw 7 columns of perspective rings receding into the distance
      const numRows = 12;
      const numCols = 7;

      for (let r = 0; r < numRows; r++) {
        const t = Math.pow(r / (numRows - 1), 2.2);
        const y = runwayTopY + t * (runwayBottomY - runwayTopY);
        const widthAtY = runwayTopWidth + t * (runwayBottomWidth - runwayTopWidth);
        const ringRadiusX = 4 + t * 9;
        const ringRadiusY = 1.6 + t * 3.5;

        for (let c = 0; c < numCols; c++) {
          const colT = c / (numCols - 1);
          const x = centerX - widthAtY / 2 + colT * widthAtY;

          ctx.beginPath();
          ctx.ellipse(x, y, ringRadiusX, ringRadiusY, 0, 0, Math.PI * 2);

          if (subPhase === 2 && r >= numRows - 4) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 + t * 0.55})`;
            ctx.lineWidth = 1.2 + t * 0.6;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Red TODAY Beacon Oval in foreground (except in subPhase 2)
      if (subPhase !== 2) {
        ctx.beginPath();
        ctx.ellipse(redDotX, redDotY, 18, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3344';
        ctx.shadowColor = '#ff3344';
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. In subPhase 1: Animate DON'T particles streaming down into the red beacon
      if (subPhase === 1 && dontParticles.length > 0) {
        const elapsed = now - startTime;
        const streamProgress = scrollT !== undefined ? scrollT : Math.max(0, Math.min((elapsed - 1200) / 1600, 1));

        dontParticles.forEach((p, idx) => {
          if (streamProgress === 0) {
            ctx.beginPath();
            ctx.arc(p.originX, p.originY, p.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 6;
            ctx.fill();
          } else {
            const stagger = (idx % 25) * 0.025;
            const itemProgress = Math.max(0, Math.min((streamProgress - stagger) / 0.65, 1));
            const ease = Math.pow(itemProgress, 2.5);

            const arcOffset = Math.sin(ease * Math.PI) * ((idx % 2 === 0 ? 1 : -1) * 45);
            p.x = p.originX + (p.targetX - p.originX) * ease + arcOffset;
            p.y = p.originY + (p.targetY - p.originY) * ease;

            const alpha = 1 - ease * 0.85;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (1 - ease * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = ease > 0.6 ? `rgba(255, 60, 75, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowColor = ease > 0.6 ? '#ff3344' : '#ffffff';
            ctx.shadowBlur = 8;
            ctx.fill();
          }
        });
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [subPhase, scrollT]);

  // Subphase 3: TODAY. Finale
  if (subPhase === 3) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center select-none bg-transparent text-white">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 animate-scaleUp">
          <h1 className="text-8xl sm:text-9xl md:text-[14rem] font-tech font-extrabold tracking-widest text-white uppercase glow-white">
            TODAY
          </h1>
          <span className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full bg-[#ff3344] shadow-[0_0_30px_#ff3344,0_0_70px_rgba(255,51,68,0.9)] inline-block mt-4 sm:mt-6 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 px-6 sm:px-12 md:px-20 select-none bg-transparent text-white relative overflow-hidden">
      {/* Top Header Text */}
      <div className="text-center pt-2 sm:pt-4 z-10">
        {subPhase === 0 && (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white">
            MOST PEOPLE WILL WAIT FOR JANUARY.
          </h1>
        )}
        {subPhase === 1 && (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-tech font-bold tracking-[0.25em] text-zinc-500 uppercase">
            MOST PEOPLE WILL WAIT FOR JANUARY.
          </h1>
        )}
        {subPhase === 2 && (
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-tech font-extrabold tracking-[0.3em] text-white uppercase glow-white">
            START
          </h1>
        )}
      </div>

      {/* 2027 JAN 01 at the Horizon */}
      <div className="absolute top-[20%] sm:top-[22%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 text-center pointer-events-none">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-tech font-bold tracking-widest text-white glow-white">
          {nextYear}
        </h2>
        <span className="text-xs sm:text-sm font-mono tracking-[0.35em] text-zinc-400 uppercase mt-1">
          JAN 01
        </span>
      </div>

      {/* Full Canvas for 3D Runway, Rings, and DON'T Particle Stream */}
      <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] my-auto">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Bottom Context */}
      <div className="w-full text-center text-xs sm:text-sm font-mono text-zinc-400 border-t border-white/10 pt-4 pb-2 uppercase tracking-widest z-10">
        {subPhase === 0 && 'LOOKING AHEAD TO THE NEW HORIZON'}
        {subPhase === 1 && 'TIME DOES NOT WAIT FOR THE CALENDAR'}
        {subPhase === 2 && 'THE REAL START IS RIGHT NOW'}
      </div>
    </div>
  );
};
