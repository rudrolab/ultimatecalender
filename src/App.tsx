import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculateYearStats, YearStats } from './core/dateEngine';
import { getCountdownToNewYear, CountdownTime } from './core/countdown';
import { TopTimelineBar } from './components/TopTimelineBar';
import { InfoModal } from './components/InfoModal';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Maximize2,
  Minimize2,
  Info,
  Clock
} from 'lucide-react';

// Phase Components matching the exact reference screenshots
import { PhaseCalendar } from './components/scenes/PhaseCalendar';
import { Scene3DaysRemaining } from './components/scenes/Scene3DaysRemaining';
import { PhaseWeeksWeekends } from './components/scenes/PhaseWeeksWeekends';
import { PhasePerspectiveRunway } from './components/scenes/PhasePerspectiveRunway';

const PHASE_NAMES = [
  'Calendar Matrix',
  '75% Complete',
  'Q4 Isolated',
  'Days Left (91)',
  '13 Weeks',
  '13 Weekends',
  'Wait for January',
  "DON'T Stream",
  'START 2027',
  'TODAY Finale',
];

const PHASE_DURATION_MS = 6500; // 6.5s per phase in autoplay

export const App: React.FC = () => {
  // Reference date state (defaults to real system Date, can be changed dynamically via simulator)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [isLiveClock, setIsLiveClock] = useState<boolean>(true);

  // Dynamic Year Statistics and Countdown calculated purely from selectedDate
  const [stats, setStats] = useState<YearStats>(() => calculateYearStats(new Date()));
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdownToNewYear(new Date()));
  const [timeString, setTimeString] = useState<string>('');

  // Active Phase & Playback State
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [phaseProgress, setPhaseProgress] = useState<number>(0);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [transitionId, setTransitionId] = useState<number>(0);

  // Modal & Screen States
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const phaseStartTimeRef = useRef<number>(performance.now());
  const touchStartXRef = useRef<number | null>(null);

  // Re-compute stats whenever selectedDate changes
  useEffect(() => {
    setStats(calculateYearStats(selectedDate));
    setCountdown(getCountdownToNewYear(selectedDate));
  }, [selectedDate]);

  // Real-time tick loop
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );

      if (isLiveClock) {
        setSelectedDate(now);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isLiveClock]);

  // Phase Navigation Handlers
  const handleNext = useCallback(() => {
    setTransitionDirection('forward');
    setTransitionId((prev) => prev + 1);
    setCurrentPhase((prev) => (prev + 1) % PHASE_NAMES.length);
    phaseStartTimeRef.current = performance.now();
    setPhaseProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setTransitionDirection('backward');
    setTransitionId((prev) => prev + 1);
    setCurrentPhase((prev) => (prev - 1 + PHASE_NAMES.length) % PHASE_NAMES.length);
    phaseStartTimeRef.current = performance.now();
    setPhaseProgress(0);
  }, []);

  const handleSelectPhase = useCallback((index: number) => {
    setCurrentPhase((prev) => {
      setTransitionDirection(index >= prev ? 'forward' : 'backward');
      return index;
    });
    setTransitionId((prev) => prev + 1);
    phaseStartTimeRef.current = performance.now();
    setPhaseProgress(0);
  }, []);

  const handleRestart = useCallback(() => {
    setTransitionDirection('forward');
    setTransitionId((prev) => prev + 1);
    setCurrentPhase(0);
    phaseStartTimeRef.current = performance.now();
    setPhaseProgress(0);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    phaseStartTimeRef.current = performance.now();
  }, []);

  // Autoplay progression ticker
  useEffect(() => {
    if (!isPlaying) {
      setPhaseProgress(0);
      return;
    }

    let animationId: number;

    const tick = () => {
      const elapsed = performance.now() - phaseStartTimeRef.current;
      const progress = Math.min((elapsed / PHASE_DURATION_MS) * 100, 100);
      setPhaseProgress(progress);

      if (elapsed >= PHASE_DURATION_MS) {
        handleNext();
      } else {
        animationId = requestAnimationFrame(tick);
      }
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, currentPhase, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRestart();
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        setIsInfoOpen((prev) => !prev);
      } else if (e.code === 'Escape') {
        if (isInfoOpen) setIsInfoOpen(false);
        if (showDatePicker) setShowDatePicker(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleTogglePlay, handleRestart, isInfoOpen, showDatePicker]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Date Simulation Presets
  const setPresetDate = (year: number, monthIdx: number, day: number) => {
    setIsLiveClock(false);
    setSelectedDate(new Date(year, monthIdx, day));
    setShowDatePicker(false);
  };

  const resetToToday = () => {
    setIsLiveClock(true);
    setSelectedDate(new Date());
    setShowDatePicker(false);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050608] text-white font-mono select-none flex flex-col justify-between relative">
      {/* Ambient background lighting */}
      <div className="absolute inset-0 grid-cinematic opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#ff3344]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. Full-Width Top Header Bar with Live Timeline */}
      <header className="w-full pt-3 pb-2 px-6 sm:px-12 flex flex-col z-30 bg-gradient-to-b from-[#050608]/90 via-[#050608]/70 to-transparent shrink-0">
        <div className="w-full flex justify-between items-center text-xs font-mono tracking-widest uppercase mb-1.5">
          {/* Left: Brand & Date Controls */}
          <div className="flex items-center space-x-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3344] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff3344]"></span>
            </span>

            <span className="font-bold text-white tracking-widest text-sm">
              ULTIMATE CALENDAR
            </span>

            {/* Date Time Machine Pill */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker((prev) => !prev)}
                className={`py-0.5 px-2.5 rounded-full text-[10px] font-mono border transition flex items-center space-x-1.5 ${
                  isLiveClock
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-[#ff3344]/50 bg-[#ff3344]/15 text-[#ff3344]'
                }`}
              >
                <CalendarIcon size={11} />
                <span>{isLiveClock ? 'LIVE: ' + stats.year : 'SIM: ' + stats.year}</span>
              </button>

              {/* Date Simulator Dropdown */}
              {showDatePicker && (
                <div className="absolute top-8 left-0 z-50 w-64 bg-[#0e1017] border border-white/10 rounded-xl p-3 shadow-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 pb-1 border-b border-white/5">
                    <span>DATE SIMULATOR</span>
                    <button onClick={resetToToday} className="text-[#ff3344] hover:underline">RESET TO TODAY</button>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => setPresetDate(2026, 9, 2)}
                      className="w-full text-left p-1.5 rounded hover:bg-white/5 text-zinc-300 text-[11px] transition"
                    >
                      Oct 02, 2026 (Reference Video Date)
                    </button>
                    <button
                      onClick={() => setPresetDate(2026, 6, 1)}
                      className="w-full text-left p-1.5 rounded hover:bg-white/5 text-zinc-300 text-[11px] transition"
                    >
                      July 01, 2026 (Mid-Year)
                    </button>
                    <button
                      onClick={() => setPresetDate(2026, 11, 31)}
                      className="w-full text-left p-1.5 rounded hover:bg-white/5 text-zinc-300 text-[11px] transition"
                    >
                      Dec 31, 2026 (New Year's Eve)
                    </button>
                    <button
                      onClick={() => setPresetDate(2028, 1, 29)}
                      className="w-full text-left p-1.5 rounded hover:bg-white/5 text-emerald-400 text-[11px] transition"
                    >
                      Feb 29, 2028 (Leap Year Test)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Ticking Countdown to Jan 1 */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-zinc-300 font-mono text-[11px]">
              <Clock size={12} className="text-[#ff3344]" />
              <span className="text-zinc-500">COUNTDOWN:</span>
              <span className="tabular-nums font-bold text-white">
                {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
              </span>
            </div>

            <button
              onClick={() => setIsInfoOpen(true)}
              title="System Statistics (Key: I)"
              className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition"
            >
              <Info size={13} />
            </button>

            <button
              onClick={handleToggleFullscreen}
              title="Toggle Fullscreen (Key: F11)"
              className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        </div>

        {/* Razor-thin Timeline Progress Bar */}
        <TopTimelineBar
          stats={stats}
          isRedDot={currentPhase > 0}
          onOpenInfo={() => setIsInfoOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </header>

      {/* 2. Main Stage (Full-Viewport Interactive Scene Canvas) */}
      <main className="flex-1 w-full relative overflow-hidden flex flex-col items-center justify-center">
        {/* Luminous Light Sweep during scene transition */}
        <div
          key={`sweep-${transitionId}`}
          className={`absolute inset-0 pointer-events-none z-20 ${
            transitionDirection === 'forward'
              ? 'animate-sweep-forward bg-gradient-to-r from-transparent via-[#ff3344]/15 to-transparent'
              : 'animate-sweep-backward bg-gradient-to-r from-transparent via-white/10 to-transparent'
          }`}
        />

        <div
          key={`phase-${currentPhase}-${transitionId}`}
          className={`w-full h-full flex flex-col items-center justify-center ${
            transitionDirection === 'forward' ? 'animate-scene-forward' : 'animate-scene-backward'
          }`}
        >
          {/* Phase 1: Calendar Overview */}
          {currentPhase === 0 && <PhaseCalendar stats={stats} subPhase={0} />}

          {/* Phase 2: 75% Complete & Q4 Highlight */}
          {currentPhase === 1 && <PhaseCalendar stats={stats} subPhase={1} />}

          {/* Phase 3: Q4 Isolated */}
          {currentPhase === 2 && <PhaseCalendar stats={stats} subPhase={2} />}

          {/* Phase 4: Days Remaining Digits (91) */}
          {currentPhase === 3 && <Scene3DaysRemaining stats={stats} countdown={countdown} />}

          {/* Phase 5: That's 13 Weeks */}
          {currentPhase === 4 && <PhaseWeeksWeekends stats={stats} isWeekendsOnly={false} />}

          {/* Phase 6: Only 13 Weekends */}
          {currentPhase === 5 && <PhaseWeeksWeekends stats={stats} isWeekendsOnly={true} />}

          {/* Phase 7: Perspective Runway (Wait for January) */}
          {currentPhase === 6 && <PhasePerspectiveRunway stats={stats} subPhase={0} />}

          {/* Phase 8: DON'T Particle Stream */}
          {currentPhase === 7 && <PhasePerspectiveRunway stats={stats} subPhase={1} />}

          {/* Phase 9: START 2027 */}
          {currentPhase === 8 && <PhasePerspectiveRunway stats={stats} subPhase={2} />}

          {/* Phase 10: TODAY. Finale */}
          {currentPhase === 9 && <PhasePerspectiveRunway stats={stats} subPhase={3} />}
        </div>
      </main>

      {/* 3. Bottom Functional Control Bar & Scrubber */}
      <footer className="w-full flex flex-col items-center px-6 sm:px-12 py-3 border-t border-white/5 bg-[#050608]/90 backdrop-blur-md z-30 shrink-0">
        {/* Continuous Autoplay Progress Bar */}
        <div className="w-full h-[2px] bg-white/5 mb-3 overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-[#ff3344] to-white transition-all duration-100 ease-linear shadow-[0_0_8px_#ff3344]"
            style={{ width: `${phaseProgress}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between">
          {/* Left: Playback Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTogglePlay}
              title="Play / Pause (Key: SPACE)"
              className="py-1 px-3 rounded-full border border-white/10 hover:border-white/30 text-white transition active:scale-95 flex items-center space-x-2 bg-white/[0.04]"
            >
              {isPlaying ? <Pause size={12} className="text-[#ff3344]" /> : <Play size={12} className="text-white" />}
              <span className="text-[10px] tracking-widest uppercase">
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </span>
            </button>

            <button
              onClick={handleRestart}
              title="Restart from Phase 1 (Key: R)"
              className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition active:scale-95"
            >
              <RotateCcw size={12} />
            </button>

            <button
              onClick={handlePrev}
              title="Previous Phase (Key: Left Arrow)"
              className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition active:scale-95"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={handleNext}
              title="Next Phase (Key: Right Arrow)"
              className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition active:scale-95"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Center: Phase Selector Pills */}
          <div className="hidden md:flex items-center space-x-2">
            {PHASE_NAMES.map((name, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPhase(idx)}
                title={name}
                className={`h-2 transition-all duration-300 rounded-full ${
                  idx === currentPhase
                    ? 'w-8 bg-[#ff3344] shadow-[0_0_8px_#ff3344]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Right: Current Phase Name */}
          <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            <span className="text-zinc-600">PHASE {currentPhase + 1}/10:</span>
            <span className="text-white font-bold">{PHASE_NAMES[currentPhase]}</span>
          </div>
        </div>
      </footer>

      {/* 4. Modal Detailed Stats Panel */}
      <InfoModal
        stats={stats}
        countdown={countdown}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
};
export default App;
