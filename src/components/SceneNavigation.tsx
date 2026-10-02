import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface SceneNavigationProps {
  currentScene: number;
  totalScenes: number;
  sceneNames: string[];
  isPlaying: boolean;
  progressPercent: number;
  onSelectScene: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onRestartScene: () => void;
}

export const SceneNavigation: React.FC<SceneNavigationProps> = ({
  currentScene,
  totalScenes,
  sceneNames,
  isPlaying,
  progressPercent,
  onSelectScene,
  onPrev,
  onNext,
  onTogglePlay,
  onRestartScene,
}) => {
  return (
    <footer className="w-full flex flex-col items-center border-t border-white/5 bg-[#090a0f]/90 backdrop-blur-md px-4 py-3 z-30 shrink-0">
      {/* Autoplay Progress Bar */}
      <div className="w-full h-[2px] bg-white/5 mb-3 overflow-hidden rounded-full">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-[#ff3344] transition-all duration-100 ease-linear shadow-[0_0_8px_#ff3344]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="w-full flex items-center justify-between">
        {/* Left: Scene counter & current name */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-mono">
            SCENE {currentScene + 1} / {totalScenes}
          </span>
          <span className="text-xs font-semibold tracking-wider text-zinc-200 uppercase font-display">
            {sceneNames[currentScene]}
          </span>
        </div>

        {/* Center: Scene Dot Indicators */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {Array.from({ length: totalScenes }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectScene(idx)}
              title={sceneNames[idx]}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentScene
                  ? 'w-6 bg-[#ff3344] shadow-[0_0_8px_#ff3344]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Right: Interactive Navigation Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={onRestartScene}
            title="Restart Scene (Key: R)"
            className="p-1.5 text-zinc-400 hover:text-white rounded border border-white/10 hover:border-white/25 transition active:scale-95"
          >
            <RotateCcw size={13} />
          </button>

          <button
            onClick={onPrev}
            title="Previous Scene (Key: Left Arrow)"
            className="p-1.5 text-zinc-400 hover:text-white rounded border border-white/10 hover:border-white/25 transition active:scale-95"
          >
            <ChevronLeft size={13} />
          </button>

          <button
            onClick={onTogglePlay}
            title="Play / Pause Auto-Advance (Key: Space)"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 transition active:scale-95"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            onClick={onNext}
            title="Next Scene (Key: Right Arrow)"
            className="p-1.5 text-zinc-400 hover:text-white rounded border border-white/10 hover:border-white/25 transition active:scale-95"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};
