import React from 'react';
import { YearStats } from '../../core/dateEngine';

interface PhaseCalendarProps {
  stats: YearStats;
  subPhase: 0 | 1 | 2; // 0 = Overview, 1 = Quarter Highlight (75% Complete), 2 = Q4 Isolated
}

export const PhaseCalendar: React.FC<PhaseCalendarProps> = ({ stats, subPhase }) => {
  const currentMonthIdx = stats.currentMonthNumber - 1; // 0-11
  const todayDate = new Date().getDate();

  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];

  const currentMonthShort = stats.currentMonthName.substring(0, 3).toUpperCase();
  const currentDayPad = String(todayDate).padStart(2, '0');
  const dateStr = `${currentMonthShort} ${currentDayPad}`;

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 px-6 sm:px-12 md:px-20 select-none bg-transparent text-white">
      {/* Cinematic Title */}
      <div className="text-center pt-2 sm:pt-4">
        {subPhase === 0 ? (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white">
            HOW MUCH OF {stats.year} IS LEFT?
          </h1>
        ) : (
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white animate-fadeIn">
            {stats.year} IS {Math.round(stats.percentCompleted)}% COMPLETE.
          </h1>
        )}
      </div>

      {/* Spacious 12-Month Calendar Grid */}
      <div className="my-auto py-4 flex flex-col justify-center max-w-4xl mx-auto w-full">
        {Array.from({ length: 4 }).map((_, qIdx) => {
          const isQ4 = qIdx === 3;
          const isPastQuarter = qIdx < 3;

          // In subPhase 2, Q1-Q3 completely fade out into the dark depth
          if (subPhase === 2 && isPastQuarter) {
            return (
              <div
                key={qIdx}
                className="h-20 sm:h-24 transition-all duration-700 opacity-0 pointer-events-none transform -translate-y-8"
              />
            );
          }

          return (
            <div
              key={qIdx}
              className={`flex items-start mb-4 sm:mb-6 transition-all duration-700 ${
                subPhase === 1 && isPastQuarter
                  ? 'opacity-25 filter blur-[0.5px]'
                  : subPhase === 2 && isPastQuarter
                  ? 'opacity-0 filter blur-[2px]'
                  : 'opacity-100'
              }`}
            >
              {/* Quarter label on left (visible in subPhase 1 & 2) */}
              <div className="w-10 sm:w-14 shrink-0 text-left pt-5">
                {subPhase >= 1 && (
                  <span
                    className={`text-xs sm:text-sm font-mono tracking-widest ${
                      isQ4 ? 'text-white font-bold glow-white' : 'text-zinc-600'
                    }`}
                  >
                    {quarterLabels[qIdx]}
                  </span>
                )}
              </div>

              {/* 3 Months for this Quarter */}
              <div className="flex-1 grid grid-cols-3 gap-4 sm:gap-8 md:gap-12">
                {Array.from({ length: 3 }).map((_, mOffset) => {
                  const mIdx = qIdx * 3 + mOffset;
                  const month = stats.monthsData[mIdx];
                  if (!month) return null;

                  const isCurrentMonth = mIdx === currentMonthIdx;
                  const isFutureMonth = mIdx > currentMonthIdx;
                  const isPastMonth = mIdx < currentMonthIdx;

                  return (
                    <div key={mIdx} className="flex flex-col">
                      {/* Month Label */}
                      <span
                        className={`text-[11px] sm:text-xs font-mono tracking-[0.2em] mb-2 ${
                          isCurrentMonth
                            ? 'text-white font-bold glow-white'
                            : isQ4 && subPhase >= 1
                            ? 'text-zinc-300 font-semibold'
                            : 'text-zinc-600'
                        }`}
                      >
                        {monthNames[mIdx]}
                      </span>

                      {/* Dots Matrix */}
                      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 place-items-center">
                        {month.days.map((day) => {
                          const isToday = isCurrentMonth && day.dayNumber === todayDate;
                          const isPastDay = isPastMonth || (isCurrentMonth && day.dayNumber < todayDate);
                          const isFutureDay = isFutureMonth || (isCurrentMonth && day.dayNumber > todayDate);

                          if (subPhase === 0) {
                            if (isPastDay || isToday) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[5px] h-[5px] sm:w-[6.5px] sm:h-[6.5px] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                                />
                              );
                            }
                            return (
                              <div
                                key={day.dayNumber}
                                className="w-[5px] h-[5px] sm:w-[6.5px] sm:h-[6.5px] rounded-full border border-zinc-700 bg-transparent"
                              />
                            );
                          } else {
                            if (isPastQuarter) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[5px] h-[5px] sm:w-[6.5px] sm:h-[6.5px] rounded-full bg-zinc-700"
                                />
                              );
                            }

                            if (isToday) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[7px] h-[7px] sm:w-[8.5px] sm:h-[8.5px] rounded-full bg-[#ff3344] shadow-[0_0_14px_#ff3344,0_0_24px_rgba(255,51,68,0.8)] animate-pulse"
                                />
                              );
                            }

                            if (isPastDay) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[5px] h-[5px] sm:w-[6.5px] sm:h-[6.5px] rounded-full bg-zinc-700"
                                />
                              );
                            }

                            // Remaining future day in Q4: Glowing concentric ring
                            return (
                              <div
                                key={day.dayNumber}
                                className="w-[6px] h-[6px] sm:w-[7.5px] sm:h-[7.5px] rounded-full border border-white flex items-center justify-center bg-transparent shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                              >
                                <div className="w-[1.5px] h-[1.5px] sm:w-[2px] sm:h-[2px] rounded-full bg-white" />
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center text-xs sm:text-sm font-mono tracking-widest text-zinc-400 border-t border-white/10 pt-4 pb-2 uppercase">
        {subPhase === 0 ? (
          <>
            <span className="text-zinc-300 font-semibold">{dateStr}</span>
            <span>DAY {stats.daysPassed} / {stats.totalDays}</span>
          </>
        ) : (
          <>
            <span className="flex items-center space-x-2">
              <span className="text-zinc-500">STATUS</span>
              <span className="text-zinc-600">·</span>
              <span className="text-[#ff3344] font-bold">TODAY ({dateStr})</span>
            </span>
            <span className="text-zinc-300">DAY {stats.daysPassed} OF {stats.totalDays}</span>
          </>
        )}
      </div>
    </div>
  );
};
