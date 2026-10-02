import React from 'react';
import { YearStats } from '../../core/dateEngine';

interface Scene5Props {
  stats: YearStats;
}

export const Scene5WeekendsRemaining: React.FC<Scene5Props> = ({ stats }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-4 sm:px-8 select-none">
      {/* Top indicator */}
      <div className="text-center pt-4">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          METRIC 04 / LEISURE & REST INTERVALS
        </span>
      </div>

      {/* Main Weekends Left Display */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-white font-display select-none">
            {stats.weekendsRemaining}
          </span>
          <div className="absolute inset-0 bg-red-500/10 blur-3xl -z-10 rounded-full" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-[0.3em] text-[#ff3344] uppercase mt-2 glow-red">
          WEEKENDS LEFT
        </h2>

        <div className="mt-3 py-1 px-4 rounded-full border border-white/10 bg-white/[0.02]">
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-300 uppercase">
            {stats.weekendsRemaining * 2} SATURDAY & SUNDAY SESSIONS
          </span>
        </div>

        {/* Visual Weekends Matrix (Pairs of Saturday/Sunday Dots) */}
        <div className="mt-6 w-full max-w-xs sm:max-w-sm">
          <div className="text-[10px] font-mono text-zinc-500 text-center mb-3 tracking-wider">
            REMAINING SATURDAY & SUNDAY PAIRS
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-3 rounded-lg border border-white/5 bg-[#12141c]/60 max-h-48 overflow-y-auto">
            {Array.from({ length: stats.weekendsRemaining }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center space-x-1.5 p-2 rounded border border-white/5 bg-white/[0.02] hover:border-[#ff3344]/40 transition group"
              >
                <div
                  title="Saturday"
                  className="w-2.5 h-2.5 rounded-full bg-[#ff3344]/80 group-hover:bg-[#ff3344] group-hover:shadow-[0_0_6px_#ff3344] transition"
                />
                <div
                  title="Sunday"
                  className="w-2.5 h-2.5 rounded-full bg-zinc-400 group-hover:bg-white transition"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center pb-4 text-xs font-mono text-zinc-500">
        HOW WILL YOU SPEND YOUR FREE DAYS?
      </div>
    </div>
  );
};
