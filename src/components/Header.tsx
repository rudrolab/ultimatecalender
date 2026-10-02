import React from 'react';
import { Maximize2, Minimize2, Info, Sparkles } from 'lucide-react';

interface HeaderProps {
  year: number;
  timeString: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleInfo: () => void;
  isInfoOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  year,
  timeString,
  isFullscreen,
  onToggleFullscreen,
  onToggleInfo,
  isInfoOpen,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-3 px-4 border-b border-white/5 bg-[#090a0f]/80 backdrop-blur-md z-30 shrink-0">
      <div className="flex items-center space-x-3">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3344]"></span>
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-semibold font-mono">
            ULTIMATE CALENDAR
          </span>
          <span className="text-xs font-bold tracking-widest text-zinc-200">
            YEAR {year}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-xs text-zinc-400 font-mono">
        <span className="hidden sm:inline-block tabular-nums tracking-wider text-zinc-300">
          {timeString}
        </span>

        <button
          onClick={onToggleInfo}
          title="Toggle Information Panel (Key: I)"
          aria-label="Toggle Information Panel"
          className={`p-1.5 rounded transition border ${
            isInfoOpen
              ? 'bg-[#ff3344]/20 border-[#ff3344]/50 text-[#ff3344]'
              : 'border-white/10 hover:border-white/30 text-zinc-400 hover:text-white'
          }`}
        >
          <Info size={14} />
        </button>

        <button
          onClick={onToggleFullscreen}
          title="Toggle Fullscreen (Key: F11)"
          aria-label="Toggle Fullscreen"
          className="p-1.5 rounded border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </header>
  );
};
