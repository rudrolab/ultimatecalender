import React from 'react';
import { YearStats } from '../core/dateEngine';

interface TopTimelineBarProps {
  stats: YearStats;
  isRedDot?: boolean;
}

export const TopTimelineBar: React.FC<TopTimelineBarProps> = ({ stats, isRedDot = true }) => {
  const fraction = Math.min(Math.max(stats.daysPassed / stats.totalDays, 0), 1);

  return (
    <div className="w-full flex flex-col pt-3 px-6 sm:px-8 select-none shrink-0 z-30">
      {/* Top Labels */}
      <div className="w-full flex justify-between items-center text-[10px] sm:text-[11px] font-mono text-zinc-500 tracking-[0.2em] uppercase mb-1.5">
        <span>{stats.year}</span>
        <span>{stats.daysPassed}/{stats.totalDays}</span>
      </div>

      {/* Technical Timeline with Ticks */}
      <div className="w-full h-4 relative flex items-center">
        <div className="w-full h-[1px] bg-zinc-800 relative">
          {/* End caps */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-2 bg-zinc-600" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-2 bg-zinc-600" />

          {/* Quarter ticks */}
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-zinc-700" />
          <div className="absolute left-2/4 top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-zinc-700" />
          <div className="absolute left-3/4 top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-zinc-700" />

          {/* Progress Indicator Dot */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
              isRedDot
                ? 'bg-[#ff3344] shadow-[0_0_8px_#ff3344]'
                : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
            }`}
            style={{ left: `${fraction * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
