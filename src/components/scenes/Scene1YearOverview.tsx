import React from 'react';
import { YearStats } from '../../core/dateEngine';

interface Scene1Props {
  stats: YearStats;
}

export const Scene1YearOverview: React.FC<Scene1Props> = ({ stats }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between py-2 px-3 sm:px-6 select-none animate-fadeIn">
      {/* Title block */}
      <div className="text-center pt-2 sm:pt-4">
        <h2 className="text-xs sm:text-sm tracking-[0.3em] uppercase text-zinc-400 font-mono font-medium">
          HOW MUCH OF
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display my-1">
          {stats.year}
        </h1>
        <h2 className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#ff3344] font-mono font-semibold">
          IS LEFT?
        </h2>
      </div>

      {/* 12-Month Calendar Dot Matrix */}
      <div className="my-auto py-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-4 max-w-lg mx-auto">
          {stats.monthsData.map((month) => (
            <div
              key={month.index}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                month.isCurrent
                  ? 'border-[#ff3344]/40 bg-[#ff3344]/5'
                  : 'border-white/5 bg-white/[0.01]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span
                  className={`text-[10px] font-bold font-mono tracking-wider ${
                    month.isCurrent ? 'text-[#ff3344]' : 'text-zinc-400'
                  }`}
                >
                  {month.shortName}
                </span>
                <span className="text-[8px] text-zinc-600 font-mono">
                  {month.completedDays}/{month.daysCount}
                </span>
              </div>

              {/* Day dots: 7 columns for week layout */}
              <div className="grid grid-cols-7 gap-1 place-items-center">
                {month.days.map((day) => {
                  let dotClass = 'bg-[#1c1f2b]';
                  if (day.status === 'completed') {
                    dotClass = 'bg-zinc-300';
                  } else if (day.status === 'current') {
                    dotClass = 'bg-[#ff3344] scale-125 glow-dot-current animate-pulse';
                  }

                  return (
                    <div
                      key={day.dayNumber}
                      title={`${month.name} ${day.dayNumber}: ${day.status}`}
                      className={`w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full transition-all duration-200 ${dotClass}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Summary Footer */}
      <div className="w-full pb-2">
        <div className="max-w-md mx-auto flex items-center justify-between border-t border-white/10 pt-3 px-2 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-zinc-200 tracking-wider">
              {stats.percentCompleted}% COMPLETE
            </span>
          </div>

          <div className="h-3 w-[1px] bg-white/10" />

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#ff3344] glow-dot-current" />
            <span className="font-bold text-white tracking-wider">
              {stats.daysRemaining} DAYS LEFT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
