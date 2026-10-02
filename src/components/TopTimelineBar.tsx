import React from 'react';
import { YearStats } from '../core/dateEngine';
import { Info, Maximize2, Minimize2 } from 'lucide-react';

interface TopTimelineBarProps {
  stats: YearStats;
  isRedDot?: boolean;
  onOpenInfo: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TopTimelineBar: React.FC<TopTimelineBarProps> = ({
  stats,
  isRedDot = true,
  onOpenInfo,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const fraction = Math.min(Math.max(stats.daysPassed / stats.totalDays, 0), 1);

  return (
    <header className="w-full pt-4 pb-2 px-6 sm:px-12 md:px-16 flex flex-col select-none shrink-0 z-30 bg-gradient-to-b from-[#050608]/90 via-[#050608]/60 to-transparent backdrop-blur-[2px]">
      {/* Telemetry Bar */}
      <div className="w-full flex justify-between items-center text-[10px] sm:text-[12px] font-mono text-zinc-400 tracking-[0.25em] uppercase mb-2">
        <div className="flex items-center space-x-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3344] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3344]"></span>
          </span>
          <span className="font-bold text-white tracking-widest">
            {stats.year} // CHRONOS
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="font-mono text-zinc-400">
            DAY <strong className="text-white">{stats.daysPassed}</strong> / {stats.totalDays}
          </span>
          
          <button
            onClick={onOpenInfo}
            title="System Statistics (Key: I)"
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <Info size={14} />
          </button>

          <button
            onClick={onToggleFullscreen}
            title="Toggle Fullscreen (Key: F11)"
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Edge-to-edge Glowing Timeline Track with Precise Quarter Ticks */}
      <div className="w-full h-3 relative flex items-center">
        <div className="w-full h-[1px] bg-zinc-800 relative">
          {/* Quarter lines */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-3 bg-zinc-600" />
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[1px] h-2 bg-zinc-700" />
          <div className="absolute left-2/4 top-1/2 -translate-y-1/2 w-[1px] h-2 bg-zinc-700" />
          <div className="absolute left-3/4 top-1/2 -translate-y-1/2 w-[1px] h-2 bg-zinc-700" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-3 bg-zinc-600" />

          {/* Active progress fill line */}
          <div
            className="absolute left-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff3344]/50 to-[#ff3344] transition-all duration-100"
            style={{ width: `${fraction * 100}%` }}
          />

          {/* Luminous progress beacon dot */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isRedDot
                ? 'bg-[#ff3344] shadow-[0_0_12px_#ff3344,0_0_24px_rgba(255,51,68,0.8)]'
                : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]'
            }`}
            style={{ left: `${fraction * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
};
