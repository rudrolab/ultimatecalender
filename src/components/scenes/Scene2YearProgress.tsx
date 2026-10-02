import React, { useEffect, useState } from 'react';
import { YearStats } from '../../core/dateEngine';

interface Scene2Props {
  stats: YearStats;
}

export const Scene2YearProgress: React.FC<Scene2Props> = ({ stats }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = stats.percentCompleted;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Number((ease * end).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [stats.percentCompleted]);

  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-4 sm:px-8 select-none">
      {/* Top indicator */}
      <div className="text-center pt-4">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          METRIC 01 / ANNUAL RATIO
        </span>
      </div>

      {/* Main Percentage Display */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative flex items-baseline justify-center">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-white font-display select-none">
            {animatedPercent}
          </span>
          <span className="text-4xl sm:text-5xl font-bold text-[#ff3344] font-display ml-1 glow-red">
            %
          </span>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm sm:text-base font-mono tracking-[0.25em] text-zinc-300 uppercase font-semibold">
            OF {stats.year} IS COMPLETE
          </p>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            {stats.daysPassed} OF {stats.totalDays} DAYS HAVE PASSED
          </p>
        </div>

        {/* Cinematic Precision Progress Bar */}
        <div className="w-full max-w-xs sm:max-w-sm mt-8 space-y-2">
          <div className="w-full h-3 bg-[#12141c] border border-white/10 rounded-full overflow-hidden p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-zinc-400 via-white to-[#ff3344] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(255,51,68,0.7)]"
              style={{ width: `${animatedPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-1">
            <span>JAN 1</span>
            <span className="text-zinc-400">TODAY (DAY {stats.dayOfYear})</span>
            <span>DEC 31</span>
          </div>
        </div>
      </div>

      {/* Bottom context */}
      <div className="text-center pb-4">
        <span className="inline-block py-1 px-3 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-400">
          <span className="text-[#ff3344] font-bold">{stats.percentRemaining}%</span> OF THE YEAR REMAINS
        </span>
      </div>
    </div>
  );
};
