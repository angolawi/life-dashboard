import { describe, it, expect } from 'vitest';
import {
  ANNUAL_BIBLE_PLAN,
  TOTAL_BIBLE_CHAPTERS,
  calculateBiblePlanStats,
  DEFAULT_BIBLE_PLAN_PROGRESS
} from './bibleReadingPlan';

describe('Annual Bible Reading Plan', () => {
  it('should have exactly 365 days', () => {
    expect(ANNUAL_BIBLE_PLAN).toHaveLength(365);
    expect(ANNUAL_BIBLE_PLAN[0].dayNumber).toBe(1);
    expect(ANNUAL_BIBLE_PLAN[364].dayNumber).toBe(365);
  });

  it('should sum to exactly 1189 chapters', () => {
    const totalChapters = ANNUAL_BIBLE_PLAN.reduce((acc, curr) => acc + curr.chaptersCount, 0);
    expect(totalChapters).toBe(TOTAL_BIBLE_CHAPTERS);
    expect(totalChapters).toBe(1189);
  });

  it('should start with Genesis 1 and end with Revelation 22', () => {
    expect(ANNUAL_BIBLE_PLAN[0].chaptersText).toContain('Gênesis 1');
    expect(ANNUAL_BIBLE_PLAN[364].chaptersText).toBe('Apocalipse 20-22');
  });

  it('calculates statistics correctly with empty progress', () => {
    const stats = calculateBiblePlanStats(
      { ...DEFAULT_BIBLE_PLAN_PROGRESS, startDate: '2026-01-01' },
      '2026-01-05'
    );
    expect(stats.completedDaysCount).toBe(0);
    expect(stats.chaptersRead).toBe(0);
    expect(stats.percentageChapters).toBe(0);
    expect(stats.nextPendingDay.dayNumber).toBe(1);
    expect(stats.expectedDay).toBe(5);
    expect(stats.paceDelta).toBe(-5);
    expect(stats.isBehind).toBe(true);
  });

  it('calculates pace correctly when ahead of schedule', () => {
    const progress = {
      completedDayNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 10 dias lidos
      startDate: '2026-01-01'
    };
    // No dia 5 de janeiro (dia esperado 5)
    const stats = calculateBiblePlanStats(progress, '2026-01-05');
    expect(stats.completedDaysCount).toBe(10);
    expect(stats.expectedDay).toBe(5);
    expect(stats.paceDelta).toBe(5); // +5 dias adiantado
    expect(stats.isAhead).toBe(true);
    expect(stats.nextPendingDay.dayNumber).toBe(11);
  });
});
