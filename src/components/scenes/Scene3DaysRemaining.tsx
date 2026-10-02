import React, { useEffect, useState, useMemo } from 'react';
import { YearStats } from '../../core/dateEngine';
import { CountdownTime } from '../../core/countdown';
import { DIGIT_PATHS } from '../../utils/digitPaths';

interface Scene3Props {
  stats: YearStats;
  countdown: CountdownTime;
  scrollT?: number; // 0 to 1 continuous scrub
}

export const Scene3DaysRemaining: React.FC<Scene3Props> = ({ stats, scrollT }) => {
  const daysLeft = stats.daysRemaining;
  const digits = String(daysLeft).split('');

  // Dimensions for SVG canvas scaled for full viewport
  const digitWidth = 140;
  const digitHeight = 220;
  const digitSpacing = 36;
  const totalDigitsWidth = digits.length * digitWidth + (digits.length - 1) * digitSpacing;
  const svgWidth = totalDigitsWidth + 120;
  const svgHeight = digitHeight + 60;
  const offsetX = (svgWidth - totalDigitsWidth) / 2;
  const offsetY = 30;

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
        const targetDist = ((i + 0.5) / daysLeft) * totalLength;
        let accumulated = 0;

        for (const item of pathLengths) {
          if (targetDist <= accumulated + item.len || item === pathLengths[pathLengths.length - 1]) {
            const distOnSegment = Math.max(0, Math.min(item.len, targetDist - accumulated));
            const pt = item.pathEl.getPointAtLength(distOnSegment);
            // Scale point from 100x160 viewBox to 140x220
            const scaledX = (pt.x / 100) * digitWidth;
            const scaledY = (pt.y / 160) * digitHeight;

            dots.push({
              targetX: item.digitX + scaledX,
              targetY: offsetY + scaledY,
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
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (scrollT !== undefined) return;

    setInternalProgress(0);
    const startTime = performance.now();
    const duration = 1200;

    let animId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setInternalProgress(ease);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setInternalProgress(1);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [daysLeft, scrollT]);

  const effectiveProgress = scrollT !== undefined ? scrollT : internalProgress;

  // Generate initial scattered/calendar starting positions for each dot
  const dotsWithAnimation = useMemo(() => {
    return sampledDots.map((dot, idx) => {
      const angle = (idx / daysLeft) * Math.PI * 2;
      const radius = 140 + ((idx * 23) % 120);
      const startX = svgWidth / 2 + Math.cos(angle) * radius;
      const startY = svgHeight / 2 + Math.sin(angle) * (radius * 0.6) - 40;

      const currentX = startX + (dot.targetX - startX) * effectiveProgress;
      const currentY = startY + (dot.targetY - startY) * effectiveProgress;

      return {
        id: idx,
        x: currentX,
        y: currentY,
      };
    });
  }, [sampledDots, effectiveProgress, daysLeft, svgWidth, svgHeight]);

  const startMonthShort = stats.currentMonthName.substring(0, 3).toUpperCase();
  const startDayPad = String(new Date().getDate()).padStart(2, '0');
  const dateRangeStr = `${startMonthShort} ${startDayPad} - DEC 31`;

  return (
    <div className="w-full h-full flex flex-col justify-between py-6 px-6 sm:px-12 md:px-20 select-none bg-transparent text-white">
      {/* 1. Header: "YOU HAVE" */}
      <div className="text-center pt-2 sm:pt-4">
        <h2 className="text-lg sm:text-2xl font-tech font-bold tracking-[0.35em] uppercase text-zinc-200 glow-white">
          YOU HAVE
        </h2>
      </div>

      {/* 2. Monumental Number Composed of Perfectly Aligned Dots with Silhouette Track */}
      <div className="my-auto flex items-center justify-center w-full relative">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-red-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[460px] sm:max-w-[560px] md:max-w-[640px] overflow-visible"
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
                  transform={`translate(${digitX}, ${offsetY}) scale(${digitWidth / 100}, ${digitHeight / 160})`}
                  fill="none"
                  stroke="#161822"
                  strokeWidth="28"
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
                r={4.2}
                fill="#ffffff"
                className="transition-transform duration-100"
                style={{
                  filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.95))',
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* 3. Bottom Section: "DAYS LEFT ." and "OCT 02 - DEC 31" */}
      <div className="flex flex-col items-center justify-center text-center pb-4">
        <div className="flex items-center justify-center space-x-3">
          <h1 className="text-3xl sm:text-5xl font-tech font-bold tracking-[0.25em] text-white uppercase glow-white">
            DAYS LEFT
          </h1>
          <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#ff3344] shadow-[0_0_16px_#ff3344,0_0_30px_rgba(255,51,68,0.9)] inline-block animate-pulse" />
        </div>

        <p className="mt-3 text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-zinc-400 font-medium">
          {dateRangeStr}
        </p>
      </div>
    </div>
  );
};
