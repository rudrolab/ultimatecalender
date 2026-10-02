import { describe, it, expect } from 'vitest';
import {
  isLeapYear,
  getTotalDaysInYear,
  getDaysInMonth,
  getDayOfYear,
  calculateYearStats,
  getWeekendsRemaining
} from '../src/core/dateEngine';
import { getCountdownToNewYear } from '../src/core/countdown';

describe('Date Engine - Leap Year Logic', () => {
  it('correctly identifies leap years and non-leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(2000)).toBe(true); // Century divisible by 400

    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2027)).toBe(false);
    expect(isLeapYear(2029)).toBe(false);
    expect(isLeapYear(1900)).toBe(false); // Century not divisible by 400
    expect(isLeapYear(2100)).toBe(false);
  });

  it('provides correct total days in a year', () => {
    expect(getTotalDaysInYear(2026)).toBe(365);
    expect(getTotalDaysInYear(2028)).toBe(366);
  });

  it('provides correct days in February for leap and non-leap years', () => {
    expect(getDaysInMonth(2026, 1)).toBe(28); // Feb 2026
    expect(getDaysInMonth(2028, 1)).toBe(29); // Feb 2028
  });
});

describe('Date Engine - Year Calculations', () => {
  it('calculates day of year accurately', () => {
    const jan1 = new Date(2026, 0, 1);
    expect(getDayOfYear(jan1)).toBe(1);

    const feb1 = new Date(2026, 1, 1);
    expect(getDayOfYear(feb1)).toBe(32);

    const dec31 = new Date(2026, 11, 31);
    expect(getDayOfYear(dec31)).toBe(365);

    const leapDec31 = new Date(2028, 11, 31);
    expect(getDayOfYear(leapDec31)).toBe(366);
  });

  it('calculates accurate statistics for mid-year date', () => {
    const testDate = new Date(2026, 9, 2); // Oct 2, 2026
    const stats = calculateYearStats(testDate);

    expect(stats.year).toBe(2026);
    expect(stats.isLeapYear).toBe(false);
    expect(stats.totalDays).toBe(365);
    expect(stats.daysPassed + stats.daysRemaining).toBe(365);
    expect(stats.currentMonthName).toBe('October');
    expect(stats.currentMonthNumber).toBe(10);
    expect(stats.monthsRemaining).toBe(2); // Nov, Dec
    expect(stats.percentCompleted + stats.percentRemaining).toBeCloseTo(100, 1);
  });

  it('calculates remaining weekends without crashing or negative values', () => {
    const testDate = new Date(2026, 9, 2);
    const weekends = getWeekendsRemaining(testDate);
    expect(weekends).toBeGreaterThan(0);
    expect(weekends).toBeLessThanOrEqual(53);
  });
});

describe('Countdown Engine', () => {
  it('calculates valid remaining time to next year', () => {
    const testDate = new Date(2026, 9, 2, 12, 0, 0);
    const countdown = getCountdownToNewYear(testDate);

    expect(countdown.targetYear).toBe(2027);
    expect(countdown.days).toBeGreaterThan(0);
    expect(countdown.hours).toBeLessThan(24);
    expect(countdown.minutes).toBeLessThan(60);
    expect(countdown.seconds).toBeLessThan(60);
    expect(countdown.totalMilliseconds).toBeGreaterThan(0);
  });
});
