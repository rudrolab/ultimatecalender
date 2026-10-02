import React, { useState, useEffect } from 'react';
import { YearStats } from '../../core/dateEngine';

interface Scene1Props {
  stats: YearStats;
}

export const Scene1YearOverview: React.FC<Scene1Props> = ({ stats }) => {
  const [highlightRemaining, setHighlightRemaining] = useState(false);
  const [displayedDaysLeft, setDisplayedDaysLeft] = useState(0);

  useEffect(() => {
    // Phase 1: Display calendar
    // Phase 2: After 800ms, trigger remaining dots glow wave
    const timer = setTimeout(() => {
      setHighlightRemaining(true);
    }, 700);

    // Number count-up animation for days left
    const startCountTime = performance.now() + 700;
    const duration = 1200;
    let animId: number;

    const animateCount = (now: number) => {
      if (now < startCountTime) {
        animId = requestAnimationFrame(animateCount);
        return;
      }
      const progress = Math.min((now - startCountTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayedDaysLeft(Math.floor(ease * stats.daysRemaining));

      if (progress < 1) {
        animId = requestAnimationFrame(animateCount);
      } else {
        setDisplayedDaysLeft(stats.daysRemaining);
      }
    };

    animId = requestAnimationFrame(animateCount);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, [stats.daysRemaining]);

  // Track remaining dot order index for wave animation
  let remainingCounter = 0;

  return (
    <div className="w-full h-full flex flex-col justify-between py-2 px-3 sm:px-6 select-none">
      {/* Title block */}
      <div className="text-center pt-2 sm:pt-4">
        <h2 className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-zinc-400 font-mono font-medium">
          HOW MUCH OF
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display my-0.5">
          {stats.year}
        </h1>
        <h2 className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#ff3344] font-mono font-semibold glow-red">
          IS LEFT?
        </h2>
      </div>

      {/* 12-Month Calendar Dot Matrix */}
      <div className="my-auto py-1">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2.5 gap-y-3 max-w-lg mx-auto">
          {stats.monthsData.map((month) => (
            <div
              key={month.index}
              className={`p-2 rounded-lg border transition-all duration-500 ${
                month.isCurrent
                  ? 'border-[#ff3344]/50 bg-[#ff3344]/8 shadow-[0_0_15px_rgba(255,51,68,0.15)]'
                  : month.isFuture && highlightRemaining
                  ? 'border-red-500/20 bg-red-950/10'
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

              {/* Day dots: 7 columns */}
              <div className="grid grid-cols-7 gap-1 place-items-center">
                {month.days.map((day) => {
                  let isFuture = day.status === 'future';
                  let isCurrent = day.status === 'current';
                  let isCompleted = day.status === 'completed';

                  let dotClass = 'bg-[#1a1d28]';
                  let delayStyle = {};

                  if (isCompleted) {
                    dotClass = highlightRemaining ? 'bg-zinc-600 opacity-60' : 'bg-zinc-300';
                  } else if (isCurrent) {
                    dotClass = 'bg-[#ff3344] scale-125 glow-dot-current animate-pulse';
                  } else if (isFuture) {
                    remainingCounter++;
                    if (highlightRemaining) {
                      // Wave animation as remaining dots turn bright red
                      dotClass = 'bg-[#ff3344] scale-110 shadow-[0_0_5px_#ff3344] transition-all duration-300';
                      delayStyle = {
                        transitionDelay: `${Math.min(remainingCounter * 5, 800)}ms`,
                      };
                    } else {
                      dotClass = 'bg-[#1c1f2b]';
                    }
                  }

                  return (
                    <div
                      key={day.dayNumber}
                      title={`${month.name} ${day.dayNumber}`}
                      style={delayStyle}
                      className={`w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full transition-all duration-300 ${dotClass}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prominent Days Left Spotlight Indicator */}
      <div className="w-full pb-2">
        <div className="max-w-md mx-auto p-2.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-zinc-300">
              {stats.percentCompleted}% PASSED
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-[#ff3344]/15 border border-[#ff3344]/40 py-1 px-3 rounded-full shadow-[0_0_12px_rgba(255,51,68,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#ff3344] animate-ping" />
            <span className="font-bold text-white tracking-wider glow-white">
              {displayedDaysLeft} DAYS LEFT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
