import React from 'react';

interface ScrollProgressIndicatorProps {
  progress: number; // 0 to 1
  phaseIndex: number;
  totalPhases: number;
  phaseNames: string[];
  onJumpToPhase: (phaseIdx: number) => void;
}

export const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  progress,
  phaseIndex,
  totalPhases,
  phaseNames,
  onJumpToPhase,
}) => {
  return (
    <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end space-y-4 pointer-events-auto select-none">
      {/* Percentage Readout */}
      <div className="flex flex-col items-end font-mono">
        <span className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase">3D TIMELINE</span>
        <span className="text-sm font-bold text-white tabular-nums tracking-wider">
          {Math.round(progress * 100)}%
        </span>
      </div>

      {/* Vertical Indicator Track */}
      <div className="relative flex flex-col items-center space-y-3 py-2 pr-1">
        {/* Track Line */}
        <div className="absolute right-[5px] top-0 bottom-0 w-[1px] bg-white/10 -z-10">
          <div
            className="w-full bg-[#ff3344] shadow-[0_0_8px_#ff3344] transition-all duration-75"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        {/* Phase Node Pills */}
        {phaseNames.map((name, idx) => {
          const isActive = idx === phaseIndex;
          const isPassed = idx < phaseIndex;

          return (
            <button
              key={idx}
              onClick={() => onJumpToPhase(idx)}
              className="group flex items-center space-x-3 text-right transition-all cursor-pointer"
            >
              {/* Tooltip on hover */}
              <span
                className={`text-[10px] font-mono tracking-wider uppercase transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                  isActive ? 'opacity-100 text-white font-bold' : 'text-zinc-500'
                }`}
              >
                {name}
              </span>

              {/* Node Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#ff3344] scale-125 shadow-[0_0_10px_#ff3344]'
                    : isPassed
                    ? 'bg-zinc-400'
                    : 'bg-zinc-800 border border-white/20 hover:border-white/50'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase">
        SCROLL TO SCRUB
      </span>
    </div>
  );
};
