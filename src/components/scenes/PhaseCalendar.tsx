import React from 'react';
import { YearStats } from '../../core/dateEngine';

interface PhaseCalendarProps {
  stats: YearStats;
  subPhase: 0 | 1 | 2; // 0 = Overview, 1 = Quarter Highlight (75% Complete), 2 = Q4 Isolated
}

export const PhaseCalendar: React.FC<PhaseCalendarProps> = ({ stats, subPhase }) => {
  const currentMonthIdx = stats.currentMonthNumber - 1; // 0-11
  const todayDate = new Date().getDate();

  // Short month names
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];

  // Current formatted date: e.g. "OCT 02"
  const currentMonthShort = stats.currentMonthName.substring(0, 3).toUpperCase();
  const currentDayPad = String(todayDate).padStart(2, '0');
  const dateStr = `${currentMonthShort} ${currentDayPad}`;

  return (
    <div className="w-full h-full flex flex-col justify-between py-2 px-4 sm:px-6 select-none bg-[#090a0f] text-white">
      {/* Title */}
      <div className="text-center pt-2 sm:pt-4">
        {subPhase === 0 ? (
          <h1 className="text-xl sm:text-2xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white">
            HOW MUCH OF {stats.year} IS LEFT?
          </h1>
        ) : (
          <h1 className="text-xl sm:text-2xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white animate-fadeIn">
            {stats.year} IS {Math.round(stats.percentCompleted)}% COMPLETE.
          </h1>
        )}
      </div>

      {/* Calendar Grid (4 Rows of 3 Months) */}
      <div className="my-auto py-2 flex flex-col justify-center max-w-sm sm:max-w-md mx-auto w-full">
        {Array.from({ length: 4 }).map((_, qIdx) => {
          const isQ4 = qIdx === 3;
          const isPastQuarter = qIdx < 3;

          // In subPhase 2, Q1-Q3 are completely invisible/hidden
          if (subPhase === 2 && isPastQuarter) {
            return (
              <div key={qIdx} className="h-16 sm:h-20 transition-all duration-700 opacity-0 pointer-events-none" />
            );
          }

          return (
            <div
              key={qIdx}
              className={`flex items-start mb-4 transition-all duration-700 ${
                subPhase === 1 && isPastQuarter
                  ? 'opacity-30'
                  : subPhase === 2 && isPastQuarter
                  ? 'opacity-0'
                  : 'opacity-100'
              }`}
            >
              {/* Quarter label on left (visible in subPhase 1 & 2) */}
              <div className="w-7 sm:w-8 shrink-0 text-left pt-5">
                {subPhase >= 1 ? (
                  <span className={`text-[10px] sm:text-xs font-mono tracking-wider ${isQ4 ? 'text-zinc-300 font-bold' : 'text-zinc-600'}`}>
                    {quarterLabels[qIdx]}
                  </span>
                ) : null}
              </div>

              {/* 3 Months for this Quarter */}
              <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-3">
                {Array.from({ length: 3 }).map((_, mOffset) => {
                  const mIdx = qIdx * 3 + mOffset;
                  const month = stats.monthsData[mIdx];
                  if (!month) return null;

                  const isCurrentMonth = mIdx === currentMonthIdx;
                  const isFutureMonth = mIdx > currentMonthIdx;
                  const isPastMonth = mIdx < currentMonthIdx;

                  return (
                    <div key={mIdx} className="flex flex-col">
                      {/* Month short name */}
                      <span
                        className={`text-[9px] sm:text-[10px] font-mono tracking-widest mb-1.5 ${
                          isCurrentMonth
                            ? 'text-white font-bold'
                            : isQ4 && subPhase >= 1
                            ? 'text-zinc-300 font-semibold'
                            : 'text-zinc-500'
                        }`}
                      >
                        {monthNames[mIdx]}
                      </span>

                      {/* Dots matrix (7 columns) */}
                      <div className="grid grid-cols-7 gap-1 place-items-center">
                        {month.days.map((day) => {
                          const isToday = isCurrentMonth && day.dayNumber === todayDate;
                          const isPastDay = isPastMonth || (isCurrentMonth && day.dayNumber < todayDate);
                          const isFutureDay = isFutureMonth || (isCurrentMonth && day.dayNumber > todayDate);

                          // Style based on subPhase and day status matching screenshots
                          if (subPhase === 0) {
                            // Phase 1 Overview
                            if (isPastDay) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[4.5px] h-[4.5px] rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                                />
                              );
                            }
                            if (isToday) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[4.5px] h-[4.5px] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                                />
                              );
                            }
                            // Future day in Phase 1: hollow dark ring
                            return (
                              <div
                                key={day.dayNumber}
                                className="w-[4.5px] h-[4.5px] rounded-full border border-zinc-700 bg-transparent"
                              />
                            );
                          } else {
                            // Phase 2 & 3: Focus on Q4
                            if (isPastQuarter) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[4.5px] h-[4.5px] rounded-full bg-zinc-600"
                                />
                              );
                            }

                            // Q4 days
                            if (isToday) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[6px] h-[6px] rounded-full bg-[#ff3344] shadow-[0_0_10px_#ff3344] animate-pulse"
                                />
                              );
                            }
                            if (isPastDay) {
                              return (
                                <div
                                  key={day.dayNumber}
                                  className="w-[4.5px] h-[4.5px] rounded-full bg-zinc-600"
                                />
                              );
                            }
                            // Remaining future day: Concentric glowing ring / ring with inner dot
                            return (
                              <div
                                key={day.dayNumber}
                                className="w-[5.5px] h-[5.5px] rounded-full border border-white flex items-center justify-center bg-transparent shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                              >
                                <div className="w-[1.5px] h-[1.5px] rounded-full bg-white" />
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

      {/* Bottom Status Footer (matching screenshots) */}
      <div className="w-full flex justify-between items-center text-xs font-mono tracking-widest text-zinc-400 border-t border-white/5 pt-3 pb-2 uppercase">
        {subPhase === 0 ? (
          <>
            <span>{dateStr}</span>
            <span>DAY {stats.daysPassed} / {stats.totalDays}</span>
          </>
        ) : (
          <>
            <span className="flex items-center space-x-1.5">
              <span>TODAY</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-200">{dateStr}</span>
            </span>
            <span>DAY {stats.daysPassed} / {stats.totalDays}</span>
          </>
        )}
      </div>
    </div>
  );
};
