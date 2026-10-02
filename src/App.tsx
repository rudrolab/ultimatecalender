import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculateYearStats, YearStats } from './core/dateEngine';
import { getCountdownToNewYear, CountdownTime } from './core/countdown';
import { TopTimelineBar } from './components/TopTimelineBar';
import { ScrollProgressIndicator } from './components/ScrollProgressIndicator';
import { InfoModal } from './components/InfoModal';
import { Play, Pause, ChevronDown, Maximize2, Minimize2, Info, RotateCcw } from 'lucide-react';

// Phase Components matching the exact reference screenshots
import { PhaseCalendar } from './components/scenes/PhaseCalendar';
import { Scene3DaysRemaining } from './components/scenes/Scene3DaysRemaining';
import { PhaseWeeksWeekends } from './components/scenes/PhaseWeeksWeekends';
import { PhasePerspectiveRunway } from './components/scenes/PhasePerspectiveRunway';

const PHASE_NAMES = [
  '1. Year Matrix',
  '2. 75% Complete',
  '3. Q4 Isolated',
  '4. Days Left (91)',
  '5. 13 Weeks',
  '6. 13 Weekends',
  '7. Wait for January',
  "8. DON'T Stream",
  '9. START 2027',
  '10. TODAY. Finale',
];

export const App: React.FC = () => {
  const [stats, setStats] = useState<YearStats>(() => calculateYearStats());
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdownToNewYear());

  // Scroll Progress States
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);
  const scrollVelocityRef = useRef<number>(0);

  // Auto-play / Auto-scroll Mode
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  // System time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCountdown(getCountdownToNewYear(now));
      if (now.getFullYear() !== stats.year) {
        setStats(calculateYearStats(now));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [stats.year]);

  // Window scroll event listener to track user scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0) {
        const raw = window.scrollY / scrollable;
        targetScrollRef.current = Math.min(Math.max(raw, 0), 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 60FPS Physics Lerp Loop for butter-smooth camera inertia
  useEffect(() => {
    let animId: number;

    const lerpLoop = () => {
      // Auto-play advances target scroll continuously
      if (isAutoPlaying) {
        targetScrollRef.current = (targetScrollRef.current + 0.0008) % 1;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, targetScrollRef.current * scrollable);
      }

      const diff = targetScrollRef.current - currentScrollRef.current;
      scrollVelocityRef.current = diff * 0.12;
      currentScrollRef.current += scrollVelocityRef.current;

      // Keep in bounds
      const clamped = Math.min(Math.max(currentScrollRef.current, 0), 1);
      setScrollProgress(clamped);

      animId = requestAnimationFrame(lerpLoop);
    };

    animId = requestAnimationFrame(lerpLoop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoPlaying]);

  // Map progress (0 to 1) to Phase Index (0 to 9) and local sub-phase progress (0 to 1)
  const totalPhases = PHASE_NAMES.length;
  const rawPhase = scrollProgress * totalPhases;
  const currentPhase = Math.min(Math.floor(rawPhase), totalPhases - 1);
  const subProgress = Math.min(Math.max(rawPhase - currentPhase, 0), 1);

  // Jump to specific phase
  const handleJumpToPhase = useCallback((phaseIdx: number) => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const target = (phaseIdx + 0.05) / totalPhases;
    targetScrollRef.current = target;
    window.scrollTo({
      top: target * scrollable,
      behavior: 'smooth',
    });
  }, [totalPhases]);

  // Toggle Auto-play
  const handleToggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleAutoPlay();
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleJumpToPhase(Math.min(currentPhase + 1, totalPhases - 1));
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handleJumpToPhase(Math.max(currentPhase - 1, 0));
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        targetScrollRef.current = 0;
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        setIsInfoOpen((prev) => !prev);
      } else if (e.code === 'Escape') {
        if (isInfoOpen) setIsInfoOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhase, totalPhases, handleJumpToPhase, handleToggleAutoPlay, isInfoOpen]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Subtle 3D dynamic tilt angle based on scroll velocity
  const tiltX = Math.min(Math.max(scrollVelocityRef.current * 40, -4), 4);

  return (
    <div className="relative bg-[#040508] text-white font-mono selection:bg-[#ff3344] selection:text-white">
      {/* 1. Extended Virtual Scroll Track (1000vh creates deep, responsive 3D scrolling) */}
      <div className="h-[1000vh] w-full pointer-events-none" />

      {/* 2. Fixed Sticky Viewport holding 3D Cinematic Phone Frame */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 perspective-[1400px] overflow-hidden">
        
        {/* Ambient 3D Space Backdrop */}
        <div className="absolute inset-0 grid-cinematic opacity-25 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#ff3344]/5 rounded-full blur-[160px] pointer-events-none" />

        {/* 9:16 Vertical Cinematic Phone Frame with 3D Depth Dynamics */}
        <main
          style={{
            transform: `rotateX(${tiltX}deg) translateZ(0px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="w-full h-full max-w-[480px] max-h-[920px] sm:h-[96vh] sm:rounded-2xl border border-white/10 bg-[#090a0f] flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.95)] relative overflow-hidden pointer-events-auto z-20"
        >
          {/* Top Timeline Bar */}
          <TopTimelineBar stats={stats} isRedDot={currentPhase > 0} />

          {/* Dynamic Scene Content Area */}
          <div className="flex-1 w-full relative overflow-hidden flex flex-col items-center justify-center">
            {/* Phase 1: Calendar Overview */}
            {currentPhase === 0 && <PhaseCalendar stats={stats} subPhase={0} />}

            {/* Phase 2: 75% Complete & Q4 Highlight */}
            {currentPhase === 1 && <PhaseCalendar stats={stats} subPhase={1} />}

            {/* Phase 3: Q4 Isolated */}
            {currentPhase === 2 && <PhaseCalendar stats={stats} subPhase={2} />}

            {/* Phase 4: Days Remaining Digits (91) with continuous scroll scrub */}
            {currentPhase === 3 && (
              <Scene3DaysRemaining
                stats={stats}
                countdown={countdown}
                scrollT={subProgress}
              />
            )}

            {/* Phase 5: That's 13 Weeks */}
            {currentPhase === 4 && <PhaseWeeksWeekends stats={stats} isWeekendsOnly={false} />}

            {/* Phase 6: Only 13 Weekends */}
            {currentPhase === 5 && <PhaseWeeksWeekends stats={stats} isWeekendsOnly={true} />}

            {/* Phase 7: Perspective Runway (Wait for January) */}
            {currentPhase === 6 && (
              <PhasePerspectiveRunway
                stats={stats}
                subPhase={0}
                scrollT={subProgress}
              />
            )}

            {/* Phase 8: DON'T Particle Stream */}
            {currentPhase === 7 && (
              <PhasePerspectiveRunway
                stats={stats}
                subPhase={1}
                scrollT={subProgress}
              />
            )}

            {/* Phase 9: START 2027 */}
            {currentPhase === 8 && (
              <PhasePerspectiveRunway
                stats={stats}
                subPhase={2}
                scrollT={subProgress}
              />
            )}

            {/* Phase 10: TODAY. Finale */}
            {currentPhase === 9 && (
              <PhasePerspectiveRunway
                stats={stats}
                subPhase={3}
              />
            )}
          </div>

          {/* Bottom HUD Bar */}
          <div className="w-full flex items-center justify-between border-t border-white/5 bg-[#090a0f]/90 px-4 py-2 text-xs font-mono z-30">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleAutoPlay}
                title="Toggle Auto-Scroll Playback (Key: SPACE)"
                className="p-1.5 rounded border border-white/10 hover:border-white/30 text-white transition active:scale-95 flex items-center space-x-1.5"
              >
                {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span className="text-[10px] tracking-wider uppercase">
                  {isAutoPlaying ? 'PAUSE' : 'AUTO-SCROLL'}
                </span>
              </button>

              <button
                onClick={() => handleJumpToPhase(0)}
                title="Restart from beginning (Key: R)"
                className="p-1.5 rounded border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              PHASE {currentPhase + 1} / {totalPhases}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsInfoOpen(true)}
                title="System Statistics (Key: I)"
                className="p-1.5 rounded border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition"
              >
                <Info size={12} />
              </button>

              <button
                onClick={handleToggleFullscreen}
                title="Fullscreen (Key: F11)"
                className="p-1.5 rounded border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition"
              >
                {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 3. 3D Scroll Progress Indicator (Right Sidebar HUD) */}
      <ScrollProgressIndicator
        progress={scrollProgress}
        phaseIndex={currentPhase}
        totalPhases={totalPhases}
        phaseNames={PHASE_NAMES}
        onJumpToPhase={handleJumpToPhase}
      />

      {/* 4. Bottom Scroll Prompt Overlay (Fades as user scrolls) */}
      {scrollProgress < 0.03 && !isAutoPlaying && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-1 pointer-events-none animate-bounce">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 font-semibold bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            SCROLL TO TRAVEL THROUGH TIME ↓
          </span>
          <ChevronDown size={16} className="text-[#ff3344]" />
        </div>
      )}

      {/* 5. Modal Detailed Stats Panel */}
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
