/**
 * Real-time Countdown Engine to the Next Year
 */

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalMilliseconds: number;
  targetYear: number;
}

export function getCountdownToNewYear(now: Date = new Date()): CountdownTime {
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  const targetTime = new Date(nextYear, 0, 1, 0, 0, 0, 0).getTime();
  const currentTime = now.getTime();

  let diff = Math.max(0, targetTime - currentTime);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);
  diff -= seconds * 1000;

  const milliseconds = diff;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalMilliseconds: targetTime - currentTime,
    targetYear: nextYear,
  };
}
