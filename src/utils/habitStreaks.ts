export interface HabitStreakResult {
  currentStreak: number;
  bestStreak: number;
}

/**
 * Calcula sequências (streaks) consecutivas de dias cumpridos para um determinado hábito.
 */
export function calculateHabitStreaks(
  row: boolean[] | undefined,
  daysCount: number
): HabitStreakResult {
  if (!row || row.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  let running = 0;
  let bestStreak = 0;

  for (let d = 0; d < daysCount; d++) {
    if (row[d]) {
      running++;
      if (running > bestStreak) {
        bestStreak = running;
      }
    } else {
      running = 0;
    }
  }

  // Contagem reversa para o streak ativo atual
  let currentStreak = 0;
  for (let d = daysCount - 1; d >= 0; d--) {
    if (row[d]) {
      currentStreak++;
    } else if (currentStreak > 0) {
      break;
    }
  }

  return { currentStreak, bestStreak };
}
