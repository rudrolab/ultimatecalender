import React from 'react';
import { YearStats } from '../../core/dateEngine';

interface PhaseWeeksWeekendsProps {
  stats: YearStats;
  isWeekendsOnly: boolean; // false = "THAT'S 13 WEEKS.", true = "ONLY 13 WEEKENDS."
}

export const PhaseWeeksWeekends: React.FC<PhaseWeeksWeekendsProps> = ({ stats, isWeekendsOnly }) => {
  const weeksCount = stats.weeksRemaining; // 13

  // Weekday column headers starting from today's day of week
  // Reference starts from Friday (F S S M T W T) for Oct 02 2026
  const daysHeader = ['F', 'S', 'S', 'M', 'T', 'W', 'T'];

  return (
    <div className="w-full h-full flex flex-col justify-between py-2 px-6 sm:px-10 select-none bg-[#090a0f] text-white">
      {/* Title */}
      <div className="text-center pt-2 sm:pt-4">
        {isWeekendsOnly ? (
          <h1 className="text-xl sm:text-2xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white animate-fadeIn">
            ONLY {stats.weekendsRemaining} WEEKENDS.
          </h1>
        ) : (
          <h1 className="text-xl sm:text-2xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white">
            THAT'S {weeksCount} WEEKS.
          </h1>
        )}
      </div>

      {/* Week Grid Container */}
      <div className="my-auto py-2 flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm mx-auto">
        {/* Column Headers + Today indicator */}
        <div className="w-full flex items-center justify-between pl-8 pr-16 mb-2 text-[11px] font-mono tracking-widest text-zinc-500">
          <div className="grid grid-cols-7 gap-3 sm:gap-4 w-full">
            {daysHeader.map((d, idx) => {
              const isWeekendCol = idx === 1 || idx === 2; // S S
              return (
                <span
                  key={idx}
                  className={`text-center font-bold transition-colors duration-300 ${
                    isWeekendsOnly
                      ? isWeekendCol
                        ? 'text-white scale-110'
                        : 'text-zinc-600'
                      : 'text-zinc-400'
                  }`}
                >
                  {d}
                </span>
              );
            })}
          </div>

          {/* Today red indicator badge on top right */}
          <div className="absolute right-6 sm:right-10 flex items-center space-x-1 text-[10px] font-mono tracking-wider text-[#ff3344] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ff3344] shadow-[0_0_8px_#ff3344] animate-pulse" />
            <span className="glow-red">TODAY</span>
          </div>
        </div>

        {/* 13 Rows of 7 Dots */}
        <div className="w-full flex flex-col space-y-2 relative">
          {Array.from({ length: weeksCount }).map((_, rIdx) => {
            const rowNumberStr = String(rIdx + 1).padStart(2, '0');
            const isFirstRow = rIdx === 0;
            const isLastRow = rIdx === weeksCount - 1;

            return (
              <div key={rIdx} className="w-full flex items-center justify-between">
                {/* Left Row Number (01 - 13) */}
                <span className={`w-6 text-[10px] font-mono text-left tracking-wider ${isLastRow ? 'text-white font-bold' : 'text-zinc-600'}`}>
                  {rowNumberStr}
                </span>

                {/* 7 Day Dots */}
                <div className="grid grid-cols-7 gap-3 sm:gap-4 flex-1 place-items-center px-2">
                  {daysHeader.map((_, cIdx) => {
                    const isWeekendCol = cIdx === 1 || cIdx === 2; // Saturday & Sunday

                    if (isWeekendsOnly) {
                      // In Weekends-only mode: weekends glow white, others become hollow rings
                      if (isWeekendCol) {
                        return (
                          <div
                            key={cIdx}
                            className="w-[5.5px] h-[5.5px] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] transition-all duration-500"
                          />
                        );
                      } else {
                        return (
                          <div
                            key={cIdx}
                            className="w-[5px] h-[5px] rounded-full border border-zinc-700 bg-transparent transition-all duration-500"
                          />
                        );
                      }
                    } else {
                      // In all weeks mode: all dots are solid glowing white
                      return (
                        <div
                          key={cIdx}
                          className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] transition-all duration-300"
                        />
                      );
                    }
                  })}
                </div>

                {/* Right Labels: OCT 02 at row 1, DEC 31 at row 13 */}
                <span className="w-16 text-[10px] font-mono text-right text-zinc-400 font-semibold tracking-wider">
                  {isFirstRow && 'OCT 02'}
                  {isLastRow && 'DEC 31'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom context */}
      <div className="w-full text-center text-xs font-mono text-zinc-500 border-t border-white/5 pt-3 pb-2 uppercase tracking-widest">
        {isWeekendsOnly
          ? `${stats.weekendsRemaining * 2} DAYS OF FREE TIME REMAIN`
          : `${stats.daysRemaining} DAYS REMAIN IN ${weeksCount} WEEKS`}
      </div>
    </div>
  );
};
