import React from 'react';
import { YearStats } from '../../core/dateEngine';

interface PhaseWeeksWeekendsProps {
  stats: YearStats;
  isWeekendsOnly: boolean; // false = "THAT'S 13 WEEKS.", true = "ONLY 13 WEEKENDS."
}

export const PhaseWeeksWeekends: React.FC<PhaseWeeksWeekendsProps> = ({ stats, isWeekendsOnly }) => {
  const weeksCount = stats.weeksRemaining; // 13
  const daysHeader = ['F', 'S', 'S', 'M', 'T', 'W', 'T'];

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 px-6 sm:px-12 md:px-20 select-none bg-transparent text-white">
      {/* Title */}
      <div className="text-center pt-2 sm:pt-4">
        {isWeekendsOnly ? (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white animate-fadeIn">
            ONLY {stats.weekendsRemaining} WEEKENDS.
          </h1>
        ) : (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white">
            THAT'S {weeksCount} WEEKS.
          </h1>
        )}
      </div>

      {/* Week Grid Container */}
      <div className="my-auto py-3 flex flex-col items-center justify-center w-full max-w-md sm:max-w-xl mx-auto">
        {/* Column Headers + Today indicator */}
        <div className="w-full flex items-center justify-between pl-8 pr-16 mb-3 text-xs sm:text-sm font-mono tracking-widest text-zinc-500">
          <div className="grid grid-cols-7 gap-4 sm:gap-6 w-full">
            {daysHeader.map((d, idx) => {
              const isWeekendCol = idx === 1 || idx === 2; // S S
              return (
                <span
                  key={idx}
                  className={`text-center font-bold transition-colors duration-300 ${
                    isWeekendsOnly
                      ? isWeekendCol
                        ? 'text-white scale-125 glow-white'
                        : 'text-zinc-700'
                      : 'text-zinc-300'
                  }`}
                >
                  {d}
                </span>
              );
            })}
          </div>

          {/* Today red indicator badge */}
          <div className="absolute right-8 sm:right-24 flex items-center space-x-1.5 text-xs font-mono tracking-wider text-[#ff3344] font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3344] shadow-[0_0_10px_#ff3344] animate-pulse" />
            <span className="glow-red">TODAY</span>
          </div>
        </div>

        {/* 13 Rows of 7 Dots */}
        <div className="w-full flex flex-col space-y-2 sm:space-y-2.5 relative">
          {Array.from({ length: weeksCount }).map((_, rIdx) => {
            const rowNumberStr = String(rIdx + 1).padStart(2, '0');
            const isFirstRow = rIdx === 0;
            const isLastRow = rIdx === weeksCount - 1;

            return (
              <div key={rIdx} className="w-full flex items-center justify-between">
                {/* Left Row Number (01 - 13) */}
                <span className={`w-8 text-[11px] sm:text-xs font-mono text-left tracking-wider ${isLastRow ? 'text-white font-bold' : 'text-zinc-600'}`}>
                  {rowNumberStr}
                </span>

                {/* 7 Day Dots */}
                <div className="grid grid-cols-7 gap-4 sm:gap-6 flex-1 place-items-center px-2">
                  {daysHeader.map((_, cIdx) => {
                    const isWeekendCol = cIdx === 1 || cIdx === 2;

                    if (isWeekendsOnly) {
                      if (isWeekendCol) {
                        return (
                          <div
                            key={cIdx}
                            className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] transition-all duration-500 scale-110"
                          />
                        );
                      } else {
                        return (
                          <div
                            key={cIdx}
                            className="w-[5.5px] h-[5.5px] sm:w-[6.5px] sm:h-[6.5px] rounded-full border border-zinc-800 bg-transparent transition-all duration-500"
                          />
                        );
                      }
                    } else {
                      return (
                        <div
                          key={cIdx}
                          className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.85)] transition-all duration-300"
                        />
                      );
                    }
                  })}
                </div>

                {/* Right Labels: OCT 02 at row 1, DEC 31 at row 13 */}
                <span className="w-20 text-[11px] sm:text-xs font-mono text-right text-zinc-400 font-semibold tracking-wider">
                  {isFirstRow && 'OCT 02'}
                  {isLastRow && 'DEC 31'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Context */}
      <div className="w-full text-center text-xs sm:text-sm font-mono text-zinc-400 border-t border-white/10 pt-4 pb-2 uppercase tracking-widest">
        {isWeekendsOnly
          ? `${stats.weekendsRemaining * 2} SATURDAYS & SUNDAYS REMAINING FOR PERSONAL GROWTH`
          : `${stats.daysRemaining} CONCRETE DAYS SPREAD ACROSS ${weeksCount} STRUCTURED WEEKS`}
      </div>
    </div>
  );
};
