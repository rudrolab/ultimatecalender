import React, { useEffect, useState, useMemo } from 'react';
import { YearStats } from '../../core/dateEngine';
import { CountdownTime } from '../../core/countdown';
import { DIGIT_PATHS } from '../../utils/digitPaths';

interface Scene3Props {
  stats: YearStats;
  countdown: CountdownTime;
}

interface DotPosition {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export const Scene3DaysRemaining: React.FC<Scene3Props> = ({ stats }) => {
  const daysLeft = stats.daysRemaining;
  const digits = String(daysLeft).split('');

  // Dimensions for SVG canvas
  const digitWidth = 100;
  const digitHeight = 160;
  const digitSpacing = 28;
  const totalDigitsWidth = digits.length * digitWidth + (digits.length - 1) * digitSpacing;
  const svgWidth = totalDigitsWidth + 80;
  const svgHeight = digitHeight + 40;
  const offsetX = (svgWidth - totalDigitsWidth) / 2;
  const offsetY = 20;

  // Calculate paths and sample equidistant dot points
  const { pathsWithOffset, sampledDots } = useMemo(() => {
    if (typeof document === 'undefined') {
      return { pathsWithOffset: [], sampledDots: [] };
    }

    const pathsData: { d: string; digitIdx: number }[] = [];
    const pathLengths: { pathEl: SVGPathElement; digitX: number; len: number }[] = [];
    let totalLength = 0;

    digits.forEach((digit, idx) => {
      const digitX = offsetX + idx * (digitWidth + digitSpacing);
      const digitPathStrings = DIGIT_PATHS[digit] || DIGIT_PATHS['0'];

      digitPathStrings.forEach((d) => {
        pathsData.push({ d, digitIdx: idx });

        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', d);
        const len = pathEl.getTotalLength();
        pathLengths.push({ pathEl, digitX, len });
        totalLength += len;
      });
    });

    const dots: { targetX: number; targetY: number }[] = [];

    if (totalLength > 0 && daysLeft > 0) {
      for (let i = 0; i < daysLeft; i++) {
        // Equidistant sample point along composite stroke
        const targetDist = ((i + 0.5) / daysLeft) * totalLength;
        let accumulated = 0;

        for (const item of pathLengths) {
          if (targetDist <= accumulated + item.len || item === pathLengths[pathLengths.length - 1]) {
            const distOnSegment = Math.max(0, Math.min(item.len, targetDist - accumulated));
            const pt = item.pathEl.getPointAtLength(distOnSegment);
            dots.push({
              targetX: item.digitX + pt.x,
              targetY: offsetY + pt.y,
            });
            break;
          }
          accumulated += item.len;
        }
      }
    }

    return {
      pathsWithOffset: pathsData,
      sampledDots: dots,
    };
  }, [daysLeft, digits, offsetX, offsetY, totalDigitsWidth]);

  // Dot transition animation state
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    setAnimationProgress(0);
    const startTime = performance.now();
    const duration = 1200; // ms

    let animId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic easing
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(ease);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setAnimationProgress(1);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [daysLeft]);

  // Generate initial scattered/calendar starting positions for each dot
  const dotsWithAnimation = useMemo(() => {
    return sampledDots.map((dot, idx) => {
      // Deterministic pseudo-random calendar start position
      const angle = (idx / daysLeft) * Math.PI * 2;
      const radius = 90 + ((idx * 17) % 80);
      const startX = svgWidth / 2 + Math.cos(angle) * radius;
      const startY = svgHeight / 2 + Math.sin(angle) * (radius * 0.6) - 30;

      const currentX = startX + (dot.targetX - startX) * animationProgress;
      const currentY = startY + (dot.targetY - startY) * animationProgress;

      return {
        id: idx,
        x: currentX,
        y: currentY,
      };
    });
  }, [sampledDots, animationProgress, daysLeft, svgWidth, svgHeight]);

  // Date range formatted: e.g. "OCT 02 - DEC 31"
  const startMonthShort = stats.currentMonthName.substring(0, 3).toUpperCase();
  const startDayPad = String(new Date().getDate()).padStart(2, '0');
  const dateRangeStr = `${startMonthShort} ${startDayPad} - DEC 31`;

  const progressFraction = Math.min(Math.max(stats.daysPassed / stats.totalDays, 0), 1);

  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-6 sm:px-10 select-none bg-[#090a0f] text-white">
      {/* 1. Top Bar with Thin Timeline & Ticks (matching reference image) */}
      <div className="w-full flex flex-col pt-1">
        <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500 tracking-widest uppercase mb-1">
          <span>{stats.year}</span>
          <span>{stats.daysPassed}/{stats.totalDays}</span>
        </div>

        {/* Timeline bar with quarter ticks and glowing red position dot */}
        <div className="w-full h-3 relative flex items-center">
          <div className="w-full h-[1px] bg-zinc-800 relative">
            {/* End caps */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-2 bg-zinc-700" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-2 bg-zinc-700" />
            {/* Quarter ticks */}
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-zinc-800" />
            <div className="absolute left-2/4 top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-zinc-800" />
            <div className="absolute left-3/4 top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-zinc-800" />

            {/* Glowing Red Current Position Dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#ff3344] shadow-[0_0_8px_#ff3344] transition-all duration-300"
              style={{ left: `${progressFraction * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Header text: "YOU HAVE" */}
      <div className="text-center mt-4">
        <h2 className="text-sm sm:text-base font-display font-semibold tracking-[0.3em] uppercase text-zinc-200">
          YOU HAVE
        </h2>
      </div>

      {/* 3. The Number Composed of Perfectly Aligned Dots with Silhouette Track */}
      <div className="my-auto flex items-center justify-center w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[340px] sm:max-w-[400px] overflow-visible"
        >
          {/* A. Dark Charcoal Track Silhouette (Underneath) */}
          <g>
            {digits.map((digit, idx) => {
              const digitX = offsetX + idx * (digitWidth + digitSpacing);
              const pathStrings = DIGIT_PATHS[digit] || DIGIT_PATHS['0'];

              return pathStrings.map((d, pIdx) => (
                <path
                  key={`bg-${idx}-${pIdx}`}
                  d={d}
                  transform={`translate(${digitX}, ${offsetY})`}
                  fill="none"
                  stroke="#161822"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-opacity duration-500"
                />
              ));
            })}
          </g>

          {/* B. Crisp White Glowing Circular Dots */}
          <g>
            {dotsWithAnimation.map((dot) => (
              <circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r={3.4}
                fill="#ffffff"
                className="transition-transform duration-150"
                style={{
                  filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))',
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* 4. Bottom Section: "DAYS LEFT ." and "OCT 02 - DEC 31" */}
      <div className="flex flex-col items-center justify-center text-center pb-3">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-[0.25em] text-white uppercase">
            DAYS LEFT
          </h1>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff3344] shadow-[0_0_10px_#ff3344] inline-block animate-pulse" />
        </div>

        <p className="mt-2 text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 font-medium">
          {dateRangeStr}
        </p>
      </div>
    </div>
  );
};
