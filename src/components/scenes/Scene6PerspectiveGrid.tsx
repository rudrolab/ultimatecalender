import React, { useEffect, useRef } from 'react';
import { YearStats } from '../../core/dateEngine';

interface Scene6Props {
  stats: YearStats;
}

export const Scene6PerspectiveGrid: React.FC<Scene6Props> = ({ stats }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offsetZ = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Number of remaining day nodes to project
    const remainingCount = Math.min(stats.daysRemaining, 180);
    const cols = 6;
    const rows = Math.ceil(remainingCount / cols);

    const render = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Camera coordinates
      const horizonY = height * 0.35;
      const focalLength = 320;
      offsetZ = (time * 0.0006) % 1; // smooth forward motion

      // Horizon subtle glow
      const horizonGrad = ctx.createRadialGradient(
        width / 2, horizonY, 5,
        width / 2, horizonY, width * 0.6
      );
      horizonGrad.addColorStop(0, 'rgba(255, 51, 68, 0.25)');
      horizonGrad.addColorStop(0.5, 'rgba(255, 51, 68, 0.05)');
      horizonGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw perspective grid floor lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      // Radial perspective rays from vanishing point
      const numRays = 14;
      for (let i = 0; i <= numRays; i++) {
        const spreadX = (i / numRays - 0.5) * width * 3.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(width / 2 + spreadX, height);
        ctx.stroke();
      }

      // Horizontal depth lines
      const depthSteps = 16;
      for (let j = 0; j < depthSteps; j++) {
        const z = ((j + offsetZ) / depthSteps);
        // Exponential depth projection
        const screenY = horizonY + Math.pow(z, 2.2) * (height - horizonY);
        const alpha = Math.min(z * 0.15, 0.12);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
      }

      // Render remaining days as floating 3D nodes
      let dayIndex = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (dayIndex >= remainingCount) break;

          // Normalized 3D position
          const normZ = 1 - ((r + offsetZ) / (rows + 1));
          if (normZ <= 0.05 || normZ > 1) {
            dayIndex++;
            continue;
          }

          const worldX = (c / (cols - 1) - 0.5) * 400;
          const worldY = 80;
          const worldZ = normZ * 800;

          // 3D perspective projection
          const scale = focalLength / (worldZ + focalLength);
          const projX = width / 2 + worldX * scale + Math.sin(time * 0.001 + r) * 4 * scale;
          const projY = horizonY + worldY * scale;
          const radius = Math.max(1.2, 4.5 * scale);
          const alpha = Math.min(Math.max(scale * 1.5, 0.1), 0.9);

          // Today / closest remaining node highlight
          const isNextDay = dayIndex === 0;

          ctx.beginPath();
          ctx.arc(projX, projY, radius, 0, Math.PI * 2);

          if (isNextDay) {
            ctx.fillStyle = `rgba(255, 51, 68, ${alpha})`;
            ctx.shadowColor = '#ff3344';
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = `rgba(226, 232, 240, ${alpha * 0.7})`;
            ctx.shadowBlur = 0;
          }
          ctx.fill();

          dayIndex++;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [stats.daysRemaining]);

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 px-4 select-none relative overflow-hidden">
      {/* Top overlay */}
      <div className="text-center pt-2 z-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          METRIC 05 / TEMPORAL PERSPECTIVE
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-[0.25em] text-white uppercase mt-1">
          {stats.daysRemaining} DAYS IN HORIZON
        </h2>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-72 sm:h-80 my-auto rounded-xl border border-white/5 bg-[#0b0c12] overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Horizon crosshair */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
          <div className="w-4 h-[1px] bg-red-500/60" />
          <div className="h-4 w-[1px] bg-red-500/60 -mt-2" />
        </div>

        <div className="absolute bottom-2 left-3 text-[9px] font-mono text-zinc-600 tracking-wider">
          CAMERA: FORWARD VECTOR [0, 0, +Z]
        </div>
        <div className="absolute bottom-2 right-3 text-[9px] font-mono text-zinc-600 tracking-wider">
          TARGET: DEC 31, {stats.year}
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center pb-2 z-10 text-xs font-mono text-zinc-400">
        THE FUTURE IS NOT DISTANT. IT IS ARRIVING EVERY SECOND.
      </div>
    </div>
  );
};
