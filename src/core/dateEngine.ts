/**
 * Core Date Engine for Ultimate Calendar
 * Computes all calendar, progress, leap year, week, and weekend statistics dynamically.
 */

export interface MonthInfo {
  index: number; // 0-11
  monthNumber: number; // 1-12
  name: string;
  shortName: string;
  daysCount: number;
  completedDays: number;
  remainingDays: number;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  days: DayStatus[];
}

export interface DayStatus {
  dayNumber: number;
  date: Date;
  isWeekend: boolean;
  status: 'completed' | 'current' | 'future';
}

export interface YearStats {
  year: number;
  isLeapYear: boolean;
  totalDays: number;
  dayOfYear: number;
  daysPassed: number;
  daysRemaining: number;
  percentCompleted: number;
  percentRemaining: number;
  monthsTotal: number;
  monthsCompleted: number;
  currentMonthName: string;
  currentMonthNumber: number;
  monthsRemaining: number;
  currentIsoWeek: number;
  weeksRemaining: number;
  weekendsRemaining: number;
  currentDateFormatted: string;
  monthsData: MonthInfo[];
}

/**
 * Determine if a year is a leap year based on Gregorian calendar rules.
 */
export function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

/**
 * Get total days in a given year (366 for leap, 365 for non-leap).
 */
export function getTotalDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Get total days in a specific month of a year.
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  // monthIndex: 0 = Jan, 1 = Feb, etc.
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Calculate the 1-based day of the year for a given date.
 */
export function getDayOfYear(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffTime = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diffTime / oneDay) + 1;
}

/**
 * Compute ISO week number (1-53).
 */
export function getIsoWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Monday = 0
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Count the number of Saturdays and Sundays remaining in the year after today.
 * Each Saturday or Sunday that falls strictly after the current date is considered.
 * We count remaining full weekend units (Math.ceil(remaining weekend days / 2)).
 */
export function getWeekendsRemaining(referenceDate: Date = new Date()): number {
  const year = referenceDate.getFullYear();
  const currentDayOfYear = getDayOfYear(referenceDate);
  const totalDays = getTotalDaysInYear(year);

  let weekendDaysLeft = 0;

  for (let day = currentDayOfYear + 1; day <= totalDays; day++) {
    const d = new Date(year, 0, day);
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDaysLeft++;
    }
  }

  // Count remaining weekend pairs (Saturday + Sunday)
  return Math.ceil(weekendDaysLeft / 2);
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

/**
 * Compute all year statistics for a reference date.
 */
export function calculateYearStats(referenceDate: Date = new Date()): YearStats {
  const year = referenceDate.getFullYear();
  const leap = isLeapYear(year);
  const totalDays = leap ? 366 : 365;
  const dayOfYear = Math.min(Math.max(getDayOfYear(referenceDate), 1), totalDays);

  const daysPassed = dayOfYear;
  const daysRemaining = Math.max(0, totalDays - dayOfYear);

  const percentCompleted = Number(((daysPassed / totalDays) * 100).toFixed(2));
  const percentRemaining = Number((100 - percentCompleted).toFixed(2));

  const currentMonthIdx = referenceDate.getMonth(); // 0-11
  const currentMonthNumber = currentMonthIdx + 1;
  const currentMonthName = MONTH_NAMES[currentMonthIdx];

  // Definition: Months fully completed = currentMonthIdx
  // Months remaining = 12 - currentMonthNumber (full calendar months remaining after current month)
  const monthsCompleted = currentMonthIdx;
  const monthsRemaining = 12 - currentMonthNumber;

  const currentIsoWeek = getIsoWeek(referenceDate);
  // Full weeks remaining
  const weeksRemaining = Math.floor(daysRemaining / 7);
  const weekendsRemaining = getWeekendsRemaining(referenceDate);

  // Month data generation with dot statuses
  const monthsData: MonthInfo[] = [];

  for (let m = 0; m < 12; m++) {
    const daysInThisMonth = getDaysInMonth(year, m);
    const days: DayStatus[] = [];
    let completedInMonth = 0;
    let remainingInMonth = 0;

    for (let d = 1; d <= daysInThisMonth; d++) {
      const dateObj = new Date(year, m, d);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

      let status: 'completed' | 'current' | 'future';
      if (m < currentMonthIdx) {
        status = 'completed';
        completedInMonth++;
      } else if (m > currentMonthIdx) {
        status = 'future';
        remainingInMonth++;
      } else {
        // Current month
        const todayDate = referenceDate.getDate();
        if (d < todayDate) {
          status = 'completed';
          completedInMonth++;
        } else if (d === todayDate) {
          status = 'current';
          completedInMonth++;
        } else {
          status = 'future';
          remainingInMonth++;
        }
      }

      days.push({
        dayNumber: d,
        date: dateObj,
        isWeekend,
        status,
      });
    }

    monthsData.push({
      index: m,
      monthNumber: m + 1,
      name: MONTH_NAMES[m],
      shortName: MONTH_SHORT_NAMES[m],
      daysCount: daysInThisMonth,
      completedDays: completedInMonth,
      remainingDays: remainingInMonth,
      isCurrent: m === currentMonthIdx,
      isPast: m < currentMonthIdx,
      isFuture: m > currentMonthIdx,
      days,
    });
  }

  const currentDateFormatted = referenceDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    year,
    isLeapYear: leap,
    totalDays,
    dayOfYear,
    daysPassed,
    daysRemaining,
    percentCompleted,
    percentRemaining,
    monthsTotal: 12,
    monthsCompleted,
    currentMonthName,
    currentMonthNumber,
    monthsRemaining,
    currentIsoWeek,
    weeksRemaining,
    weekendsRemaining,
    currentDateFormatted,
    monthsData,
  };
}
