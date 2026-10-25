// Re-export e consolidação de tipos do Road2Belt & Life Nexus
export type BJJArenaFocus = 
  | 'GUARD_RETENTION' 
  | 'PASSING' 
  | 'SUBMISSIONS' 
  | 'TAKEDOWN' 
  | 'SPARRING_ONLY';

export interface BJJSession {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ex: "12:00"
  durationMinutes: number; // ex: 75
  focusArea: BJJArenaFocus;
  roundsRolled: number; // quantidade de rolas
  rpe: number; // 1 a 10 (Percepção Subjetiva de Esforço)
  techniqueNotes: string; // A-Game, raspagens/passagens executadas
  partnersFeedback: string; // observações qualitativas com graduados
  createdAt: string;
}

export type ConditioningType = 
  | 'PILATES_18H' 
  | 'SC_TREINO_A' 
  | 'SC_TREINO_B' 
  | 'REST';

export interface ExerciseDefinition {
  id: string;
  block: 1 | 2 | 3;
  name: string;
  sets: number;
  reps: string;
  cadence: string;
  targetPse: number;
  notes?: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface ConditioningSession {
  id: string;
  date: string;
  type: ConditioningType;
  weekCycle: number; // 1 a 6
  completed: boolean;
  cadenceAdherence: boolean;
  pseAverage: number;
  attendanceStatus?: 'ATTENDED' | 'SKIPPED' | 'PASSIVE_REST';
  decompressionImpact?: 'HIGH' | 'MODERATE' | 'LOW';
  barefootConfirmed: boolean;
  exercises?: ExerciseDefinition[];
  notes: string;
}

export type NutritionProtocolType = 'DIAS_COM_BJJ' | 'DIAS_SEM_BJJ';

export interface MealOption {
  description: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}

export interface MealDetail {
  time: string;
  name: string;
  kcal: number;
  description: string;
  options: string[];
  tips?: string;
}

export interface DailyNutrition {
  id: string;
  date: string;
  protocolType: NutritionProtocolType;
  targetKcal: number;
  targetCarbsG: number;
  targetProteinG: number;
  targetFatG: number;
  breakfastDone: boolean;
  snackAmDone: boolean;
  lunchDone: boolean;
  snackPmDone: boolean;
  dinnerDone: boolean;
  hydrationLiters: number;
  notes?: string;
}

export interface ReadinessCheck {
  id: string;
  date: string;
  sleepHours: number;
  jointSoreness: number; // 1 a 5 (dedos, joelhos, coluna)
  energyLevel: number; // 1 a 5
  lumbarNeckStatus: 'OPTIMAL' | 'NORMAL' | 'STIFF' | 'PAIN';
  notes?: string;
}

export interface WeeklyScheduleConfig {
  bjjDays: number[]; // 0 = Dom, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb
  conditioningDays: number[];
  pilatesDays: number[];
  bjjDefaultTime: string;
  pilatesDefaultTime: string;
}

export type BJJBeltColor = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK';

export interface BJJBeltMeta {
  color: BJJBeltColor;
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  hex: string;
  sleeveColor: 'BLACK' | 'RED';
}

export const BJJ_BELT_METAS: Record<BJJBeltColor, BJJBeltMeta> = {
  WHITE: {
    color: 'WHITE',
    name: 'Faixa Branca',
    bgClass: 'bg-slate-200',
    textClass: 'text-slate-900',
    borderClass: 'border-slate-300',
    hex: '#e2e8f0',
    sleeveColor: 'BLACK'
  },
  BLUE: {
    color: 'BLUE',
    name: 'Faixa Azul',
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-600',
    borderClass: 'border-blue-500',
    hex: '#2563eb',
    sleeveColor: 'BLACK'
  },
  PURPLE: {
    color: 'PURPLE',
    name: 'Faixa Roxa',
    bgClass: 'bg-purple-700',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-500',
    hex: '#7e22ce',
    sleeveColor: 'BLACK'
  },
  BROWN: {
    color: 'BROWN',
    name: 'Faixa Marrom',
    bgClass: 'bg-amber-900',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-700',
    hex: '#78350f',
    sleeveColor: 'BLACK'
  },
  BLACK: {
    color: 'BLACK',
    name: 'Faixa Preta',
    bgClass: 'bg-neutral-950',
    textClass: 'text-neutral-900',
    borderClass: 'border-neutral-700',
    hex: '#0a0a0a',
    sleeveColor: 'RED'
  }
};

export interface UserProfile {
  id: string;
  name: string;
  currentRank: string;
  targetRank: string;
  currentBeltColor?: BJJBeltColor;
  currentDegrees?: number;
  targetBeltColor?: BJJBeltColor;
  targetDegrees?: number;
  targetDate: string;
  startDate: string;
  targetWeightKg?: number;
  scheduleConfig?: WeeklyScheduleConfig;
}

// 1. Roda de Hábitos
export interface HabitItem {
  id: string;
  name: string;
  color: string;
  targetDaysPerMonth: number;
}

export interface HabitsMonthState {
  [monthKey: string]: {
    cells: boolean[][];
  };
}

// 2. Saúde Integral, Peso & Biomarcadores
export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  heightCm: number;
  notes?: string;
}

export interface BloodMarker {
  id: string;
  name: string;
  category: 'Metabólico' | 'Lipídico' | 'Hormonal' | 'Hepático/Renal' | 'Vitaminas';
  unit: string;
  value: number;
  minOptimal: number;
  maxOptimal: number;
  status: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  date: string;
}

// 3. Perspectiva Espiritual Reformada
export interface BibleReadingEntry {
  id: string;
  date: string;
  book: string;
  chapters: string;
  completed: boolean;
  notes?: string;
}

export interface PrayerItem {
  id: string;
  title: string;
  category: 'Família' | 'Igreja' | 'Santificação' | 'Gratidão' | 'Trabalho/Metas';
  status: 'ACTIVE' | 'ANSWERED';
  createdAt: string;
  answeredAt?: string;
  testimony?: string;
}

export interface DevotionalThought {
  id: string;
  date: string;
  verse: string;
  reflection: string;
  confessionReference?: string;
}

// 4. Perspectiva Financeira
export interface FinanceConfig {
  emergencyTargetAmount: number;
  emergencyCurrentAmount: number;
  fourYearTargetAmount: number;
  startDate: string;
  targetEndDate: string;
  monthlyContributionTarget: number;
}

export interface ContributionEntry {
  id: string;
  date: string;
  amount: number;
  destination: 'RESERVA_EMERGENCIA' | 'META_100K';
  notes?: string;
}

// 5. David Goggins Accountability Mirror
export type MirrorNoteType = 'HARD_TRUTH' | 'MISSION' | 'COOKIE_JAR';

export interface AccountabilityNote {
  id: string;
  type: MirrorNoteType;
  title: string;
  brutalTruth: string; // A desculpa ou realidade nua e crua
  actionPlan: string;  // A missão de contra-ataque imediata
  status: 'PENDING' | 'CRUSHED';
  color: 'yellow' | 'rose' | 'amber' | 'blue' | 'emerald';
  createdAt: string;
  crushedAt?: string;
}
