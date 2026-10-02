import React from 'react';
import { YearStats } from '../../core/dateEngine';
import { CountdownTime } from '../../core/countdown';

interface Scene3Props {
  stats: YearStats;
  countdown: CountdownTime;
}

export const Scene3DaysRemaining: React.FC<Scene3Props> = ({ stats, countdown }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-4 sm:px-8 select-none">
      {/* Top indicator */}
      <div className="text-center pt-4">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-500 font-mono font-medium">
          METRIC 02 / DAILY COUNTDOWN
        </span>
      </div>

      {/* Main Days Left Display */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-white font-display select-none">
            {stats.daysRemaining}
          </span>
          {/* Subtle accent highlight behind number */}
          <div className="absolute inset-0 bg-red-500/10 blur-3xl -z-10 rounded-full" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-[0.3em] text-[#ff3344] uppercase mt-2 glow-red">
          DAYS LEFT
        </h2>

        {/* Current Date Display */}
        <div className="mt-4 py-1.5 px-4 rounded-full border border-white/10 bg-white/[0.02]">
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-300 uppercase">
            {stats.currentDateFormatted}
          </span>
        </div>

        {/* Live Real-time Sub-Day Countdown */}
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs text-center font-mono">
          <div className="p-2.5 rounded-lg border border-white/5 bg-[#12141c]">
            <div className="text-lg sm:text-xl font-bold text-zinc-100 tabular-nums">
              {String(countdown.hours).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-zinc-500 tracking-wider">HOURS</div>
          </div>

          <div className="p-2.5 rounded-lg border border-white/5 bg-[#12141c]">
            <div className="text-lg sm:text-xl font-bold text-zinc-100 tabular-nums">
              {String(countdown.minutes).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-zinc-500 tracking-wider">MINUTES</div>
          </div>

          <div className="p-2.5 rounded-lg border border-[#ff3344]/30 bg-[#ff3344]/10">
            <div className="text-lg sm:text-xl font-bold text-[#ff3344] tabular-nums glow-red">
              {String(countdown.seconds).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-[#ff3344]/80 tracking-wider">SECONDS</div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center pb-4 text-xs font-mono text-zinc-500">
        TIME MOVES ONLY IN ONE DIRECTION
      </div>
    </div>
  );
};
