import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculateYearStats, YearStats } from './core/dateEngine';
import { getCountdownToNewYear, CountdownTime } from './core/countdown';
import { TopTimelineBar } from './components/TopTimelineBar';
import { ScrollProgressIndicator } from './components/ScrollProgressIndicator';
import { InfoModal } from './components/InfoModal';
import { Play, Pause, ChevronDown, RotateCcw } from 'lucide-react';

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

  // Mouse Parallax 3D Camera tilt
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  // Mouse move listener for 3D camera parallax depth
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseParallax({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 60FPS Physics Lerp Loop for butter-smooth camera inertia
  useEffect(() => {
    let animId: number;

    const lerpLoop = () => {
      if (isAutoPlaying) {
        targetScrollRef.current = (targetScrollRef.current + 0.0007) % 1;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, targetScrollRef.current * scrollable);
      }

      const diff = targetScrollRef.current - currentScrollRef.current;
      scrollVelocityRef.current = diff * 0.12;
      currentScrollRef.current += scrollVelocityRef.current;

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

  // 3D camera tilt combining velocity pitch with subtle mouse parallax
  const tiltX = Math.min(Math.max(scrollVelocityRef.current * 35 - mouseParallax.y * 2.5, -5), 5);
  const tiltY = mouseParallax.x * 3.5;

  return (
    <div className="relative bg-[#050608] text-white font-mono selection:bg-[#ff3344] selection:text-white min-h-screen">
      {/* 1. Virtual Scroll Track (1000vh creates deep, responsive 3D scrolling) */}
      <div className="h-[1000vh] w-full pointer-events-none" />

      {/* 2. Fixed Full-Viewport Immersive 3D Stage (No Phone Frame Borders!) */}
      <div className="fixed inset-0 w-screen h-screen flex flex-col justify-between overflow-hidden z-10 perspective-[1600px] pointer-events-none">
        
        {/* Deep Atmospheric Lighting & Horizon Nebula */}
        <div className="absolute inset-0 grid-cinematic opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-[#ff3344]/[0.04] rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050608] via-transparent to-transparent pointer-events-none" />

        {/* 3D Camera Stage Wrapper */}
        <div
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`,
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="w-full h-full flex flex-col justify-between pointer-events-auto z-20"
        >
          {/* Top Full-Width Timeline Bar */}
          <TopTimelineBar
            stats={stats}
            isRedDot={currentPhase > 0}
            onOpenInfo={() => setIsInfoOpen(true)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />

          {/* Dynamic Scene Content Area */}
          <main className="flex-1 w-full relative overflow-hidden flex flex-col items-center justify-center">
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
          </main>

          {/* Minimalist Bottom Sci-Fi HUD */}
          <footer className="w-full flex items-center justify-between px-6 sm:px-12 md:px-16 py-3 border-t border-white/5 bg-[#050608]/80 backdrop-blur-md text-xs font-mono z-30 select-none">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleAutoPlay}
                title="Toggle Auto-Scroll Playback (Key: SPACE)"
                className="py-1 px-3 rounded-full border border-white/10 hover:border-white/30 text-white transition active:scale-95 flex items-center space-x-2 bg-white/[0.03]"
              >
                {isAutoPlaying ? <Pause size={12} className="text-[#ff3344]" /> : <Play size={12} className="text-white" />}
                <span className="text-[10px] tracking-widest uppercase">
                  {isAutoPlaying ? 'PAUSE STORY' : 'AUTO-PLAY'}
                </span>
              </button>

              <button
                onClick={() => handleJumpToPhase(0)}
                title="Restart from beginning (Key: R)"
                className="p-1.5 rounded-full border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
              <span>PHASE {currentPhase + 1} / {totalPhases}</span>
              <span className="text-zinc-700">·</span>
              <span className="text-white font-semibold">{PHASE_NAMES[currentPhase]}</span>
            </div>

            <div className="text-[10px] font-mono text-zinc-500 tracking-wider">
              {stats.currentDateFormatted.toUpperCase()}
            </div>
          </footer>
        </div>
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
      {scrollProgress < 0.02 && !isAutoPlaying && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-1.5 pointer-events-none animate-bounce">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-zinc-300 font-semibold bg-black/70 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
            SCROLL TO TRAVEL THROUGH 2026 ↓
          </span>
          <ChevronDown size={18} className="text-[#ff3344]" />
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
