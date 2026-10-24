import { describe, it, expect } from 'vitest';
import { calculateHabitStreaks } from './habitStreaks';

describe('calculateHabitStreaks', () => {
  it('retorna 0 para linha vazia ou undefined', () => {
    expect(calculateHabitStreaks(undefined, 30)).toEqual({ currentStreak: 0, bestStreak: 0 });
    expect(calculateHabitStreaks([], 30)).toEqual({ currentStreak: 0, bestStreak: 0 });
  });

  it('calcula streak ativo contínuo até o final do período', () => {
    // Dias: 0, 1, 2, 3 false, 4, 5, 6 true
    const row = [false, false, false, false, true, true, true];
    const result = calculateHabitStreaks(row, 7);
    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
  });

  it('calcula best streak maior que o current streak', () => {
    // Sequência de 4 dias no meio, depois falha, depois 2 dias no fim
    const row = [true, true, true, true, false, false, true, true];
    const result = calculateHabitStreaks(row, 8);
    expect(result.bestStreak).toBe(4);
    expect(result.currentStreak).toBe(2);
  });

  it('mantém o streak ativo de ontem caso o dia de hoje ainda não tenha sido marcado', () => {
    // 4 dias cumpridos e hoje (índice 4) ainda em aberto
    const row = [true, true, true, true, false];
    const result = calculateHabitStreaks(row, 5);
    expect(result.currentStreak).toBe(4);
    expect(result.bestStreak).toBe(4);
  });

  it('zera o streak se houver 2 ou mais dias sem marcação no final', () => {
    // Quebrou a sequência há mais de 1 dia
    const row = [true, true, true, false, false];
    const result = calculateHabitStreaks(row, 5);
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(3);
  });
});
