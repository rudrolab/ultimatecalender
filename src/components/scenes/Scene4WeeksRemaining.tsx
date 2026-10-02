import React from 'react';
import { YearStats } from '../../core/dateEngine';

interface Scene4Props {
  stats: YearStats;
}

export const Scene4WeeksRemaining: React.FC<Scene4Props> = ({ stats }) => {
  const totalYearWeeks = Math.ceil(stats.totalDays / 7);
  const weeksPassed = Math.max(0, totalYearWeeks - stats.weeksRemaining);

  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-4 sm:px-8 select-none">
      {/* Top indicator */}
      <div className="text-center pt-4">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          METRIC 03 / CALENDAR INTERVALS
        </span>
      </div>

      {/* Main Weeks Left Display */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-white font-display select-none">
            {stats.weeksRemaining}
          </span>
          <div className="absolute inset-0 bg-red-500/10 blur-3xl -z-10 rounded-full" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-[0.3em] text-[#ff3344] uppercase mt-2 glow-red">
          WEEKS LEFT
        </h2>

        {/* Supporting information */}
        <div className="mt-3 py-1 px-4 rounded-full border border-white/10 bg-white/[0.02]">
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-300 uppercase">
            {stats.daysRemaining} EXACT DAYS REMAINING
          </span>
        </div>

        {/* Visual Week Representation Blocks */}
        <div className="mt-8 w-full max-w-xs sm:max-w-sm">
          <div className="text-[10px] font-mono text-zinc-500 text-center mb-2 tracking-wider">
            ANNUAL WEEKS MATRIX ({weeksPassed} PASSED • {stats.weeksRemaining} REMAINING)
          </div>
          <div className="grid grid-cols-13 gap-1.5 p-3 rounded-lg border border-white/5 bg-[#12141c]/60">
            {Array.from({ length: totalYearWeeks }).map((_, i) => {
              const isPassed = i < weeksPassed;
              const isCurrent = i === weeksPassed;

              let bg = 'bg-[#1c1f2b]';
              if (isPassed) bg = 'bg-zinc-400';
              if (isCurrent) bg = 'bg-[#ff3344] glow-dot-current animate-pulse';

              return (
                <div
                  key={i}
                  title={`Week ${i + 1}`}
                  className={`h-4 sm:h-5 rounded-sm transition-all duration-300 ${bg}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center pb-4 text-xs font-mono text-zinc-500">
        EACH WEEK IS 168 UNRECOVERABLE HOURS
      </div>
    </div>
  );
};
