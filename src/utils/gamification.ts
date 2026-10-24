import { 
  HabitItem, 
  HabitsMonthState, 
  BJJSession, 
  ConditioningSession, 
  BibleReadingEntry, 
  ContributionEntry, 
  UserProfile 
} from '../types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'habits' | 'bjj' | 'spiritual' | 'finance' | 'streak';
  unlocked: boolean;
  progressPct: number;
  currentValue: number;
  targetValue: number;
}

export interface DayActivityData {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6 (Dom-Sab)
  habitsDone: number;
  bjjDone: boolean;
  conditioningDone: boolean;
  bibleDone: boolean;
  contributionDone: boolean;
  totalScore: number; // ponderado
  intensityLevel: 0 | 1 | 2 | 3 | 4; // 0 a 4 estilo GitHub
}

export interface GamificationStats {
  totalXp: number;
  level: number;
  levelTitle: string;
  xpCurrentLevel: number;
  xpNextLevel: number;
  levelProgressPct: number;
  currentGlobalStreak: number;
  bestGlobalStreak: number;
  todayCompletedCount: number;
  totalCompletedActivities: number;
  achievements: Achievement[];
}

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Iniciante Consciente', xp: 0 },
  { level: 2, title: 'Praticante Disciplinado', xp: 150 },
  { level: 3, title: 'Guerreiro Focado', xp: 400 },
  { level: 4, title: 'Guardião da Rotina', xp: 800 },
  { level: 5, title: 'Mestre da Consistência', xp: 1500 },
  { level: 6, title: 'Executor Implacável', xp: 2500 },
  { level: 7, title: 'Atleta de Alta Performance', xp: 4000 },
  { level: 8, title: 'Líder Reformado & Resiliente', xp: 6000 },
  { level: 9, title: 'Faixa Preta de Hábitos', xp: 9000 },
  { level: 10, title: 'Titã da Autoliderança', xp: 13000 }
];

export function calculateGamificationStats(
  user: UserProfile,
  habits: HabitItem[],
  habitsState: HabitsMonthState,
  bjjSessions: BJJSession[],
  conditioningSessions: ConditioningSession[],
  bibleLogs: BibleReadingEntry[],
  contributions: ContributionEntry[],
  selectedDate: string
): GamificationStats {
  // 1. Contagem de hábitos completados em todos os meses
  let totalHabitsDone = 0;
  Object.values(habitsState).forEach((monthData) => {
    if (monthData.cells) {
      monthData.cells.forEach((row) => {
        row.forEach((cell) => {
          if (cell) totalHabitsDone++;
        });
      });
    }
  });

  // 2. Contagem de outras atividades
  const totalBjjSessions = bjjSessions.length;
  const totalConditioning = conditioningSessions.filter((s) => s.completed).length;
  const totalBibleLogs = bibleLogs.filter((b) => b.completed).length;
  const totalContributions = contributions.length;

  // 3. Sistema de XP
  // Hábito: 10 XP
  // Treino BJJ: 40 XP
  // Condicionamento / Pilates: 30 XP
  // Leitura Bíblica: 20 XP
  // Aporte Financeiro: 50 XP
  const totalXp = 
    (totalHabitsDone * 10) +
    (totalBjjSessions * 40) +
    (totalConditioning * 30) +
    (totalBibleLogs * 20) +
    (totalContributions * 50);

  // 4. Nível e Progresso de Nível
  let currentLevelObj = LEVEL_THRESHOLDS[0];
  let nextLevelObj = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xp) {
      currentLevelObj = LEVEL_THRESHOLDS[i];
      nextLevelObj = LEVEL_THRESHOLDS[i + 1] || { 
        level: currentLevelObj.level + 1, 
        title: 'Lenda Soberana', 
        xp: currentLevelObj.xp + 5000 
      };
    } else {
      break;
    }
  }

  const xpInCurrentBracket = totalXp - currentLevelObj.xp;
  const xpNeededForNext = nextLevelObj.xp - currentLevelObj.xp;
  const levelProgressPct = Math.min(100, Math.max(0, Math.round((xpInCurrentBracket / xpNeededForNext) * 100)));

  // 5. Streaks Globais (dias consecutivos com pelo menos 1 atividade)
  const heatmapData = generateActivityHeatmapData(
    habitsState, 
    bjjSessions, 
    conditioningSessions, 
    bibleLogs, 
    contributions, 
    60
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Percorrendo cronologicamente para calcular best streak
  heatmapData.forEach((day) => {
    if (day.totalScore > 0) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });

  // Calculando streak atual a partir do dia de hoje (ou último dia ativo)
  const todayEntry = heatmapData.find(d => d.date === selectedDate);
  const todayCompletedCount = todayEntry ? todayEntry.habitsDone + (todayEntry.bjjDone ? 1 : 0) + (todayEntry.conditioningDone ? 1 : 0) + (todayEntry.bibleDone ? 1 : 0) : 0;

  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].totalScore > 0) {
      currentStreak++;
    } else {
      // Se for o dia de hoje e ainda não fez nada, permite manter o streak de ontem
      if (heatmapData[i].date === selectedDate && i > 0 && heatmapData[i - 1].totalScore > 0) {
        continue;
      }
      break;
    }
  }

  // 6. Conquistas (Achievements)
  const achievements: Achievement[] = [
    {
      id: 'first_step',
      title: 'Primeiro Passo',
      description: 'Conclua seu primeiro hábito no dashboard',
      iconName: 'Footprints',
      category: 'habits',
      unlocked: totalHabitsDone >= 1,
      progressPct: Math.min(100, (totalHabitsDone / 1) * 100),
      currentValue: totalHabitsDone,
      targetValue: 1
    },
    {
      id: 'habit_50',
      title: 'Hábito de Ferro',
      description: 'Conclua 50 repetições de hábitos no total',
      iconName: 'Zap',
      category: 'habits',
      unlocked: totalHabitsDone >= 50,
      progressPct: Math.min(100, Math.round((totalHabitsDone / 50) * 100)),
      currentValue: totalHabitsDone,
      targetValue: 50
    },
    {
      id: 'streak_7',
      title: 'Semana Imbatível',
      description: 'Mantenha um streak global de 7 dias consecutivos',
      iconName: 'Flame',
      category: 'streak',
      unlocked: bestStreak >= 7,
      progressPct: Math.min(100, Math.round((bestStreak / 7) * 100)),
      currentValue: bestStreak,
      targetValue: 7
    },
    {
      id: 'streak_21',
      title: 'Mente Blindada',
      description: 'Alcance a marca de 21 dias seguidos de consistência',
      iconName: 'Award',
      category: 'streak',
      unlocked: bestStreak >= 21,
      progressPct: Math.min(100, Math.round((bestStreak / 21) * 100)),
      currentValue: bestStreak,
      targetValue: 21
    },
    {
      id: 'mat_warrior',
      title: 'Guerreiro do Tatame',
      description: 'Complete 10 treinos registrados de Jiu-Jitsu',
      iconName: 'Shield',
      category: 'bjj',
      unlocked: totalBjjSessions >= 10,
      progressPct: Math.min(100, Math.round((totalBjjSessions / 10) * 100)),
      currentValue: totalBjjSessions,
      targetValue: 10
    },
    {
      id: 'berean',
      title: 'Discípulo Bereano',
      description: 'Realize 15 sessões de leitura das Escrituras',
      iconName: 'BookOpen',
      category: 'spiritual',
      unlocked: totalBibleLogs >= 15,
      progressPct: Math.min(100, Math.round((totalBibleLogs / 15) * 100)),
      currentValue: totalBibleLogs,
      targetValue: 15
    },
    {
      id: 'wealth_builder',
      title: 'Edificador Patrimonial',
      description: 'Faça 5 aportes registrados para o alvo de 100k',
      iconName: 'TrendingUp',
      category: 'finance',
      unlocked: totalContributions >= 5,
      progressPct: Math.min(100, Math.round((totalContributions / 5) * 100)),
      currentValue: totalContributions,
      targetValue: 5
    }
  ];

  return {
    totalXp,
    level: currentLevelObj.level,
    levelTitle: currentLevelObj.title,
    xpCurrentLevel: currentLevelObj.xp,
    xpNextLevel: nextLevelObj.xp,
    levelProgressPct,
    currentGlobalStreak: currentStreak,
    bestGlobalStreak: bestStreak,
    todayCompletedCount,
    totalCompletedActivities: totalHabitsDone + totalBjjSessions + totalConditioning + totalBibleLogs,
    achievements
  };
}

