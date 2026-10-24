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

  // Contagem reversa para o streak ativo atual:
  // Se o dia final avaliado (ex: hoje) não foi cumprido e nem o dia anterior, o streak atual é 0.
  let currentStreak = 0;
  
  // Se o último dia da contagem não está marcado:
  // Permite tolerância de apenas 1 dia se for o dia de hoje ainda em aberto (ontem concluído).
  // Se houver 2 ou mais dias sem marcação consecutiva no fim, o streak quebrou.
  for (let d = daysCount - 1; d >= 0; d--) {
    if (row[d]) {
      currentStreak++;
    } else {
      // Se ainda não começou a contar e já encontrou mais de um dia vazio no final, streak quebrou
      if (currentStreak > 0) {
        break;
      }
      // Se for o último dia (ex: hoje) e estiver desmarcado, verifica se o dia anterior foi feito
      if (d === daysCount - 1 && d > 0 && row[d - 1]) {
        // Tolerância para o dia de hoje que ainda está em andamento
        continue;
      } else {
        break;
      }
    }
  }

  return { currentStreak, bestStreak };
}
