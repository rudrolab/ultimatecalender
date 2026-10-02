import React from 'react';
import { YearStats } from '../../core/dateEngine';
import { CountdownTime } from '../../core/countdown';

interface Scene7Props {
  stats: YearStats;
  countdown: CountdownTime;
  onRestart: () => void;
}

export const Scene7FinalMessage: React.FC<Scene7Props> = ({ stats, countdown, onRestart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-4 sm:px-8 select-none">
      {/* Top indicator */}
      <div className="text-center pt-4">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          CONCLUSION / THE PRESENT MOMENT
        </span>
      </div>

      {/* Main Statement */}
      <div className="flex flex-col items-center justify-center my-auto text-center space-y-2">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white font-display uppercase leading-none select-none">
          START
        </h1>
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-[#ff3344] font-display uppercase leading-none select-none glow-red">
          TODAY.
        </h1>

        <p className="max-w-xs text-xs sm:text-sm font-mono tracking-widest text-zinc-400 mt-6 uppercase leading-relaxed">
          {stats.daysRemaining} DAYS REMAIN IN {stats.year}.<br />
          MAKE EVERY SINGLE ONE COUNT.
        </p>

        {/* Live Millisecond Clock */}
        <div className="mt-8 py-2 px-5 rounded-full border border-white/10 bg-white/[0.02] flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#ff3344] animate-ping" />
          <span className="text-xs font-mono tabular-nums tracking-widest text-zinc-300">
            {String(countdown.hours).padStart(2, '0')}h : {String(countdown.minutes).padStart(2, '0')}m : {String(countdown.seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="text-center pb-4">
        <button
          onClick={onRestart}
          className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition border-b border-zinc-700 hover:border-white pb-0.5"
        >
          [ REPLAY OVERVIEW ]
        </button>
      </div>
    </div>
  );
};