/**
 * Gera uma linha do tempo de dias para o Heatmap (padrão GitHub)
 */
export function generateActivityHeatmapData(
  habitsState: HabitsMonthState,
  bjjSessions: BJJSession[],
  conditioningSessions: ConditioningSession[],
  bibleLogs: BibleReadingEntry[],
  contributions: ContributionEntry[],
  daysCount: number = 70 // ~10 semanas
): DayActivityData[] {
  const result: DayActivityData[] = [];
  const today = new Date();

  // Mapeamentos rápidos por data YYYY-MM-DD
  const bjjMap = new Set(bjjSessions.map((b) => b.date));
  const condMap = new Set(conditioningSessions.filter((c) => c.completed).map((c) => c.date));
  const bibleMap = new Set(bibleLogs.filter((b) => b.completed).map((b) => b.date));
  const contMap = new Set(contributions.map((c) => c.date));

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const monthKey = dateStr.slice(0, 7);
    const dayOfMonth = parseInt(dateStr.split('-')[2], 10);
    const dayIndex = dayOfMonth - 1;

    // Hábitos marcados nesta data
    let habitsDone = 0;
    const monthData = habitsState[monthKey];
    if (monthData && monthData.cells) {
      monthData.cells.forEach((row) => {
        if (row && row[dayIndex]) habitsDone++;
      });
    }

    const bjjDone = bjjMap.has(dateStr);
    const conditioningDone = condMap.has(dateStr);
    const bibleDone = bibleMap.has(dateStr);
    const contributionDone = contMap.has(dateStr);

    // Pontuação ponderada
    let score = habitsDone;
    if (bjjDone) score += 3;
    if (conditioningDone) score += 2;
    if (bibleDone) score += 2;
    if (contributionDone) score += 2;

    // Determinar intensidade 0 a 4
    let intensityLevel: 0 | 1 | 2 | 3 | 4 = 0;
    if (score === 0) intensityLevel = 0;
    else if (score <= 2) intensityLevel = 1;
    else if (score <= 4) intensityLevel = 2;
    else if (score <= 6) intensityLevel = 3;
    else intensityLevel = 4;

    result.push({
      date: dateStr,
      dayOfWeek: d.getDay(),
      habitsDone,
      bjjDone,
      conditioningDone,
      bibleDone,
      contributionDone,
      totalScore: score,
      intensityLevel
    });
  }

  return result;
}
