import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculateYearStats, YearStats } from './core/dateEngine';
import { getCountdownToNewYear, CountdownTime } from './core/countdown';
import { TopTimelineBar } from './components/TopTimelineBar';
import { SceneNavigation } from './components/SceneNavigation';
import { InfoModal } from './components/InfoModal';

// Phase Components matching the exact reference screenshots
import { PhaseCalendar } from './components/scenes/PhaseCalendar';
import { Scene3DaysRemaining } from './components/scenes/Scene3DaysRemaining';
import { PhaseWeeksWeekends } from './components/scenes/PhaseWeeksWeekends';
import { PhasePerspectiveRunway } from './components/scenes/PhasePerspectiveRunway';

const SCENE_NAMES = [
  'Year Calendar',
  '75% Complete',
  'Q4 Isolated',
  'Days Left (91)',
  '13 Weeks',
  '13 Weekends',
  'January Horizon',
  "DON'T Stream",
  'START 2027',
  'TODAY Finale',
];

const SCENE_DURATION_MS = 6000; // 6s per phase in autoplay

export const App: React.FC = () => {
  const [stats, setStats] = useState<YearStats>(() => calculateYearStats());
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdownToNewYear());

  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [transitionId, setTransitionId] = useState<number>(0);

  const sceneStartTimeRef = useRef<number>(performance.now());
  const touchStartXRef = useRef<number | null>(null);

  // Real-time update loop for countdown
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

  // Scene Navigation Handlers
  const handleNext = useCallback(() => {
    setTransitionDirection('forward');
    setTransitionId((prev) => prev + 1);
    setCurrentScene((prev) => (prev + 1) % SCENE_NAMES.length);
    sceneStartTimeRef.current = performance.now();
    setSceneProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setTransitionDirection('backward');
    setTransitionId((prev) => prev + 1);
    setCurrentScene((prev) => (prev - 1 + SCENE_NAMES.length) % SCENE_NAMES.length);
    sceneStartTimeRef.current = performance.now();
    setSceneProgress(0);
  }, []);

  const handleSelectScene = useCallback((index: number) => {
    setCurrentScene((prev) => {
      setTransitionDirection(index >= prev ? 'forward' : 'backward');
      return index;
    });
    setTransitionId((prev) => prev + 1);
    sceneStartTimeRef.current = performance.now();
    setSceneProgress(0);
  }, []);

  const handleRestartScene = useCallback(() => {
    setTransitionDirection('forward');
    setTransitionId((prev) => prev + 1);
    sceneStartTimeRef.current = performance.now();
    setSceneProgress(0);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    sceneStartTimeRef.current = performance.now();
  }, []);

  // Autoplay progression ticker
  useEffect(() => {
    if (!isPlaying) {
      setSceneProgress(0);
      return;
    }

    let animationId: number;

    const tick = () => {
      const elapsed = performance.now() - sceneStartTimeRef.current;
      const progress = Math.min((elapsed / SCENE_DURATION_MS) * 100, 100);
      setSceneProgress(progress);

      if (elapsed >= SCENE_DURATION_MS) {
        handleNext();
      } else {
        animationId = requestAnimationFrame(tick);
      }
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, currentScene, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRestartScene();
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        setIsInfoOpen((prev) => !prev);
      } else if (e.code === 'Escape') {
        if (isInfoOpen) {
          setIsInfoOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleTogglePlay, handleRestartScene, isInfoOpen]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-[#050608] relative overflow-hidden font-mono"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient glow and cinematic grid */}
      <div className="absolute inset-0 grid-cinematic opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff3344]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* 9:16 Vertical Cinematic Phone Frame */}
      <main className="w-full h-full max-w-[480px] max-h-[920px] sm:h-[96vh] sm:rounded-2xl border border-white/10 bg-[#090a0f] flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden z-10">
        
        {/* Top Timeline Bar (Matching Screenshots) */}
        <TopTimelineBar stats={stats} isRedDot={currentScene > 0} />

        {/* Dynamic Scene Content Area with Smooth Motion Blur Transitions */}
        <div className="flex-1 w-full relative overflow-hidden flex flex-col items-center justify-center">
          {/* Luminous light sweep during scene transitions */}
          <div
            key={`sweep-${transitionId}`}
            className={`absolute inset-0 pointer-events-none z-20 ${
              transitionDirection === 'forward'
                ? 'animate-sweep-forward bg-gradient-to-r from-transparent via-[#ff3344]/15 to-transparent'
                : 'animate-sweep-backward bg-gradient-to-r from-transparent via-white/10 to-transparent'
            }`}
          />

          <div
            key={`scene-${transitionId}`}
            className={`w-full h-full flex flex-col items-center justify-center ${
              transitionDirection === 'forward'
                ? 'animate-scene-forward'
                : 'animate-scene-backward'
            }`}
          >
            {/* Phase 1: Calendar Overview */}
            {currentScene === 0 && <PhaseCalendar stats={stats} subPhase={0} />}

            {/* Phase 2: 75% Complete & Q4 Highlight */}
            {currentScene === 1 && <PhaseCalendar stats={stats} subPhase={1} />}

            {/* Phase 3: Q4 Isolated */}
            {currentScene === 2 && <PhaseCalendar stats={stats} subPhase={2} />}

            {/* Phase 4: Days Remaining Digits (91) */}
            {currentScene === 3 && <Scene3DaysRemaining stats={stats} countdown={countdown} />}

            {/* Phase 5: That's 13 Weeks */}
            {currentScene === 4 && <PhaseWeeksWeekends stats={stats} isWeekendsOnly={false} />}

            {/* Phase 6: Only 13 Weekends */}
            {currentScene === 5 && <PhaseWeeksWeekends stats={stats} isWeekendsOnly={true} />}

            {/* Phase 7: Perspective Runway (Wait for January) */}
            {currentScene === 6 && <PhasePerspectiveRunway stats={stats} subPhase={0} />}

            {/* Phase 8: DON'T Particle Stream */}
            {currentScene === 7 && <PhasePerspectiveRunway stats={stats} subPhase={1} />}

            {/* Phase 9: START 2027 */}
            {currentScene === 8 && <PhasePerspectiveRunway stats={stats} subPhase={2} />}

            {/* Phase 10: TODAY. Finale */}
            {currentScene === 9 && <PhasePerspectiveRunway stats={stats} subPhase={3} />}
          </div>
        </div>

        {/* Bottom Interactive Navigation & Scrubber */}
        <SceneNavigation
          currentScene={currentScene}
          totalScenes={SCENE_NAMES.length}
          sceneNames={SCENE_NAMES}
          isPlaying={isPlaying}
          progressPercent={sceneProgress}
          onSelectScene={handleSelectScene}
          onPrev={handlePrev}
          onNext={handleNext}
          onTogglePlay={handleTogglePlay}
          onRestartScene={handleRestartScene}
        />
      </main>

      {/* Modal Detailed Stats Panel */}
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
