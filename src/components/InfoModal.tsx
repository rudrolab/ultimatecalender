import React from 'react';
import { X, Calendar, Clock, BarChart3, ShieldCheck } from 'lucide-react';
import { YearStats } from '../core/dateEngine';
import { CountdownTime } from '../core/countdown';

interface InfoModalProps {
  stats: YearStats;
  countdown: CountdownTime;
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  stats,
  countdown,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
      <div className="w-full max-w-md bg-[#0e1017] border border-white/10 rounded-xl shadow-2xl p-6 relative overflow-hidden">
        {/* Subtle red corner glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#ff3344]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-[#ff3344]" size={18} />
            <h3 className="text-sm font-bold tracking-widest text-white uppercase font-mono">
              SYSTEM STATISTICS — {stats.year}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* Section 1: Core Dates */}
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-zinc-400">
              <span>REFERENCE DATE</span>
              <span className="text-zinc-100 font-semibold">{stats.currentDateFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>LEAP YEAR STATUS</span>
              <span className={stats.isLeapYear ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                {stats.isLeapYear ? 'YES (366 DAYS)' : 'NO (365 DAYS)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>DAY OF YEAR</span>
              <span className="text-zinc-100 font-semibold">
                DAY {stats.dayOfYear} OF {stats.totalDays}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>CURRENT ISO WEEK</span>
              <span className="text-zinc-100 font-semibold">WEEK {stats.currentIsoWeek}</span>
            </div>
          </div>

          {/* Section 2: Progress & Remaining */}
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-zinc-400">
              <span>YEAR COMPLETED</span>
              <span className="text-emerald-400 font-bold">{stats.percentCompleted}%</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>YEAR REMAINING</span>
              <span className="text-[#ff3344] font-bold">{stats.percentRemaining}%</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>DAYS PASSED</span>
              <span className="text-zinc-100">{stats.daysPassed} DAYS</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>DAYS REMAINING</span>
              <span className="text-white font-semibold">{stats.daysRemaining} DAYS</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>WEEKS REMAINING</span>
              <span className="text-white font-semibold">{stats.weeksRemaining} FULL WEEKS</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>WEEKENDS REMAINING</span>
              <span className="text-white font-semibold">{stats.weekendsRemaining} WEEKENDS</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>MONTHS REMAINING</span>
              <span className="text-white font-semibold">{stats.monthsRemaining} MONTHS AFTER {stats.currentMonthName.toUpperCase()}</span>
            </div>
          </div>

          {/* Section 3: Live Precision Countdown */}
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2 text-zinc-400 mb-1">
              <Clock size={12} className="text-[#ff3344]" />
              <span className="text-[10px] tracking-widest uppercase">
                EXACT TIME TO {countdown.targetYear}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-black/40 rounded border border-white/5">
                <div className="text-sm font-bold text-white">{countdown.days}</div>
                <div className="text-[9px] text-zinc-500">DAYS</div>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/5">
                <div className="text-sm font-bold text-white">{countdown.hours}</div>
                <div className="text-[9px] text-zinc-500">HOURS</div>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/5">
                <div className="text-sm font-bold text-white">{countdown.minutes}</div>
                <div className="text-[9px] text-zinc-500">MINS</div>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/5">
                <div className="text-sm font-bold text-[#ff3344]">{countdown.seconds}</div>
                <div className="text-[9px] text-zinc-500">SECS</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            PRESS [ESC] OR [I] TO DISMISS
          </span>
        </div>
      </div>
    </div>
  );
};
