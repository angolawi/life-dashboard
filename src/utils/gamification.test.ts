import { describe, it, expect } from 'vitest';
import { calculateGamificationStats, generateActivityHeatmapData } from './gamification';
import { UserProfile, HabitItem, HabitsMonthState, BJJSession, ConditioningSession, BibleReadingEntry, ContributionEntry } from '../types';

describe('Gamification Engine', () => {
  const mockUser: UserProfile = {
    id: 'user-1',
    name: 'Samuel',
    currentRank: 'Faixa Azul 3º Grau',
    targetRank: 'Faixa Roxa',
    startDate: '2024-01-01',
    targetDate: '2026-12-31'
  };

  const mockHabits: HabitItem[] = [
    { id: 'h1', name: 'Leitura', color: '#10B981', targetDaysPerMonth: 30 },
    { id: 'h2', name: 'Treino', color: '#6366F1', targetDaysPerMonth: 20 }
  ];

  it('calcula XP e nível inicial corretamente', () => {
    const stats = calculateGamificationStats(
      mockUser,
      mockHabits,
      {},
      [],
      [],
      [],
      [],
      '2026-10-24'
    );

    expect(stats.totalXp).toBe(0);
    expect(stats.level).toBe(1);
    expect(stats.levelTitle).toBe('Iniciante Consciente');
    expect(stats.levelProgressPct).toBe(0);
  });

  it('soma XP ponderado por hábitos, treinos e leituras', () => {
    // 2 hábitos marcados (+20 XP), 1 BJJ (+40 XP), 1 Leitura (+20 XP) = 80 XP
    const habitsState: HabitsMonthState = {
      '2026-10': {
        cells: [
          [true, false, false], // habit 1
          [true, false, false]  // habit 2
        ]
      }
    };

    const bjjSessions: BJJSession[] = [
      {
        id: 'bjj-1',
        date: '2026-10-24',
        startTime: '12:00',
        durationMinutes: 75,
        focusArea: 'GUARD_RETENTION',
        roundsRolled: 6,
        rpe: 8,
        techniqueNotes: 'Guarda De la Riva',
        partnersFeedback: 'Boa postura',
        createdAt: '2026-10-24T12:00:00Z'
      }
    ];

    const bibleLogs: BibleReadingEntry[] = [
      {
        id: 'bible-1',
        date: '2026-10-24',
        book: 'Romanos',
        chapters: '8',
        completed: true
      }
    ];

    const stats = calculateGamificationStats(
      mockUser,
      mockHabits,
      habitsState,
      bjjSessions,
      [],
      bibleLogs,
      [],
      '2026-10-24'
    );

    expect(stats.totalXp).toBe(80);
    expect(stats.level).toBe(1);
    // Conquista "first_step" deve estar desbloqueada
    const firstStepAch = stats.achievements.find(a => a.id === 'first_step');
    expect(firstStepAch?.unlocked).toBe(true);
  });

  it('avança para o nível 2 ao atingir 150 XP', () => {
    // 15 hábitos = 150 XP
    const cellsRow = Array(15).fill(true);
    const habitsState: HabitsMonthState = {
      '2026-10': {
        cells: [cellsRow]
      }
    };

    const stats = calculateGamificationStats(
      mockUser,
      mockHabits,
      habitsState,
      [],
      [],
      [],
      [],
      '2026-10-24'
    );

    expect(stats.totalXp).toBe(150);
    expect(stats.level).toBe(2);
    expect(stats.levelTitle).toBe('Praticante Disciplinado');
  });
});

describe('Heatmap Data Generator', () => {
  it('gera os dias solicitados com intensidade calculada', () => {
    const days = generateActivityHeatmapData({}, [], [], [], [], 14);
    expect(days).toHaveLength(14);
    // Sem atividades, todos devem ter intensidade 0
    expect(days.every(d => d.intensityLevel === 0)).toBe(true);
  });

  it('atribui intensidade maior quando há atividades combinadas', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const bjjSessions: BJJSession[] = [
      {
        id: 'bjj-1',
        date: todayStr,
        startTime: '12:00',
        durationMinutes: 75,
        focusArea: 'SPARRING_ONLY',
        roundsRolled: 8,
        rpe: 9,
        techniqueNotes: 'Passagem emborcando',
        partnersFeedback: 'Forte pressão',
        createdAt: todayStr
      }
    ];

    const days = generateActivityHeatmapData({}, bjjSessions, [], [], [], 7);
    const todayData = days.find(d => d.date === todayStr);
    expect(todayData).toBeDefined();
    expect(todayData?.bjjDone).toBe(true);
    expect(todayData?.intensityLevel).toBeGreaterThan(0);
  });
});
